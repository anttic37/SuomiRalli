// the olympics (a shot in each event), both grandstands (the car rushing past), the flattened cabbage and the tractor after the car
startRace(false); step(60*4); const out = {}, O = X3.oly;
if (O) { car.x = O.x + 60; car.z = O.z + 40; const seen = {}; const ev0 = O.ev;
  for (let i = 0; i < 60*120 && Object.keys(seen).length < 3; i++) { car.vx = car.vz = 0; worldUpdate(1/60);
    const key = O.ev; if (!seen[key] && O.phase === 'go' && O.clock > (key === 'javelin' ? 0 : 1.2) && (key !== 'javelin' || O.jav.fly)) { seen[key] = true; const [cx, cz] = lloc(O.x, O.z, O.yaw, 13, 2); await shot('oly_' + key, O.x, O.z, cx - O.x, cz - O.z, 4.5, 1.0); } }
  out.oly = { events: Object.keys(seen), races: O.races, throws: O.jav.throws, phase: O.phase, down: O.people.filter(h => h.down).length }; }
for (const [k, S] of STANDS.entries()) { const [px, pz] = lloc(S.x, S.z, S.yaw, 0, 9); car.x = px; car.z = pz; car.angle = S.yaw + Math.PI/2; car.vx = Math.sin(car.angle)*14; car.vz = Math.cos(car.angle)*14;
  for (let i = 0; i < 40; i++) { worldUpdate(1/60); } const [cx, cz] = lloc(S.x, S.z, S.yaw, -6, 16); await shot('stand' + k, S.x, S.z, cx - S.x, cz - S.z, 6, 2.2);
  out['stand' + k] = { up: S.people.filter(h => h.pose.up).length, of: S.people.length, base: +S.base.toFixed(2), yawToRoute: Math.round(angDiff(S.yaw - Math.atan2(trackPoints[roadInfo(S.x, S.z).idx].x - S.x, trackPoints[roadInfo(S.x, S.z).idx].y - S.z))*57) }; }
// the cabbage: the car drives across a patch, the tractor comes after it
{ const T = VEHICLES.find(v => v.kind === 'tractor' && v.ai), C = CABBAGE.slice().sort((a, b) => Math.hypot(a.P.x - T.x, a.P.z - T.z) - Math.hypot(b.P.x - T.x, b.P.z - T.z))[0], P = C.P;
  const a0 = -P.L/2 - 6; car.x = P.x + P.ux*a0; car.z = P.z + P.uz*a0; car.angle = Math.atan2(P.ux, P.uz); car.vx = P.ux*10; car.vz = P.uz*10; const d0 = Math.hypot(T.x - car.x, T.z - car.z);
  step(60*4, () => { keys.ArrowUp = Math.hypot(car.vx, car.vz) < 10; car.angle = Math.atan2(P.ux, P.uz); }); keys.ArrowUp = false; out.cabbage = { flat: C.flat.size, angry: C.angry, chase: !!T.ai.S.chase, tractorFrom: Math.round(d0) };
  await shot('cabbage_flat', car.x - P.ux*6, car.z - P.uz*6, -P.uz*5 - P.ux*3, P.ux*5 - P.uz*3, 3, 0.2);
  // the car then crawls away (5 m/s) for 25 s: the tractor closes in
  const dists = []; let maxTsp = 0; step(60*25, (i) => { keys.ArrowUp = Math.hypot(car.vx, car.vz) < 5; keys.ArrowDown = false; if (i % 150 === 0) dists.push(Math.round(Math.hypot(T.x - car.x, T.z - car.z))); maxTsp = Math.max(maxTsp, Math.abs(T.vF)); }); keys.ArrowUp = false;
  out.chase = { dists, tractorTopKmh: Math.round(maxTsp*3.6), stillChasing: !!T.ai.S.chase, tractorDamage: Math.round(T.damage), fire: !!T.fire };
  await shot('tractor_chase', T.x, T.z, (car.x - T.x)*0.3 + 6, (car.z - T.z)*0.3 + 6, 4, 1.4);
  startRace(false); step(30); out.afterReset = { flat: C.flat.size, chase: !!T.ai.S.chase, spec: T.spec === VSPEC.tractor, home: Math.round(Math.hypot(T.x - T.home.x, T.z - T.home.z)) }; }
return out;
