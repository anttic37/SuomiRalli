// ES at the K-shop: stop in front 3 s → the can; twice the pull and top speed; a hit → the car burns, the driver's thrown out,
// ambulance and fire engine come; R: all back as it was
startRace(false); step(60*4); const out = {}, [kx, kz, kth, W, D] = ES.zone;
const accelRun = () => { const n = trackPoints.length, i0 = gridIndex(); let best = 0; const p = trackPoints[(i0 + 10) % n], q = trackPoints[(i0 + 11) % n];
  car.x = p.x; car.z = p.y; car.angle = Math.atan2(q.x - p.x, q.y - p.y); car.vx = car.vz = 0; let v2 = 0; step(120, (i) => { keys.ArrowUp = true; car.angle = Math.atan2(q.x - p.x, q.y - p.y); car.x = p.x; car.z = p.y; if (i === 119) v2 = car.speed; });   // (pinned in place: only the pull counts)
  keys.ArrowUp = false; car.vx = car.vz = 0; return +v2.toFixed(2); };
out.pullBefore = accelRun();
const [zx, zz] = lloc(kx, kz, kth, 0, D/2 + 6); car.x = zx; car.z = zz; car.angle = kth + Math.PI/2; car.vx = car.vz = 0; out.inZone = esZoneAt(car.x, car.z);
let shotT = false; step(60*6, (i) => { car.vx = car.vz = 0; if (!shotT && ES.guy && ES.wait > 2.2) { shotT = true; return false; } if (ES.on) return false; });
if (shotT) { const [cx, cz] = lloc(car.x, car.z, car.angle, -7, 4); await shot('es_can', car.x, car.z, cx - car.x, cz - car.z, 2.6, 1.0); step(60*3, () => { car.vx = car.vz = 0; return !ES.on; }); }
out.esOn = ES.on; out.esT = +ES.t.toFixed(1); out.hud = document.getElementById('es-hud').style.display + ' "' + document.getElementById('es-hud').textContent + '"'; out.pullES = accelRun();
// top speed along a stretch: flat out 12 s from 30 m/s
{ const n = trackPoints.length; let bi = 0, bl = 0; for (let i = 0; i < n; i++) { let l = 0; for (let k = 1; k < 40; k++) { const a = trackPoints[(i + k - 1) % n], b = trackPoints[(i + k) % n], c = trackPoints[(i + k + 1) % n]; if (Math.abs(angDiff(Math.atan2(c.x - b.x, c.y - b.y) - Math.atan2(b.x - a.x, b.y - a.y))) > 0.06) break; l += Math.hypot(b.x - a.x, b.y - a.y); } if (l > bl) { bl = l; bi = i; } }
  out.straight = Math.round(bl); }
// the crash: into the shop wall at ~12 m/s
{ const [sx, sz] = lloc(kx, kz, kth, 0, D/2 + 12); car.x = sx; car.z = sz; car.angle = kth + Math.PI; car.vx = Math.sin(car.angle)*12; car.vz = Math.cos(car.angle)*12; ES.t = 30; ES.on = true;
  step(60*2, () => { keys.ArrowUp = true; return !WRECK.on; }); keys.ArrowUp = false; out.wreck = { on: WRECK.on, fire: !!(WRECK.rv && WRECK.rv.fire), driverDown: !!(WRECK.driver && WRECK.driver.down), esOff: !ES.on, hud: document.getElementById('es-hud').textContent };
  const c0 = [car.x, car.z]; let amb = null, fe = null; step(60*70, () => { keys.ArrowUp = true; amb = amb || VEHICLES.find(v => v.kind === 'ambulance'); fe = fe || VEHICLES.find(v => v.kind === 'fire'); }); keys.ArrowUp = false;
  out.after70 = { carMoved: +Math.hypot(car.x - c0[0], car.z - c0[1]).toFixed(2), ambulance: amb ? amb.job && amb.job.phase : null, fireEngine: fe ? fe.job && fe.job.phase : null, charred: WRECK.rv && WRECK.rv.charred, fireLevel: WRECK.rv && WRECK.rv.fire ? +WRECK.rv.fire.level.toFixed(2) : 'out', driverGone: WRECK.driver && WRECK.driver.gone };
  await shot('es_wreck', car.x, car.z, 9, 7, 5, 0.8); }
startRace(false); step(30); let charMat = 0; carGroup.traverse(o => { if (o.userData && o.userData.charOrig) charMat++; });
out.afterReset = { wreck: WRECK.on, es: ES.on, got: ES.got, charredMats: charMat, hud: document.getElementById('es-hud').style.display, fires: FIRES.length };
return out;
