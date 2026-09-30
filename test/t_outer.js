// beyond the village: a seamless edge, the first airstrip, the car drives out, a plane lands on a strip and takes off again; pictures
startRace(false); step(20); const out = {};
{ let mj = 0, prev = H(560, 0); for (let x = 560.5; x < 640; x += 0.5) { const h = H(x, 0); mj = Math.max(mj, Math.abs(h - prev)); prev = h; } out.seamMaxStep = +mj.toFixed(2); }
const N0 = nearestAirfield(0, 0); out.first = { name: N0.A.name, d: Math.round(N0.d), h: +N0.A.h.toFixed(1) }; out.near5km = airfieldsNear(0, 0, 5000).length;
// the car out east: straight off the map edge, full throttle for 25 s
const EX = OUT.exits && OUT.exits.length ? OUT.exits[0] : null; outerUpdate(); const E0 = OUT.exits[0]; out.exits = OUT.exits.length; car.x = RI.x = E0.x - E0.dx*20; car.z = RI.z = E0.z - E0.dz*20; car.angle = RI.a = Math.atan2(E0.dx, E0.dz); car.vx = car.vz = 0; step(5); keys.ArrowUp = true; let maxX = 0; step(60*25, () => { maxX = Math.max(maxX, (car.x - E0.x)*E0.dx + (car.z - E0.z)*E0.dz); }); keys.ArrowUp = false;
out.car = { maxX: Math.round(maxX), x: Math.round(car.x), kmh: Math.round(Math.hypot(car.vx, car.vz)*3.6), nan: !isFinite(car.x), solids: OUT.sb.length, trees: OUT.trees ? OUT.trees.count : 0 };
step(3); { const gy = Y(car.x, car.z); await shot('out_car', car.x, car.z, -14, 6, 7, 1); }
// a landing on the first strip: over the threshold at 5 m, 95 km/h, idle, a touch nose-up, hands off; brakes once down
const A = N0.A; planeEnter(true); const [ax, az] = [A.x - A.fx*(AF_L/2 - 40), A.z - A.fz*(AF_L/2 - 40)]; planeInit({ x: ax, z: az, angle: A.a }); PLANE.p.y = A.h + 1.05 + 5; PLANE.v.set(A.fx*26, -1, A.fz*26); PLANE.air = true; PLANE.airT = 1; PLANE.thr = 0; PLANE.upFree = true;
PLANE.q.setFromEuler(new THREE.Euler(-0.06, A.a, 0, 'YXZ')); let t = 0, td = null, maxSink = 0, stopped = null;
step(60*40, () => { t += 1/60; const P = PLANE, V = P.v.length(), along = (P.p.x - A.x)*A.fx + (P.p.z - A.z)*A.fz; keys.KeyS = true; keys.Space = !P.air; if (P.air) maxSink = Math.max(maxSink, -P.v.y);
  if (!td && !P.air) td = { t: +t.toFixed(1), kmh: Math.round(V*3.6), onStrip: afMask(A, P.p.x, P.p.z) > 0.95 }; if (td && V < 0.5 && !stopped) stopped = { t: +t.toFixed(1), along: Math.round(along), onStrip: afMask(A, P.p.x, P.p.z) > 0.95 }; if (P.crashed || stopped) return false; });
for (const k of ['ArrowDown', 'ArrowUp', 'KeyS', 'KeyW', 'Space']) keys[k] = false;
out.landing = { td, stopped, crashed: PLANE.crashed, maxSink: +maxSink.toFixed(1) };
{ const P = PLANE; await shot('out_strip', P.p.x, P.p.z, -A.fx*40 + A.fz*30, -A.fz*40 - A.fx*30, 22, 0); }
// and off again from the strip
keys.ArrowUp = true; let lift = null; t = 0; step(60*25, () => { t += 1/60; const V = PLANE.v.length()*3.6; keys.ArrowDown = V > 80 && Math.asin(new THREE.Vector3(0, 0, 1).applyQuaternion(PLANE.q).y) < 0.17; if (!lift && PLANE.air) lift = +t.toFixed(1); if (PLANE.crashed || (lift && t > lift + 8)) return false; });
keys.ArrowUp = keys.ArrowDown = false; out.retakeoff = { lift, crashed: PLANE.crashed, agl: Math.round(PLANE.p.y - Y(PLANE.p.x, PLANE.p.z)) };
{ const P = PLANE; camera.position.set(P.p.x - 60, P.p.y + 70, P.p.z - 80); camera.lookAt(P.p.x, P.p.y - 20, P.p.z); camera.fov = 60; camera.updateProjectionMatrix(); outerUpdate(); RR(scene, camera); await __save('s3_out_air.png', renderer.domElement.toDataURL('image/png')); }
// the seam from above: the village's east edge
camera.position.set(640, H(600, 0) + 120, 90); camera.lookAt(560, H(560, 0), 0); outerUpdate(); RR(scene, camera); await __save('s3_out_seam.png', renderer.domElement.toDataURL('image/png'));
return out;
