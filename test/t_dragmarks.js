startRace(false); step(40); lapStarted = true; dragSwap(true); step(30); const H = DRAG.home;
keys.ArrowUp = true; step(28); keys.ArrowUp = false; keys.ArrowDown = true; step(40); keys.ArrowDown = false; step(60*4);
LH_FAR.k = 1; const mx = (H.x + car.x)/2, mz = (H.z + car.z)/2; await view('dragmarks', mx, Y(mx, mz), mz, mx + 0.3, Y(mx, mz) + 26, mz + 0.3);
const fx = Math.sin(car.angle), fz = Math.cos(car.angle); car.vx = car.vz = 0; DP.v.set(0, 0, 0); step(20);
await view('dragshadow', car.x, Y(car.x, car.z) + 0.8, car.z, car.x + fz*7 - fx*2, Y(car.x, car.z) + 5, car.z - fx*7 - fz*2);
return { marks: markIdx, lost: Object.keys(DP.lost), dmg: DP.dmg, onLay: inLay(car.x, car.z, 0), onRoad: onRoad(car.x, car.z, 0) };
