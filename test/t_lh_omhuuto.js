// paper photos (3.10.): the jump for an apple, the owner shouting at the door, an orchard
setTimeOfDay('paiva'); startRace(false); step(30); const res = {};
const lone = APPLES.list.filter(a => Math.hypot(a.x, a.z) < 360 && clearSpot(a.x + 1.6, a.z, 0.4) && clearLine(a.x, a.z, a.x + 9, a.z + 9) && !APPLES.list.some(b => b !== a && Math.hypot(b.x - a.x, b.z - a.z) < 9));
const AT = lone[2] || lone[0]; res.tree = [Math.round(AT.x), Math.round(AT.z)];
car.x = AT.x + 9; car.z = AT.z + 9; car.vx = car.vz = car.speed = 0; step(2); walkOut(); const wh = WALK.h; wh.x = AT.x + 1.6; wh.z = AT.z; wh.vx = wh.vz = 0; LH_FAR.k = 1.0;
let k = 0, jumped = false; while (k < 600 && !jumped) { step(1); k++; const F = APPLES.fly[0]; if (F && F.tp !== Infinity && F.t >= F.tp - 0.02) jumped = true; }
res.jump = jumped; res.hop = +wh.hop.toFixed(2);
{ const a = wh.yaw + Math.PI/2; let best = a; for (const b of [a, a + Math.PI, a + 0.6, a - 0.6 + Math.PI]) { const cx = wh.x + Math.sin(b)*5.5, cz = wh.z + Math.cos(b)*5.5; if (clearLine(wh.x, wh.z, cx, cz) && clearSpot(cx, cz, 1)) { best = b; break; } }
  await view('omhyppy', wh.x, Y(wh.x, wh.z) + 1.9, wh.z, wh.x + Math.sin(best)*5.5, Y(wh.x, wh.z) + 2.6, wh.z + Math.cos(best)*5.5); }
const OC = APPLES.chase[0]; res.owner = !!OC; for (let i = 0; i < 600 && OC && !(OC.m === 'shout' && OC.t > 0.35); i++) { wh.x = AT.x + 3; wh.z = AT.z + 3; step(1); }
res.mode = OC && OC.m;
if (OC) { const oh = OC.h; let best = null; for (const b of [oh.yaw, oh.yaw + 0.5, oh.yaw - 0.5, oh.yaw + 1.0, oh.yaw - 1.0]) { const cx = oh.x + Math.sin(b)*7, cz = oh.z + Math.cos(b)*7; if (clearLine(oh.x, oh.z, cx, cz) && clearSpot(cx, cz, 1)) { best = b; break; } }
  if (best === null) best = oh.yaw; await view('omhuuto', oh.x, Y(oh.x, oh.z) + 1.8, oh.z, oh.x + Math.sin(best)*7, Y(oh.x, oh.z) + 3.2, oh.z + Math.cos(best)*7); }
walkIn(true); for (const f of X3.reset) f(); step(5);
const orch = APPLES.list.map(a => ({ a, n: APPLES.list.filter(b => Math.hypot(b.x - a.x, b.z - a.z) < 7).length })).filter(o => Math.hypot(o.a.x, o.a.z) < 500).sort((p, q) => q.n - p.n)[0];
res.orchN = orch && orch.n;
if (orch) { const O = orch.a; let cxs = 0, czs = 0, m = 0; for (const b of APPLES.list) if (Math.hypot(b.x - O.x, b.z - O.z) < 7) { cxs += b.x; czs += b.z; m++; } const ox = cxs/m, oz = czs/m; car.x = ox + 30; car.z = oz + 30; step(20);
  for (const b of [0.6, 2.2, 3.8, 5.4]) { const cx = ox + Math.sin(b)*13, cz = oz + Math.cos(b)*13; if (clearLine(ox, oz, cx, cz) && clearSpot(cx, cz, 1.5)) { await view('omtarha', ox, Y(ox, oz) + 1.5, oz, cx, Y(cx, cz) + 8, cz); break; } } }
return res;
