// a knocked bin must not ride along on the bonnet: drive straight through bins at 15 m/s for 3 s
initAudio = () => {}; renderer.render = () => {}; startRace(false); const st = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(); loop(lastTime + 1000/60); } }; st(60);
const B = BINS.list.find(b => !onRoad(b.x, b.z, 0)) || BINS.list[0]; const res = {}; const a = Math.atan2(B.x - (B.x - 20), 0); const sx = B.x - 20, sz = B.z;
car.x = sx; car.z = sz; car.angle = Math.PI/2; const drive = () => { car.angle = Math.PI/2; car.vx = 15; car.vz = 0; car.speed = 15; };
let near = 0, maxNearRun = 0, run = 0; for (let i = 0; i < 180; i++) { drive(); loop(lastTime + 1000/60); const p = B.rb ? B.rb.p : B; const d = Math.hypot(p.x - car.x, p.z - car.z); if (B.down && d < 3) { run++; maxNearRun = Math.max(maxNearRun, run); } else run = 0; }
res.down = B.down; res.maxFramesNearCar = maxNearRun; res.binBehind = +((B.rb ? B.rb.p.x : B.x) - car.x).toFixed(1);
return res;
