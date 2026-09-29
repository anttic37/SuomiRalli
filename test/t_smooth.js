// judder: the drawn car against the camera, frame to frame, at 144 Hz and at a jittery 60 Hz (driving along the route); the step count per frame varies, the drawn motion must not
initAudio = () => {}; renderer.render = () => {};
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 22; };
startRace(false); for (let i = 0; i < 60*3.3; i++) loop(lastTime + 1000/60); for (let i = 0; i < 60*6; i++) { steer(); loop(lastTime + 1000/60); }
const run = (dts) => { const sp = []; let px = carGroup.position.x, pz = carGroup.position.z;
  for (const d of dts) { steer(); loop(lastTime + d); const x = carGroup.position.x, z = carGroup.position.z; sp.push(Math.hypot(x - px, z - pz)/(d/1000)); px = x; pz = z; }
  let j = 0; for (let i = 1; i < sp.length; i++) j += Math.abs(sp[i] - sp[i - 1]); const m = sp.reduce((a, b) => a + b)/sp.length; return { meanSpeed: +m.toFixed(1), judder: +(j/(sp.length - 1)/m*100).toFixed(1) }; };   // (judder: the mean frame-to-frame change of the drawn speed, % of the speed)
return { hz144: run(Array.from({ length: 600 }, () => 1000/144)), hz60jitter: run(Array.from({ length: 300 }, (_, i) => 1000/60 + (i % 2 ? 0.7 : -0.7))), hz60: run(Array.from({ length: 300 }, () => 1000/60)) };
