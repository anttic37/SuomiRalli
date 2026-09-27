// FREE (GTA) mode: up the right lane at the start → the track goes (kerbs, tyres, gates, start/finish), no clock; drive the village's
// streets end to end on the road graph (no tyre wall or gate in the way); R brings the track back. The left lane still starts the race.
initAudio = () => {}; renderer.render = () => {}; const RR = () => {};
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
const drive = (tx, tz, vmax) => { let dA = Math.atan2(tx - car.x, tz - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI;
  keys.ArrowLeft = dA > 0.05; keys.ArrowRight = dA < -0.05; const v = Math.hypot(car.vx, car.vz), vm = Math.abs(dA) > 0.5 ? Math.min(vmax, 7) : vmax; keys.ArrowUp = v < vm; keys.ArrowDown = v > vm + 3; };
const out = {};
// 1. the left lane: the race as before
startRace(false); step(60*3.2); { const S = START_SPLIT; step(60*20, () => { drive(S.x + S.lx*S.hw*0.5 + S.dx*10, S.z + S.lz*S.hw*0.5 + S.dz*10, 12); if (S.done) return false; }); }
out.left = { free: FREE.on, split: START_SPLIT.done }; step(60*8, () => { drive(trackPoints[(car.prog + 8) % trackPoints.length].x, trackPoints[(car.prog + 8) % trackPoints.length].y, 14); }); out.left.lapStarted = lapStarted;
// 2. the right lane: FREE
const tiresOn = () => tires.filter(t => t.kind === 'tire' && !t.off).length, curbsOn = () => trackMeshGroup.children.filter(m => m.userData.key === 'curb' && m.visible).length;
out.before = { tires: tiresOn(), curbs: curbsOn() };
startRace(false); step(60*3.2); { const S = START_SPLIT; step(60*20, () => { drive(S.x - S.lx*S.hw*0.5 + S.dx*10, S.z - S.lz*S.hw*0.5 + S.dz*10, 12); if (S.done) return false; }); }
out.right = { free: FREE.on, tires: tiresOn(), curbs: curbsOn(), finish: finishMesh.visible, hud: document.getElementById('timer').textContent };
// 3. the streets: to the far ends of the road graph and back, following the shortest road path
const G = roadGraph(), nearest = (x, z) => { let b = 0, bd = 1e18; G.nodes.forEach((q, i) => { const d = (q.x - x)**2 + (q.z - z)**2; if (d < bd) { bd = d; b = i; } }); return b; };
const legs = [], stuckAt = []; let stuckTotal = 0;
for (let leg = 0; leg < 4; leg++) { const src = nearest(car.x, car.z), { dist, prev } = rgDijkstra(src); let tgt = -1, far = 0; dist.forEach((d, i) => { if (isFinite(d) && d > far && d < 900 && (leg % 2 ? G.nodes[i].x < car.x : G.nodes[i].x > car.x)) { far = d; tgt = i; } }); if (tgt < 0) break;
  const path = []; for (let i = tgt; i >= 0; i = prev[i]) path.push(G.nodes[i]); path.reverse(); let k = 0, t = 0, still = 0, maxStill = 0;
  step(60*150, () => { while (k < path.length - 1 && Math.hypot(path[k].x - car.x, path[k].z - car.z) < 9) k++; drive(path[k].x, path[k].z, 13); t += 1/60;
    if (Math.hypot(car.vx, car.vz) < 1) { still += 1/60; maxStill = Math.max(maxStill, still); if (still > 6) { const blk = []; staticNear(car.x, car.z, 6, B => blk.push(B.kind + '@' + Math.round(Math.hypot(B.x - car.x, B.z - car.z)))); VEHICLES.forEach(v => { if (Math.hypot(v.x - car.x, v.z - car.z) < 8) blk.push(v.kind + '@' + Math.round(Math.hypot(v.x - car.x, v.z - car.z))); }); forStaticNear(car.x, car.z, t => { if (!t.off && Math.hypot(t.x - car.x, t.z - car.z) < 5) blk.push(t.kind); }); stuckAt.push({ at: [Math.round(car.x), Math.round(car.z)], blk: blk.slice(0, 6).join(','), rock: ROCK_HILLS.length && rockNear(car.x, car.z, 2) ? 1 : 0, road: onRoad(car.x, car.z, 0.4) }); car.x = path[Math.min(k + 2, path.length - 1)].x; car.z = path[Math.min(k + 2, path.length - 1)].z; stuckTotal++; still = 0; } } else still = 0;
    if (k >= path.length - 1 && Math.hypot(path[k].x - car.x, path[k].z - car.z) < 10) return false; });
  legs.push({ road: Math.round(far), secs: Math.round(t), reached: k >= path.length - 1, maxStill: +maxStill.toFixed(1), to: [Math.round(path[path.length - 1].x), Math.round(path[path.length - 1].z)] }); }
out.streets = { legs, stuckAt, teleportsWhenStuck: stuckTotal, stillFree: FREE.on, lapStarted, raceTime };
// 4. R: the track back
startRace(false); step(10); out.afterR = { free: FREE.on, tires: tiresOn(), curbs: curbsOn(), finish: finishMesh.visible };
return out;
