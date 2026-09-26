// real physics, full lap on autopilot: lap completes, the car stays on the ground, the camera never dips under it
if (window.__AMP) { const rh = window.rawHeight; window.rawHeight = (x, z) => rh(x, z)*window.__AMP; generateTrack(); resetCar(); }
initAudio = () => {}; startRace(false);
const realRender = renderer.render.bind(renderer); renderer.render = () => {};
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
step(60*3.2);
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI;
  const tp2 = trackPoints[(car.prog + 14) % n]; let dB = Math.atan2(tp2.x - car.x, tp2.y - car.z) - car.angle; while (dB > Math.PI) dB -= 2*Math.PI; while (dB < -Math.PI) dB += 2*Math.PI;
  keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; const vmax = Math.abs(dB) > 0.6 ? 9 : Math.abs(dB) > 0.3 ? 13 : 19; const v = Math.hypot(car.vx, car.vz); keys.ArrowUp = v < vmax; keys.ArrowDown = v > vmax + 3; };
let t = 0, offRoad = 0, maxDy = 0, camLow = 0, camMin = 9, maxTilt = 0, stuck = 0, lastProg = -1, lastProgT = 0, climb = [];
const carY = () => carGroup.position.y;
step(60*400, i => { steer(); t += 1/60;
  const g = H(car.x, car.z); maxDy = Math.max(maxDy, Math.abs(carY() - g) > 2 ? Math.abs(carY() - g) : 0);
  const cy = camera.position.y - H(camera.position.x, camera.position.z); camMin = Math.min(camMin, cy); if (cy < 0.6) camLow++;
  maxTilt = Math.max(maxTilt, Math.abs(car.tiltP || 0), Math.abs(car.tiltR || 0));
  if (!onRoad(car.x, car.z, 0.3)) offRoad++;
  if (car.prog !== lastProg) { lastProg = car.prog; lastProgT = t; } else if (t - lastProgT > 8) { stuck++; return false; }
  if (i % 120 === 0) climb.push([car.prog, +g.toFixed(1), Math.round(Math.hypot(car.vx, car.vz)*3.6)]);
  if (gameState === State.FINISHED || (lapStarted === false && t > 30 && raceTime === 0 && gameState !== State.RACING)) return false; });
keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = keys.ArrowDown = false;
let hmin = 1e9, hmax = -1e9; for (const v of HG.h) { hmin = Math.min(hmin, v); hmax = Math.max(hmax, v); }
return { state: gameState, t: +t.toFixed(1), raceTime: +raceTime.toFixed(2), best: typeof bestLap !== 'undefined' ? bestLap : null, prog: car.prog, n: trackPoints.length, offRoadFrames: offRoad, carOffGround: +maxDy.toFixed(2), camMin: +camMin.toFixed(2), camLowFrames: camLow, maxTilt: +maxTilt.toFixed(3), stuck, terrain: [hmin.toFixed(1), hmax.toFixed(1)], climb: climb.filter((_, k) => k % 3 === 0).map(c => c.join('/')).join(' ') };
