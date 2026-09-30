// R in a broken dragster: straight into a fresh one at the lay-by; the Pökö waits on the grid. Also: the exit side
startRace(false); step(30); const g0 = { x: car.x, z: car.z }; const out = {};
{ const [lx, lz] = lloc(car.x, car.z, car.angle, 1, 0); walkOut(); const h = WALK.h; out.walkLeft = (h.x - car.x)*(lx - car.x) + (h.z - car.z)*(lz - car.z) > 0; walkIn(true); }
lapStarted = true; dragSwap(true); step(10);
const B = STATIC_LIST.find(b => b.kind === 'house' && Math.hypot(b.x - car.x, b.z - car.z) > 30 && Math.hypot(b.x - car.x, b.z - car.z) < 200);
const a = Math.atan2(B.x - car.x, B.z - car.z), sx = B.x - Math.sin(a)*(Math.max(B.hw, B.hl) + 14), sz = B.z - Math.cos(a)*(Math.max(B.hw, B.hl) + 14); car.x = RI.x = sx; car.z = RI.z = sz; car.angle = RI.a = a; DP.ok = false; dragInit(sx, sz, a); step(15);
DP.v.set(Math.sin(a)*45, 0, Math.cos(a)*45); step(120);
out.before = { lost: Object.keys(DP.lost).length, broken: DP.broken, wreck: WRECK.on };
startRace(false); step(30);
const lostVis = Object.keys(DP.lost).length;
out.after = { drag: DRAG.on, used: DRAG.used, broken: DP.broken, lost: lostVis, wreck: WRECK.on, dHome: Math.hypot(car.x - DRAG.home.x, car.z - DRAG.home.z).toFixed(1), pokoGrid: Math.hypot(DRAG.poko.x - g0.x, DRAG.poko.z - g0.z).toFixed(1), rb: RB.list ? RB.list.length : -1 };
startRace(false); step(10); out.again = { drag: DRAG.on };
dragSwap(false); startRace(false); step(10); out.poko = { drag: DRAG.on, dGrid: Math.hypot(car.x - g0.x, car.z - g0.z).toFixed(1) };
return out;
