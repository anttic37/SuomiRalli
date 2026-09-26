initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false);
let T = 0; const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
const calls = [], tris = [], jsMs = [];
for (let k = 0; k < 8; k++) { step(60*6, steer); renderer.info.autoReset = true; const t0 = performance.now(); for (let i = 0; i < 30; i++) worldUpdate(1/60); const t1 = performance.now(); jsMs.push(((t1 - t0)/30).toFixed(2));
  RR(scene, camera); calls.push(renderer.info.render.calls); tris.push(Math.round(renderer.info.render.triangles/1000)); }
keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = false;
return { calls: calls.join(' '), ktris: tris.join(' '), lifeMsPerFrame: jsMs.join(' ') };
