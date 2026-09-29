// the visiting UFO: during a race it comes down over a moose ahead of the car, beams it up (the moose rises and is gone); the car
// driven into the beam floats up and slows; out of it, it drops back; R brings the moose back
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); let T0 = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); T0 += 1000/60; loop(T0); } };
step(30); lapStarted = true; const out = {}; const moose = HUMANS.filter(h => h.task && h.task.kind === 'moose'); out.moose = moose.length;
const m = moose[0], uc = updateCar; updateCar = (dt) => { car.vx = car.vz = car.speed = 0; };   // parked 120 m short of the moose, facing it
const a = Math.random()*6.3; car.x = RI.x = m.x - Math.sin(a)*120; car.z = RI.z = m.z - Math.cos(a)*120; car.angle = RI.a = a; ABD.next = worldT;
let st = []; step(60*5, () => { if (!st.includes(ABD.st)) st.push(ABD.st); }); out.states = st.slice(); out.target = ABD.h === m ? 'first moose' : ABD.h ? 'another' : null;
const h = ABD.h; if (!h) return out; let maxHop = 0; step(60*2, () => { maxHop = Math.max(maxHop, h.hop); });
camPos.set(ABD.x + 26, ABD.gy + 9, ABD.z + 26); camera.position.copy(camPos); camera.lookAt(ABD.x, ABD.gy + 7, ABD.z); RR(scene, camera); await __save('abd_moose.png', renderer.domElement.toDataURL()); step(60, () => { maxHop = Math.max(maxHop, h.hop); });
car.x = RI.x = ABD.x + 1; car.z = RI.z = ABD.z; updateCar = (dt) => { car.x += car.vx*dt; car.z += car.vz*dt; }; car.vx = 3; car.vz = 0; let maxCarY = 0; step(60*2, () => { maxCarY = Math.max(maxCarY, ABD.carY); });
out.carLifted = +maxCarY.toFixed(2); out.carSlowed = +Math.hypot(car.vx, car.vz).toFixed(2); renderer.render = RR; RR(scene, camera); renderer.render = () => {};
{ const c = document.querySelector('canvas'); } camPos.set(ABD.x + 30, ABD.gy + 14, ABD.z + 30); camera.position.copy(camPos); camera.lookAt(ABD.x, ABD.gy + 8, ABD.z); RR(scene, camera); await __save('abd.png', renderer.domElement.toDataURL());
step(60*6, () => { if (!st.includes(ABD.st)) st.push(ABD.st); }); out.states = st; out.maxHop = +maxHop.toFixed(1); out.mooseGone = h.inside; out.carDown = ABD.carY;
updateCar = uc; startRace(false); step(20); out.afterR = [h.inside, h.abd, ABD.st, ABD.M && ABD.M.G.visible];
return out;
