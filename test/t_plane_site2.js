startRace(false); step(10); const n = trackPoints.length, g = gridIndex(), tp = (i) => trackPoints[((i % n) + n) % n], out = { g, grid: [Math.round(tp(g).x), Math.round(tp(g).y)] };
const hd = (i) => Math.atan2(tp(i + 3).x - tp(i).x, tp(i + 3).y - tp(i).y), dA = (a, b) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
out.bends = []; for (let k = 0; k < 250; k += 4) { const t = dA(hd(g + k + 12), hd(g + k)); if (Math.abs(t) > 0.5) out.bends.push([k, Math.round(tp(g + k + 6).x), Math.round(tp(g + k + 6).y), +t.toFixed(2)]); }
const Yl = sideRoads.filter(r => r.name === 'YLÄSTÖNTIE'); out.yl = Yl.map(r => r.pts.length);
// Ylästöntie straight runs ≥ 150 m, with distance to grid
const runs = []; for (const r of Yl) { const P = r.pts; for (let i = 0; i < P.length; i += 3) { let j = i; for (let k = i + 10; k < P.length; k += 2) { const bx = P[k].x - P[i].x, bz = P[k].y - P[i].y, L = Math.hypot(bx, bz); let ok = true; for (let m = i; m <= k; m++) if (Math.abs((P[m].x - P[i].x)*bz - (P[m].y - P[i].y)*bx)/L > 2.5) { ok = false; break; } if (ok) j = k; else break; }
  const L = Math.hypot(P[j].x - P[i].x, P[j].y - P[i].y); if (L > 150) runs.push({ L: Math.round(L), a: [Math.round(P[i].x), Math.round(P[i].y)], b: [Math.round(P[j].x), Math.round(P[j].y)], dG: Math.round(Math.min(Math.hypot(P[i].x - tp(g).x, P[i].y - tp(g).y), Math.hypot(P[j].x - tp(g).x, P[j].y - tp(g).y))) }); } }
const seen = []; out.runs = runs.sort((a, b) => b.L - a.L).filter(r => { if (seen.some(s => Math.hypot(s.a[0] - r.a[0], s.a[1] - r.a[1]) < 100)) return false; seen.push(r); return true; }).slice(0, 8);
out.names = [...new Set(sideRoads.map(r => r.name))].length; return out;
