startRace(false); step(60*3); const S = X3.sauna; car.x = S.x + 30; car.z = S.z; car.vx = car.vz = 0; setTimeOfDay('ilta'); step(60*24);
// 1: hero — low, the trailer, the crowd, the plume
const tr = S.tr, [hx, hz] = lloc(0, 0, tr.yaw, 9, 6); await shot('ad_hero', S.x, S.z, hx, hz, 1.6, 4);
// 2: the rally car roaring past, everyone cheering
const [cx, cz] = lloc(S.x, S.z, tr.yaw, 7, -3); car.x = cx; car.z = cz; car.angle = tr.yaw + 1.3; for (let i = 0; i < 30; i++) { car.vx = Math.sin(car.angle)*14; car.vz = Math.cos(car.angle)*14; step(1); car.x = cx; car.z = cz; }
carGroup.position.set(car.x, Y(car.x, car.z), car.z); carGroup.rotation.y = car.angle;
const [ax, az] = lloc(0, 0, car.angle, 5, 7); await shot('ad_car', car.x, car.z, ax, az, 1.3, 1.2);
// 3: from afar over the village, the plume
setTimeOfDay('paiva'); step(10); await shot('ad_far', S.x, S.z, 34, 26, 7, 18);
return 1;
