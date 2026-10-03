initAudio = () => {}; renderer.render = () => {}; TESTBED.want = true; TESTBED.rcarWant = false; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const t0 = performance.now(); while (!TESTBED.on && performance.now() - t0 < 60000) { await new Promise(r => setTimeout(r, 200)); st(1); } st(30);
const g = groundAt(car.x, car.z); keys.ArrowUp = true; const log = []; for (let i = 0; i < 180; i++) { loop(lastTime + 1000/60); if (i % 30 === 0) log.push(Math.round(Math.hypot(car.vx, car.vz)*3.6)); } keys.ArrowUp = false;
return { on: TESTBED.on, rcar: TESTBED.rcar, ground: g, kmh: log, outer: car.outer };
