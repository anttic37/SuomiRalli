// lehti photo: the front page — "Kylän suurimmat rikolliset": a house on fire by the route, the rally car stopped, the police round it
startRace(false); setTimeOfDay('paiva'); step(60*1.2);
await TRY('rikolliset', async () => { let best = null; for (const B of STATIC_LIST) { if (B.kind !== 'house' || B.station) continue; const i = nearIdx(B.x, B.z), p = route(i), d = Math.hypot(p.x - B.x, p.y - B.z); if (d > 14 && d < 26 && (!best || d < best.d)) best = { B, i, d }; }
  const { B, i } = best; put(i, 0); hold(10); startFire({ house: B }); B.fire.level = 0.9; policeSpawn(3); let near = 0;
  for (let k = 0; k < 60*30; k++) { hold(1); near = POLICE.cars.filter(o => !o.gone && Math.hypot(o.x - car.x, o.z - car.z) < 16).length; if (near >= 2 && k > 60*4) break; }
  const tx = (car.x*2 + B.x)/3, tz = (car.z*2 + B.z)/3, a = Math.atan2(car.x - B.x, car.z - B.z) + 0.9; out.policeNear = near;
  await view('rikolliset', tx, Y(tx, tz) + 1.5, tz, tx + Math.sin(a)*14, Y(tx, tz) + 7, tz + Math.cos(a)*14); });
return out;
