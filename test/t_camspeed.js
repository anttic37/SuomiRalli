// the car's height on screen (0 top … 1 bottom) at steady speeds on a long straight: it should stay in the lower part of the view
initAudio = () => {}; renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3); const n = trackPoints.length; let bi = 0, bl = 0;
for (let i = 0; i < n; i++) { let l = 0; for (let k = 1; k < 60; k++) { const a = trackPoints[(i + k - 1) % n], b = trackPoints[(i + k) % n], c = trackPoints[(i + k + 1) % n]; if (Math.abs(angDiff(Math.atan2(c.x - b.x, c.y - b.y) - Math.atan2(b.x - a.x, b.y - a.y))) > 0.05) break; l++; } if (l > bl) { bl = l; bi = i; } }
const out = [], v = new THREE.Vector3();
for (const sp of [0, 10, 20, 30]) { const p = trackPoints[bi], q = trackPoints[(bi + 1) % n], a = Math.atan2(q.x - p.x, q.y - p.y); car.x = p.x; car.z = p.y; car.angle = a; car.prog = bi; camAngle.current = a;
  let ys = []; for (let i = 0; i < 420; i++) { car.x += Math.sin(a)*sp/60; car.z += Math.cos(a)*sp/60; car.vx = Math.sin(a)*sp; car.vz = Math.cos(a)*sp; car.speed = sp; updateCamera(1/60); camera.updateMatrixWorld(); if (i > 380) { v.set(car.x, Y(car.x, car.z), car.z).project(camera); ys.push((1 - v.y)/2); } }
  out.push({ kmh: sp*3.6, carY: +(ys.reduce((a, b) => a + b, 0)/ys.length).toFixed(3) }); }
return out;
