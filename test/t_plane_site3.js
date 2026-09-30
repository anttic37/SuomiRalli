startRace(false); step(10); const n = trackPoints.length, g = gridIndex(), tp = (i) => trackPoints[((i % n) + n) % n];
const fx = finishLine.position.x, fz = finishLine.position.y; let fi = 0, fd = 1e9; trackPoints.forEach((p, i) => { const d = Math.hypot(p.x - fx, p.y - fz); if (d < fd) { fd = d; fi = i; } });
const hd = (i) => Math.atan2(tp(i + 3).x - tp(i).x, tp(i + 3).y - tp(i).y), dA = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const out = { n, g, fi, grid: [Math.round(tp(g).x), Math.round(tp(g).y)], fin: [Math.round(fx), Math.round(fz)], plane: PLANE.home && [Math.round(PLANE.home.x), Math.round(PLANE.home.z)], seg: Math.hypot(tp(1).x - tp(0).x, tp(1).y - tp(0).y).toFixed(2) };
out.walk = []; for (let k = -150; k <= 40; k += 5) { const i = fi + k; out.walk.push([k, Math.round(tp(i).x), Math.round(tp(i).y), +(dA(hd(i + 5), hd(i))).toFixed(2)]); }
return out;
