// trees and fence sections knocked over: drive the Pökö at a tree and a fence section, watch them fall; slow = solid; R stands them up
startRace(false); step(60); lapStarted = true; Object.assign(out, { items: KNOCK.items.length, withVerts: KNOCK.items.filter(i => i.ranges.length).length, kinds: {} });
for (const it of KNOCK.items) if (it.ranges.length) out.kinds[it.kind] = (out.kinds[it.kind] || 0) + 1;
const aimAt = (it, back, v) => { const a = it.kind === 'tree' ? 0.7 : it.yaw + Math.PI/2; const x = it.x - Math.sin(a)*back, z = it.z - Math.cos(a)*back; car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; car.vx = Math.sin(a)*v; car.vz = Math.cos(a)*v; };
const pick = (kind) => { let best = null; for (const it of KNOCK.items) { if (it.kind !== kind || !it.ranges.length || it.fall) continue; const d = Math.hypot(it.x - car.x, it.z - car.z); if (d < 40) continue;
  let clear = true; for (let s = 2; s <= 10 && clear; s += 1) { const a = kind === 'tree' ? 0.7 : it.yaw + Math.PI/2, x = it.x - Math.sin(a)*s, z = it.z - Math.cos(a)*s; knockNear(x, z, 1.5, o => { if (o !== it) clear = false; }); staticNear(x, z, 2, () => { clear = false; }); }
  if (clear && (!best || d < best.d)) best = { it, d }; } return best && best.it; };
// a lone tree at 15 m/s
{ const it = pick('tree'); out.tree = !!it; if (it) { aimAt(it, 7, 15); const v0 = 15; let t = 0; step(20); out.treeFell = it.fall; out.treeSpeedKept = +(Math.hypot(car.vx, car.vz)/v0).toFixed(2); step(120); out.treeTh = +it.th.toFixed(2); out.treeDone = !KNOCK.falling.includes(it);
    const P = it.ranges[0][0].geometry.attributes.position.array; let maxY = -1e9; for (const [m, i0, n] of it.ranges) { const a = m.geometry.attributes.position.array; for (let i = i0; i < i0 + n; i++) maxY = Math.max(maxY, a[i*3 + 1]); } out.treeTopAboveFoot = +(maxY - it.py).toFixed(2);
    car.vx = car.vz = 0; car.x = RI.x = it.x - it.dx*5; car.z = RI.z = it.z - it.dz*5; step(2); LH_FAR.k = 1; await view('knock_tree', it.x + it.dx*3, it.py + 0.5, it.z + it.dz*3, it.x + it.dx*3 - it.dz*8, it.py + 16, it.z + it.dz*3 + it.dx*8); } }
// a fence section at 12 m/s
{ const it = pick('fence') || pick('hedge'); out.fence = it && it.kind; if (it) { aimAt(it, 6, 12); step(40); out.fenceFell = it.fall; out.fenceTh = +it.th.toFixed(2); out.fenceSpeedKept = +(Math.hypot(car.vx, car.vz)/12).toFixed(2);
    car.vx = car.vz = 0; step(30); LH_FAR.k = 1; await view('knock_fence', it.x, it.py + 0.5, it.z, it.x + Math.sin(it.yaw + 0.9)*9, it.py + 5, it.z + Math.cos(it.yaw + 0.9)*9); } }
// slowly into a tree: it stands
{ const it = pick('tree'); if (it) { aimAt(it, 3.5, 2); step(90); out.slowStands = !it.fall; out.slowPushedOut = !boxPush(playerBox(), it.x, it.z, 0.25); } }
startRace(false); step(10); out.afterR = { down: KNOCK.down.length, falling: KNOCK.falling.length };
return out;
