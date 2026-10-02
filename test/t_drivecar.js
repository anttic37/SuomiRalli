initAudio = () => {}; startRace(false); for (let i = 0; i < 30; i++) loop(lastTime + 1000/60);
const L = YARD_CARS.filter(c => !c.street).map(c => ({ c, s: Math.abs(Y(c.x + Math.sin(c.yaw)*2, c.z + Math.cos(c.yaw)*2) - Y(c.x - Math.sin(c.yaw)*2, c.z - Math.cos(c.yaw)*2)) })).sort((a, b) => b.s - a.s);
const out = []; for (let k = 0; k < 3; k++) { const c = L[k*5].c; car.x = c.x + 12; car.z = c.z + 12; for (let i = 0; i < 20; i++) loop(lastTime + 1000/60);
  camera.position.set(c.x + 6, Y(c.x, c.z) + 22, c.z + 10); camera.lookAt(c.x, Y(c.x, c.z), c.z); await __shot('dc' + k); out.push([Math.round(c.x), Math.round(c.z), +L[k*5].s.toFixed(2)]); }
return { n: L.length, out };
