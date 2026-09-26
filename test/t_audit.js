// Height audit: snapshot every static object just before liftWorld, rebuild the track, then compare each vertex's
// height above the RENDERED ground (the 4 m ground triangles, not H) with its height above the flat ground before lifting.
//   buried  = vertex was ≥ 3 cm above the flat ground, now below the rendered ground by > 2 cm
//   float   = vertex touched the flat ground (≤ 5 cm), now > 10 cm above the rendered ground
if (window.__AMP) { const rh = window.rawHeight; window.rawHeight = (x, z) => rh(x, z)*window.__AMP; }
const orig = window.liftWorld; const snap = [];
const V = new THREE.Vector3(), M4 = new THREE.Matrix4();
const keyOf = (o) => { let p = o, k = ''; while (p && !k) { k = (p.userData && p.userData.key) || ''; p = p.parent; } return (k || o.type).replace(/\d+$/, '').split('|')[0]; };
window.liftWorld = function () {
  const take = (root, tag) => { root.updateMatrixWorld(true); root.traverse(o => {
    if (!(o.isMesh || o.isLine || o.isLineSegments) || !o.geometry || !o.geometry.attributes.position) return;
    if (o.userData.dynamic || (o.parent && o.parent.userData.dynamic)) return;
    const e = { o, tag, key: keyOf(o), geo: o.geometry, pos: o.geometry.attributes.position.array.slice(), mw: o.matrixWorld.clone() };
    if (o.isInstancedMesh) { e.inst = o.instanceMatrix.array.slice(); e.count = o.count; }
    snap.push(e); }); };
  trackMeshGroup.children.forEach(c => take(c, 'track')); treeMeshes.forEach(m => take(m, 'tree'));
  orig.apply(this, arguments);
};
generateTrack();
window.liftWorld = orig;
// rendered ground height: same triangulation as buildGround (size 1160, 290 segs, tris (a,c,b),(b,c,d))
const size = 1160, segs = 580, step = size/segs, half = size/2;
const gp = groundMesh.geometry.attributes.position.array, cols = segs + 1;
function Hg(x, z) { const fx = (x + half)/step, fz = (z + half)/step; let ix = Math.floor(fx), iz = Math.floor(fz); if (ix < 0 || iz < 0 || ix >= segs || iz >= segs) return H(x, z);
  const u = fx - ix, v = fz - iz, a = iz*cols + ix, b = a + 1, c = a + cols, d = c + 1, y = i => gp[i*3 + 1];
  return (u + v <= 1) ? y(a) + (y(b) - y(a))*u + (y(c) - y(a))*v : y(d) + (y(c) - y(d))*(1 - u) + (y(b) - y(d))*(1 - v); }
scene.updateMatrixWorld(true);
const rows = {};
const row = (k) => rows[k] || (rows[k] = { n: 0, buried: 0, bmax: 0, float: 0, fmax: 0, at: null, fat: null, replaced: 0, rlo: 0, rhi: 0, rat: null });
const inst0 = new THREE.Matrix4(), inst1 = new THREE.Matrix4(), W0 = new THREE.Matrix4(), W1 = new THREE.Matrix4();
for (const e of snap) {
  const o = e.o; const r = row(e.tag + ' ' + e.key);
  if (o.geometry !== e.geo) { r.replaced++; continue; }        // draped (subdivided or baked): exact by construction, checked separately
  o.updateMatrixWorld(true);
  const p1 = o.geometry.attributes.position.array, p0 = e.pos, nV = p0.length/3, stride = Math.max(1, Math.floor(nV/20000));
  const nI = o.isInstancedMesh ? Math.min(e.count, o.count) : 1;
  for (let k = 0; k < nI; k++) {
    W0.copy(e.mw); W1.copy(o.matrixWorld);
    if (o.isInstancedMesh) { inst0.fromArray(e.inst, k*16); inst1.fromArray(o.instanceMatrix.array, k*16); W0.multiply(inst0); W1.multiply(inst1); if (Math.abs(inst1.determinant()) < 1e-9) continue; }
    for (let i = 0; i < nV; i += stride) {
      V.set(p0[i*3], p0[i*3+1], p0[i*3+2]).applyMatrix4(W0); const y0 = V.y, x0 = V.x, z0 = V.z;
      V.set(p1[i*3], p1[i*3+1], p1[i*3+2]).applyMatrix4(W1); const hAbove = V.y - Hg(V.x, V.z);
      r.n++;
      if (y0 > 0.05 && y0 < 0.3) { const dd = hAbove - y0; if (dd < r.rlo) { r.rlo = dd; r.rat = [V.x.toFixed(0), V.z.toFixed(0), y0.toFixed(2)]; } if (dd > r.rhi) r.rhi = dd; }
      if (y0 >= 0.03 && hAbove < -0.02) { r.buried++; if (-hAbove > r.bmax) { r.bmax = -hAbove; r.at = [V.x.toFixed(0), V.z.toFixed(0), y0.toFixed(2)]; } }
      if (y0 <= 0.05 && y0 >= -0.05 && hAbove - y0 > 0.10) { r.float++; if (hAbove - y0 > r.fmax) { r.fmax = hAbove - y0; r.fat = [V.x.toFixed(0), V.z.toFixed(0)]; } }
    }
  }
}
// draped surfaces vs rendered ground: sample each draped mesh's triangles' centroids (the in-between points the
// vertex-exact drape does not guarantee): surface minus ground, should stay ≥ its flat offset − 1 cm
const drapeRows = {};
for (const e of snap) { const o = e.o; if (o.geometry === e.geo || !o.isMesh) continue; const g = o.geometry, P = g.attributes.position.array, I = g.index ? g.index.array : null;
  const nT = I ? I.length/3 : P.length/9, stride = Math.max(1, Math.floor(nT/40000)); const r = drapeRows[e.key] || (drapeRows[e.key] = { tris: 0, under: 0, min: 9, at: null, over: 0, omax: 0, oat: null });
  for (let t = 0; t < nT; t += stride) { const ia = I ? I[t*3] : t*3, ib = I ? I[t*3+1] : t*3+1, ic = I ? I[t*3+2] : t*3+2;
    for (const [wa, wb, wc] of [[1/3, 1/3, 1/3], [0.5, 0.5, 0], [0, 0.5, 0.5], [0.5, 0, 0.5]]) {
      const x = P[ia*3]*wa + P[ib*3]*wb + P[ic*3]*wc, y = P[ia*3+1]*wa + P[ib*3+1]*wb + P[ic*3+1]*wc, z = P[ia*3+2]*wa + P[ib*3+2]*wb + P[ic*3+2]*wc;
      const off = (y - H(x, z)), d = y - Hg(x, z); r.tris++; { const vo = P[ia*3+1] - H(P[ia*3], P[ia*3+2]); if (d - vo > 0.04) { r.over++; if (d - vo > r.omax) { r.omax = d - vo; r.oat = [x.toFixed(0), z.toFixed(0)]; } } }
      if (off > -0.5 && d < Math.min(off, 0.03) - 0.02) { r.under++; if (d < r.min) { r.min = d; r.at = [x.toFixed(0), z.toFixed(0), off.toFixed(3)]; } } } } }
for (const e of snap) { const o = e.o; if (o.geometry !== e.geo || !o.isMesh || o.isInstancedMesh) continue; const g = o.geometry, P = g.attributes.position.array, P0 = e.pos, I = g.index ? g.index.array : null;
  if (!(o.position.lengthSq() < 1e-8)) continue;
  const nT = I ? I.length/3 : P.length/9; const r = drapeRows['m:' + e.key] || (drapeRows['m:' + e.key] = { tris: 0, under: 0, min: 9, at: null });
  for (let t = 0; t < nT; t++) { const ia = I ? I[t*3] : t*3, ib = I ? I[t*3+1] : t*3+1, ic = I ? I[t*3+2] : t*3+2;
    const y0a = P0[ia*3+1], y0b = P0[ib*3+1], y0c = P0[ic*3+1]; if (Math.max(y0a, y0b, y0c) > 0.12 || Math.min(y0a, y0b, y0c) < 0.005) continue;
    for (const [wa, wb, wc] of [[1/3, 1/3, 1/3], [0.5, 0.5, 0], [0, 0.5, 0.5], [0.5, 0, 0.5]]) {
      const x = P[ia*3]*wa + P[ib*3]*wb + P[ic*3]*wc, y = P[ia*3+1]*wa + P[ib*3+1]*wb + P[ic*3+1]*wc, z = P[ia*3+2]*wa + P[ib*3+2]*wb + P[ic*3+2]*wc, y0 = y0a*wa + y0b*wb + y0c*wc;
      const d = y - Hg(x, z); r.tris++; if (d < Math.min(y0, 0.03) - 0.02) { r.under++; if (d < r.min) { r.min = d; r.at = [x.toFixed(0), z.toFixed(0), y0.toFixed(3)]; } } } } }
const fmt = (k, r) => `${k.padEnd(28)} n${String(r.n).padStart(7)} buried ${String(r.buried).padStart(5)} (max ${r.bmax.toFixed(2)} @${r.at})  float ${String(r.float).padStart(5)} (max ${r.fmax.toFixed(2)} @${r.fat})${r.replaced ? ' draped×' + r.replaced : ''}`;
const rel = Object.entries(rows).filter(([k, r]) => r.rlo < -0.03 || r.rhi > 0.1).map(([k, r]) => `${k.padEnd(28)} low-verts rel ${r.rlo.toFixed(2)}..${r.rhi.toFixed(2)} @${r.rat}`);
const bad = Object.entries(rows).filter(([k, r]) => r.buried || r.float).sort((a, b) => (b[1].buried + b[1].float) - (a[1].buried + a[1].float)).map(([k, r]) => fmt(k, r));
const ok = Object.entries(rows).filter(([k, r]) => !r.buried && !r.float).map(([k, r]) => k.trim() + (r.replaced ? '(d)' : ''));
const dr = Object.entries(drapeRows).map(([k, r]) => `${k.padEnd(20)} samples ${r.tris} under ${r.under} min ${r.min.toFixed(3)} @${r.at}` + (r.over !== undefined ? ` over ${r.over} max ${r.omax.toFixed(3)} @${r.oat}` : ''));
let hmin = 1e9, hmax = -1e9; for (const v of HG.h) { if (v < hmin) hmin = v; if (v > hmax) hmax = v; }
return { terrain: [hmin.toFixed(2), hmax.toFixed(2)], bad, rel, ok: ok.join(', '), drape: dr };
