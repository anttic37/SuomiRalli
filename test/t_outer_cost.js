// the endless world's cost and solidity: rebuild times of the streamed ground/forest/solids, the static grid's size and query cost,
// and the plane meets the outer forest and a korpikenttä's hut (the solids follow the plane, not the parked Pökö)
startRace(false); step(20); const out = {}, P = PLANE, ms = (f, k) => { const t0 = performance.now(); for (let i = 0; i < k; i++) f(i); return +((performance.now() - t0)/k).toFixed(2); };
out.groundCold = ms(i => outerGround(3000 + i*2000, 500), 3); out.ground = ms(i => outerGround(9000 + i*170, 500), 8); out.forest = ms(i => { forestClear(); outerForest(3000 + i*200, 500); }, 5); out.trees = forestCount().all; out.forestStep = ms(i => outerForest(3000 + 800 + i*40, 500), 10);
out.solids = ms(i => outerSolids(3000 + i*40, 500), 10); out.solidN = OUT.sb.length; out.staticList = STATIC_LIST.length; let cells = 0; STATIC.forEach(() => cells++); out.cells = cells;
out.query = +(ms(i => { let c = 0; staticNear(-200 + (i % 400), -200 + (i % 300), 3, () => c++); }, 20000)*1000).toFixed(2) + ' µs';
// plane taxiing at 15 m/s into Hukanaho's hut
const A = airfieldCell(0, 0); for (let i = 0; i < 3; i++) { camera.position.set(A.x, 50, A.z); outerUpdate(); } const hut = A.solid[0];
planeEnter(true); { const a = Math.atan2(hut.x - (hut.x - 40), 0); planeInit({ x: hut.x - 40, z: hut.z, angle: Math.PI/2 }); P.v.set(15, 0, 0); P.thr = 0; }
let i = 0; for (; i < 300 && !P.crashed; i++) step(1); out.hut = { crashed: P.crashed, t: +(i/60).toFixed(2), d: +Math.hypot(P.p.x - hut.x, P.p.z - hut.z).toFixed(1), solidsNear: OUT.sb.length };
// plane low and fast through the outer forest 4 km out
planeInit({ x: 4000, z: 2600, angle: 0 }); P.crashed = false; let y0 = 0; { let best = null; for (let z = 2600; z < 3400; z += 2) { let c = 0; outerTreesAt(Math.floor(4000/60), Math.floor(z/60), (tx, tz) => { if (Math.abs(tx - 4000) < 3 && Math.abs(tz - z) < 3) c++; }); if (c) { best = z; break; } } out.treeAhead = best; }
P.p.set(4000, H(4000, 2600) + 4, 2600); P.v.set(0, 0, 40); P.air = true; P.airT = 1; P.thr = 0.7; for (i = 0; i < 600 && !P.crashed; i++) { P.p.y = H(P.p.x, P.p.z) + 4; P.v.y = 0; step(1); }
out.forestFly = { crashed: P.crashed, z: Math.round(P.p.z) };
return out;
