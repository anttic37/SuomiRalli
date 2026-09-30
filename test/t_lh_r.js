// the dragster: pipe flames at the launch, the lay-by in the road's asphalt, its own gauges, and a crash that tears it apart
startRace(false); step(40); lapStarted = true; const H = DRAG.home; car.x = RI.x = H.x - Math.cos(H.angle)*4.5; car.z = RI.z = H.z + Math.sin(H.angle)*4.5; car.vx = car.vz = 0; step(10); walkOut(); WALK.h.x = H.x - Math.cos(H.angle)*1.6; WALK.h.z = H.z + Math.sin(H.angle)*1.6; step(3);
dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' })); dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyF' })); step(60); out.inDrag = DRAG.on;
LH_FAR.k = 1; await view('laytop', H.x, Y(H.x, H.z), H.z, H.x + 0.5, Y(H.x, H.z) + 34, H.z + 0.5);
keys.ArrowUp = true; step(20); out.flames = flameFx2 && true; out.kmh = Math.round(Math.hypot(car.vx, car.vz)*3.6);
{ const fx = Math.sin(car.angle), fz = Math.cos(car.angle), x = car.x - fx*1.4, z = car.z - fz*1.4; LH_FAR.k = 1; await view('liekit', x, Y(x, z) + 1.1, z, x - fx*2.5 + fz*5.5, Y(x, z) + 2.4, z - fz*2.5 - fx*5.5); }
await __pageshot('cluster_drag.png'); keys.ArrowUp = false; step(30);
// apart: 48 m/s into a house
{ let best = null; for (const B of STATIC_LIST) { if (B.kind !== 'house') continue; const d = Math.hypot(B.x - car.x, B.z - car.z); if (d > 40 && d < 250 && (!best || d < best.d)) best = { B, d }; }
  const B = best.B, a = Math.atan2(B.x - car.x, B.z - car.z) + 0.2, sx = B.x - Math.sin(a)*28, sz = B.z - Math.cos(a)*28; car.x = RI.x = sx; car.z = RI.z = sz; car.angle = RI.a = a; DP.ok = false; dragInit(sx, sz, a); step(20);
  DP.v.set(Math.sin(a)*48, 0, Math.cos(a)*48); let n = 0; while (n++ < 90 && !WRECK.on) step(1); step(14); out.apart = { wreck: WRECK.on, lost: Object.keys(DP.lost).length, debris: debris.length };
  LH_FAR.k = 1; await view('hajosi', car.x, Y(car.x, car.z) + 1, car.z, car.x - Math.sin(a)*13 + Math.cos(a)*8, Y(car.x, car.z) + 9, car.z - Math.cos(a)*13 - Math.sin(a)*8); }
return out;
