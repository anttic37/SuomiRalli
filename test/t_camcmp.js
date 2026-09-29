// the camera now vs the one of 27.9 (Mane's record, f1c9ed8): the same seeded drive, shots at the same moments — CAMV = 'old' | 'new', CAMLOW for the low view
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {};
if (window.CAMV === 'old') updateCamera = window.__oldCam;
const steer = (vmax) => { const n = trackPoints.length, tp = trackPoints[(car.prog + 7) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.05; keys.ArrowRight = dA < -0.05; keys.ArrowUp = Math.hypot(car.vx, car.vz) < vmax; keys.ArrowDown = Math.hypot(car.vx, car.vz) > vmax + 4; };
startRace(false); if (window.CAMLOW) { camLow = true; } for (let i = 0; i < 60*3.3; i++) loop(lastTime + 1000/60);
const shots = [[60*9, 34], [60*6, 30], [60*6, 38]], out = [];
for (let s = 0; s < shots.length; s++) { for (let i = 0; i < shots[s][0]; i++) { steer(shots[s][1]); loop(lastTime + 1000/60); } RR(scene, camera); await __save('cam_' + window.CAMV + (window.CAMLOW ? 'low' : '') + s + '.png', renderer.domElement.toDataURL('image/png')); out.push([Math.round(Math.hypot(car.vx, car.vz)*3.6), car.prog]); }
return out;
