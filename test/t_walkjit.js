// on foot: frame-to-frame camera motion vs the walker's (judder = the camera's step varying while the walker's is steady)
initAudio = () => {}; renderer.render = () => {}; car.x = car.x; startRace(false); for (let i = 0; i < 60*2; i++) loop(lastTime + 1000/60);
walkOut(); const h = WALK.h, rec = []; const dts = [1000/60, 1000/144];
const run = (ms, n) => { const a = []; let px = camera.position.clone(), hx = h.x, hz = h.z; for (let i = 0; i < n; i++) { loop(lastTime + ms); const p = camera.position; a.push([+p.distanceTo(px).toFixed(4), +Math.hypot(h.x - hx, h.z - hz).toFixed(4), +(p.y).toFixed(3), +(camAngle.current).toFixed(4)]); px = p.clone(); hx = h.x; hz = h.z; } return a; };
const idle = run(1000/60, 40); keys.ArrowUp = true; const w60 = run(1000/60, 120); const w144 = run(1000/144, 200); keys.ArrowUp = false;
const stat = (a) => { const s = a.slice(20).map(r => r[0]), m = s.reduce((x, y) => x + y, 0)/s.length; return { mean: +m.toFixed(4), min: Math.min(...s), max: Math.max(...s), hmin: Math.min(...a.slice(20).map(r => r[1])), hmax: Math.max(...a.slice(20).map(r => r[1])) }; };
h.x = car.x + 1.2; h.z = car.z; loop(lastTime + 1000/60); const pin = camera.position.clone(); walkIn(true); const back = run(1000/60, 60); const jin = Math.max(...back.map(r => r[0]));
return { exitMax: Math.max(...idle.map(r => r[0])), inMax: +jin.toFixed(3), idle: stat(idle), w60: stat(w60), w144: stat(w144), sample60: w60.slice(40, 60), idleS: idle.slice(0, 12) };
