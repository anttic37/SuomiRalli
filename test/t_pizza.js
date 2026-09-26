// pizzeria: placed beside the track (lot's front to the road), stop in the yard → the pizza guy walks out, hands it over after 5 s → car ×1.1
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {};
const n = trackPoints.length, gi = gridIndex(), pi = (gi + 40) % n, p = trackPoints[pi], q = trackPoints[(pi + 1) % n];
let dx = q.x - p.x, dz = q.y - p.y; const L = Math.hypot(dx, dz); dx /= L; dz /= L; const nx = dz, nz = -dx, off = wAt(pi)/2 + 10 + 1.2;   // right-hand side of the road
LANDMARKS.push(['pitseria', p.x + nx*off, p.y + nz*off, Math.atan2(-nx, -nz)]);
generateTrack(); resetCar(); startRace(false); setTimeOfDay('paiva');
const step = (k, f) => { for (let i = 0; i < k; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
const S = PIZZA.shops[0]; if (!S) return 'no shop';
const out = { shops: PIZZA.shops.length, solid: STATIC_LIST.filter(b => b.kind === 'lm').length };
// 1) drive in, stop, leave after 2 s: he comes out and goes back
const yard = (b) => lloc(S.x, S.z, S.th, 0, b), [yx, yz] = yard((S.P.yard0 + S.P.yard1)/2);
const park = () => { car.x = yx; car.z = yz; car.angle = S.th + Math.PI/2; car.vx = car.vz = 0; };
park(); step(60*2, park); out.guyOutAfter2s = !!PIZZA.guy; out.waitAt2 = +PIZZA.wait.toFixed(2);
car.x = p.x; car.z = p.y; car.vx = car.vz = 0; step(60*6, () => { car.vx = car.vz = 0; }); out.guyGoneAfterLeaving = !PIZZA.guy; out.gotEarly = PIZZA.got;
// 2) stop for good: delivered at ≥ 5 s
park(); let tDel = null, shot = false;
out.log = []; for (let i = 0; i < 60*15 && !PIZZA.got; i++) { park(); step(1); if (i % 60 === 0 && PIZZA.guy) { const g = PIZZA.guy, rx = Math.cos(car.angle), rz = -Math.sin(car.angle), fx = Math.sin(car.angle), fz = Math.cos(car.angle), sd = (g.x - car.x)*rx + (g.z - car.z)*rz >= 0 ? 1 : -1, tx = car.x + rx*1.45*sd + fx*0.25, tz = car.z + rz*1.45*sd + fz*0.25; out.log.push([PIZZA.wait.toFixed(1), g.st && g.st.mode, g.down, g.inside, Math.hypot(tx - g.x, tz - g.z).toFixed(2), g.x.toFixed(1), g.z.toFixed(1), HUMANS.includes(g)]); }
  if (!shot && PIZZA.guy && PIZZA.wait > 3) { shot = true; const [cx, cz] = lloc(S.x, S.z, S.th, 9, S.P.yard1 + 6); camera.position.set(cx, H(cx, cz) + 6, cz); camera.lookAt(yx, H(yx, yz) + 1, yz); camera.updateMatrixWorld(); RR(scene, camera); await __save('pizza_yard.png', renderer.domElement.toDataURL('image/png')); } }
out.got = PIZZA.got; out.deliveredAfter = +PIZZA.wait.toFixed(2); out.k = PIZZA.k; out.hud = document.getElementById('pizza-hud').textContent;
step(60*6, park); out.guyInsideAgain = !PIZZA.guy;
// 3) game camera shot from above
step(1); RR(scene, camera); await __save('pizza_top.png', renderer.domElement.toDataURL('image/png'));
// 4) acceleration: same start, 5 s full throttle on the start straight, with and without the pizza
const accel = (k) => { startRace(false); step(60*3.3); PIZZA.k = k; for (let i = 0; i < 60*2; i++) { keys.ArrowUp = true; loop(lastTime + 1000/60); } keys.ArrowUp = false; out['acc' + k] = [gameState, car.x.toFixed(1), car.z.toFixed(1), countdownT.toFixed(2)]; return Math.hypot(car.vx, car.vz); };
const v0 = accel(1), v1 = accel(1.1); out.speed2s = [+(v0*3.6).toFixed(1), +(v1*3.6).toFixed(1), +(v1/v0).toFixed(3)];
// 5) terminal speed of the model (flat, straight): accel(1 - v/M) = drag v
const term = k => DRIVE.accel*k/(DRIVE.accel*k/(DRIVE.maxSpeed*k) + 0.035); out.topKmh = [+(term(1)*3.6).toFixed(1), +(term(1.1)*3.6).toFixed(1)];
// 6) restart clears it
startRace(false); out.afterRestart = { k: PIZZA.k, got: PIZZA.got, hud: document.getElementById('pizza-hud').textContent, guy: !!PIZZA.guy };
return out;
