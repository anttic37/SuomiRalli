startRace(false); step(60*4.2); const a = [car.x, car.z, Math.hypot(car.vx, car.vz)]; walkOut(); const b = [car.x, car.z]; const r = [];
for (let k = 0; k < 6; k++) { step(60*5); r.push(+Math.hypot(car.x - b[0], car.z - b[1]).toFixed(2)); }
return { before: a, series: r };
