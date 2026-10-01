// one ground question (groundAt) for every wheel: a village street, the sand pitch, a countryside gravel road, a field out there;
// the dragster asks it too — on a countryside road it's gravel now, not grass
setTimeOfDay('paiva'); startRace(false); step(10); const out = {};
const q = (x, z) => { const G = groundAt(x, z); return G.on + ':' + G.surf; };
out.start = q(car.x, car.z);
let road = null; roadsEnsure(700, 0); for (const E of RD.edges.values()) { if (!E.pts) continue; const p = E.pts.find(p => !inBase(p.x, p.z, 30)); if (p) { road = p; break; } }
out.outerRoad = road ? q(road.x, road.z) : 'none'; out.outerField = road ? q(road.x + 25, road.z + 25) : 'none';
const F = FIELD_GAMES[0]; out.pitch = F ? q(F.lx, F.lz) : 'none'; out.grass = q(car.x + 40, car.z + 40);
if (road) { lapStarted = true; dragSwap(true); step(10); out.inDrag = DRAG.on; car.x = RI.x = road.x; car.z = RI.z = road.z; car.vx = car.vz = 0; DP.ok = false; dragInit(car.x, car.z, 0); step(30); out.dragOuter = car.onTrack + ':' + car.surface + ':' + q(car.x, car.z); }
return out;
