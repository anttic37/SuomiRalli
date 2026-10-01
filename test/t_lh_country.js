// paper photos for the countryside (lhrun.sh: lh_common.inc + s3_shot.inc in front): a village street with its sign, a lake with the sauna
setTimeOfDay('paiva'); startRace(false); step(20); const res = {};
const near = (kind) => { let best = null; for (let r = 1; r < 9; r++) for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) { const F = featCell(i, j); if (F && F.kind === kind && (!best || Math.hypot(F.x, F.z) < Math.hypot(best.x, best.z))) best = F; } return best; };
const settle = (x, z) => { camera.position.set(x, H(x, z) + 20, z); for (let i = 0; i < 60; i++) { OUT.ctry = true; outerUpdate(); } };
{ const V = near('village'), [x, z] = featAt(V, V.L - 40, 0), y = H(x, z); settle(x, z); LH_FAR.k = 1.4; await view('kyla', x, y + 2, z, x + V.fx*45 + V.fz*22, y + 12, z + V.fz*45 - V.fx*22); res.v = V.name; }
{ const L = near('lake'), ap = L.yaw + 1.2, r = L.R*0.93*featWob(L, ap), x = L.x + Math.sin(ap)*(r - 6), z = L.z + Math.cos(ap)*(r - 6); settle(x, z); LH_FAR.k = 1.4; await view('jarvi', x, L.level + 1.5, z, x + Math.sin(ap + 1.0)*30, L.level + 10, z + Math.cos(ap + 1.0)*30); res.l = L.name; }
return res;
