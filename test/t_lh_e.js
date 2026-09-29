startRace(false); setTimeOfDay('paiva'); step(60*4.5);
put(300, 15); hold(2); const fx = Math.sin(car.angle), fz = Math.cos(car.angle), rx = fz, rz = -fx;   // (rx: the car's right)
const P = { x: car.x + fx*9, z: car.z + fz*9, a: car.angle }; car.x -= rx*1.8; car.z -= rz*1.8; carGroup.position.set(car.x, Y(car.x, car.z), car.z); placeGhost(ghostGroup, P, 1); ghostGroup.userData.colMat.opacity = 0.7;
await view('haamu_a', car.x + fx*6, Y(car.x, car.z) + 0.8, car.z + fz*6, car.x - fx*7 + rx*2, Y(car.x, car.z) + 3.4, car.z - fz*7 + rz*2);
return out;
