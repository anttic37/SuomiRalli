// lehti photo: the dragster roaring up Malminrajantie
startRace(false); step(40); lapStarted = true; const H = DRAG.home; car.x = RI.x = H.x + 3; car.z = RI.z = H.z; car.vx = car.vz = 0; step(10); walkOut(); WALK.h.x = H.x + 1.2; WALK.h.z = H.z; step(3);
dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' })); dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyF' })); step(5); out.inDrag = DRAG.on;
{ const n = trackPoints.length, g = gridIndex(), i = (g - 30 + n) % n, a = trackPoints[i], b = trackPoints[(i + 3) % n]; car.x = RI.x = a.x; car.z = RI.z = a.y; car.angle = RI.a = Math.atan2(a.x - b.x, a.y - b.y); car.vx = car.vz = 0; step(2); }
keys.ArrowUp = true; step(60*1.4); keys.ArrowUp = false; out.kmh = Math.round(Math.hypot(car.vx, car.vz)*3.6);
LH_FAR.k = 1; await view('dragster', car.x, Y(car.x, car.z) + 1, car.z, car.x + Math.sin(car.angle)*10 + Math.cos(car.angle)*7, Y(car.x, car.z) + 4.5, car.z + Math.cos(car.angle)*10 - Math.sin(car.angle)*7);
return out;
