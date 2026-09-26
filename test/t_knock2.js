// drive past / into a person at 12 m/s: side miss/hit distances, then spin and lying pose after landing — for a spectator AND a medic
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
const P = HUMANS.filter(h => h.task.kind === 'spectate').sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z))[3];
const side = (off) => { worldReset();
  const ang = 0.3, fx = Math.sin(ang), fz = Math.cos(ang), rx = fz, rz = -fx; car.angle = ang; car.x = P.x - fx*10 - rx*off; car.z = P.z - fz*10 - rz*off; car.vx = fx*12; car.vz = fz*12;
  let hitAt = null; step(80, (i) => { car.vx = fx*12; car.vz = fz*12; car.angle = ang; if (P.down && hitAt === null) hitAt = i; }); return hitAt !== null; };
const res = { miss_1_20: side(1.2), miss_1_05: side(1.05), hit_0_9: side(0.9), hit_0: side(0) };
let yawA, yawB; step(60*2); yawA = P.yaw; step(60*2); yawB = P.yaw;
res.spinAfterLanding = Math.abs(yawB - yawA).toFixed(3); res.tilt = P.tilt.toFixed(2); res.hop = P.hop.toFixed(2); res.down = P.down; res.queued = DISPATCH.queue.length;
return res;
