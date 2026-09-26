let n = 0, close = [], minC = 99;
BUILDINGS.forEach(B => { if (B.length > 5) return; if (Math.min(B[2], B[3]) < 2) return; n++; const [x,z,w,d,th] = B, ux=Math.cos(th), uz=-Math.sin(th), vx=Math.sin(th), vz=Math.cos(th);
  let worst = 0; for (let a = -1; a <= 1; a += 0.1) for (const b of [-1, 1]) for (const [aa, bb] of [[a, b], [b, a]]) { const px = x+ux*w/2*aa+vx*d/2*bb, pz = z+uz*w/2*aa+vz*d/2*bb, r = roadPen(px, pz, 1.8); if (r && r.pen > worst) worst = r.pen; }
  if (worst > 0.05) close.push(`${x.toFixed(0)},${z.toFixed(0)} pen ${worst.toFixed(2)}`); });
return { houses: n, tooClose: close.length, ex: close.slice(0, 8) };
