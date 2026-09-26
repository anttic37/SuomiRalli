// police: three knocks in a race bring two cruisers; they chase the autopiloted car, catch it when it stops, hold it, leave; reset clears it
initAudio = () => {}; startRace(false); setTimeOfDay('paiva');
const RR = renderer.render.bind(renderer); renderer.render = () => {};
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { f && f(i); T += 1000/60; loop(T); } };
const shot = async (n) => { RR(scene, camera); await __save(n, renderer.domElement.toDataURL('image/png')); };
step(60*3.5); const out = { state: gameState, inc: [] };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 7) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI;
  keys.ArrowLeft = dA > 0.05; keys.ArrowRight = dA < -0.05; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 19; keys.ArrowDown = false; };
step(60*6, steer);
// three pile-ups: a person put right in front of the moving car, 5 s apart
for (let k = 0; k < 3; k++) { const h = HUMANS.find(q => q.task && q.task.kind === 'spectate' && !q.down && Math.hypot(q.x - car.x, q.z - car.z) > 30); const fx = Math.sin(car.angle), fz = Math.cos(car.angle);
  h.x = car.x + fx*4; h.z = car.z + fz*4; step(40, steer); out.inc.push([POLICE.n, h.down]); step(60*4.5, steer); }
out.carsAfter3 = POLICE.cars.map(v => v.kind + ':' + Math.round(Math.hypot(v.x - car.x, v.z - car.z)) + 'm');
const log = []; for (let s = 0; s < 40; s++) { step(60, steer); log.push(POLICE.cars.map(v => Math.round(Math.hypot(v.x - car.x, v.z - car.z)) + (v.chase ? '' : 'L') + (v.fire ? 'F' : '') + (v.pl.hold ? 'H' : '') + ':' + v.vF.toFixed(0) + ':' + v.pl.rev.toFixed(1) + ':' + (v.offPath||0).toFixed(0)).join('/') + '|' + POLICE.lostT.toFixed(1)); }
out.chaseDist = log.join(' ');
{ const v = POLICE.cars[0]; if (v) { const fx = Math.sin(car.angle), fz = Math.cos(car.angle); camera.position.set(car.x - fx*9, H(car.x, car.z) + 4, car.z - fz*9); camera.lookAt(v.x, H(v.x, v.z) + 1, v.z); camera.updateMatrixWorld();
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(car.x + SUN.x, H(car.x, car.z) + SUN.y, car.z + SUN.z); dirLight.target.position.set(car.x, H(car.x, car.z), car.z); dirLight.target.updateMatrixWorld(); await shot('police_chase.png'); } }
// stop: wait for the bust
keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = false; keys.ArrowDown = true; let bustAt = null, heldMove = null, p0 = null;
for (let s = 0; s < 60*60 && POLICE.hold === 0; s++) { if (Math.hypot(car.vx, car.vz) < 0.5) keys.ArrowDown = false; step(1); } bustAt = POLICE.hold > 0 ? +worldT.toFixed(1) : null; keys.ArrowDown = false;
if (bustAt) { p0 = [car.x, car.z]; keys.ArrowUp = true; step(60*3); heldMove = +Math.hypot(car.x - p0[0], car.z - p0[1]).toFixed(2); const off = HUMANS.find(h => h.task && h.task.kind === 'officer');
  const v = POLICE.cars[0]; camera.position.set(car.x + 7, H(car.x, car.z) + 3.5, car.z + 7); camera.lookAt(car.x, H(car.x, car.z) + 0.8, car.z); camera.updateMatrixWorld(); await shot('police_bust.png');
  out.officer = off ? Math.round(Math.hypot(off.x - car.x, off.z - car.z)*10)/10 : null; keys.ArrowUp = false; step(60*6); out.holdAfter = POLICE.hold; step(60*8); out.leaving = POLICE.cars.map(v => (v.chase ? 'chase' : 'leave') + ':' + Math.round(Math.hypot(v.x - car.x, v.z - car.z))); }
out.bustAt = bustAt; out.heldMove = heldMove; out.n = POLICE.n; out.hud = document.getElementById('police-hud').style.display;
startRace(false); step(10); out.afterRestart = { cars: VEHICLES.filter(v => v.kind === 'police').length, n: POLICE.n, officers: HUMANS.filter(h => h.task && h.task.kind === 'officer').length };
return out;
