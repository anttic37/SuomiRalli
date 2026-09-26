initAudio = () => {}; if (typeof setTimeOfDay === 'function') setTimeOfDay('paiva');
const realRender = renderer.render.bind(renderer); renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; loop(lastTime + 1000/60); } };
step(60*3.3);
const shot = async (name, tx, tz, ex, ez, up) => { const p = new THREE.Vector3(tx, H(tx, tz), tz);
  camera.position.set(ex, H(ex, ez) + (up || 4.5), ez); camera.lookAt(p.x, p.y + 1, p.z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(p.x + SUN.x, p.y + SUN.y, p.z + SUN.z); dirLight.target.position.copy(p); dirLight.target.updateMatrixWorld();
  realRender(scene, camera); await __save('' + name + '.png', renderer.domElement.toDataURL('image/png')); };
const cx0 = car.x, cz0 = car.z;
// 1. the start crowd from behind the car
await shot('w_start', car.x + Math.sin(car.angle)*12, car.z + Math.cos(car.angle)*12, car.x - Math.sin(car.angle)*7 + Math.cos(car.angle)*3, car.z - Math.cos(car.angle)*7 - Math.sin(car.angle)*3, 3);
// 2. football
const F = FIELD_GAMES[0]; if (F) { car.x = F.lx + 40; car.z = F.lz + 30; step(60*2, () => { car.vx = car.vz = 0; }); await shot('w_pitch', F.lx, F.lz, F.lx + 16, F.lz + 14, 9); }
// 3. an injured spectator, the medics treating him (Humans), a burning parked car next to it
let victim = null, bd = 1e9; HUMANS.forEach(h => { if (h.task.kind !== 'spectate') return; const d = Math.hypot(h.x - car.x, h.z - car.z); if (d < bd && d > 25) { bd = d; victim = h; } });
car.x = cx0; car.z = cz0; step(10); knock(victim, 1.5, 0, 3);
const done = {};
for (let i = 0; i < 60*80 && !done.treat; i++) { car.vx = car.vz = 0; loop(lastTime + 1000/60); const A = VEHICLES.find(v => v.kind === 'ambulance'); if (!A) continue;
  if (A.job.phase === 'treat' && A.job.t > 1.5) { done.treat = 1; const m = A.crew[0]; await shot('w_treat', (A.x + m.x)/2, (A.z + m.z)/2, A.x - Math.sin(A.yaw)*9 - Math.cos(A.yaw)*8, A.z - Math.cos(A.yaw)*9 + Math.sin(A.yaw)*8); await shot('w_treat2', victim.x, victim.z, victim.x + 4.5, victim.z + 3.5, 2.2); } }
// 4. a parked car set on fire by a hard hit
const pc = VEHICLES.filter(v => v.kind === 'car').sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z))[5];
startFire({ vehicle: pc }); pc.damage = 20;
step(60*16, () => { car.vx = car.vz = 0; });
await shot('w_carfire', pc.x, pc.z, pc.x + 8, pc.z + 7, 3.5);
return { done, victimDown: victim.down, pcCharred: pc.charred };
