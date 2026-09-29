// on foot the camera is the driving one: high above and behind the walker (not the low third-person one)
initAudio = () => {}; renderer.render = () => {};
startRace(false); for (let i = 0; i < 60*2; i++) loop(lastTime + 1000/60);
const drive = camera.position.y - Y(car.x, car.z); walkOut(); const h = WALK.h; keys.ArrowUp = true; for (let i = 0; i < 60*4; i++) loop(lastTime + 1000/60); keys.ArrowUp = false;
const up = camera.position.y - Y(h.x, h.z), back = Math.hypot(camera.position.x - h.x, camera.position.z - h.z); walkIn(true);
return { driveCamHeight: +drive.toFixed(1), walkCamHeight: +up.toFixed(1), walkCamDist: +back.toFixed(1) };
