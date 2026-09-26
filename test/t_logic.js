// logic only (render stubbed) — node real.js ../index.html t_logic.js, or profiled: node prof.js ../index.html t_logic.js: drive the lap with the bot, whole loop() per frame
initAudio = () => {}; renderer.render = () => {};
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
if (window.__warm !== false) { startRace(false); step(60*3.3); step(60*5, steer); if (window.__warm) return 'warm'; }   // (prof.js: a warm-up call, then the profiled one; real.js: both in one go)
const t0 = performance.now(); step(60*40, steer); const ms = (performance.now() - t0)/(60*40);
return { msPerFrame: ms.toFixed(3), prog: car.prog };
