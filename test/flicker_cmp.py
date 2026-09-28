# z-fight check for t_flicker: python3 flicker_cmp.py <dir with fz*a.png / fz*b.png> → blotch counts per view + fz*_z.png with the changed pixels in magenta (trees/bushes always show a few: their dithered fade)
import sys, glob
from PIL import Image, ImageChops, ImageFilter
import numpy as np
d = sys.argv[1]; out = []
for a in sorted(glob.glob(d + '/s3_fz*a.png') + glob.glob(d + '/fz*a.png')):
    b = a[:-5] + 'b.png'
    A = np.asarray(Image.open(a).convert('L')).astype(int); B = np.asarray(Image.open(b).convert('L')).astype(int)
    D = np.abs(A - B) > 24
    # edges move a little with any nudge: ignore pixels near strong gradients in A
    gx = np.abs(np.diff(A, axis=1, prepend=A[:, :1])); gy = np.abs(np.diff(A, axis=0, prepend=A[:1, :]))
    edge = (gx + gy) > 30; E = Image.fromarray((edge*255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)); edge = np.asarray(E) > 0
    Z = D & ~edge
    # blotches: count 8x8 blocks with ≥ 6 such pixels
    h, w = Z.shape; bl = Z[:h//8*8, :w//8*8].reshape(h//8, 8, w//8, 8).sum(axis=(1, 3)); n = int((bl >= 6).sum())
    im = Image.open(a).convert('RGB'); px = im.load()
    ys, xs = np.nonzero(Z)
    for y, x in zip(ys, xs): px[int(x), int(y)] = (255, 0, 255)
    im.resize((im.width//2, im.height//2)).save(a[:-5] + '_z.png'); out.append((a.split('/')[-1], n, int(Z.sum())))
for o in out: print(o)
