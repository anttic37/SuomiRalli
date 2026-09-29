startRace(false); step(60*4.5); const out = {}; const c0 = [car.x, car.z];
out.out = walkOut(); const h = WALK.h; const p0 = [h.x, h.z];
keys.ArrowUp = true; step(60*3); out.walked3s = +Math.hypot(h.x - p0[0], h.z - p0[1]).toFixed(2); out.carMoved = +Math.hypot(car.x - c0[0], car.z - c0[1]).toFixed(2);
keys.Space = true; const p1 = [h.x, h.z]; step(60*2); out.ran2s = +Math.hypot(h.x - p1[0], h.z - p1[1]).toFixed(2); keys.Space = false;
keys.ArrowLeft = true; step(60*1); keys.ArrowLeft = false; keys.ArrowUp = false; step(10);
await shot('walk', h.x, h.z, -Math.sin(h.yaw)*6, -Math.cos(h.yaw)*6, 3, 1.2);
// the real camera
RR(scene, camera); await __save('s3_walk_cam.png', renderer.domElement.toDataURL('image/png'));
out.farHidden = h.view.g.visible;
knock(h, 5, 0, 6); out.down = h.down; out.ambQueued = DISPATCH.queue.some(q => q.victims && q.victims.includes(h)); step(60*5); out.upAgain = !h.down;
out.inFar = walkIn(); h.x = car.x + 1; h.z = car.z; step(2); out.inNear = walkIn(); out.walkOn = WALK.on;
// heli: ram it
const V = X3.heli.v; const hx = V.x, hz = V.z; car.x = V.x - Math.sin(V.yaw + Math.PI/2)*14; car.z = V.z - Math.cos(V.yaw + Math.PI/2)*14; car.angle = V.yaw + Math.PI/2;
for (let i = 0; i < 90; i++) { if (i < 50) { car.vx = Math.sin(car.angle)*22; car.vz = Math.cos(car.angle)*22; } step(1); }
out.heliMoved = +Math.hypot(V.x - hx, V.z - hz).toFixed(2); out.heliDamage = +V.damage.toFixed(1); out.heliFire = !!V.fire;
step(60*6); out.fireEngine = VEHICLES.some(v => v.kind === 'fire'); await shot('heli_hit', V.x, V.z, 9, 9, 4, 1);
return out;
