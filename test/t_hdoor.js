step(30); const out = [];
for (const bi of [3, 10, 17, 94]) { const [x, z, w, d, th] = BUILDINGS[bi], alongX = w > d;
  let rd2 = 1e9, rdx = 0, rdz = 0; for (const q of sideRoadPts) { const dx = q.x - x, dz = q.y - z, dd = dx*dx + dz*dz; if (dd < rd2) { rd2 = dd; rdx = dx; rdz = dz; } }
  const nx = alongX ? Math.sin(th) : Math.cos(th), nz = alongX ? Math.cos(th) : -Math.sin(th), sg = (nx*rdx + nz*rdz) >= 0 ? 1 : -1, r = Math.min(w, d)/2 + 7;
  car.x = x; car.z = z; out.push(bi + ' road ' + Math.sqrt(rd2).toFixed(1));
  await shot('door' + bi, x, z, nx*sg*r + nz*3, nz*sg*r - nx*3, 2.2, 1.6); }
return out;
