// the wedding convoy on the move: the lead gets somewhere, the others keep ~10 m; tagging along behind → joined
initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const res = {}; const L = WED.cars[0]; car.x = L.x + 300; car.z = L.z + 300; const p0 = [L.x, L.z]; let minG = 99, maxG = 0, path = 0, px = L.x, pz = L.z;
for (let i = 0; i < 60*45; i++) { st(1); path += Math.hypot(L.x - px, L.z - pz); px = L.x; pz = L.z; if (i > 60*8) for (let k = 1; k < 4; k++) { const g = Math.hypot(WED.cars[k].x - WED.cars[k-1].x, WED.cars[k].z - WED.cars[k-1].z); minG = Math.min(minG, g); maxG = Math.max(maxG, g); } }
res.leadPath = Math.round(path); res.gap = [+minG.toFixed(1), +maxG.toFixed(1)]; res.dmg = WED.cars.map(v => +v.damage.toFixed(1)); res.mode = L.ai.V.mode;
let joined = false; for (let i = 0; i < 60*8 && !joined; i++) { const B = WED.cars[3]; car.x = B.x - Math.sin(B.yaw)*10; car.z = B.z - Math.cos(B.yaw)*10; car.angle = B.yaw; car.vx = Math.sin(B.yaw)*4; car.vz = Math.cos(B.yaw)*4; st(1); joined = WED.joined; }
res.joined = joined; st(20);
const M = WED.cars[1]; renderer.render = R0; camera.position.set(M.x + Math.cos(M.yaw)*12, Y(M.x, M.z) + 11, M.z - Math.sin(M.yaw)*12); camera.lookAt(M.x, Y(M.x, M.z), M.z); renderer.render = () => {};
return res;
