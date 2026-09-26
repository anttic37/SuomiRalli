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
let knocked = null;
for (let i = 0; i < 60*120; i++) { car.x = cx0; car.z = cz0; car.vx = car.vz = 0; loop(lastTime + 1000/60);
  const v = VEHICLES.find(o => o.kind === 'fire');
  if (v && v.job.phase === 'spray' && v.job.t > 2 && !knocked) { knocked = v.crew[1]; const dx = knocked.x - v.x, dz = knocked.z - v.z, d = Math.hypot(dx, dz) || 1; knock(knocked, dx/d*4, dz/d*4, 6); }
  if (knocked && knocked.down && knocked.hop === 0 && Math.hypot(knocked.vx, knocked.vz) < 0.05) { await shot('hose_drop', (knocked.x + v.x)/2, (knocked.z + v.z)/2, lloc(v.x, v.z, v.yaw, -9, -2)); await shot('hose_drop2', knocked.x, knocked.z, [knocked.x + 4, knocked.z + 4]); break; } }
return { knocked: !!knocked, drop: knocked && knocked.hoseDrop, now: knocked && [knocked.x.toFixed(1), knocked.z.toFixed(1)] };
