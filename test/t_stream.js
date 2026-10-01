// streaming out there: the camera flies 6 km east at 40 m/s (and some back), outerUpdate every frame — its cost a frame (budgets: ground 2 ms,
// forest 2 ms, a place ~3 ms a frame), the drawn ground always under the camera, the forest's chunks culled out of view and out of the shadow
// camera, draw calls; then the caches pruned in mid-flight and the roads still found, there and back again
setTimeOfDay('paiva'); startRace(false); step(20); const out = {}, times = []; let worstGap = 0, x = 700, z = 260;
const draws = () => { camera.updateMatrixWorld(); skyDome.position.copy(camera.position); dirLight.position.set(camera.position.x + SUN.x, camera.position.y + SUN.y, camera.position.z + SUN.z); dirLight.target.position.copy(camera.position); dirLight.target.updateMatrixWorld();
  renderer.info.autoReset = false; renderer.info.reset(); RR(scene, camera); const r = { calls: renderer.info.render.calls, tris: renderer.info.render.triangles }; renderer.info.autoReset = true; return r; };
let fc = 0; const fly = (n, vx) => { for (let f = 0; f < n; f++) { x += vx/60; camera.position.set(x, H(x, z) + 60, z); camera.lookAt(x + Math.sign(vx)*300, H(x, z), z); const t0 = performance.now(); outerUpdate(); times.push(performance.now() - t0); fc++;
  if (OUT.cx !== undefined) worstGap = Math.max(worstGap, Math.hypot(x - OUT.cx, z - OUT.cz)); } };
fly(60*60, 40); const s1 = forestCount(); out.at1 = { x: Math.round(x), chunks: s1.chunks, trees: s1.all, near: s1.near, feat: FEAT.size, edges: RD.edges.size, roadCells: OUT.rG.size, places: OUT.fG.size, gc: OUT.gc.size };
let vis = 0; { camera.updateMatrixWorld(); const fr = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse)); for (const m of FOR.ims.far) if (m.count && fr.intersectsObject(m)) vis++; }
out.farQuartersInView = vis + '/4'; out.draws = draws();
// a road near here: is it found before and after a prune?
let rp = null; for (const E of RD.edges.values()) if (E.pts && E.key[0] !== 'X') { const p = E.pts[Math.floor(E.pts.length/2)]; if (Math.hypot(p.x - x, p.z - z) < 1500) { rp = p; break; } }
out.road = rp ? { before: +roadDist(rp.x, rp.z).toFixed(2) } : null; const e0 = RD.edges.size; countryPrune(); out.pruned = { edges: [e0, RD.edges.size], feat: FEAT.size };
if (rp) out.road.after = +roadDist(rp.x, rp.z).toFixed(2);
fly(60*90, 40); fly(60*30, -40); out.at2 = { x: Math.round(x), chunks: FOR.data.size, roadCells: OUT.rG.size, places: OUT.fG.size }; if (rp) out.road.later = +roadDist(rp.x, rp.z).toFixed(2);
times.sort((a, b) => a - b); out.frame = { n: times.length, mean: +(times.reduce((a, b) => a + b, 0)/times.length).toFixed(2), p99: +times[Math.floor(times.length*0.99)].toFixed(2), max: +times[times.length - 1].toFixed(2), over8: times.filter(t => t > 8).length };
out.worstGap = Math.round(worstGap);
return out;
