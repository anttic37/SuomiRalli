// fast hits: 20, 30, 45 m/s straight into a bale — how fast does the bale leave? (it shouldn't beat ~1.6× the car)
initAudio = () => {}; renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const t0 = performance.now(); while (!PHYS.ready && !PHYS.failed && performance.now() - t0 < 60000) await new Promise(r => setTimeout(r, 200));
const res = {}; let k = 2;
for (const v0 of [20, 30, 45]) { const b = BALES[k++ * 7 % BALES.length]; const ax = Math.sin(b.yaw), az = Math.cos(b.yaw), dx = az, dz = -ax; const p0 = b.rb.translation();
  car.x = p0.x - dx*25; car.z = p0.z - dz*25; car.angle = Math.atan2(dx, dz); let maxV = 0, maxW = 0;
  for (let i = 0; i < 120; i++) { if (i < 70) { car.vx = dx*v0; car.vz = dz*v0; car.angle = Math.atan2(dx, dz); } loop(lastTime + 1000/60); const v = b.rb.linvel(), w = b.rb.angvel(); maxV = Math.max(maxV, Math.hypot(v.x, v.y, v.z)); maxW = Math.max(maxW, Math.hypot(w.x, w.y, w.z)); }
  const p1 = b.rb.translation(); res['v' + v0] = { baleMax: +maxV.toFixed(1), ratio: +(maxV/v0).toFixed(2), spin: +maxW.toFixed(1), moved: +Math.hypot(p1.x - p0.x, p1.z - p0.z).toFixed(1), up: +(p1.y - Y(p1.x, p1.z)).toFixed(1) }; car.x += 300; st(30); }
return res;
