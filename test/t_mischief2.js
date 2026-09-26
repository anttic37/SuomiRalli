// mischief set 2: counts, the ice-cream van driving and stopping (kids, cones), mopeds and the postman moving, a sheet flying and
// re-hung, the midsummer faller, a yard dog chasing, badminton rallies, the postman knocked (letters), close-ups, reset
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; setTimeOfDay('paiva');
const out = {}, kinds = {}; HUMANS.forEach(h => { const k = h.task ? h.task.kind : '-'; kinds[k] = (kinds[k] || 0) + 1; }); out.kinds = kinds;
const van = VEHICLES.find(v => v.kind === 'icecream'); out.van = !!van; out.upd = X2.upd.length;
const find = k => HUMANS.find(h => h.task && h.task.kind === k), all = k => HUMANS.filter(h => h.task && h.task.kind === k);
const step = (n) => { for (let i = 0; i < n; i++) worldUpdate(1/60); };
const shot = async (n, x, z, dx, dz, up, ly, pre) => { car.x = x + 30; car.z = z + 30; car.vx = car.vz = 0; HUMANS.forEach(q => { q.far = Math.hypot(q.x - car.x, q.z - car.z) >= 240; if (q.view.kind === 'rig') humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
  step(pre || 20); const gy = H(x, z); camera.position.set(x + dx, gy + up, z + dz); camera.lookAt(x, gy + (ly || 1), z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  dirLight.position.set(x + SUN.x, gy + SUN.y, z + SUN.z); dirLight.target.position.set(x, gy, z); dirLight.target.updateMatrixWorld(); U_TIME.value = 0;
  RR(scene, camera); await __save('mis2_' + n + '.png', renderer.domElement.toDataURL('image/png')); };
// the van over 4 minutes, the car parked far away so nothing blocks it
if (van) { car.x = van.x + 300; car.z = van.z + 300; const log = { stops: 0, drove: 0, cones: 0, maxKids: 0, turned: 0 }, p0 = [van.x, van.z]; let last = 'stop', mode0 = null;
  for (let i = 0; i < 60*240; i++) { worldUpdate(1/60); vehiclesPhysics(1/60); const md = HUMANS.filter(h => h.task && h.task.kind === 'icekid' && !h.inside).length; log.maxKids = Math.max(log.maxKids, md);
    const m = X2vanMode(); if (m !== last) { if (m === 'stop') log.stops++; if (m === 'turn') log.turned++; last = m; } log.cones = Math.max(log.cones, HUMANS.filter(h => h.task && h.task.kind === 'icekid' && h.st && h.st.mode === 'eat').length); }
  log.drove = Math.round(Math.hypot(van.x - p0[0], van.z - p0[1])); log.mode = X2vanMode(); log.damage = van.damage; out.vanLog = log; }
function X2vanMode() { return van.ai.V.mode; }
// mopeds and the postman: how far along they got in 20 s
const mp = all('moped'), pm = find('post'); { const a = mp.map(h => [h.x, h.z]), b = pm ? [pm.x, pm.z] : null; if (mp[0]) { car.x = mp[0].x + 400; car.z = mp[0].z; } step(60*20);
  out.mopedMoved = mp.map((h, i) => Math.round(Math.hypot(h.x - a[i][0], h.z - a[i][1]))); out.postMoved = pm && Math.round(Math.hypot(pm.x - b[0], pm.z - b[1])); out.postMode = pm && pm.task && null; }
// badminton: count hits over 40 s near the court
{ const bp = all('badminton'); if (bp[0]) { car.x = bp[0].x + 40; car.z = bp[0].z + 40; let hits = 0, misses = 0, lastU = 0; const B0 = X2.upd; for (let i = 0; i < 60*40; i++) { worldUpdate(1/60); } out.badmintonHome = bp.map(h => Math.round(Math.hypot(h.x - h.home.x, h.z - h.home.z)*10)/10); } }
// the sheet: force a gust, watch it fly, land, get picked up and re-hung
{ const wf = find('laundry'); if (wf) { car.x = wf.x + 12; car.z = wf.z; car.vx = 20; car.vz = 0; const seen = {}; for (let i = 0; i < 60*40; i++) { worldUpdate(1/60); car.vx = i < 30 ? 20 : 0; const m = wf.task && wf.st; } car.vx = 0; out.laundryWife = { x: Math.round(wf.x - wf.home.x), z: Math.round(wf.z - wf.home.z), down: wf.down }; } }
// the yard dog: the car rushes past
{ const dog = find('yarddog'); if (dog) { const d0 = [dog.x, dog.z]; car.x = dog.x + 20; car.z = dog.z; car.vx = 0; car.vz = 14; car.angle = 0; let maxAway = 0; const owner = find('dogowner'), o0 = owner ? [owner.x, owner.z] : null; let ownerMax = 0;
  for (let i = 0; i < 60*8; i++) { car.z += 14/60; worldUpdate(1/60); maxAway = Math.max(maxAway, Math.hypot(dog.x - d0[0], dog.z - d0[1])); if (owner) ownerMax = Math.max(ownerMax, Math.hypot(owner.x - o0[0], owner.z - o0[1])); }
  car.vz = 0; car.x += 500; step(60*20); out.dog = { maxAway: Math.round(maxAway), backHome: Math.round(Math.hypot(dog.x - d0[0], dog.z - d0[1])), ownerRan: Math.round(ownerMax) }; } }
// midsummer: wait for a faller
{ const ps = all('party'); if (ps[0]) { car.x = ps[0].x + 30; car.z = ps[0].z; let fell = 0; for (let i = 0; i < 60*120; i++) { worldUpdate(1/60); if (ps.some(h => h.tilt > 1.3)) fell++; } out.partyFallFrames = fell; out.partyDown = ps.filter(h => h.down).length; } }
// close-ups
const K = (k) => find(k);
for (const [k, dx, dz, up, ly] of [['horse', 7, 6, 3.5], ['beat', 3.5, -3.5, 2.2], ['moped', 6, 5, 2.6], ['post', 5, 5, 2.6], ['laundry', 6, -5, 2.6], ['party', 9, 7, 4.5], ['yarddog', 5, 4, 2.2]]) {
  const h = K(k); if (!h) continue; await shot(k, h.x, h.z, dx, dz, up, ly); }
{ const bp = all('badminton'); if (bp[1]) { const mx = (bp[0].x + bp[1].x)/2, mz = (bp[0].z + bp[1].z)/2, ax = bp[1].x - bp[0].x, az = bp[1].z - bp[0].z, l = Math.hypot(ax, az) || 1; await shot('badminton', mx, mz, -az/l*9, ax/l*9, 3.5, 1.5, 90); } }
if (van) { const V = van.ai.V; car.x = van.x + 300; car.z = van.z; for (let i = 0; i < 60*300 && !(V.mode === 'stop' && V.order.length >= 3 && V.order.slice(0, 2).every(h => h.st && h.st.mode === 'queue')); i++) { car.x = van.x + 300; car.z = van.z; worldUpdate(1/60); vehiclesPhysics(1/60); }
  out.vanQueue = V.order.length; const [cx, cz] = lloc(van.x, van.z, van.yaw, 9, -3); await shot('icevan', van.x, van.z, cx - van.x, cz - van.z, 3, 1.2, 1); }
// knock the postman: letters fly, no crash; an ice kid knocked gets an ambulance
if (pm && !pm.down) { car.x = pm.x + 20; car.z = pm.z; const q0 = DISPATCH.queue.length; knock(pm, 8, 2, 8); step(60*3); out.postKnock = { down: pm.down, letters: X2.flying.length, resting: X2.flying.filter(F => F.rest).length, amb: DISPATCH.queue.length > q0 || VEHICLES.some(v => v.kind === 'ambulance') }; const L = X2.flying, lx = L.reduce((a, F) => a + F.x, 0)/L.length, lz = L.reduce((a, F) => a + F.z, 0)/L.length; await shot('letters', lx, lz, 3, 3, 2.5, 0.2, 5); }
worldReset(); step(10); out.afterReset = { letters: X2.flying.length, down: HUMANS.filter(h => h.down).length, vanHome: van ? Math.round(Math.hypot(van.x - van.home.x, van.z - van.home.z)) : null };
return out;
