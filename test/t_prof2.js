initAudio = () => {}; renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
step(60*3.3); const out = [];
for (let k = 0; k < 4; k++) { step(60*9, steer); const T = {}; const time = (n, f) => { const t0 = performance.now(); for (let i = 0; i < 60; i++) f(); T[n] = ((performance.now() - t0)/60).toFixed(3); };
  time('humans', () => humansUpdate(1/60)); time('vehicles', () => vehiclesUpdate(1/60)); time('field', () => updateFieldGames(1/60)); time('fires', () => firesUpdate(1/60)); time('emit', () => emittersUpdate(1/60)); time('near', () => { nearVisT = 0; nearVisUpdate(1/60); });
  let moving = 0, rigs = 0; HUMANS.forEach(h => { if (h.vx || h.vz) moving++; if (h.view.kind === 'rig' && !h.far) rigs++; }); T.moving = moving; T.rigsNear = rigs; out.push(T); }
return out;
