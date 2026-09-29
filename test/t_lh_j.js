// lehti photo: record pace — two police cars ahead swerve off the road into the forest, the rally car goes on (far view)
startRace(false); setTimeOfDay('paiva'); step(60*1.2);
await TRY('vauhti', async () => { let best = null; for (let i = 0; i < n; i += 9) { const p = route(i); const t = treeCount(p.x, p.y, 30); if (!best || t > best.t) best = { i, t }; }   // (a stretch through the woods)
  put(best.i, 0); hold(5); policeSpawn(2); const P = POLICE.cars.filter(v => !v.gone), p = route(best.i + 22);
  P.forEach((v, k) => { v.x = p.x + (k ? 2.5 : -2.5); v.z = p.y + k*6; v.yaw = Math.atan2(car.x - v.x, car.z - v.z); v.vx = Math.sin(v.yaw)*12; v.vz = Math.cos(v.yaw)*12; vehicleSync(v); });
  car.angle = Math.atan2(p.x - car.x, p.y - car.z); FLOW.on = true; for (let k = 0; k < 60*1.6; k++) step(1); FLOW.on = false;
  const tx = (car.x + p.x)/2, tz = (car.z + p.y)/2, a = car.angle + 2.2; LH_FAR.k = 1; await view('vauhti', tx, Y(tx, tz) + 1, tz, tx + Math.sin(a)*34, Y(tx, tz) + 24, tz + Math.cos(a)*34); LH_FAR.k = 1.9;
  out.off = P.map(v => +Math.sqrt(roadInfo(v.x, v.z).d2).toFixed(1)); });
return out;
