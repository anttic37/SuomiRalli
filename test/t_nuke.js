startRace(false); step(60*4.5); const out = {}; const h0 = HUMANS.filter(h => !h.gone).length, s0 = STATIC_LIST.length, v0 = VEHICLES.length;
// the radio path: arm, then the song check
RADIO.list = [{ file: 'koelahetys-11.mp3', koe: true }]; RADIO.i = 0; RADIO.off = false; nukeArm(); out.armed = NUKE.armT > 0; step(60*7.2); out.on = NUKE.on;
RR(scene, camera); await __save('s3_nuke_flash.png', renderer.domElement.toDataURL('image/png'));
step(60*1); const c0 = [car.x, car.z]; for (let i = 0; i < 60*4 && !NUKE.hit; i++) step(1); out.hit = NUKE.hit; step(60*1.5); out.carFlung = +Math.hypot(car.x - c0[0], car.z - c0[1]).toFixed(1);
out.humansLeft = [h0, HUMANS.filter(h => !h.gone).length]; out.statics = [s0, STATIC_LIST.length]; out.vehNuked = VEHICLES.filter(v => v.nuked).length + '/' + v0;
step(60*4); RR(scene, camera); await __save('s3_nuke_cam.png', renderer.domElement.toDataURL('image/png'));
await shot('nuke_ground', car.x, car.z, 30, 25, 14, 4);
// look at the cloud
const dx = NUKE.gx - car.x, dz = NUKE.gz - car.z, l = Math.hypot(dx, dz); camera.position.set(car.x - dx/l*20, Y(car.x, car.z) + 6, car.z - dz/l*20); camera.lookAt(NUKE.gx, Y(NUKE.gx, NUKE.gz) + 180, NUKE.gz); camera.updateMatrixWorld(); RR(scene, camera); await __save('s3_nuke_cloud.png', renderer.domElement.toDataURL('image/png'));
// drive on
const p0 = car.prog; for (let i = 0; i < 60*3; i++) { keys.ArrowUp = true; step(1); } keys.ArrowUp = false; out.drives = +Math.hypot(car.vx, car.vz).toFixed(1);
startRace(false); step(30); out.afterR = [NUKE.on, HUMANS.filter(h => !h.gone).length, STATIC_LIST.length, VEHICLES.filter(v => v.nuked).length, treeMeshes.filter(m => !m.visible).length];
return out;
