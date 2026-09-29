startRace(false); step(60*4); const out = {};
// balloons
out.balloons = BALLOONS.map(B => [B.x|0, B.z|0, (B.y - Y(B.x, B.z))|0, B.mode]);
const B = BALLOONS[0]; await shot('bal_fly', B.x, B.z, 40, 30, 4, B.y - Y(B.x, B.z) - 2);
const x0 = B.x; step(60*10); out.drift10s = +(Math.hypot(B.x - x0, 0)).toFixed(2);
BALLOON_POP_P = 1; car.x = B.x + 30; car.z = B.z; car.vx = car.vz = 0; step(2); out.mode1 = B.mode;
step(60*0.9); await shot('bal_fall', B.x, B.z, 45, 25, 6, B.y - Y(B.x, B.z) + 4);
for (let i = 0; i < 60*12 && B.mode !== 'down'; i++) { car.x = B.x + 30; car.z = B.z; car.vx = car.vz = 0; step(1); }
out.mode2 = B.mode; out.pilotsDown = B.pilots.map(h => h.down); out.ambQ = DISPATCH.queue.length + VEHICLES.filter(v => v.kind === 'ambulance').length;
step(30); await shot('bal_down', B.x, B.z, 9, 7, 3.5, 0.6);
// push the basket with the car
const bx = B.x, bz = B.z; car.x = B.x - 8; car.z = B.z; car.angle = Math.PI/2; car.vx = 12; car.vz = 0; car.speed = 12;
for (let i = 0; i < 60*3; i++) step(1); out.basketMoved = +Math.hypot(B.x - bx, B.z - bz).toFixed(2); out.carSpeedAfter = +Math.hypot(car.vx, car.vz).toFixed(2);
// heli
const Hh = X3.heli; out.heli = Hh ? [Hh.x|0, Hh.z|0] : null;
if (Hh) { car.x = Hh.x + 40; car.z = Hh.z; car.vx = car.vz = 0; step(60*2); await shot('heli', Hh.x, Hh.z, 11, 8, 3, 1); const [lx, lz] = lloc(Hh.x, Hh.z, Hh.yaw, 4.2, 0); await shot('heli_cpr', lx, lz, 3.5, -3, 1.8, 0.3); }
// dogs
const dogs = HUMANS.filter(h => h.task && h.task.kind === 'yarddog'); out.dogs = dogs.length;
const D = dogs[0]; let best = null; for (const p of trackPoints) { const d = Math.hypot(p.x - D.x, p.y - D.z); if (!best || d < best.d) best = { d, p }; } out.dogRouteDist = +best.d.toFixed(1);
// drive the car past on the route at 15 m/s
const i0 = trackPoints.indexOf(best.p), pA = trackPoints[(i0 - 12 + trackPoints.length) % trackPoints.length], ang = Math.atan2(best.p.x - pA.x, best.p.y - pA.y);
car.x = pA.x; car.z = pA.y; car.angle = ang; let chased = false;
for (let i = 0; i < 60*3; i++) { car.vx = Math.sin(car.angle)*15; car.vz = Math.cos(car.angle)*15; car.speed = 15; step(1); if (D.task && HUMANS.find(h => h === D) && dogs[0].st === null) {} }
out.dogChasing = HUMANS.filter(h => h.task && h.task.kind === 'yarddog' && Math.hypot(h.x - h.home.x, h.z - h.home.z) > 5).length;
car.vx = car.vz = 0; car.speed = 0; car.x = D.x - 2; car.z = D.z; car.vx = 10; knock(D, 10, 0, 10);
out.mad = HUMANS.filter(h => h.mad).length; step(60*2); out.madMoving = HUMANS.filter(h => h.mad && Math.hypot(h.vx, h.vz) > 1).length;
const m = HUMANS.find(h => h.mad); if (m) await shot('mad', car.x, car.z, 10, 8, 3, 1);
return out;
