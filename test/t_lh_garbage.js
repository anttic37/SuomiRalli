// paper photos: the bin lorry with a bin going up at the back; a row of bins in front of the houses; a bin the rally car sent flying
setTimeOfDay('paiva'); startRace(false); step(20); const V = BINS.lorry, v = V.v, res = {};
for (let i = 0; i < 60*200 && !(V.w.m === 'lift' && V.w.t > 1.0 && V.w.t < 1.3); i++) { car.x = v.x + 400; car.z = v.z; car.vx = car.vz = 0; worldUpdate(1/60); vehiclesPhysics(1/60); }
res.lift = V.w.m; { const [bx, bz] = lloc(v.x, v.z, v.yaw, 0, -(v.hl + 0.5)), [cx, cz] = lloc(v.x, v.z, v.yaw, -6.5, -(v.hl + 3.5)); car.x = v.x + 30; car.z = v.z + 30; nearVisT = 0; nearVisUpdate(0.01); LH_FAR.k = 1.0; await view('roskaauto', bx, Y(bx, bz) + 1.3, bz, cx, Y(cx, cz) + 2.4, cz); }
// a row of bins: the one with most full bins within 30 m, from the street
let best = null, bn = 0; for (const B of BINS.list) { if (B.route < 15) continue; const n = BINS.list.filter(o => o.full && Math.hypot(o.x - B.x, o.z - B.z) < 30).length; if (n > bn) { bn = n; best = B; } }
if (best) { const a = best.yaw, fx = Math.sin(a), fz = Math.cos(a), dx = Math.cos(a), dz = -Math.sin(a); const cx = best.x + fx*9 - dx*10, cz = best.z + fz*9 - dz*10; car.x = best.x + 60; car.z = best.z; nearVisT = 0; nearVisUpdate(0.01); LH_FAR.k = 1.3; await view('ponttorivi', best.x + dx*4, Y(best.x, best.z) + 0.8, best.z + dz*4, cx, Y(cx, cz) + 2.4, cz); res.row = bn; }
// the rally car clipping a bin, along the street itself (the nearest street node and its neighbour give the way)
const { nodes, adj } = roadGraph();
const way = (b) => { if (!adj[b.ni] || adj[b.ni].length !== 2) return null; const n0 = nodes[b.ni], n1 = nodes[adj[b.ni][0][0]], l = Math.hypot(n1.x - n0.x, n1.z - n0.z) || 1, dx = (n1.x - n0.x)/l, dz = (n1.z - n0.z)/l;
  let sx = dz, sz = -dx; if ((b.x - n0.x)*sx + (b.z - n0.z)*sz < 0) { sx = -sx; sz = -sz; } const ok = [[-1.1, -20], [-1.1, 0], [-5, 10], [-1.1, 12]].every(([o, f]) => onRoad(b.x + sx*o + dx*f, b.z + sz*o + dz*f, 0.3)); return ok ? { dx, dz, sx, sz } : null; };   // (the start, the bin's own stretch, the camera, beyond: all on the street)
const B = BINS.list.find(b => !b.down && b.full && b.route > 12 && Math.hypot(b.x - v.x, b.z - v.z) > 40 && way(b)); if (B) { const { dx, dz, sx, sz } = way(B), ang = Math.atan2(dx, dz);
  car.angle = ang; car.x = B.x - sx*1.1 - dx*20; car.z = B.z - sz*1.1 - dz*20; car.vx = dx*15; car.vz = dz*15; let shot = false;
  for (let i = 0; i < 150 && !shot; i++) { car.vx = dx*15; car.vz = dz*15; car.angle = ang; step(1); if (B.down && B.y > 0.3) { shot = true; const cx = B.x + dx*10 - sx*5, cz = B.z + dz*10 - sz*5; LH_FAR.k = 1.0; await view('ponttolentaa', (B.x + car.x)/2, Y(B.x, B.z) + 0.9, (B.z + car.z)/2, cx, Y(cx, cz) + 2.8, cz); } }
  res.flew = shot; }
return res;
