// the UFOs: close-ups; the car driven at one: shot, explodes, burns; the responders that come get shot (up to the cap), then
// the job gets done; R: all back
startRace(false); step(60*4); const out = { ufos: UFOS.length };
for (const [k, U] of UFOS.entries()) { car.x = U.x + 70; car.z = U.z + 70; step(5); await shot('ufo' + k, U.x, U.z, 13, 10, 5, 0.5); }
{ const U = UFOS[0], a = Math.atan2(car.x - U.x, car.z - U.z); car.x = U.x + Math.sin(a)*70; car.z = U.z + Math.cos(a)*70; car.angle = a + Math.PI; car.vx = car.vz = 0;
  let beamShot = false; step(60*8, () => { keys.ArrowUp = Math.hypot(car.vx, car.vz) < 9; car.angle = Math.atan2(U.x - car.x, U.z - car.z); if (U.beam.visible && !beamShot) { beamShot = true; return false; } return !WRECK.on || !beamShot; }); keys.ArrowUp = false;
  if (beamShot) await shot('ufo_beam', (U.x + car.x)/2, (U.z + car.z)/2, 16, -12, 8, 1.5);
  step(60*1); out.carShot = { wreck: WRECK.on, distToUfo: Math.round(Math.hypot(car.x - U.x, car.z - U.z)), partsOff: carParts.filter(p => p.state === 'gone').length, fire: !!(WRECK.rv && WRECK.rv.fire) };
  await shot('ufo_wreck', car.x, car.z, 8, 8, 4, 0.6);
  const log = []; let lastK = 0; step(60*200, (i) => { if (U.kills !== lastK) { lastK = U.kills; log.push(Math.round(i/60) + 's:' + U.kills); } });
  out.after200 = { kills: U.kills, shots: U.shots, log: log.join(' '), wrecks: VEHICLES.filter(v => v.ufoHit).map(v => v.kind).join(','), live: VEHICLES.filter(v => (v.kind === 'ambulance' || v.kind === 'fire') && !v.ufoHit).map(v => v.kind + ':' + (v.job && v.job.phase)).join(','), driverGone: WRECK.driver && WRECK.driver.gone, queue: DISPATCH.queue.length, fires: FIRES.length };
  const W = VEHICLES.find(v => v.ufoHit); if (W) await shot('ufo_amb', W.x, W.z, 9, 7, 4.5, 0.8); }
startRace(false); step(30); out.afterReset = { wreck: WRECK.on, temp: VEHICLES.filter(v => v.temp).length, kills: UFOS.map(U => U.kills), fires: FIRES.length };
return out;
