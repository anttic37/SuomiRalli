// the countryside beyond the village: the nearest lake, bog, farm and village; the roads that join them (and the village's exits);
// build times; a car on a gravel road (grip), into a bog and a lake; the plane onto a lake; pictures of each
setTimeOfDay('paiva'); startRace(false); step(20); const out = {}, P = PLANE;
const look = async (n, tx, ty, tz, cx, cy, cz) => { camera.position.set(cx, cy, cz); for (let i = 0; i < 40; i++) { OUT.ctry = true; outerUpdate(); }   /* (the page's own loop ran during the last save: it streamed the world round the car) */ camera.lookAt(tx, ty, tz); camera.fov = 55; camera.updateProjectionMatrix(); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  dirLight.position.set(tx + SUN.x, ty + SUN.y, tz + SUN.z); dirLight.target.position.set(tx, ty, tz); dirLight.target.updateMatrixWorld(); RR(scene, camera); await __save('s3_' + n + '.png', renderer.domElement.toDataURL('image/png')); };
const settle = (x, z) => { camera.position.set(x, H(x, z) + 30, z); for (let i = 0; i < 60; i++) { OUT.ctry = true; outerUpdate(); } };
const kinds = {}; for (let r = 1; r < 9; r++) for (let i = -r; i <= r; i++) for (let j = -r; j <= r; j++) { const F = featCell(i, j); if (!F) continue; const d = Math.hypot(F.x, F.z); if (!kinds[F.kind] || d < kinds[F.kind].d) kinds[F.kind] = { F, d }; }
out.count = {}; for (let i = -8; i <= 8; i++) for (let j = -8; j <= 8; j++) { const F = featCell(i, j); if (F) out.count[F.kind] = (out.count[F.kind] || 0) + 1; }
out.nearest = Object.fromEntries(Object.entries(kinds).map(([k, v]) => [k, { d: Math.round(v.d), x: Math.round(v.F.x), z: Math.round(v.F.z), name: v.F.name || '' }]));
// build times
{ const F = kinds.village.F, t0 = performance.now(); const G = featBuild(F); out.tVillage = +(performance.now() - t0).toFixed(1); groupDrop(G); const t1 = performance.now(); const G2 = featBuild(kinds.farm.F); out.tFarm = +(performance.now() - t1).toFixed(1); groupDrop(G2); }
// the roads: how many edges round the origin, how many reach a place, the exits joined
roadsEnsure(0, 0); for (const k of Object.values(kinds)) roadsEnsure(k.F.x, k.F.z); let n = 0, live = 0, len = 0; for (const E of RD.edges.values()) { if (!E.pts) continue; n++; len += E.pts.length*10; } out.roads = { edges: n, km: +(len/1000).toFixed(1), exits: [...RD.edges.keys()].filter(k => k[0] === 'X').map(k => RD.edges.get(k).pts.length) };
// pictures
for (const [k, v] of Object.entries(kinds)) { const F = v.F; settle(F.x, F.z); const R = F.R || 120, y = H(F.x, F.z); await look('ct_' + k, F.x, y, F.z, F.x - F.fz*R*1.3 - F.fx*R*0.6, y + R*0.75, F.z + F.fx*R*1.3 - F.fz*R*0.6);
  if (k === 'lake') { const ap = F.yaw + 1.2, r = F.R*0.93*featWob(F, ap), x = F.x + Math.sin(ap)*(r + 4), z = F.z + Math.cos(ap)*(r + 4); await look('ct_lake_near', x, F.level + 1, z, x + Math.sin(ap + 0.9)*24, F.level + 7, z + Math.cos(ap + 0.9)*24); }
  if (k === 'village') { const [x, z] = featAt(F, F.L + 14, 5.5); await look('ct_sign', x, H(x, z) + 2, z, x + F.fx*12 + F.fz*4, H(x, z) + 3, z + F.fz*12 - F.fx*4); }
  if (k === 'village' || k === 'farm') { const [x, z] = featAt(F, k === 'farm' ? -8 : 20, k === 'farm' ? 14 : 0); await look('ct_' + k + '_near', x, H(x, z) + 2, z, x - F.fz*28 + F.fx*20, H(x, z) + 9, z + F.fx*28 + F.fz*20); } }
// the forest rebuild with the places and roads in it
{ const V = kinds.village.F; settle(V.x, V.z); const t0 = performance.now(); forestClear(); outerForest(V.x, V.z); out.tForest = +(performance.now() - t0).toFixed(1); out.trees = forestCount().all; }
// a car on the village street, full throttle along it for 6 s: gravel grip, stays on the road; then a hard left into the yard (a house stops it)
{ const V = kinds.village.F, [x, z] = featAt(V, -V.L + 5, 0); settle(x, z); car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = V.yaw; car.vx = car.vz = 0; car.speed = 0; step(3); keys.ArrowUp = true; let onRd = 0, f = 0;
  step(360, () => { camera.position.set(car.x, H(car.x, car.z) + 30, car.z); const [a] = featLoc(V, car.x, car.z); if (a > V.L - 5) return false; f++; if (car.outer && car.outer.road) onRd++; }); keys.ArrowUp = false; out.street = { kmh: Math.round(Math.hypot(car.vx, car.vz)*3.6), surface: car.surface, onRoad: +(onRd/f).toFixed(2), sb: OUT.sb.length }; }
// into a bog at 60 km/h coasting: stops much sooner than on grass
const coast = (x, z, a) => { car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; car.vx = Math.sin(a)*17; car.vz = Math.cos(a)*17; car.speed = 17; let i = 0; for (; i < 600; i++) { step(1); camera.position.set(car.x, H(car.x, car.z) + 30, car.z); if (Math.hypot(car.vx, car.vz) < 1) break; } return { s: +(i/60).toFixed(1), d: Math.round(Math.hypot(car.x - x, car.z - z)), outer: car.outer ? { bog: +car.outer.bog.toFixed(2), water: +car.outer.water.toFixed(2) } : null }; };
{ let gx = 0, gz = 0; for (let i = 1; i < 9; i++) { const F = featCell(i, 3); if (!F) { gx = i*FC + 300; gz = 3*FC + 300; break; } } settle(gx, gz); out.grass = coast(gx, gz, 0.3); }
{ const B = kinds.bog.F; settle(B.x, B.z); out.bog = coast(B.x - B.fx*B.R*0.5, B.z - B.fz*B.R*0.5, B.yaw); }
{ const L = kinds.lake.F, a = L.yaw + 2.5, r = L.R*1.25*featWob(L, a), x = L.x + Math.sin(a)*r, z = L.z + Math.cos(a)*r; settle(x, z); out.lake = coast(x, z, Math.atan2(L.x - x, L.z - z)); out.lake.depthMid = +(L.level - H(L.x, L.z)).toFixed(1); }
// the plane onto the lake: slow → floats, fast → flips
{ const L = kinds.lake.F; settle(L.x, L.z); planeEnter(true); const drop = (V) => { planeInit({ x: L.x - 30, z: L.z, angle: Math.PI/2 }); P.crashed = false; P.p.y = L.level + 1.4; P.v.set(V, -0.5, 0); P.air = true; P.airT = 1; P.thr = 0; let i = 0; for (; i < 180 && !P.crashed; i++) step(1); return { crashed: P.crashed, y: +(P.p.y - L.level).toFixed(2), kmh: Math.round(P.v.length()*3.6) }; };
  out.planeLake = { slow: drop(4), fast: drop(30) }; }
out.H = { lat: +(H(kinds.farm.F.x + 7, kinds.farm.F.z + 3)).toFixed(2), seam: (() => { let mj = 0, prev = H(560, 0); for (let x = 560.5; x < 700; x += 0.5) { const h = H(x, 0); mj = Math.max(mj, Math.abs(h - prev)); prev = h; } return +mj.toFixed(2); })() };
return out;
