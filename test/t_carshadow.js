initAudio = () => {}; startRace(false); for (let i = 0; i < 30; i++) loop(lastTime + 1000/60);
const c = YARD_CARS[3]; car.x = c.x + 40; car.z = c.z + 40; for (let i = 0; i < 30; i++) loop(lastTime + 1000/60);
camera.position.set(c.x + 6, Y(c.x, c.z) + 5, c.z + 6); camera.lookAt(c.x, Y(c.x, c.z), c.z); await __shot('cs1');
car.x = c.x + 5; car.z = c.z; for (let i = 0; i < 5; i++) loop(lastTime + 1000/60); camera.position.set(car.x + 7, Y(car.x, car.z) + 6, car.z + 7); camera.lookAt(car.x, Y(car.x, car.z), car.z); await __shot('cs2');
const v = VEHICLES.find(v => !v.gone && v.view && v.view.g); let vi = null; if (v) { vi = v.kind; camera.position.set(v.x + 7, Y(v.x, v.z) + 6, v.z + 7); camera.lookAt(v.x, Y(v.x, v.z), v.z); await __shot('cs3'); }
return { yard: YARD_CARS.length, vi };
