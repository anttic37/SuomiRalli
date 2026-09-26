// road look: junctions (graph nodes of degree ≥ 3), the sharpest bends, gravel→asphalt mouths — seen from a chase-cam height and from above
initAudio = () => {}; setTimeOfDay('paiva'); const RR = renderer.render.bind(renderer); renderer.render = () => {};
const view = async (name, ex, ez, eh, tx, tz, th) => { const ey = H(ex, ez) + eh, ty = H(tx, tz) + th; skyDome.position.set(ex, ey, ez); car.x = tx; car.z = tz; carGroup.position.set(0, -500, 0);
  HUMANS.forEach(q => { q.far = Math.hypot(q.x - tx, q.z - tz) >= 240; if (q.view.kind === 'rig') humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
  camera.position.set(ex, ey, ez); camera.lookAt(tx, ty, tz); camera.updateMatrixWorld();
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(tx + SUN.x, ty + SUN.y, tz + SUN.z); dirLight.target.position.set(tx, ty, tz); dirLight.target.updateMatrixWorld(); U_TIME.value = 0;
  RR(scene, camera); await __save(name + '.png', renderer.domElement.toDataURL('image/png')); };
const { nodes, adj } = roadGraph(), spots = [];
const junc = nodes.map((n, i) => ({ n, d: adj[i].length })).filter(o => o.d >= 3); const pick = (arr, k, gap) => { const out = []; for (const a of arr) { if (out.length >= k) break; if (out.some(o => Math.hypot(o.x - a.x, o.z - a.z) < gap)) continue; out.push(a); } return out; };
const J = pick(junc.map(o => ({ x: o.n.x, z: o.n.z, dr: distRoute(o.n.x, o.n.z) })).sort((a, b) => a.dr - b.dr), 4, 80);
for (let k = 0; k < J.length; k++) { const j = J[k]; await view('rl_j' + k, j.x + 14, j.z + 10, 5, j.x, j.z, 0); await view('rl_jt' + k, j.x + 2, j.z + 2, 30, j.x, j.z, 0); }
// sharpest bends of the route
const bends = []; for (let i = 6; i < trackPoints.length - 6; i++) { const a = trackPoints[i - 5], b = trackPoints[i], c = trackPoints[i + 5]; const t = Math.abs(angDiff(Math.atan2(c.x - b.x, c.y - b.y) - Math.atan2(b.x - a.x, b.y - a.y))); bends.push({ x: b.x, z: b.y, t, i }); }
const B = pick(bends.sort((a, b) => b.t - a.t), 3, 80);
for (let k = 0; k < B.length; k++) { const b = B[k], p = trackPoints[Math.max(0, b.i - 8)]; await view('rl_b' + k, p.x, p.y, 3.2, b.x, b.z, 0.5); }
// a gravel street meeting asphalt
const G = sideRoads.filter(R => R.gravel); let gm = null; for (const R of G) { for (const p of [R.pts[0], R.pts[R.pts.length - 1]]) { if (surfaceAt(p.x + 3, p.y) === 'asphalt' || surfaceAt(p.x - 3, p.y) === 'asphalt' || surfaceAt(p.x, p.y + 3) === 'asphalt' || surfaceAt(p.x, p.y - 3) === 'asphalt') { gm = p; break; } } if (gm) break; }
if (gm) { await view('rl_g', gm.x + 10, gm.y + 8, 4, gm.x, gm.y, 0); }
return { junctions: J.length, bends: B.map(b => b.t.toFixed(2)), gravel: !!gm, nG: G.length };
