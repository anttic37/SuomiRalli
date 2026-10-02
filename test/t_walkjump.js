// out at speed: the driver tumbles, the car rolls to a stop and is parked; the walking camera close and centred; out/in smooth
initAudio = () => {}; renderer.render = () => {};
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; };
startRace(false); keys.ArrowUp = true; for (let i = 0; i < 60*6; i++) { steer(); loop(lastTime + 1000/60); } keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = false;
const kmh = Math.round(Math.hypot(car.vx, car.vz)*3.6), c0 = [car.x, car.z]; const out = walkOut(), h = WALK.h, down = h.down; let t = 0, camStep = 0, prev = camera.position.clone();
while (WALK.roll && t < 600) { loop(lastTime + 1000/60); t++; camStep = Math.max(camStep, camera.position.distanceTo(prev)); prev.copy(camera.position); }
const rolled = Math.round(Math.hypot(car.x - c0[0], car.z - c0[1])); for (let i = 0; i < 60*4; i++) { loop(lastTime + 1000/60); camStep = Math.max(camStep, camera.position.distanceTo(prev)); prev.copy(camera.position); }
const up = !h.down, parked = [car.x, car.z]; for (let i = 0; i < 60; i++) loop(lastTime + 1000/60); const stays = Math.hypot(car.x - parked[0], car.z - parked[1]) < 0.01;
// the walking camera: distance, height, and where the walker sits on screen
const back = Math.hypot(camera.position.x - h.x, camera.position.z - h.z), hgt = camera.position.y - Y(h.x, h.z), p = new THREE.Vector3(h.x, Y(h.x, h.z) + 0.9, h.z).project(camera);
return { kmh, out, down, rollFrames: t, rolled, maxCamStep: +camStep.toFixed(2), up, stays, cam: { back: +back.toFixed(1), height: +hgt.toFixed(1), screenX: +p.x.toFixed(2), screenY: +p.y.toFixed(2) } };
