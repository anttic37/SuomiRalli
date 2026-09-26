initAudio = () => {}; if (typeof setTimeOfDay === 'function') setTimeOfDay('paiva');
const realRender = renderer.render.bind(renderer); renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; loop(lastTime + 1000/60); } };
step(60*3.3);
const clear = (h) => !tires.some(t => t.kind === 'tire' && !t.off && Math.hypot(t.x - h.x, t.z - h.z) < 9) && !HUMANS.some(o => o !== h && Math.hypot(o.x - h.x, o.z - h.z) < 2.5) && !STATIC_LIST.some(b => Math.hypot(b.x - h.x, b.z - h.z) < 12) && !VEHICLES.some(b => Math.hypot(b.x - h.x, b.z - h.z) < 12);
const P = HUMANS.filter(h => h.task.kind === 'spectate' && clear(h)).sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z))[0];
const shot = async (name) => { const fx = Math.sin(car.angle), fz = Math.cos(car.angle), rx = fz, rz = -fx, ex = car.x - rx*4.5 + fx*3.5, ez = car.z - rz*4.5 + fz*3.5;
  camera.position.set(ex, carGroup.position.y + 2.6, ez); camera.lookAt(car.x + fx*0.8, carGroup.position.y + 0.9, car.z + fz*0.8); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(car.x + SUN.x, carGroup.position.y + SUN.y, car.z + SUN.z); dirLight.target.position.set(car.x, carGroup.position.y, car.z); dirLight.target.updateMatrixWorld();
  realRender(scene, camera); await __save('' + name + '.png', renderer.domElement.toDataURL('image/png')); };
const runs = [[40, 'ride_bonnet', 0.3], [90, 'ride_roof', 0.12]];
for (const [kmh, name, at] of runs) { worldReset(); const v = kmh/3.6, ang = 0.3, fx = Math.sin(ang), fz = Math.cos(ang); car.angle = ang; car.x = P.x - fx*10; car.z = P.z - fz*10; car.vx = fx*v; car.vz = fz*v;
  for (let i = 0; i < 200; i++) { car.vx = fx*v; car.vz = fz*v; car.angle = ang; loop(lastTime + 1000/60); if (P.ride && P.ride.t >= at) { await shot(name); break; } } }
// and one lying on the ground afterwards
step(60*3, () => { car.vx = car.vz = 0; });
{ const ex = P.x + 3, ez = P.z + 2.5; camera.position.set(ex, H(ex, ez) + 2, ez); camera.lookAt(P.x, H(P.x, P.z) + 0.2, P.z); camera.updateMatrixWorld(); realRender(scene, camera); await __save('ride_after.png', renderer.domElement.toDataURL('image/png')); }
return 'ok';
