// ?tyhja with the whole car in Rapier: accelerate north through the rows, a left turn check, collisions; numbers + jpeg shots
initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; TESTBED.want = true; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const t0 = performance.now(); while (!TESTBED.on && performance.now() - t0 < 60000) { await new Promise(r => setTimeout(r, 200)); st(1); }
const res = { on: TESTBED.on, rcar: TESTBED.rcar }; if (!TESTBED.rcar) return res; st(60);
const up = () => { const r = PHYS.rch.rotation(); return +new THREE.Vector3(0, 1, 0).applyQuaternion(new THREE.Quaternion(r.x, r.y, r.z, r.w)).y.toFixed(2); };
res.rest = { y: +PHYS.rch.translation().y.toFixed(2), up: up() };
const shot = async (n) => { camera.position.set(car.x + 8, 5, car.z - 9); camera.lookAt(car.x, 0.5, car.z + 8); R0(scene, camera); R0(scene, camera); await __save(n, renderer.domElement.toDataURL('image/jpeg', 0.55)); };
const log = []; keys.ArrowUp = true; for (let i = 0; i < 60*8; i++) { loop(lastTime + 1000/60); if (i % 30 === 0) log.push([+(i/60).toFixed(1), Math.round(car.x - TESTBED.X0), Math.round(car.z - TESTBED.Z0), Math.round(Math.hypot(car.vx, car.vz)*3.6), up()]); if (i === 150 || i === 220) await shot('rc' + (i === 150 ? 0 : 1)); }
keys.ArrowUp = false; res.log = log;
res.moved = TESTBED.items.filter(o => o.rb.bodyType() === 0).map(o => { const t = o.rb.translation(); return [o.kind, +Math.hypot(t.x - o.home.x, t.z - o.home.z).toFixed(1)]; }).filter(m => m[1] > 0.3);
// steering: from rest, left held 2 s at throttle
for (const f of X3.reset) f(); st(30); const a0 = car.angle; keys.ArrowUp = true; keys.ArrowLeft = true; st(120); keys.ArrowUp = keys.ArrowLeft = false; res.leftTurn = +(car.angle - a0).toFixed(2); res.leftX = Math.round(car.x - TESTBED.X0);
return res;
