startRace(false); step(10);
const K = LANDMARKS.find(L => L[0] === 'kauppa'); const out = { K: [Math.round(K[1]), Math.round(K[2])] };
out.ri = JSON.stringify(roadInfo(164, 145)).slice(0, 200);
const runs = []; for (const r of sideRoads.filter(r => r.name === 'YLÄSTÖNTIE')) { const P = r.pts; out.np = (out.np || []).concat([P.length + '@' + Math.round(P[0].x) + ',' + Math.round(P[0].y)]);
  for (let i = 0; i < P.length; i += 4) { let best = i; for (let j = i + 10; j < P.length; j += 2) { const ax = P[i].x, az = P[i].y, bx = P[j].x - ax, bz = P[j].y - az, L = Math.hypot(bx, bz); let ok = true;
      for (let k = i; k <= j; k++) { const d = Math.abs((P[k].x - ax)*bz - (P[k].y - az)*bx)/L; if (d > 2.5) { ok = false; break; } } if (ok) best = j; else break; }
    const L = Math.hypot(P[best].x - P[i].x, P[best].y - P[i].y); if (L > 180) runs.push({ L: Math.round(L), a: [Math.round(P[i].x), Math.round(P[i].y)], b: [Math.round(P[best].x), Math.round(P[best].y)], dK: Math.round(Math.hypot(P[i].x - K[1], P[i].y - K[2])), dy: Math.round(Y(P[best].x, P[best].y) - Y(P[i].x, P[i].y)) }); } }
const seen = []; out.runs = runs.sort((a, b) => b.L - a.L).filter(r => { if (seen.some(s => Math.hypot(s.a[0] - r.a[0], s.a[1] - r.a[1]) < 150)) return false; seen.push(r); return true; }).slice(0, 8); return out;
