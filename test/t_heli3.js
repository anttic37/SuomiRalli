startRace(false); step(60*2); const Hh = X3.heli; car.x = Hh.x + 40; car.z = Hh.z; step(60*2);
const P = HUMANS.find(h => h.task && h.task.kind === 'patient'), fx = Math.sin(P.yaw), fz = Math.cos(P.yaw), cx = P.x - fx*1.0, cz = P.z - fz*1.0;
await shot('cpr_side', cx, cz, -fz*4.5, fx*4.5, 1.6, 0.3); step(9); await shot('cpr_side2', cx, cz, fz*4.5, -fx*4.5, 1.6, 0.3);
return 1;
