// pedestrian impacts: how far people end up from where they were hit (car keeps its speed / brakes at the hit), riding the bonnet
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
const clear = (h) => !tires.some(t => t.kind === 'tire' && !t.off && Math.hypot(t.x - h.x, t.z - h.z) < 9) && !HUMANS.some(o => o !== h && Math.hypot(o.x - h.x, o.z - h.z) < 2.5) && !STATIC_LIST.some(b => Math.hypot(b.x - h.x, b.z - h.z) < 12) && !VEHICLES.some(b => Math.hypot(b.x - h.x, b.z - h.z) < 12);
const P = HUMANS.filter(h => h.task.kind === 'spectate' && clear(h)).sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z))[0];
const out = {};
for (const kmh of [30, 50, 80, 110]) for (const brake of [false, true]) {
  worldReset(); const v = kmh/3.6, ang = 0.3, fx = Math.sin(ang), fz = Math.cos(ang); car.angle = ang; car.x = P.x - fx*12; car.z = P.z - fz*12; car.vx = fx*v; car.vz = fz*v;
  let hitAt = null, x0 = P.x, z0 = P.z, rideT = 0, maxY = 0, hitPos = null;
  step(60*6, i => { if (!brake || hitAt === null) { car.vx = fx*v; car.vz = fz*v; car.angle = ang; keys.ArrowDown = false; } else keys.ArrowDown = true;
    if (P.down && hitAt === null) { hitAt = i; hitPos = [P.x, P.z]; } if (P.ride) rideT += 1/60; if (hitAt !== null) maxY = Math.max(maxY, P.hop); });
  keys.ArrowDown = false;
  out[kmh + (brake ? 'brake' : '')] = { hit: hitAt !== null, dist: hitPos ? Math.hypot(P.x - hitPos[0], P.z - hitPos[1]).toFixed(1) : '-', ride: rideT.toFixed(2), maxHop: maxY.toFixed(2), rest: Math.hypot(P.vx, P.vz).toFixed(2), tilt: P.tilt.toFixed(2) };
}
// side swipe at 50
worldReset(); { const v = 50/3.6, ang = 0.3, fx = Math.sin(ang), fz = Math.cos(ang), rx = fz, rz = -fx; car.angle = ang; car.x = P.x - fx*12 - rx*0.95; car.z = P.z - fz*12 - rz*0.95; car.vx = fx*v; car.vz = fz*v;
  let hp = null; step(60*5, () => { car.vx = fx*v; car.vz = fz*v; car.angle = ang; if (P.down && !hp) hp = [P.x, P.z, !!P.ride]; }); out.side50 = { hit: !!hp, rode: hp && hp[2], dist: hp ? Math.hypot(P.x - hp[0], P.z - hp[1]).toFixed(1) : '-' }; }
return out;
