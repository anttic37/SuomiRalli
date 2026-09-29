// lehti photo retake: the alien gunner by the crashed UFO, far off and from above (the UFO no longer fills half the frame)
startRace(false); setTimeOfDay('paiva'); step(60*1.2);
await TRY('ufo_b', async () => { const U = UFOS[0]; car.x = U.x + 30; car.z = U.z + 5; car.vx = car.vz = 0; UFO_HITS.MAX = 99; hold(60*6);
  const gun = HUMANS.find(q => q.propR && q.task && q.task.kind === 'alien' && Math.hypot(q.x - U.x, q.z - U.z) < 15); car.x = gun.x + 22; car.z = gun.z + 4; hold(60*2);
  const tx = (gun.x + U.x)/2, tz = (gun.z + U.z)/2, a = Math.atan2(car.x - gun.x, car.z - gun.z) + 1.3; LH_FAR.k = 1; await view('ufo_b', tx, Y(tx, tz) + 2, tz, tx + Math.sin(a)*30, Y(tx, tz) + 17, tz + Math.cos(a)*30); LH_FAR.k = 1.9; });
return out;
