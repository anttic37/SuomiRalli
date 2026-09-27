// people (body v2): the same group at each detail level (full / light / boxes) and the game view → bv_lod.png (s3_shot.inc in front)
setTimeOfDay('paiva'); startRace(false); step(60*4);
const W = renderer.domElement.width, Hh = renderer.domElement.height, c2 = document.createElement('canvas'); c2.width = W; c2.height = Hh*2; const g2 = c2.getContext('2d');
RR(scene, camera); g2.drawImage(renderer.domElement, W*0.25, Hh*0.3, W*0.5, Hh*0.5, 0, Hh, W, Hh);   // the game view, the middle ×2
let best = null; for (const h of HUMANS) { if (!h.look || h.inside || h.gone || h.task.kind !== 'spectate') continue; let c = 0; forHumansNear(h.x, h.z, 4, () => c++); if (!best || c > best.c) best = { h, c }; }
const h = best.h; car.x = h.x + 20; car.z = h.z + 20; step(3); HUMANS.forEach(q => { q.far = Math.hypot(q.x - car.x, q.z - car.z) >= 240; humanSync(q); });
const gy = Y(h.x, h.z), sl = Math.hypot(SUN.x, SUN.z), sx = SUN.x/sl, sz = SUN.z/sl;
camera.position.set(h.x + sx*4.5, gy + 2.2, h.z + sz*4.5); camera.lookAt(h.x, gy + 0.9, h.z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
dirLight.position.set(h.x + SUN.x, gy + SUN.y, h.z + SUN.z); dirLight.target.position.set(h.x, gy, h.z); dirLight.target.updateMatrixWorld();
const L0 = BODY.px.slice(); [[0, 0], [1e9, 0], [1e9, 1e9]].forEach(([a, b], k) => { BODY.px[0] = a; BODY.px[1] = b; RR(scene, camera); g2.drawImage(renderer.domElement, W/3, 0, W/3, Hh, k*W/3, 0, W/3, Hh); });
BODY.px[0] = L0[0]; BODY.px[1] = L0[1];
g2.font = 'bold 22px Arial'; g2.lineWidth = 4; g2.strokeStyle = '#000'; g2.fillStyle = '#fff'; [['LOD0 täysi', 0], ['LOD1 kevyt', 1], ['LOD2 laatikot', 2]].forEach(([t, k]) => { g2.strokeText(t, k*W/3 + 10, 28); g2.fillText(t, k*W/3 + 10, 28); });
g2.strokeText('pelikamera (2× zoom)', 10, Hh + 28); g2.fillText('pelikamera (2× zoom)', 10, Hh + 28);
await __save('bv_lod.png', c2.toDataURL('image/png')); return best.c;
