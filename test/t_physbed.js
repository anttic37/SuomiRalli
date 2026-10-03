// the ?fysiikka testbed: drive down the start straight through the row of bales with the real car physics (throttle held); wireframe shots
initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const t0 = performance.now(); while (!PHYS.ready && performance.now() - t0 < 60000) await new Promise(r => setTimeout(r, 200));
PHYS.debug = true; physBales(); st(5); const b0 = BALES[0], dir = getDir(0); const res = { log: [] };
car.x = trackPoints[0].x; car.z = trackPoints[0].y; car.angle = Math.atan2(dir.x, dir.y); st(2);
const shot = async (n) => { camera.position.set(car.x - dir.x*8 + dir.y*6, Y(car.x, car.z) + 6, car.z - dir.y*8 - dir.x*6); camera.lookAt(car.x + dir.x*6, Y(car.x, car.z), car.z + dir.y*6); R0(scene, camera); R0(scene, camera); await __save(n, renderer.domElement.toDataURL('image/jpeg', 0.55)); };
let touched = false, shots = 0;
for (let i = 0; i < 60*7; i++) { if (!touched) { car.vx = dir.x*25; car.vz = dir.y*25; car.angle = Math.atan2(dir.x, dir.y); } keys.ArrowUp = true; loop(lastTime + 1000/60);
  if (BALES.slice(0, 6).some(b => b.touched > 0)) touched = true;
  if (i % 12 === 0) { const v = b0.rb.linvel(), p = b0.rb.translation(); res.log.push([+(i/60).toFixed(1), Math.round(Math.hypot(car.vx, car.vz)*3.6), Math.round(Math.hypot(v.x, v.y, v.z)*3.6), +(p.y - Y(p.x, p.z)).toFixed(1), +Math.hypot(p.x - car.x, p.z - car.z).toFixed(1)]); }
  if (touched && shots < 3 && i % 6 === 0) { await shot('pb' + shots); shots++; } }
keys.ArrowUp = false; res.moved = BALES.slice(0, 6).map(b => { const p = b.rb.translation(); return +Math.hypot(p.x - b.ox, p.z - b.oz).toFixed(1); });
return res;
