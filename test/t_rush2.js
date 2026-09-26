initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
const persons = HUMANS.filter(h => h.task && h.task.kind === 'spectate');
let best = null; tires.forEach(t => { if (t.kind !== 'tire') return; const n = persons.filter(p => Math.hypot(p.x - t.x, p.z - t.z) < 30).length; if (!best || n > best.n) best = { t, n }; });
const T0 = best.t, ri = roadInfo(T0.x, T0.z), q = trackPoints[ri.idx]; const dx = T0.x - q.x, dz = T0.z - q.y, dl = Math.hypot(dx, dz) || 1;
car.x = T0.x - dx/dl*12; car.z = T0.z - dz/dl*12; car.angle = Math.atan2(dx, dz); car.vx = dx/dl*17; car.vz = dz/dl*17;
const near = () => persons.filter(p => !p.down && Math.hypot(p.x - T0.x, p.z - T0.z) < 45);
const d0 = near().map(p => Math.hypot(p.x - car.x, p.z - car.z)); const start = new Map(near().map(p => [p, [p.x, p.z]]));
step(60*1.2);
const crashed = !!crashAt; const snap = [];
for (let k = 0; k < 4; k++) { step(60*1.5, () => { car.vx *= 0.9; car.vz *= 0.9; }); const ds = near().map(p => Math.hypot(p.x - car.x, p.z - car.z)); snap.push((ds.reduce((a, b) => a + b, 0)/ds.length).toFixed(1) + '/' + ds.filter(d => d < 7).length); }
let moved = 0, closer = 0; start.forEach(([x, z], p) => { if (Math.hypot(p.x - x, p.z - z) > 3) moved++; if (Math.hypot(p.x - car.x, p.z - car.z) < Math.hypot(x - car.x, z - car.z) - 3) closer++; });
return { moved, closer, of: start.size, onRoute: crashAt && crashAt.onRoute, crowdNear: best.n, crashed, startAvgDist: (d0.reduce((a, b) => a + b, 0)/d0.length).toFixed(1), avgDist_within7: snap, downed: HUMANS.filter(p => p.down).length, queue: DISPATCH.queue.length, amb: VEHICLES.filter(v => v.kind === 'ambulance').length };
