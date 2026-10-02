// on foot: the walker's place on screen frame to frame (judder = it hops about while walking steadily), at even and uneven frame times
initAudio = () => {}; renderer.render = () => {}; startRace(false); for (let i = 0; i < 60*2; i++) loop(lastTime + 1000/60);
walkOut(); for (let i = 0; i < 90; i++) loop(lastTime + 1000/60); const h = WALK.h;
const v3 = new THREE.Vector3();
const run = (pat, n, turn) => { const a = []; for (let i = 0; i < n; i++) { if (turn) keys.ArrowLeft = (i % 80) < 30; loop(lastTime + pat[i % pat.length]); v3.set(h.x, Y(h.x, h.z) + 1, h.z).project(camera); a.push([+v3.x.toFixed(4), +v3.y.toFixed(4), +h.x.toFixed(2), +h.z.toFixed(2), +Y(h.x,h.z).toFixed(2), +camera.position.y.toFixed(2), +Math.hypot(h.vx,h.vz).toFixed(2), +(h.hop||0).toFixed(2), +h.yaw.toFixed(3)]); } keys.ArrowLeft = false; return a; };
const jit = (a) => { let m = 0, s = 0; for (let i = 2; i < a.length; i++) { const ax = a[i][0] - 2*a[i-1][0] + a[i-2][0], ay = a[i][1] - 2*a[i-1][1] + a[i-2][1], d = Math.hypot(ax, ay); m = Math.max(m, d); s += d; } return { max: +m.toFixed(4), mean: +(s/(a.length - 2)).toFixed(5), x: [Math.min(...a.map(r => r[0])), Math.max(...a.map(r => r[0]))], y: [Math.min(...a.map(r => r[1])), Math.max(...a.map(r => r[1]))] }; };
keys.ArrowUp = true; run([1000/60], 60);
const even = run([1000/60], 240), uneven = run([1000/72, 1000/48], 240), spikes = run([1000/60, 1000/60, 1000/60, 1000/60, 1000/60, 1000/60, 1000/60, 40], 240), turnE = run([1000/60], 240, true), turnU = run([1000/72, 1000/48], 240, true);
keys.ArrowUp = false;
return { even: jit(even), uneven: jit(uneven), spikes: jit(spikes), turnE: jit(turnE), turnU: jit(turnU), sampU: (() => { let k = 0, m = 0; for (let i = 2; i < uneven.length; i++) { const d = Math.abs(uneven[i][1] - 2*uneven[i-1][1] + uneven[i-2][1]); if (d > m) { m = d; k = i; } } return uneven.slice(Math.max(0, k - 8), k + 8); })(), sampT: turnU.slice(20, 40), foot: CAM.foot };
