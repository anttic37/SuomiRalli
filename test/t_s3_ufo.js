// the UFOs: well away from the route (a race never wakes them, even passing right by); drive out to one: it wakes, the neighbourhood
// comes to gawk, green bolts at everything — most go wide; people knocked, cars burning, the car blown up sooner or later; R: all back
startRace(false); step(60*4); const out = { ufos: UFOS.length, fromRoute: UFOS.map(U => Math.round(distRoute(U.x, U.z))) };
// racing past: the car on the route point nearest each UFO, driving along the route
for (const U of UFOS) { let bi = 0, bd = 1e9; trackPoints.forEach((p, i) => { const d = Math.hypot(p.x - U.x, p.y - U.z); if (d < bd) { bd = d; bi = i; } });
  const p = trackPoints[bi], q = trackPoints[(bi + 3) % trackPoints.length]; car.x = p.x; car.z = p.y; car.angle = Math.atan2(q.x - p.x, q.y - p.y); car.vx = car.vz = 0; step(60*3); }
out.wokeFromRoute = UFOS.map(U => U.woke);
for (const [k, U] of UFOS.entries()) { car.x = U.x + 70; car.z = U.z + 70; step(5); await shot('ufo' + k, U.x, U.z, 13, 10, 5, 0.5); }
// out to UFO 0 off the route
const U = UFOS[0], a = Math.atan2(car.x - U.x, car.z - U.z); car.x = U.x + Math.sin(a)*90; car.z = U.z + Math.cos(a)*90; car.angle = a + Math.PI; car.vx = car.vz = 0;
const booms = []; const ub = ufoBoom; ufoBoom = (B) => { booms.push([+worldT.toFixed(1), Math.round(Math.hypot(car.x - B.x, car.z - B.z)), WRECK.on]); return ub(B); };
let wokeAt = null; step(60*6, () => { keys.ArrowUp = Math.hypot(car.vx, car.vz) < 7; car.angle = Math.atan2(U.x - car.x, U.z - car.z); if (U.woke && wokeAt === null) wokeAt = Math.round(Math.hypot(car.x - U.x, car.z - U.z)); return Math.hypot(car.x - U.x, car.z - U.z) > 42; });
keys.ArrowUp = false; out.wokeAt = wokeAt; out.gawkers = UFO_GAWK.length;
let firstWreck = null; step(60*25, (i) => { if (WRECK.on && firstWreck === null) firstWreck = +(i/60).toFixed(1); if (i === 60*9) return false; });
await shot('ufo_chaos', U.x + 18, U.z + 10, 30, 22, 16, 1);
step(60*16, (i) => { if (WRECK.on && firstWreck === null) firstWreck = +(9 + i/60).toFixed(1); });
await shot('ufo_chaos2', U.x + 10, U.z + 5, -26, 24, 14, 1);
out.fight = { shots: U.shots, booms: booms.length, wreckAfterS: firstWreck, nearCar: booms.filter(b => !b[2]).map(b => b[1]).slice(0, 25).join(' '), gawkersArrived: UFO_GAWK.filter(h => Math.hypot(h.x - U.x, h.z - U.z) < 70).length, peopleDown: HUMANS.filter(h => h.down && Math.hypot(h.x - U.x, h.z - U.z) < 90).length, carsBurning: VEHICLES.filter(v => v.ufoHit).map(v => v.kind).join(','), ambulances: VEHICLES.filter(v => v.kind === 'ambulance').length };
step(60*40); out.later = { shots: U.shots, kills: U.kills, peopleDown: HUMANS.filter(h => h.down && Math.hypot(h.x - U.x, h.z - U.z) < 90).length, carsBurning: VEHICLES.filter(v => v.ufoHit).length, temps: VEHICLES.filter(v => v.temp).length };
await shot('ufo_later', U.x + 10, U.z + 5, 30, 26, 18, 1);
startRace(false); step(30); out.afterReset = { woke: UFOS.map(U => U.woke), gawk: UFO_GAWK.length, gawkTasksLeft: HUMANS.filter(h => h.task && h.task.kind === 'gawk').length, bolts: UFO_BOLTS.filter(b => b.live).length, wreck: WRECK.on, temp: VEHICLES.filter(v => v.temp).length, fires: FIRES.length };
return out;
