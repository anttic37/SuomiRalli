startRace(false); step(60*2); const Hh = X3.heli; car.x = Hh.x + 40; car.z = Hh.z; step(60*2);
const [lx, lz] = lloc(Hh.x, Hh.z, Hh.yaw, 4.2, 0);
await shot('heli_top', lx, lz, 0.5, 0.5, 7, 0);
const [sx, sz] = lloc(0, 0, Hh.yaw, 9, 6); await shot('heli_side', Hh.x, Hh.z, sx, sz, 2.5, 1.5);
const [fx, fz] = lloc(0, 0, Hh.yaw, -4, 10); await shot('heli_front', Hh.x, Hh.z, fx, fz, 2, 1.5);
const P = HUMANS.find(h => h.task && h.task.kind === 'patient'); return { patient: [P.x - lx, P.z - lz], yaw: P.yaw };
