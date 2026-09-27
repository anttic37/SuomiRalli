// hay bales: their own instances; at rest they stay put; the car knocks one (it rolls, the car slows and dents); R puts them back
initAudio = () => {}; setTimeOfDay('paiva'); startRace(false); const realRender = renderer.render.bind(renderer); renderer.render = () => {};
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
const out = { n: BALES.length }; step(60*3);
out.movingAtRest = BALE.moving.size; out.driftAtRest = +Math.max(0, ...BALES.map(b => Math.hypot(b.x - b.ox, b.z - b.oz))).toFixed(3);
// the flattest bale away from others
const b = BALES.filter(b => BALES.every(o => o === b || Math.hypot(o.x - b.x, o.z - b.z) > 6)).sort((p, q) => Math.abs(Y(p.x+2,p.z)-Y(p.x-2,p.z)) - Math.abs(Y(q.x+2,q.z)-Y(q.x-2,q.z)))[0];
const shot = async (n, tx, tz, yaw) => { const cx = tx - Math.sin(yaw)*9, cz = tz - Math.cos(yaw)*9; camera.position.set(cx, Y(cx, cz) + 4.5, cz); camera.lookAt(tx, Y(tx, tz) + 0.8, tz); camera.updateMatrixWorld(); lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(tx + SUN.x, SUN.y, tz + SUN.z); dirLight.target.position.set(tx, 0, tz); dirLight.target.updateMatrixWorld(); realRender(scene, camera); await __save(n, renderer.domElement.toDataURL('image/png')); };
// the car 14 m out, aimed across the bale's axis, 14 m/s
const ax = Math.sin(b.yaw), az = Math.cos(b.yaw), dirx = az, dirz = -ax, ang = Math.atan2(dirx, dirz);
car.x = b.x - dirx*14; car.z = b.z - dirz*14; car.angle = ang; car.vx = dirx*14; car.vz = dirz*14; car.speed = 14;
await shot('bale_before.png', b.x, b.z, ang + 0.6);
const log = []; let hitT = null, carV0 = 14, carV1 = null;
step(60*6, (i) => { keys.ArrowUp = false; if (!hitT && b.moving) { hitT = i; } if (hitT && i === hitT + 6) carV1 = +Math.hypot(car.vx, car.vz).toFixed(1); if (i % 30 === 0) log.push([+(i/60).toFixed(1), +Math.hypot(b.x - b.ox, b.z - b.oz).toFixed(1), +Math.hypot(b.vx, b.vz).toFixed(1), +Math.hypot(car.vx, car.vz).toFixed(1)]); });
keys.ArrowDown = false;
out.hit = { hitFrame: hitT, carSpeedAfter: carV1, baleMoved: +Math.hypot(b.x - b.ox, b.z - b.oz).toFixed(1), stillMoving: b.moving, log };
await shot('bale_after.png', b.x, b.z, ang + 0.6);
// uphill-away check: after 10 s nothing still rolling
step(60*10); out.movingAfter10 = BALE.moving.size;
startRace(false); step(5); out.afterR = { moving: BALE.moving.size, back: +Math.hypot(b.x - b.ox, b.z - b.oz).toFixed(3) };
return out;
