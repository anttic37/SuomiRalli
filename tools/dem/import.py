#!/usr/bin/env python3
"""MML elevation model (GeoTIFF, TM35FIN / EPSG:3067, e.g. Korkeusmalli 2 m) → HEIGHT_RAW embedded in the game template.

usage: import.py <file.tif|file.zip> [...] [--scale 1.0] [--step 4] [--out game.html]

Samples the model on the game's grid (game units → editor px → TM35FIN via georef.json), area-averaged to the
grid spacing, stores heights relative to their median as Int16 centimetres (little-endian, base64).
"""
import sys, json, re, zipfile, io, base64, argparse
import numpy as np, tifffile

MAP_SCALE, MAP_CX, MAP_CY = 0.45, 1113, 770          # editor px ↔ game units (must match the editor build)
HALF = 580                                            # game world half-size

ap = argparse.ArgumentParser()
ap.add_argument('files', nargs='+')
ap.add_argument('--scale', type=float, default=1.0, help='vertical factor applied in the game (1.0 = real metres)')
ap.add_argument('--step', type=float, default=4.0, help='grid spacing in game units')
ap.add_argument('--out', default='/home/claude/korkeus/game.html')
ap.add_argument('--georef', default='/home/claude/korkeus/dem/georef.json')
ap.add_argument('--dry', action='store_true')
a = ap.parse_args()

def rasters(path):
    if path.lower().endswith('.zip'):
        z = zipfile.ZipFile(path)
        for n in z.namelist():
            if n.lower().endswith(('.tif', '.tiff')): yield n, io.BytesIO(z.read(n))
    else: yield path, path

R = []
for f in a.files:
    for name, src in rasters(f):
        with tifffile.TiffFile(src) as t:
            p = t.pages[0]; tags = p.tags
            data = p.asarray().astype(np.float64)
            if data.ndim == 3: data = data[..., 0]
            sx, sy = tags['ModelPixelScaleTag'].value[:2]
            tp = tags['ModelTiepointTag'].value; i, j, X, Y = tp[0], tp[1], tp[3], tp[4]
            nod = None
            if 'GDAL_NODATA' in tags:
                try: nod = float(str(tags['GDAL_NODATA'].value).strip('\x00 '))
                except ValueError: pass
            # pixel-is-area (default): tiepoint is the corner of pixel (i, j); centres sit half a pixel in
            x0, y0 = X - i*sx + sx/2, Y + j*sy - sy/2
            if nod is not None: data[data == nod] = np.nan
            data[data < -1000] = np.nan
            R.append(dict(name=name, a=data, x0=x0, y0=y0, sx=sx, sy=sy))
            print(f'{name}: {data.shape[1]}×{data.shape[0]} px, {sx} m, E {x0:.0f}..{x0 + sx*data.shape[1]:.0f}, N {y0 - sy*data.shape[0]:.0f}..{y0:.0f}, '
                  f'h {np.nanmin(data):.1f}..{np.nanmax(data):.1f} m')

M = np.array(json.load(open(a.georef))['px_to_tm35'])
n = int(round(2*HALF/a.step)) + 1
g = -HALF + np.arange(n)*a.step
GX, GZ = np.meshgrid(g, g)                                  # [iz, ix]
PX, PY = GX/MAP_SCALE + MAP_CX, GZ/MAP_SCALE + MAP_CY
E = M[0, 0]*PX + M[0, 1]*PY + M[0, 2]
N = M[1, 0]*PX + M[1, 1]*PY + M[1, 2]
cell_m = a.step/MAP_SCALE*np.hypot(M[0, 0], M[1, 0])        # one game cell in real metres
print(f'grid {n}×{n}, one cell = {cell_m:.1f} m real; area E {E.min():.0f}..{E.max():.0f}, N {N.min():.0f}..{N.max():.0f}')

def box(a2, r):                                             # mean filter (2r+1)², nan-aware
    if r < 1: return a2
    v = np.nan_to_num(a2); w = (~np.isnan(a2)).astype(float)
    def s(x):
        c = np.cumsum(np.cumsum(np.pad(x, ((r+1, r), (r+1, r)), mode='edge'), 0), 1)
        return c[2*r+1:, 2*r+1:] - c[:-2*r-1, 2*r+1:] - c[2*r+1:, :-2*r-1] + c[:-2*r-1, :-2*r-1]
    sv, sw = s(v), s(w)
    with np.errstate(invalid='ignore', divide='ignore'): return np.where(sw > 0, sv/sw, np.nan)

out = np.full(E.shape, np.nan)
for r in R:
    rad = max(0, int(round(cell_m/r['sx']/2)))                 # average over about one game cell
    A = box(r['a'], rad)
    fx = (E - r['x0'])/r['sx']; fy = (r['y0'] - N)/r['sy']
    H_, W_ = A.shape
    ok = (fx >= 0) & (fy >= 0) & (fx <= W_ - 1) & (fy <= H_ - 1) & np.isnan(out)
    ix = np.clip(np.floor(fx).astype(int), 0, W_ - 2); iy = np.clip(np.floor(fy).astype(int), 0, H_ - 2)
    tx, ty = fx - ix, fy - iy
    v = (A[iy, ix]*(1-tx) + A[iy, ix+1]*tx)*(1-ty) + (A[iy+1, ix]*(1-tx) + A[iy+1, ix+1]*tx)*ty
    out[ok] = v[ok]
miss = np.isnan(out).mean()
print(f'coverage {100*(1-miss):.1f} %')
if miss > 0:
    if miss > 0.25: print('WARNING: model does not cover the game area — download the neighbouring sheet(s) too')
    # fill gaps by repeated neighbour averaging (edges beyond the model fade to the nearest known ground)
    for _ in range(400):
        m = np.isnan(out)
        if not m.any(): break
        o = box(out, 1); out[m] = o[m]
    out[np.isnan(out)] = np.nanmedian(out)
base = float(np.median(out)); rel = out - base
gy, gx = np.gradient(rel, a.step)                            # per game unit, before the vertical factor
slope = np.hypot(gx, gy)*a.scale
print(f'relief {rel.min():.1f}..{rel.max():.1f} m around median {base:.1f} m; ×{a.scale} in game → {rel.min()*a.scale:.1f}..{rel.max()*a.scale:.1f}')
print(f'slope (game, after ×{a.scale}): p50 {100*np.percentile(slope, 50):.1f} %  p90 {100*np.percentile(slope, 90):.1f} %  p99 {100*np.percentile(slope, 99):.1f} %  max {100*slope.max():.0f} %')
cm = np.clip(np.round(rel*100), -32767, 32767).astype('<i2')
raw = {'step': a.step, 'x0': -HALF, 'z0': -HALF, 'nx': n, 'nz': n, 'scale': a.scale, 'base': round(base, 2), 'b64': base64.b64encode(cm.tobytes()).decode()}
np.save('/home/claude/korkeus/dem/height_rel.npy', rel)
if a.dry: sys.exit(0)
src = open(a.out).read()
line = 'const HEIGHT_RAW = ' + json.dumps(raw, separators=(',', ':')) + ';   // MML elevation model (imported: dem/import.py)'
src2, k = re.subn(r'^const HEIGHT_RAW = .*$', lambda m_: line, src, count=1, flags=re.M)
assert k == 1, 'HEIGHT_RAW line not found'
open(a.out, 'w').write(src2)
print(f'wrote HEIGHT_RAW into {a.out} ({len(raw["b64"])//1024} KB base64)')
