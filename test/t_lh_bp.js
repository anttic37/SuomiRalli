// paper photo: the plane an instant before it tears through a hot-air balloon (lhrun.sh: lh_common.inc + s3_shot.inc in front)
startRace(false); step(20); const P = PLANE, B = BALLOONS[0]; planeEnter(true);
const ang = 0.7, fx = Math.sin(ang), fz = Math.cos(ang); planeInit({ x: B.x - fx*40, z: B.z - fz*40, angle: ang }); P.p.y = B.y + PB_ENV[2] + 2; P.v.set(fx*40, 0, fz*40); P.air = true; P.airT = 1; P.thr = 0.6; P.upFree = true;
let i = 0; for (; i < 200; i++) { const d = Math.hypot(P.p.x - B.x, P.p.z - B.z); if (d < 13) break; step(1); }
LH_FAR.k = 1; await view('bp', (P.p.x + B.x)/2, P.p.y, (P.p.z + B.z)/2, P.p.x - fx*16 + fz*13, P.p.y + 5, P.p.z - fz*16 - fx*13);
for (let k = 0; k < 40; k++) step(1);
return { torn: B.torn, kmh: Math.round(P.v.length()*3.6), crashed: P.crashed, frames: i };
