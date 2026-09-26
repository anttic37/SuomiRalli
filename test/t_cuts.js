// every short cut over the inside of a bend: a straight line between two points just inside the inner kerb that saves ≥ 6 m —
// is something solid (a tyre stack, a tractor, a house, a pole) in the way of a car (r ≈ 1 m)?
renderer.render = () => {}; const n = trackPoints.length;
const curv = (i) => { const p = trackPoints[i], a = trackPoints[(i-6+n)%n], c = trackPoints[(i+6)%n], cr = (p.x-a.x)*(c.y-p.y) - (p.y-a.y)*(c.x-p.x); return { k: Math.abs(cr)/(Math.hypot(p.x-a.x,p.y-a.y)*Math.hypot(c.x-p.x,c.y-p.y) + 1e-9), side: -Math.sign(cr) || 1 }; };
const blockers = tires.filter(t => t.kind === 'tire').map(t => [t.x, t.z, 0.82]); const T = VEHICLES.filter(v => v.kind === 'tractor' && !v.ai);
const blocked = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0); for (let t = 0; t <= L; t += 0.5) { const x = x0 + (x1 - x0)*t/L, z = z0 + (z1 - z0)*t/L;
    if (blockers.some(b => Math.abs(b[0] - x) < 2 && Math.abs(b[1] - z) < 2 && Math.hypot(b[0] - x, b[1] - z) < b[2] + 0.95)) return true;
    let hit = false; staticNear(x, z, 3, B => { if (!hit && boxPush(B, x, z, 0.95)) hit = true; }); if (hit) return true;
    if (T.some(v => boxPush(v, x, z, 0.95))) return true; } return false; };
const corners = []; let i = 0; while (i < n) { if (curv(i).k > 0.28) { let j = i; while (j < n && curv(j).k > 0.15) j++; let ap = i, am = 0; for (let k = i; k <= j; k++) { const c = curv(k % n).k; if (c > am) { am = c; ap = k; } } corners.push({ ap: ap % n, am, side: curv(ap % n).side }); i = j + 1; } else i++; }
const open = []; let tried = 0;
for (const C of corners) { const s = -C.side, pt = (k) => { const q = (k%n+n)%n, p = trackPoints[q], d = getDir(q), nm = { x: -d.y, y: d.x }, gn = getNormal(q), o = (wAt(q)*0.5 + 1.2)*s; return [p.x + gn.x*o, p.y + gn.y*o]; };
  let worst = null; for (let a = 3; a <= 14; a++) for (let b = 3; b <= 14; b++) { const A = pt(C.ap - a), B = pt(C.ap + b); let route = 0; for (let k = C.ap - a; k < C.ap + b; k++) { const p = trackPoints[(k%n+n)%n], q = trackPoints[((k+1)%n+n)%n]; route += Math.hypot(q.x - p.x, q.y - p.y); }
    const chord = Math.hypot(B[0] - A[0], B[1] - A[1]), save = route - chord; if (save < 6) continue;
    const mid = [(A[0] + B[0])/2, (A[1] + B[1])/2]; if (onRoad(mid[0], mid[1], 0)) continue;   // (the cut is itself a street: fine)
    tried++; if (!blocked(A[0], A[1], B[0], B[1])) { if (!worst || save > worst.save) worst = { save: +save.toFixed(1), at: Math.round(trackPoints[C.ap].x) + ',' + Math.round(trackPoints[C.ap].y), am: +C.am.toFixed(2) }; } }
  if (worst) open.push(worst); }
return { corners: corners.length, cutsTried: tried, cornersWithOpenCut: open.length, open: open.sort((p, q) => q.save - p.save).slice(0, 12) };
