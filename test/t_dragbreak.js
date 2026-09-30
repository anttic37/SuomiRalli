// how much does it take? the dragster into a house head-on and glancing, a pole, a parked car, a roll — at several speeds
startRace(false); step(60); lapStarted = true; dragSwap(true); step(10); const res = [];
const houseNear = (x, z) => { let best = null; for (const B of STATIC_LIST) { if (B.kind !== B.kind || !(B.kind === 'house' || B.kind === 'pole')) continue; const d = Math.hypot(B.x - x, B.z - z); if (d > 30 && d < 300 && (!best || d < best.d)) best = { B, d }; } return best.B; };
const kinds = {}; for (const B of STATIC_LIST) kinds[B.kind] = B;
const run = (B, v, off, lab) => { if (WRECK.on || !DRAG.on) { startRace(false); step(20); lapStarted = true; dragSwap(true); step(5); }
  const a = Math.atan2(B.x - car.x, B.z - car.z) + off, sx = B.x - Math.sin(a)*(Math.max(B.hw, B.hl) + 14), sz = B.z - Math.cos(a)*(Math.max(B.hw, B.hl) + 14); car.x = RI.x = sx; car.z = RI.z = sz; car.angle = RI.a = a; DP.ok = false; dragInit(sx, sz, a); step(15);
  DP.v.set(Math.sin(a)*v, 0, Math.cos(a)*v); let hm = 0; step(100, () => { hm = Math.max(hm, DP.hit); }); res.push([lab, B.kind, Math.round(v*3.6) + 'km/h', 'hit' + hm.toFixed(0), Object.keys(DP.lost).join(',') || '-', WRECK.on ? 'WRECK' : ''].join(' ')); };
const H = houseNear(car.x, car.z), P = STATIC_LIST.find(b => b.kind === 'pole' && Math.hypot(b.x - car.x, b.z - car.z) > 30);
for (const v of [12, 18, 25, 33, 45]) run(H, v, 0, 'head-on');
for (const v of [18, 33]) run(H, v, 0.55, 'glance');
if (P) for (const v of [15, 30]) run(P, v, 0, 'pole');
return res;
