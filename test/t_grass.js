// on grass: full-throttle speed after 4 s from standstill; coast from 25 m/s for 2 s; lateral slide after a flick
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
// find an open grass patch: no road, no building, no vehicle within 40 m
let spot = null; for (let k = 0; k < 4000 && !spot; k++) { const x = (Math.random() - 0.5)*900, z = (Math.random() - 0.5)*900; let ok = true;
  for (let a = 0; a < 6.3 && ok; a += 0.5) for (let r = 0; r <= 40 && ok; r += 5) { const px = x + Math.sin(a)*r, pz = z + Math.cos(a)*r; if (onRoad(px, pz, 2) || inSandPitch(px, pz)) ok = false; }
  if (ok && STATIC_LIST.some(b => Math.hypot(b.x - x, b.z - z) < 45)) ok = false; if (ok && VEHICLES.some(v => Math.hypot(v.x - x, v.z - z) < 45)) ok = false;
  if (ok) { const s = Math.abs(H(x + 20, z) - H(x - 20, z)) + Math.abs(H(x, z + 20) - H(x, z - 20)); if (s > 2) ok = false; } if (ok) spot = [x, z]; }
const res = { spot };
const at = (a) => { car.x = spot[0] - Math.sin(a)*25; car.z = spot[1] - Math.cos(a)*25; car.angle = a; car.vx = car.vz = 0; };
at(0.3); step(60*4, () => { keys.ArrowUp = true; }); keys.ArrowUp = false; res.throttle4s = (Math.hypot(car.vx, car.vz)*3.6).toFixed(0) + ' km/h';
at(0.3); car.vx = Math.sin(0.3)*25; car.vz = Math.cos(0.3)*25; step(60*2); res.coastFrom90 = (Math.hypot(car.vx, car.vz)*3.6).toFixed(0) + ' km/h';
at(0.3); car.vx = Math.sin(0.3)*25; car.vz = Math.cos(0.3)*25; step(60*1.5, () => { keys.ArrowDown = true; }); keys.ArrowDown = false; res.brake15s = (Math.hypot(car.vx, car.vz)*3.6).toFixed(0) + ' km/h';
at(0.3); car.vx = Math.sin(0.3)*22; car.vz = Math.cos(0.3)*22; let maxLat = 0; step(60*2, (i) => { keys.ArrowLeft = i < 40; const rx = Math.cos(car.angle), rz = -Math.sin(car.angle); maxLat = Math.max(maxLat, Math.abs(car.vx*rx + car.vz*rz)); }); keys.ArrowLeft = false; res.maxSlide = maxLat.toFixed(1) + ' m/s sideways';
res.onTrack = car.onTrack;
return res;
