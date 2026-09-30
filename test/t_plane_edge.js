// flying straight at the map's edge: it turns back by itself and stays inside
startRace(false); step(20); const P = PLANE; planeEnter(true); planeInit({ x: 0, z: 0, angle: -Math.PI/2 }); P.p.y = Y(0, 0) + 80; P.v.set(-40, 0, 0); P.thr = 0.6; P.air = true; P.airT = 1; step(2);
let minEdge = 1e9, maxAway = 0; step(60*60, () => { const e = Math.min(P.p.x + 580, 580 - P.p.x, P.p.z + 580, 580 - P.p.z); minEdge = Math.min(minEdge, e); if (P.crashed) return false; });
return { minEdge: Math.round(minEdge), crashed: P.crashed, agl: Math.round(P.p.y - Y(P.p.x, P.p.z)), x: Math.round(P.p.x), z: Math.round(P.p.z), nan: !isFinite(P.p.x) };
