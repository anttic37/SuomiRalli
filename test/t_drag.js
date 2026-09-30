// the dragster: parked by the finish area; on foot F by it → you drive it (the Pökö stays parked), huge acceleration, a chute when
// you lift at speed; F by the Pökö → back; a lap with it doesn't count; R → both home
startRace(false); step(60); lapStarted = true; out.home = !!DRAG.home;
if (!DRAG.home) return out; const H = DRAG.home;
car.x = RI.x = H.x + Math.cos(H.angle)*4; car.z = RI.z = H.z - Math.sin(H.angle)*4; car.vx = car.vz = 0; step(20); walkOut(); const w = WALK.h; w.x = H.x + Math.cos(H.angle)*1.6; w.z = H.z - Math.sin(H.angle)*1.6; step(5);
const ev = (c) => { dispatchEvent(new KeyboardEvent('keydown', { code: c })); dispatchEvent(new KeyboardEvent('keyup', { code: c })); };
ev('KeyF'); step(5); out.inDrag = DRAG.on; out.pokoParked = !!DRAG.pokoMesh && DRAG.pokoMesh.visible; out.accel = DRIVE.accel;
await view('dragster_park', H.x, Y(H.x, H.z) + 1, H.z, H.x + Math.cos(H.angle)*8 + Math.sin(H.angle)*5, Y(H.x, H.z) + 4, H.z - Math.sin(H.angle)*8 + Math.cos(H.angle)*5);
{ const n = trackPoints.length, g = gridIndex(), i = (g - 20 + n) % n, a = trackPoints[i], b = trackPoints[(i + 3) % n]; car.x = RI.x = a.x; car.z = RI.z = a.y; car.angle = RI.a = Math.atan2(a.x - b.x, a.y - b.y); car.vx = car.vz = 0; step(2); }   // (out on the road, facing up Malminrajantie)
let t100 = null, vmax = 0, t = 0; keys.ArrowUp = true; step(60*6, () => { t += 1/60; const v = Math.hypot(car.vx, car.vz)*3.6; vmax = Math.max(vmax, v); if (t100 === null && v >= 100) t100 = +t.toFixed(2); }); keys.ArrowUp = false;
out.t0_100 = t100; out.vmaxKmh = Math.round(vmax); step(10); out.chute = DRAG.chute > 0;
LH_FAR.k = 1; await view('dragster', car.x, Y(car.x, car.z) + 1, car.z, car.x - Math.sin(car.angle)*9 + Math.cos(car.angle)*5, Y(car.x, car.z) + 4, car.z - Math.cos(car.angle)*9 - Math.sin(car.angle)*5);
step(60*6); out.stopped = Math.hypot(car.vx, car.vz) < 3;
car.x = RI.x = DRAG.poko.x + 6; car.z = RI.z = DRAG.poko.z; car.vx = car.vz = 0; step(5); walkOut(); const w2 = WALK.h;   // (driven back by the Pökö: on foot you only go so far from your car)
 out.walked = !!w2; if (w2) { w2.x = DRAG.poko.x + 1.5; w2.z = DRAG.poko.z; step(3); ev('KeyF'); step(5); }
out.backInPoko = !DRAG.on && !WALK.on; out.accelBack = DRIVE.accel; out.dragParkedAway = Math.round(Math.hypot(DRAG.park.x - H.x, DRAG.park.z - H.z)); out.used = DRAG.used;
startRace(false); step(10); out.afterR = [DRAG.on, DRAG.used, Math.round(Math.hypot(DRAG.park.x - H.x, DRAG.park.z - H.z)), DRAG.parkMesh.visible, DRIVE.accel];
return out;
