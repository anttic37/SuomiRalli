// moped boys after a car on record pace: FLOW on, the car driven (scripted) along their own street at 22 m/s — they give chase along
// its trail, the first to give up goes in the ditch, all ride back to their street
initAudio = () => {}; renderer.render = () => {}; startRace(false); let T0 = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); T0 += 1000/60; loop(T0); } };
step(30); lapStarted = true; const H = HUMANS.filter(h => h.mS); const h0 = H[0], S = h0.mS, M = h0.mM, out = { mopeds: H.length };
const uc = updateCar; let sp = 0, dirS = 1; const pos = () => M.L.at(sp);
sp = Math.max(0, (S.s || S.s0) - 25); updateCar = (dt) => { sp = Math.min(M.L.total, sp + 22*dt); const [x, z, yw] = M.L.at(sp); car.vx = (x - car.x)/dt; car.vz = (z - car.z)/dt; car.x = x; car.z = z; car.angle = yw; car.speed = 22; };
{ const [x, z, yw] = pos(); car.x = x; car.z = z; car.angle = yw; RI.x = x; RI.z = z; }
FLOW.on = true; let started = 0, maxV = 0, maxAway = 0, ditch = 0; const sx = S.px, sz = S.pz;
step(60*12, () => { FLOW.on = true; for (const h of H) { const C = h.mS.chase; if (C) { started = Math.max(started, H.filter(q => q.mS.chase).length); maxV = Math.max(maxV, h.mS.v); maxAway = Math.max(maxAway, Math.hypot(h.mS.px - sx, h.mS.pz - sz)); if (C.ditch > 0) ditch++; } } });
out.chasing = started; out.maxKmh = Math.round(maxV*3.6); out.away = Math.round(maxAway);
updateCar = uc; car.vx = car.vz = car.speed = 0; car.x += 400; car.z += 0; FLOW.on = false;
step(60*40, () => { for (const h of H) if (h.mS.chase && h.mS.chase.ditch > 0) ditch++; });
out.ditchFrames = ditch; out.stillChasing = H.filter(h => h.mS.chase).length; out.backOnStreet = H.map(h => Math.round(Math.hypot(h.mS.px - h.mM.L.at(h.mS.s)[0], h.mS.pz - h.mM.L.at(h.mS.s)[1])));
return out;
