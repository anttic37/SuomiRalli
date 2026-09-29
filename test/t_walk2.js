startRace(false); step(60*4.2); walkOut(); const h = WALK.h; keys.ArrowUp = true; step(60*2.5); keys.ArrowUp = false; step(20);
RR(scene, camera); await __save('s3_walk_cam2.png', renderer.domElement.toDataURL('image/png'));
const V = X3.heli.v; const [sx, sz] = lloc(0, 0, V.yaw, 8, 7); car.x = V.x + 30; car.z = V.z; step(30); await shot('heli_new', V.x, V.z, sx, sz, 2.5, 1.5);
const [fx, fz] = lloc(0, 0, V.yaw, -5, 9); await shot('heli_new2', V.x, V.z, fx, fz, 3, 1.5);
return [h.x - car.x, h.z - car.z];
