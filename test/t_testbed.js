// ?tyhja testbed: set up, drive into the rows of shapes with the real car physics; numbers + jpeg shots
initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; TESTBED.want = true; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const t0 = performance.now(); while (!TESTBED.on && performance.now() - t0 < 60000) { await new Promise(r => setTimeout(r, 200)); st(1); }
const res = { on: TESTBED.on, items: TESTBED.items.length, carAt: [Math.round(car.x), Math.round(car.z)], H: H(car.x, car.z) }; if (!TESTBED.on) return res; st(30);
const shot = async (n, cx, cz, h) => { camera.position.set(car.x + cx, h, car.z + cz); camera.lookAt(car.x, 0.5, car.z + 8); R0(scene, camera); R0(scene, camera); await __save(n, renderer.domElement.toDataURL('image/jpeg', 0.55)); };
await shot('tb0', 14, -14, 10);
// drive north at 20 m/s through the middle column (cube 1 m, ball, lying cylinder…)
const log = []; for (let i = 0; i < 60*9; i++) { if (i < 60*2) { car.vx = 0; car.vz = 18; car.angle = 0; } keys.ArrowUp = i < 60*7; loop(lastTime + 1000/60);
  if (i % 30 === 0) log.push([+(i/60).toFixed(1), Math.round(car.z - TESTBED.Z0), Math.round(Math.hypot(car.vx, car.vz)*3.6)]); if (i === 100 || i === 160) await shot('tb' + (i === 100 ? 1 : 2), 8, -9, 5); }
keys.ArrowUp = false; res.log = log; res.moved = TESTBED.items.filter(o => o.rb.bodyType() === 0).map(o => { const t = o.rb.translation(); return [o.kind, +Math.hypot(t.x - o.home.x, t.z - o.home.z).toFixed(1), +t.y.toFixed(1)]; }).filter(m => m[1] > 0.3);
for (const f of X3.reset) f(); st(30); res.afterR = TESTBED.items.filter(o => { const t = o.rb.translation(); return Math.hypot(t.x - o.home.x, t.z - o.home.z) > 0.3; }).length;
return res;
