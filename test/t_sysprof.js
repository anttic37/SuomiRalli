// per-system time per frame (render stubbed): every worldUpdate part and the loop's other parts, driving the lap with the bot; also frame-time spikes
initAudio = () => {}; renderer.render = () => {};
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
startRace(false); step(60*3.3); step(60*5, steer);
const names = ['vehiclesUpdate','updateFieldGames','pizzaUpdate','lpUpdate','queueUpdate','extras2Update','extras3Update','policeUpdate','bassUpdate','heviUpdate','humansUpdate','walkUpdate','firesUpdate','emittersUpdate','nearVisUpdate','updateCar','updateTires','balesUpdate','vehiclesPhysics','updateMarks','updateDust','updateDebris','updateSmoke','updateCarBody','updateCamera','updateHUD','updateGhost','updateAudio','drawMinimap','updateCheckpoints','worldUpdate'];
const T = {}; for (const n of names) { const f = window[n]; if (typeof f !== 'function') continue; T[n] = 0; window[n] = function (...a) { const t = performance.now(); const r = f.apply(this, a); T[n] += performance.now() - t; return r; }; }
const N = 60*25, ft = []; for (let i = 0; i < N; i++) { steer(); const t = performance.now(); loop(lastTime + 1000/60); ft.push(performance.now() - t); }
ft.sort((a, b) => a - b); const out = {}; for (const n in T) out[n] = +(T[n]/N).toFixed(3);
return { frames: N, avg: +(ft.reduce((a, b) => a + b)/N).toFixed(2), p50: +ft[N/2|0].toFixed(2), p95: +ft[N*0.95|0].toFixed(2), p99: +ft[N*0.99|0].toFixed(2), max: +ft[N-1].toFixed(1), msPer: Object.fromEntries(Object.entries(out).sort((a, b) => b[1] - a[1])), humans: HUMANS.length, veh: VEHICLES.length };
