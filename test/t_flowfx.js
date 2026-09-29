// the record-pace sign: the yellow beacon on the roof flashes and the small line at the top shows (a real frame of the game)
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; setTimeOfDay('paiva'); startRace(false);
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 20; };
for (let i = 0; i < 60*9; i++) { steer(); loop(lastTime + 1000/60); } FLOW.on = true; let lit = 0;
for (let i = 0; i < 40; i++) { steer(); loop(lastTime + 1000/60); if (FLOW_FX && FLOW_FX.gl.material.opacity > 0.5) lit++; }
while (!(FLOW_FX.gl.material.opacity > 0.5)) { steer(); loop(lastTime + 1000/60); }
RR(scene, camera); await __save('flowfx.png', renderer.domElement.toDataURL('image/png')); const hud = getComputedStyle(document.getElementById('flow-hud')).display; FLOW.on = false; loop(lastTime + 1000/60);
return { lapStarted, litFramesOf40: lit, hud, hudAfter: getComputedStyle(document.getElementById('flow-hud')).display, beaconAfter: FLOW_FX.g.visible };
