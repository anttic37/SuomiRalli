// paper photos (3.10.): the wedding convoy on the move, rice when you tag along, the angry bride and groom
startRace(false); const res = {}; const L = WED.cars[0]; car.x = L.x + 300; car.z = L.z + 300; car.vx = car.vz = car.speed = 0;
step(60*40); res.mode = L.ai.V.mode;
const side = (v, d) => { for (const s of [1, -1]) { const a = v.yaw + s*Math.PI/2, cx = v.x + Math.sin(a)*d, cz = v.z + Math.cos(a)*d; if (clearLine(v.x, v.z, cx, cz)) return a; } return v.yaw + Math.PI/2; };
{ const M = WED.cars[1], N = WED.cars[2], A0 = WED.cars[0], A3 = WED.cars[3], tx = (A0.x + A3.x)/2, tz = (A0.z + A3.z)/2, a = side(M, 14) - 0.35; res.gapA = +Math.hypot(M.x - N.x, M.z - N.z).toFixed(1);
  await view('haat_a', tx, Y(tx, tz) + 0.8, tz, tx + Math.sin(a)*17, Y(tx, tz) + 7, tz + Math.cos(a)*17); }
let joined = false; for (let i = 0; i < 60*10 && !joined; i++) { const B = WED.cars[3]; car.x = B.x - Math.sin(B.yaw)*9; car.z = B.z - Math.cos(B.yaw)*9; car.angle = B.yaw; car.vx = Math.sin(B.yaw)*3; car.vz = Math.cos(B.yaw)*3; car.speed = 3; step(1); joined = WED.joined; }
for (let i = 0; i < 45; i++) { const B = WED.cars[3]; car.x = B.x - Math.sin(B.yaw)*9; car.z = B.z - Math.cos(B.yaw)*9; car.angle = B.yaw; car.vx = Math.sin(B.yaw)*3; car.vz = Math.cos(B.yaw)*3; car.speed = 3; step(1); }
res.joined = joined;
{ const R = WED.cars[2], a = side(R, 8); setTimeOfDay('paiva'); LH_FAR.k = 1.0; res.rice = lifeFx.mesh ? 1 : 0;
  const q = a + 0.5*Math.sign(Math.sin(a - R.yaw)); await view('haat_b', R.x, Y(R.x, R.z) + 1.4, R.z, R.x + Math.sin(q)*4.5, Y(R.x, R.z) + 2.6, R.z + Math.cos(q)*4.5); }
// the hit: the bride and the groom come for you
{ const B = WED.cars[3]; car.x = B.x - Math.sin(B.yaw)*4; car.z = B.z - Math.cos(B.yaw)*4; car.vx = car.vz = car.speed = 0; B.damage += 2; step(2); res.angry = WED.angry > 0;
  const L0 = WED.cars[0]; let sp = null; for (const sd of [1, -1]) for (const d of [12, 15, 10]) { const q = L0.yaw + sd*1.1, x = L0.x + Math.sin(q)*d, z = L0.z + Math.cos(q)*d; if (!sp && clearSpot(x, z, 2.5)) sp = [x, z]; }
  if (!sp) sp = [L0.x + Math.sin(L0.yaw + 1.1)*12, L0.z + Math.cos(L0.yaw + 1.1)*12]; car.x = sp[0]; car.z = sp[1]; car.angle = Math.atan2(L0.x - car.x, L0.z - car.z) + 2.4; car.vx = car.vz = car.speed = 0; step(50); }
{ const b = WED.pair[0], g = WED.pair[1], tx = (b.x + car.x)/2, tz = (b.z + car.z)/2; res.brideD = +Math.hypot(b.x - car.x, b.z - car.z).toFixed(1); res.out = WED.pair.map(h => !h.inside);
  carGroup.position.set(car.x, Y(car.x, car.z), car.z); carGroup.rotation.set(0, car.angle, 0);
  const a0 = Math.atan2(b.x - car.x, b.z - car.z) + Math.PI/2; let a = a0; for (const s of [0, Math.PI, 0.5, Math.PI - 0.5]) { const q = a0 + s; if (clearLine(tx, tz, tx + Math.sin(q)*9, tz + Math.cos(q)*9)) { a = q; break; } }
  setTimeOfDay('paiva'); LH_FAR.k = 1.0; res.pair = WED.pair.map(h => [+Math.hypot(h.x - car.x, h.z - car.z).toFixed(1), !!h.down]); await view('haat_c', tx, Y(tx, tz) + 1.0, tz, tx + Math.sin(a)*11, Y(tx, tz) + 5, tz + Math.cos(a)*11); }
return res;
