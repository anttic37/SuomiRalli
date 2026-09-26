// the parked ambulance is not a rock: rammed side-on it slides and turns (and the crew carries on)
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
const vic = HUMANS.filter(h => h.task.kind === 'spectate').sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z))[20];
car.x = vic.x + 70; car.z = vic.z + 70; knock(vic, 0, 0, 1);
let A = null; for (let i = 0; i < 60*70 && !A; i++) { car.vx = car.vz = 0; loop(lastTime + 1000/60); A = VEHICLES.find(v => v.kind === 'ambulance' && v.job.phase === 'go'); }
A = VEHICLES.find(v => v.kind === 'ambulance'); const out = { phase: A && A.job.phase };
for (const sp of [8, 14]) { if (!A || A.gone) break; const x0 = A.x, z0 = A.z, y0 = A.yaw, ux = Math.cos(A.yaw), uz = -Math.sin(A.yaw), off = 1.4;   // hit it towards the rear: it should turn
  car.x = A.x - ux*7 - Math.sin(A.yaw)*off; car.z = A.z - uz*7 - Math.cos(A.yaw)*off; car.angle = Math.atan2(ux, uz); car.vx = ux*sp; car.vz = uz*sp;
  let maxV = 0; step(60*3, i => { maxV = Math.max(maxV, Math.hypot(A.vx, A.vz)); if (i > 40) { car.vx = car.vz = 0; } });
  out['ram' + sp] = { moved: Math.hypot(A.x - x0, A.z - z0).toFixed(2), turned: angDiff(A.yaw - y0).toFixed(2), maxV: maxV.toFixed(1), damage: A.damage.toFixed(1), fire: !!A.fire, phase: A.job.phase }; }
return out;
