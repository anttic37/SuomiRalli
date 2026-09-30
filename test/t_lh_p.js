// lehti photos: the Pökö knocks a lone tree over (mid-fall) and flattens a fence section
startRace(false); step(60); lapStarted = true;
const lone = (kind, gap) => { let best = null; for (const it of KNOCK.items) { if (it.kind !== kind || !it.ranges.length || it.fall) continue; const d = Math.hypot(it.x - car.x, it.z - car.z); if (d < 40 || d > 700) continue;
  let n = 0; knockNear(it.x, it.z, gap, o => { if (o !== it && Math.hypot(o.x - it.x, o.z - it.z) < gap) n++; }); if (n) continue; let blocked = false; staticNear(it.x, it.z, kind === 'tree' ? 12 : 4, () => { blocked = true; }); if (blocked) continue;
  if (!best || d < best.d) best = { it, d }; } return best && best.it; };
{ const it = lone('tree', 9); out.tree = !!it; if (it) { const a = 0.4, x = it.x - Math.sin(a)*8, z = it.z - Math.cos(a)*8; car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; car.vx = Math.sin(a)*17; car.vz = Math.cos(a)*17;
    let n = 0; while (n++ < 200 && !(it.fall && it.th > 0.75)) step(1); out.th = +it.th.toFixed(2); const sx = -it.dz, sz = it.dx;
    LH_FAR.k = 1.1; await view('puu', it.x + it.dx*2, it.py + 1.8, it.z + it.dz*2, it.x + it.dx*2 + sx*11 - it.dx*3, it.py + 4.5, it.z + it.dz*2 + sz*11 - it.dz*3); } }
{ let it = null; for (const k of ['fence', 'hedge']) { it = lone(k, 0) ; if (it) break; } out.fence = it && it.kind; if (it) { const a = it.yaw + Math.PI/2, x = it.x - Math.sin(a)*7, z = it.z - Math.cos(a)*7; car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; car.vx = Math.sin(a)*13; car.vz = Math.cos(a)*13;
    let n = 0; while (n++ < 120 && !(it.fall && it.th > 0.5)) step(1); step(3); out.fth = +it.th.toFixed(2);
    LH_FAR.k = 1.1; await view('aita', it.x, it.py + 0.6, it.z, it.x - Math.sin(a)*3 + Math.cos(a)*9, it.py + 4, it.z - Math.cos(a)*3 - Math.sin(a)*9); } }
return out;
