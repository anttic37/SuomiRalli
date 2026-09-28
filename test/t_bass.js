// bass boost: the car goes up to 75 % of its top speed (it was a fifth); it hops to the beat; in GTA mode the gig bus visits
// now and then without the bass; the band's logo on the bus
startRace(false); step(60*4); const out = {}, n = trackPoints.length;
const run = (frames) => { const i0 = gridIndex(), p = trackPoints[(i0 + 10) % n], q = trackPoints[(i0 + 11) % n], a = Math.atan2(q.x - p.x, q.y - p.y); car.vx = car.vz = 0; let v = 0;
  step(frames, (i) => { keys.ArrowUp = true; car.angle = a; car.x = p.x; car.z = p.y; v = car.speed; }); keys.ArrowUp = false; car.vx = car.vz = 0; return +(v*3.6).toFixed(1); };
out.off = { pull2s: run(120), top: run(60*25) };
bassToggle(); step(2); out.on = { pull2s: run(120), top: run(60*25) }; out.ratio = { pull: +(out.on.pull2s/out.off.pull2s).toFixed(2), top: +(out.on.top/out.off.top).toFixed(2) };
{ let maxH = 0, hops = 0, air = false; step(60*6, () => { const h = carGroup.position.y - Y(car.x, car.z); maxH = Math.max(maxH, h); if (h > 0.05 && !air) { hops++; air = true; } if (h <= 0.001) air = false; }); out.hop = { maxM: +maxH.toFixed(2), hopsIn6s: hops }; }
startRace(false); step(60*4); out.afterRestart = { bass: BASS.on, hopY: BASS.hopY };
// GTA: a visit without the bass
freeEnter(); step(10); HEVI.freeT = 0.1; step(30); const v = HEVI.v; out.gtaVisit = { came: !!v, visitT: +HEVI.visitT.toFixed(0), bass: BASS.on };
if (v) { await new Promise(r => setTimeout(r, 400)); const fx = Math.sin(v.yaw), fz = Math.cos(v.yaw); car.x = v.x + 40; car.z = v.z; step(1);
  await shot('bass_bus_side', v.x, v.z, fz*12, -fx*12, 2.2, 1.6); await shot('bass_bus_rear', v.x, v.z, -fx*9, -fz*9, 2.2, 1.7);
  HEVI.visitT = 0.05; step(3); out.gtaVisit.leaving = HEVI.leave; car.x = v.x + 400; step(5); out.gtaVisit.goneAfter = !HEVI.v; }
return out;
