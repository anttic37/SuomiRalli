// record pace: the split test turns FLOW on within 5 % of the best (off beyond); then police ahead swerve off the road into the forest, a moose ahead bolts
initAudio = () => {}; renderer.render = () => {};
const step = (k) => { for (let i = 0; i < k; i++) loop(lastTime + 1000/60); };
startRace(false); step(60);
bestTime = 100; ghost = { time: 100, splits: [12.5, 25, 37.5, 50, 62.5, 75, 87.5], s: [0, 0, 0, 0] }; const r = {};
flowSplit(0, 13.0); r.at4pct = FLOW.on; flowSplit(1, 27.0); r.at8pct = FLOW.on; flowSplit(2, 36.0); r.ahead = FLOW.on;
// police ahead
const n = trackPoints.length, i0 = car.prog; policeSpawn(2); const P = POLICE.cars.filter(v => !v.gone);
const p = trackPoints[(i0 + 25) % n], q = trackPoints[(i0 + 26) % n]; P.forEach((v, k) => { v.x = p.x + k*3; v.z = p.y; v.yaw = Math.atan2(car.x - p.x, car.z - p.y); vehicleSync(v); });
car.angle = Math.atan2(p.x - car.x, p.y - car.z); FLOW.on = true; const n0 = FLOW.n;
const d0 = P.map(v => Math.sqrt(roadInfo(v.x, v.z).d2)); step(60*4); const d1 = P.map(v => Math.sqrt(roadInfo(v.x, v.z).d2));
r.policeDodges = FLOW.n - n0; r.offRoadBefore = d0.map(x => +x.toFixed(1)); r.offRoadAfter = d1.map(x => +x.toFixed(1));
// a moose ahead
const m = HUMANS.find(h => h.task && h.task.kind === 'moose'); if (m) { const pm = trackPoints[(car.prog + 12) % n]; m.x = pm.x; m.z = pm.y; car.angle = Math.atan2(m.x - car.x, m.z - car.z); m.M.s.bolt = 0; const mb = Math.sqrt(roadInfo(m.x, m.z).d2); step(60*3); r.moose = [+mb.toFixed(1), +Math.sqrt(roadInfo(m.x, m.z).d2).toFixed(1)]; }
FLOW.on = false; return r;
