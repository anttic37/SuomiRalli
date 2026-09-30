// the dragster in pieces: each piece a box that falls, tumbles and settles flat — none sunk, none floating, no NaN
startRace(false); step(40); lapStarted = true; dragSwap(true); step(20);
let best = null; for (const B of STATIC_LIST) { if (B.kind !== 'house') continue; const d = Math.hypot(B.x - car.x, B.z - car.z); if (d > 40 && d < 250 && (!best || d < best.d)) best = { B, d }; }
const B = best.B, a = Math.atan2(B.x - car.x, B.z - car.z) + 0.2, sx = B.x - Math.sin(a)*28, sz = B.z - Math.cos(a)*28; car.x = RI.x = sx; car.z = RI.z = sz; car.angle = RI.a = a; DP.ok = false; dragInit(sx, sz, a); step(20);
DP.v.set(Math.sin(a)*45, 0, Math.cos(a)*45); let nn = 0; while (nn++ < 90 && !WRECK.on) step(1); step(10);
LH_FAR.k = 1; await view('palat_lento', car.x, Y(car.x, car.z) + 1, car.z, car.x - Math.sin(a)*12 + Math.cos(a)*9, Y(car.x, car.z) + 7, car.z - Math.cos(a)*12 - Math.sin(a)*9);
let maxW = 0; step(60*5, () => { for (const b of RB.list) maxW = Math.max(maxW, b.w.length()); });
const st = RB.list.map(b => { let lo = 1e9, hi = -1e9; for (const P of b.pts) { const w = new THREE.Vector3(P[0], P[1], P[2]).applyQuaternion(b.q).add(b.p), g = Y(w.x, w.z) + (onRoad(b.p.x, b.p.z, 0) ? ROAD_Y : 0); lo = Math.min(lo, w.y - g); hi = Math.max(hi, w.y - g); } return { lo: +lo.toFixed(2), sleep: b.sleep, d: +Math.hypot(b.p.x - car.x, b.p.z - car.z).toFixed(1) }; });
await view('palat_maassa', car.x, Y(car.x, car.z) + 1, car.z, car.x - Math.sin(a)*12 + Math.cos(a)*9, Y(car.x, car.z) + 7, car.z - Math.cos(a)*12 - Math.sin(a)*9);
return { pieces: RB.list.length, maxW: +maxW.toFixed(1), st };
