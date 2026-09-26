# Fit editor px ↔ TM35FIN (EPSG:3067) from street geometry: osm-network.json (px) vs map.osm (lat/lon)
import json, xml.etree.ElementTree as ET, numpy as np
from pyproj import Transformer
tr = Transformer.from_crs('EPSG:4326', 'EPSG:3067', always_xy=True)
root = ET.parse('/mnt/user-data/uploads/map.osm').getroot()
nodes = {n.get('id'): (float(n.get('lon')), float(n.get('lat'))) for n in root.iter('node')}
ways = {}
for w in root.iter('way'):
    tags = {t.get('k'): t.get('v') for t in w.iter('tag')}
    if 'highway' in tags and 'name' in tags:
        pts = [nodes[nd.get('ref')] for nd in w.iter('nd') if nd.get('ref') in nodes]
        xy = [tr.transform(lon, lat) for lon, lat in pts]
        ways.setdefault(tags['name'].lower(), []).extend(xy)
net = json.load(open('/mnt/user-data/outputs/osm-network.json'))['streets']
P, Q = [], []
for s in net:
    k = s['name'].lower()
    if k not in ways: continue
    W = np.array(ways[k])
    for p in s['pts']: P.append(p); Q.append(W)
P = np.array(P, float)
print('matched pts', len(P), 'streets', len({s['name'] for s in net if s['name'].lower() in ways}), '/', len(net))
# init: similarity from bounding boxes of all matched
allW = np.vstack([w for w in Q])
A = np.eye(3)
# px → m: scale guess 1 m/px with y flipped (px y grows south, northing grows north)
cx, cy = P.mean(0); ex, ny = allW.mean(0)
M = np.array([[1, 0, ex - cx], [0, -1, ny + cy], [0, 0, 1.0]])
for it in range(30):
    X = (M @ np.c_[P, np.ones(len(P))].T).T[:, :2]
    T = np.array([Q[i][np.argmin(((Q[i] - X[i])**2).sum(1))] for i in range(len(P))])
    # affine least squares px → TM35
    G = np.c_[P, np.ones(len(P))]
    sol, *_ = np.linalg.lstsq(G, T, rcond=None)
    M = np.vstack([sol.T, [0, 0, 1]])
    res = np.sqrt(((G @ sol - T)**2).sum(1))
print('affine px→TM35:\n', M)
print('residual m: median %.2f p90 %.2f max %.2f' % (np.median(res), np.percentile(res, 90), res.max()))
sx = np.hypot(M[0,0], M[1,0]); sy = np.hypot(M[0,1], M[1,1]); print('scale m/px', sx, sy, 'rot deg', np.degrees(np.arctan2(M[1,0], M[0,0])))
json.dump({'px_to_tm35': M.tolist(), 'median_res_m': float(np.median(res))}, open('georef.json', 'w'), indent=1)
