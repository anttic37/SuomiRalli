// a spectator is hurt → ambulance. While the medics treat him, the car knocks one medic over (→ a second ambulance) and
// then slams into the parked ambulance (→ it burns → fire engine). Everyone involved is a Human; every van a Vehicle.
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
let victim = null, bd = 1e9; HUMANS.forEach(h => { if (h.task.kind !== 'spectate') return; const d = Math.hypot(h.x - car.x, h.z - car.z); if (d < bd && d > 25) { bd = d; victim = h; } });
knock(victim, 0, 0, 3);
const log = [], ramLog = []; let last = '', phase = 0, medicHit = null, ambHitSpeed = 0, t0;
const park = () => { car.x = victim.home.x + 80; car.z = victim.home.z + 80; car.vx = car.vz = 0; };
park();
step(60*200, i => {
  const A = VEHICLES.filter(v => v.kind === 'ambulance'), F = VEHICLES.find(v => v.kind === 'fire');
  const st = A.map(a => a.job.phase + (a.fire ? (a.fire.out ? '(out)' : '(FIRE)') : '')).join('/') + ' | ' + (F ? 'fire:' + F.job.phase : '-') + ' | q' + DISPATCH.queue.length;
  if (st !== last) { log.push((i/60).toFixed(1) + 's ' + st); last = st; }
  if (phase === 0 && A[0] && A[0].job.phase === 'treat') {   // hit a medic at 9 m/s
    const m = A[0].crew[0], dx = m.x - A[0].x, dz = m.z - A[0].z, d = Math.hypot(dx, dz) || 1, a = Math.atan2(dx, dz) + 0.9, ux = Math.sin(a), uz = Math.cos(a);
    car.x = m.x - ux*6; car.z = m.z - uz*6; car.angle = Math.atan2(ux, uz); car.vx = ux*9; car.vz = uz*9; phase = 1; t0 = i; medicHit = m; }
  else if (phase === 1 && i - t0 > 50) { if (!medicHit.down) { car.vx = car.vz = 0; } phase = 2; t0 = i; park(); }
  else if (phase === 2 && i - t0 > 30) {   // now ram the parked ambulance side-on at 16 m/s
    const a0 = A[0] || A[1]; if (!a0) { phase = 9; return; } const ux = Math.cos(a0.yaw), uz = -Math.sin(a0.yaw);
    car.x = a0.x - ux*7; car.z = a0.z - uz*7; car.angle = Math.atan2(ux, uz); car.vx = ux*16; car.vz = uz*16; phase = 3; t0 = i; }
  else if (phase === 3 && i - t0 <= 60) { const a0 = A[0] || A[1]; if ((i - t0) % 4 === 0) ramLog.push([(car.x - a0.x).toFixed(2), (car.z - a0.z).toFixed(2), Math.hypot(car.vx, car.vz).toFixed(1), a0.damage.toFixed(1), !!obbSat({ x: car.x, z: car.z, yaw: car.angle, hw: CAR_HW, hl: CAR_HL }, a0)].join(' ')); }
  else if (phase === 3 && i - t0 > 60) { phase = 4; park(); }
  else if (phase >= 2 && phase !== 3) { car.vx = car.vz = 0; }
});
return { ramLog, victim: victim.gone, medicDown: medicHit && medicHit.down, medicInWorld: medicHit ? HUMANS.includes(medicHit) : null, log, temps: VEHICLES.filter(v => v.temp).length, tempHumans: HUMANS.filter(h => h.temp).length, fires: FIRES.length };
