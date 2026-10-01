// the tow truck: a parked car burnt out → the HINAUS truck comes by the streets, the driver hooks it, it is winched up behind (nose up),
// taken away, gone from its spot; R puts it back. Also a smashed one (damage, not burnt).
initAudio = () => {}; renderer.render = () => {}; startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3); const out = {};
const w = VEHICLES.find(v => v.kind === 'car' && !v.ai && !v.temp && onRoad(v.x, v.z, 2) && distRoute(v.x, v.z) > 30 && distRoute(v.x, v.z) < 160 && Math.abs(v.x) < 450 && Math.abs(v.z) < 450);
if (!w) return { noCar: true }; const home = [w.x, w.z]; charVehicle(w, true); w.damage = 99;
const phases = {}, log = []; let truck = null, maxTilt = 0, firstSeen = null;
for (let i = 0; i < 60*200; i++) { car.x = 900; car.z = 900; car.vx = car.vz = 0; worldUpdate(1/60); vehiclesPhysics(1/60);
  if (!truck && TOW.v) { truck = TOW.v; firstSeen = +worldT.toFixed(1); }
  if (truck) { const p = truck.job.phase; phases[p] = (phases[p] || 0) + 1; if (log[log.length - 1] !== p) log.push(p); maxTilt = Math.min(maxTilt, w.towTilt || 0); if (truck.gone) break; } }
out.car = { kind: w.kind, view: w.view.kind }; out.truckAt = firstSeen; out.log = log; out.towedAway = !!w.towedAway; out.hidden = Math.abs(w.x - home[0]) > 1000; out.maxTilt = +maxTilt.toFixed(2); out.done = TOW.done;
out.secs = Object.fromEntries(Object.entries(phases).map(([k, n]) => [k, +(n/60).toFixed(1)]));
startRace(false); step(10); out.afterR = { back: Math.round(Math.hypot(w.x - w.home.x, w.z - w.home.z)), towed: !!w.towed || !!w.towedAway, nuked: !!w.nuked, charred: !!w.charred, trucks: VEHICLES.filter(v => v.kind === 'tow').length };
return out;
