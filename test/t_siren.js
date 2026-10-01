// traffic gives way to a siren: a police car on a chase 25 m behind a moving traffic car → it pulls over right and stops; the siren gone → it drives on
initAudio = () => {}; renderer.render = () => {}; const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
startRace(false); step(60*3); freeEnter(); { const b = BALES[0]; car.x = b.x + 4; car.z = b.z + 4; car.vx = car.vz = 0; } step(60*12);
const v = TRAFFIC.list.filter(o => o.kind === 'car' && o.vF > 6).sort((a, b) => b.vF - a.vF)[0]; if (!v) return { noCar: true };
const out = { before: +v.vF.toFixed(1) }; const P = new Vehicle({ kind: 'police', x: v.x, z: v.z, yaw: v.yaw, hw: 0.88, hl: 2.4, view: { kind: 'mesh', g: new THREE.Group() }, temp: true }); P.chase = true;
const keep = () => { const [x, z] = lloc(v.x, v.z, v.yaw, 0, -25); P.x = x; P.z = z; P.yaw = v.yaw; P.vx = P.vz = 0; };   // (on its tail, 25 m back)
let sw0 = v.sw || 0, maxSw = sw0; step(60*5, () => { keep(); maxSw = Math.max(maxSw, v.sw || 0); }); out.withSiren = { kmh: +(Math.abs(v.vF)*3.6).toFixed(1), sw: +(maxSw - sw0).toFixed(2), onRoad: onRoad(v.x, v.z, 0.3) };
P.chase = false; step(60*6); out.after = { kmh: +(Math.abs(v.vF)*3.6).toFixed(1) };
vehicleRemove(P); return out;
