// lehti photos: the dragster launching off its lay-by (smoke, the nose up on the wheelie bars; the kerb and the tyre wall) and a tumble
startRace(false); step(40); lapStarted = true; const H = DRAG.home; car.x = RI.x = H.x - Math.cos(H.angle)*4.5; car.z = RI.z = H.z + Math.sin(H.angle)*4.5; car.vx = car.vz = 0; step(10); walkOut(); WALK.h.x = H.x - Math.cos(H.angle)*1.6; WALK.h.z = H.z + Math.sin(H.angle)*1.6; step(3);
dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' })); dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyF' })); step(90); out.inDrag = DRAG.on;
keys.ArrowUp = true; step(Math.round(60*0.55)); out.kmh = Math.round(Math.hypot(car.vx, car.vz)*3.6); out.nose = +(Math.asin(new THREE.Vector3(0, 0, 1).applyQuaternion(DP.q).y)*57.3).toFixed(1);
{ const fx = Math.sin(car.angle), fz = Math.cos(car.angle); LH_FAR.k = 1.15; await view('dragster', car.x + fx*1, Y(car.x, car.z) + 1, car.z + fz*1, car.x + fx*9 + fz*8, Y(car.x, car.z) + 3.5, car.z + fz*9 - fx*8); }
keys.ArrowUp = false; step(60);
// the tumble: along the road at 35 m/s, a kick into a roll
{ const n = trackPoints.length, g = gridIndex(), i = (g - 120 + n) % n, a = trackPoints[i], b = trackPoints[(i + 3) % n]; car.x = RI.x = a.x; car.z = RI.z = a.y; car.angle = RI.a = Math.atan2(b.x - a.x, b.y - a.y); DP.ok = false; dragInit(car.x, car.z, car.angle); step(30); }
DP.v.set(Math.sin(car.angle)*33, 3, Math.cos(car.angle)*33); DP.w.copy(new THREE.Vector3(0, 0, 1).applyQuaternion(DP.q).multiplyScalar(6)).add(new THREE.Vector3(0, 1.5, 0)); step(26);
out.upY = +new THREE.Vector3(0, 1, 0).applyQuaternion(DP.q).y.toFixed(2); out.lost = Object.keys(DP.lost);
{ const x = DP.p.x, z = DP.p.z, vx = DP.v.x, vz = DP.v.z, l = Math.hypot(vx, vz) || 1; LH_FAR.k = 1.1; await view('dragster_b', x, Y(x, z) + 1, z, x + vx/l*10 + vz/l*9, Y(x, z) + 4, z + vz/l*10 - vx/l*9); }
return out;
