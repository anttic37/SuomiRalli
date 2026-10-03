initAudio = () => {}; renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); }; st(60);
const res = {}; const Bh = WED.cars[3]; car.x = Bh.x + 30; car.z = Bh.z; st(10);
let t0 = performance.now(); Bh.damage += 2; car.x = Bh.x + 2; car.z = Bh.z; st(2); res.angry = WED.angry > 0; res.pairOut = WED.pair.map(h => !h.inside); res.ms2 = Math.round(performance.now() - t0);
car.x = Bh.x + 25; car.z = Bh.z; car.vx = car.vz = 0; t0 = performance.now(); st(60); res.ms60 = Math.round(performance.now() - t0); res.brideDist = +Math.hypot(WED.pair[0].x - car.x, WED.pair[0].z - car.z).toFixed(1);
st(120); res.brideDist2 = +Math.hypot(WED.pair[0].x - car.x, WED.pair[0].z - car.z).toFixed(1);
car.x += 200; st(60*3); res.calm = WED.angry <= 0; st(60*12); res.backIn = WED.pair.map(h => h.inside); res.leadMode = WED.cars[0].ai.V.mode;
return res;
