initAudio = () => {}; if (typeof setTimeOfDay === 'function') setTimeOfDay('paiva');
const realRender = renderer.render.bind(renderer); renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; loop(lastTime + 1000/60); } };
step(60*3.3);
let pick = null;
for (const B of STATIC_LIST) { if (B.kind !== 'house' || Math.min(B.hw, B.hl) < 3) continue; const p = ambPath(B.x, B.z); if (!p) continue; const [ex, ez] = p[p.length - 1], d = Math.hypot(ex - B.x, ez - B.z); if (d < 9 || d > 22) continue;
  if (Math.hypot(B.x - car.x, B.z - car.z) < 60) continue;
  const ux = (ex - B.x)/d, uz = (ez - B.z)/d, clear = (px, pz, r) => { const t = Math.max(0, Math.min(d, (px - B.x)*ux + (pz - B.z)*uz)), qx = B.x + ux*t, qz = B.z + uz*t; return Math.hypot(px - qx, pz - qz) > r; };
  if (VEHICLES.some(v => !clear(v.x, v.z, v.hl + 1.8)) || STATIC_LIST.some(o => o !== B && !clear(o.x, o.z, Math.hypot(o.hw, o.hl) + 1.2))) continue;
  pick = { B, ex, ez }; break; }
const B = pick.B, dx = pick.ex - B.x, dz = pick.ez - B.z, dl = Math.hypot(dx, dz), ux = dx/dl, uz = dz/dl;
const fx = Math.sin(B.yaw), fz = Math.cos(B.yaw), rx = fz, rz = -fx, ext = B.hl*Math.abs(ux*fx + uz*fz) + B.hw*Math.abs(ux*rx + uz*rz);
car.x = B.x + ux*(ext + 7); car.z = B.z + uz*(ext + 7); car.angle = Math.atan2(-ux, -uz); car.vx = -ux*17; car.vz = -uz*17;
step(60*1.0);
const cx0 = car.x, cz0 = car.z;
const shot = async (name, tx, tz, from) => { const p = new THREE.Vector3(tx, H(tx, tz), tz); const [ex, ez] = from;
  camera.position.set(ex, H(ex, ez) + 5, ez); camera.lookAt(p.x, p.y + 2, p.z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(p.x + SUN.x, p.y + SUN.y, p.z + SUN.z); dirLight.target.position.copy(p); dirLight.target.updateMatrixWorld();
  realRender(scene, camera); await __save('' + name + '.png', renderer.domElement.toDataURL('image/png')); };
const done = {};
const side = [B.x + ux*(ext + 16) + uz*9, B.z + uz*(ext + 16) - ux*9];
for (let i = 0; i < 60*120; i++) { car.x = cx0; car.z = cz0; car.vx = car.vz = 0; loop(lastTime + 1000/60);
  const v = VEHICLES.find(o => o.kind === 'fire'), f = B.fire;
  if (f && !f.out && f.level > 0.7 && !done.burn) { done.burn = 1; await shot('fire_burn', B.x, B.z, side); }
  if (v && v.job.phase === 'drive' && v.total - v.s < 40 && !done.arrive) { done.arrive = 1; const e = lloc(v.x, v.z, v.yaw, 6, 9); await shot('fire_arrive', v.x, v.z, e); }
  if (v && v.job.phase === 'spray' && v.job.t > 2 && !done.spray) { done.spray = 1; await shot('fire_spray', (B.x + v.x)/2, (B.z + v.z)/2, [v.x + ux*6 + uz*12, v.z + uz*6 - ux*12]); const e = lloc(v.x, v.z, v.yaw, -8, 4); await shot('fire_engine', v.x, v.z, e); }
  if (f && f.out && !done.out) { done.out = 1; }
  if (done.out && !v) break; }
return Object.keys(done);
