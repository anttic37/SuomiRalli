// lehti photos, far view (LH_FAR): the sauna party, the captured UFO over the car, the nuke's cloud over the village and after it
startRace(false); setTimeOfDay('paiva'); step(60*1.2);
await TRY('sauna', async () => { const S = X3.sauna; car.x = S.x + 40; car.z = S.z; car.vx = car.vz = 0; hold(60*20); await around('sauna', S.x, S.z, 15, 8, 0.8, 5); });
await TRY('ufo_a', async () => { const U = UFOS[0], gun = HUMANS.find(q => q.task && q.task.kind === 'alien' && q.propR && Math.hypot(q.x - U.x, q.z - U.z) < 15);
  car.x = U.x + 30; car.z = U.z + 5; car.vx = car.vz = 0; step(60*3); if (gun && !U.captured) knock(gun, 5, 0, 8); for (let i = 0; i < 60*5; i++) step(1);
  for (let i = 0; i < 60*3; i++) { car.vx = Math.sin(car.angle)*14; car.vz = Math.cos(car.angle)*14; car.speed = 14; step(1); } out.captured = U.captured;
  await around('ufo_a', car.x, car.z, 16, 9, car.angle + 2.3, 6); });
await TRY('nuke', async () => { if (WRECK.on) wreckReset(); put(nearIdx(car.x, car.z), 0); RADIO.list = [{ file: 'koelahetys-11.mp3', koe: true }]; RADIO.i = 0; RADIO.off = false; nukeArm(); step(60*7.2);
  for (let i = 0; i < 60*8 && !NUKE.hit; i++) step(1); step(60*3); const dx = NUKE.gx - car.x, dz = NUKE.gz - car.z, l = Math.hypot(dx, dz) || 1; LH_FAR.k = 1;
  await view('nuke_a', NUKE.gx, Y(NUKE.gx, NUKE.gz) + 90, NUKE.gz, car.x - dx/l*70, Y(car.x, car.z) + 38, car.z - dz/l*70); LH_FAR.k = 1.9;
  step(60*4); await around('nuke_b', car.x, car.z, 16, 10, car.angle + 2.6, 2); });
return out;
