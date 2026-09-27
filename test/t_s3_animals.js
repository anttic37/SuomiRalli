// moose: three minutes of grazing (how often one is out on a road), one stood in the road in front of a fast car (it freezes, the
// car hits it: dented, slowed, no ambulance); the bear run over: ten police cars; close-ups
startRace(false); step(60*4); const out = {}, M = HUMANS.filter(h => h.task && h.task.kind === 'moose');
{ const road = M.map(() => 0), far = M.map(() => 0); for (let i = 0; i < 60*180; i++) { worldUpdate(1/60); M.forEach((h, k) => { if (onRoad(h.x, h.z, 0)) road[k]++; far[k] = Math.max(far[k], Math.hypot(h.x - h.home.x, h.z - h.home.z)); }); }
  out.mooseRoadSecs = road.map(v => Math.round(v/60)); out.mooseRange = far.map(Math.round); }
{ const h = M[0]; car.x = h.x + 12; car.z = h.z + 8; car.vx = car.vz = 0; step(20); await shot('moose', h.x, h.z, 6, 5, 2.6, 1.6); }
// in the road: the car comes at 22 m/s
{ const n = trackPoints.length, i0 = (gridIndex() + 140) % n, p = trackPoints[i0], b = trackPoints[(i0 - 22 + n) % n], h = M[1]; h.x = p.x; h.z = p.y; h.M.s.tx = p.x + 0.01; h.M.s.tz = p.y; h.M.s.graze = 0; humanSync(h);
  car.x = b.x; car.z = b.y; car.angle = Math.atan2(p.x - b.x, p.y - b.y); car.vx = Math.sin(car.angle)*22; car.vz = Math.cos(car.angle)*22; const parts0 = carParts.filter(q => q.state === 'gone').length, amb0 = DISPATCH.queue.length;
  let froze = false, sp0 = 22, spHit = null; step(60*4, () => { keys.ArrowUp = !h.down; keys.ArrowDown = h.down; if (!h.down) car.angle = Math.atan2(h.x - car.x, h.z - car.z); if (h.M.s.freeze > 0) froze = true; if (h.down && spHit === null) spHit = Math.hypot(car.vx, car.vz); }); keys.ArrowUp = keys.ArrowDown = false;
  out.mooseHit = { froze, down: h.down, speedAfterHit: spHit && +spHit.toFixed(1), partsOff: carParts.filter(q => q.state === 'gone').length - parts0, hurt: HUMANS.filter(o => o.hurt && !o.animal).map(o => o.task && o.task.kind + '@' + Math.round(Math.hypot(o.x - h.x, o.z - h.z))).join(','), police: POLICE.n }; }
// the bear
startRace(false); step(60*4); { const B = X3.bear; out.bearAt = [Math.round(B.x), Math.round(B.z)]; car.x = B.x + 10; car.z = B.z + 10; step(10); await shot('bear', B.x, B.z, 4, 4, 2, 0.9);
  car.x = B.x - 18; car.z = B.z; car.angle = Math.PI/2; car.vx = 16; car.vz = 0; step(60*3, () => { keys.ArrowUp = true; car.angle = Math.atan2(B.x - car.x, B.z - car.z); return !B.down; }); keys.ArrowUp = false;
  out.bearDown = B.down; out.policeSpawned = POLICE.cars.length; step(60*25, () => { keys.ArrowUp = false; });
  out.policeAfter25 = { chasing: POLICE.cars.filter(v => v.chase).length, near60: POLICE.cars.filter(v => Math.hypot(v.x - car.x, v.z - car.z) < 60).length, hold: POLICE.hold > 0 };
  const P = POLICE.cars.slice().sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z)); await shot('bear_police', car.x, car.z, 16, 12, 9, 0.5); }
startRace(false); step(30); out.afterReset = { bear: [Math.round(X3.bear.x), Math.round(X3.bear.z)], down: X3.bear.down, police: POLICE.cars.length };
return out;
