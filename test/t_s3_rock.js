// the rock: driven at from eight directions, no corner of the car gets into it (the car stops at its foot); the boulders are solid;
// a police car shoved at it stops too; people don't walk into it
startRace(false); step(60*3.5); const R = ROCK_HILLS[0], out = { hill: [Math.round(R.lx), Math.round(R.lz), Math.round(R.w), Math.round(R.d)], runs: [] };
const deepest = () => { const fx = Math.sin(car.angle), fz = Math.cos(car.angle); let m = -9; for (const [a, b] of CAR_ROCK_PTS) m = Math.max(m, rockSolidAt(car.x + fz*a + fx*b, car.z - fx*a + fz*b)); return m; };
for (let k = 0; k < 8; k++) { const a = k*Math.PI/4 + 0.2, sx = R.lx + Math.sin(a)*75, sz = R.lz + Math.cos(a)*75; startRace(false); step(60*3.3); car.x = sx; car.z = sz; car.angle = Math.atan2(R.lx - sx, R.lz - sz); car.vx = car.vz = 0; let maxIn = -9, hitV = 0;
  step(60*7, () => { keys.ArrowUp = true; car.angle = Math.atan2(R.lx - car.x, R.lz - car.z); maxIn = Math.max(maxIn, deepest()); hitV = Math.max(hitV, Math.hypot(car.vx, car.vz)); }); keys.ArrowUp = false;
  out.runs.push({ dir: k, stopAt: +Math.hypot(car.x - R.lx, car.z - R.lz).toFixed(1), maxIntoRock: +maxIn.toFixed(2), topKmh: Math.round(hitV*3.6), partsOff: carParts.filter(p => p.state === 'gone').length });
  if (k === 1) { const fx = Math.sin(car.angle), fz = Math.cos(car.angle); await shot('rock_stop', car.x, car.z, -fx*7 + fz*5, -fz*7 - fx*5, 3.2, 0.6); } }
// a boulder
{ const ok = (B) => { const dx = B.x - R.lx, dz = B.z - R.lz, l = Math.hypot(dx, dz); for (let d = 3; d <= 20; d += 1) { const x = B.x + dx/l*d, z = B.z + dz/l*d; let hit = rockSolidAt(x, z) > 0; staticNear(x, z, 3, S => { if (S !== B && boxPush(S, x, z, 1.2)) hit = true; }); if (hit || treeNear(x, z, 0.5)) return false; } return true; };
  const SB = STATIC_LIST.filter(b => b.kind === 'rock'), B = SB.filter(ok).sort((p, q) => q.hw - p.hw)[0] || SB[0], dx = B.x - R.lx, dz = B.z - R.lz, l = Math.hypot(dx, dz), tx = dx/l, tz = dz/l;   // from outside, straight in at it
  startRace(false); step(60*3.3); car.x = B.x + tx*20; car.z = B.z + tz*20; car.angle = Math.atan2(-tx, -tz); car.vx = car.vz = 0; let minD = 1e9; step(60*5, () => { keys.ArrowUp = true; car.angle = Math.atan2(B.x - car.x, B.z - car.z); minD = Math.min(minD, Math.hypot(car.x - B.x, car.z - B.z)); }); keys.ArrowUp = false;
  out.boulder = { size: +(B.hw*2).toFixed(2), closest: +minD.toFixed(2), stoppedAt: +Math.hypot(car.x - B.x, car.z - B.z).toFixed(2) }; }
// a police car pushed at it
{ const a = 2.6, sx = R.lx + Math.sin(a)*60, sz = R.lz + Math.cos(a)*60; car.x = R.lx + Math.sin(a + 1.2)*200; car.z = R.lz + Math.cos(a + 1.2)*200;
  const M = makePoliceCar(); lifeGroup.add(M.G); const v = new Vehicle({ kind: 'police', x: sx, z: sz, yaw: Math.atan2(R.lx - sx, R.lz - sz), hw: 0.88, hl: 2.4, view: { kind: 'mesh', g: M.G }, axle: [0.8, 1.4, -1.35], temp: true, ai: (vv) => { vv.ctrl.hand = false; vv.ctrl.steer = steerToward(vv, R.lx, R.lz); vv.ctrl.thr = 1; vv.ctrl.brk = 0; } });
  let maxIn = -9; for (let i = 0; i < 60*8; i++) { worldUpdate(1/60); vehiclesPhysics(1/60); const fx = Math.sin(v.yaw), fz = Math.cos(v.yaw); maxIn = Math.max(maxIn, rockSolidAt(v.x + fx*v.hl, v.z + fz*v.hl)); }
  out.police = { stopAt: +Math.hypot(v.x - R.lx, v.z - R.lz).toFixed(1), noseIntoRock: +maxIn.toFixed(2) }; vehicleRemove(v); }
// people walking at it
{ let maxIn = -9; const ppl = []; for (let k = 0; k < 6; k++) { const a = k*1.05, x = R.lx + Math.sin(a)*60, z = R.lz + Math.cos(a)*60; ppl.push(new Human({ x, z, rig: makeAdult(0xff0000, 0x222222, 0x111111), temp: true, task: { kind: 'test', update(h, dt) { walkTo(h, R.lx, R.lz, 1.5, dt); } } })); }
  for (let i = 0; i < 60*50; i++) { worldUpdate(1/60); for (const h of ppl) maxIn = Math.max(maxIn, rockSolidAt(h.x, h.z)); } out.people = { maxIntoRock: +maxIn.toFixed(2), closest: Math.round(Math.min(...ppl.map(h => Math.hypot(h.x - R.lx, h.z - R.lz)))) }; ppl.forEach(humanRemove); }
return out;
