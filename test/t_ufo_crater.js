// the crash sites (pictures) and the three-hit rule: two direct hits throw and dent the car, the third blows it up; R resets
startRace(false); step(60*4); const out = { ufos: UFOS.length };
for (const [k, U] of UFOS.entries()) { car.x = U.x + 80; car.z = U.z + 80; step(5);
  await shot('crater' + k + 'a', U.x, U.z, 20, 16, 11, 0); await shot('crater' + k + 'b', U.x, U.z, -14, -22, 7, 0.5); await shot('crater' + k + 'top', U.x, U.z, 1, 1, 40, 0); }
// hits: a bolt put right on the car three times
const U = UFOS[0]; car.x = U.x + 40; car.z = U.z; car.vx = car.vz = 0; step(2); const hits = [];
for (let k = 0; k < 3; k++) { ufoHitCar(car.x + 0.5, car.z + 0.3); step(20); hits.push({ n: UFO_HITS.n, wreck: WRECK.on, speed: +Math.hypot(car.vx, car.vz).toFixed(1), partsOff: carParts.filter(p => p.state === 'gone').length, msg: document.getElementById('pizza-msg').textContent }); step(60); }
out.hits = hits; startRace(false); step(10); out.afterR = { n: UFO_HITS.n, wreck: WRECK.on };
return out;
