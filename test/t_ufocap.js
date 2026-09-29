startRace(false); step(60*4); const out = {};
// walker: stamina + fear
walkOut(); const h = WALK.h; keys.ArrowUp = true; keys.Space = true; step(60*8); out.stam8s = +WALK.stam.toFixed(2); out.puff = WALK.puff;
keys.Space = false; step(60*60); out.dist60s = +Math.hypot(h.x - car.x, h.z - car.z).toFixed(1); out.stamAfter = +WALK.stam.toFixed(2); keys.ArrowUp = false;
h.x = car.x + 1; h.z = car.z; step(2); walkIn();
// UFO: take the car to it
const U = UFOS[0], A = HUMANS.filter(q => q.task && q.task.kind === 'alien' && Math.hypot(q.x - U.x, q.z - U.z) < 15); out.aliens = A.length;
const gun = A.find(q => q.propR); out.gun = !!gun;
car.x = U.x + 30; car.z = U.z + 5; car.vx = car.vz = 0; step(60*6); out.woke = U.woke;
out.smallBolts = UFO_BOLTS.filter(b => b.small).length; await shot('ufo_gun', gun.x, gun.z, 6, 5, 2, 1);
// on foot near it: shot at
out.wreckBeforeWalk = WRECK.on; out.hits = UFO_HITS.n; if (WRECK.on) { wreckReset(); } UFO_HITS.n = 0; car.vx = car.vz = car.speed = 0; out.walkOk = walkOut(); if (!WALK.on) return out; WALK.h.x = gun.x + 12; WALK.h.z = gun.z; let knocked = 0; for (let i = 0; i < 60*10; i++) { step(1); if (WALK.h.down) knocked++; } out.walkerDownFrames = knocked; walkIn(true);
// run the gunner over
car.x = gun.x - 8*Math.sin(0.3); car.z = gun.z - 8*Math.cos(0.3); car.angle = 0.3; for (let i = 0; i < 60 && !U.captured; i++) { car.vx = Math.sin(car.angle)*12; car.vz = Math.cos(car.angle)*12; car.speed = 12; step(1); }
out.captured = U.captured; if (!U.captured) { knock(gun, 5, 0, 8); out.capturedByKnock = U.captured; }
step(60*5); out.ufoOverCar = [+(U.G.position.y - Y(car.x, car.z)).toFixed(1), +Math.hypot(U.x - car.x, U.z - car.z).toFixed(1)];
for (let i = 0; i < 60*3; i++) { car.vx = Math.sin(car.angle)*15; car.vz = Math.cos(car.angle)*15; car.speed = 15; step(1); } out.follow = +Math.hypot(U.x - car.x, U.z - car.z).toFixed(1);
RR(scene, camera); await __save('s3_ufo_cam.png', renderer.domElement.toDataURL('image/png'));
await shot('ufo_cap', car.x, car.z, 26, 20, 12, 10);
startRace(false); step(10); out.afterReset = [U.captured, +Math.hypot(U.x - U.sb.x, U.z - U.sb.z).toFixed(1), STATIC_LIST.includes(U.sb)];
return out;
