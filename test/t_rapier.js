// Rapier: loads, the ground heightfield is the right way round (bales rest at Y+R), the car rolls a bale away, cost per frame
initAudio = () => {}; renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const t0 = performance.now(); while (!PHYS.ready && !PHYS.failed && performance.now() - t0 < 60000) { await new Promise(r => setTimeout(r, 200)); }
const res = { ready: PHYS.ready, failed: PHYS.failed, loadMs: Math.round(performance.now() - t0), bales: BALES.length, balesOn: !!PHYS.balesOn }; if (!PHYS.ready) return res;
const b = BALES[0]; b.rb.wakeUp(); car.x = b.x + 60; car.z = b.z + 60; st(120);
const t = b.rb.translation(); res.restErr = +(t.y - (Y(t.x, t.z) + BALE.R)).toFixed(2); res.drift = +Math.hypot(t.x - b.ox, t.z - b.oz).toFixed(2);
// several bales: all settle near their ground
let maxErr = 0; for (const q of BALES.slice(0, 20)) { q.rb.wakeUp(); } st(120); for (const q of BALES.slice(0, 20)) { const p = q.rb.translation(); maxErr = Math.max(maxErr, Math.abs(p.y - (Y(p.x, p.z) + BALE.R))); } res.maxRestErr20 = +maxErr.toFixed(2);
// drive at it: 12 m/s from 15 m, along the bale's rolling direction
const ax = Math.sin(b.yaw), az = Math.cos(b.yaw), dx = az, dz = -ax; const p0 = b.rb.translation(); car.x = p0.x - dx*15; car.z = p0.z - dz*15; car.angle = Math.atan2(dx, dz);
let maxV = 0; const v0 = 12; for (let i = 0; i < 150; i++) { if (i < 90) { car.vx = dx*v0; car.vz = dz*v0; car.angle = Math.atan2(dx, dz); } loop(lastTime + 1000/60); const v = b.rb.linvel(); maxV = Math.max(maxV, Math.hypot(v.x, v.z)); }
const p1 = b.rb.translation(); res.baleMaxSpeed = +maxV.toFixed(1); res.baleMoved = +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1); res.carSpeedAfter = +Math.hypot(car.vx, car.vz).toFixed(1); res.baleUpright = +(p1.y - (Y(p1.x, p1.z) + BALE.R)).toFixed(2);
// cost
car.x = b.x + 8; car.z = b.z + 8; let tq = performance.now(); st(120); res.msPerFrameNear = +((performance.now() - tq)/120).toFixed(2);
car.x += 400; tq = performance.now(); st(120); res.msPerFrameFar = +((performance.now() - tq)/120).toFixed(2); res.fixed = PHYS.fixed.size;
for (const f of X3.reset) f(); balesReset(); st(30); const pr = b.rb.translation(); res.resetBack = +Math.hypot(pr.x - b.ox, pr.z - b.oz).toFixed(2);
return res;
