// lehti photos 30.9.: the hitchhiker, a wanted poster, the moped boys' chase, the UFO taking a moose, the radio's village rumour
startRace(false); step(60*1.2); lapStarted = true;
await TRY('liftari', async () => { const S = HITCH.spot, h = HITCH.h, a = Math.atan2(S.ux, S.uz); car.x = S.x - S.uz*4.2 - S.ux*3; car.z = S.z + S.ux*4.2 - S.uz*3; car.angle = a; car.vx = car.vz = car.speed = 0; carGroup.position.set(car.x, Y(car.x, car.z), car.z); carGroup.rotation.set(0, a, 0);
  hold(20); h.pose.armR = -1.45; await around('liftari', (S.x*2 + car.x)/3, (S.z*2 + car.z)/3, 6, 3.2, S.yaw + 0.35, 1.1); });
await TRY('juliste', async () => { RAP.list = { fires: [{ name: 'Mane', n: 14 }, { name: 'Pate', n: 6 }], people: [{ name: 'Pate', n: 41 }, { name: 'Mane', n: 12 }], animals: [], kind: [], drivers: 20, total: { f: 30, p: 80, a: 3, h: 2 } }; posterRefresh();
  let best = null; out.poles = POSTERS.at.length; for (const [x, z, nx, nz] of POSTERS.at) { const cx = x - nx*4, cz = z - nz*4; if (treeNear(cx, cz, 2.5) || treeNear(x - nx*1.5, z - nz*1.5, 1.5)) continue; const t = treeCount(x, z, 25); if (!best || t < best.t) best = { x, z, nx, nz, t }; }
  put(0, 0); car.x = best.x - best.nx*40; car.z = best.z - best.nz*40; hold(5); LH_FAR.k = 1.25; await view('juliste', best.x - best.nx*0.15, Y(best.x, best.z) + 2.0, best.z - best.nz*0.15, best.x - best.nx*3.2 + best.nz*1.4, Y(best.x, best.z) + 2.5, best.z - best.nz*3.2 - best.nx*1.4); LH_FAR.k = 1.9; });
await TRY('mopot', async () => { startRace(false); step(30); lapStarted = true; const H = HUMANS.filter(q => q.mS); const S = H[0].mS, M = H[0].mM, uc = updateCar; let sp = Math.max(0, (S.s || S.s0) - 25);
  updateCar = (dt) => { sp = Math.min(M.L.total - 1, sp + 17*dt); const [x, z, yw] = M.L.at(sp); car.vx = (x - car.x)/dt; car.vz = (z - car.z)/dt; car.x = x; car.z = z; car.angle = yw; car.speed = 17; };
  { const [x, z, yw] = M.L.at(sp); car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = yw; }
  let shotAt = null; step(60*6, () => { FLOW.on = true; const C = H.filter(q => q.mS.chase && !q.mS.chase.back); if (C.length >= 2 && C[0].mS.chase.t > 1.6 && !shotAt) { shotAt = true; return false; } });
  updateCar = uc; const L = H.filter(q => q.mS.chase).sort((a, b) => Math.hypot(a.mS.px - car.x, a.mS.pz - car.z) - Math.hypot(b.mS.px - car.x, b.mS.pz - car.z))[0], tx = L ? (car.x*0.3 + L.mS.px*0.7) : car.x, tz = L ? (car.z*0.3 + L.mS.pz*0.7) : car.z; out.mopoChase = H.filter(q => q.mS.chase).length; out.gap = L && Math.round(Math.hypot(L.mS.px - car.x, L.mS.pz - car.z));
  await around('mopot', tx, tz, 11, 5, L ? Math.atan2(L.mS.px - car.x, L.mS.pz - car.z) + 0.3 : 0, 0.8); FLOW.on = false; });
await TRY('ufo_hirvi', async () => { startRace(false); step(30); lapStarted = true; const m = HUMANS.find(q => q.task && q.task.kind === 'moose'); const a = 0.8; put(0, 0); car.x = m.x - Math.sin(a)*120; car.z = m.z - Math.cos(a)*120; car.angle = a; ABD.next = worldT;
  step(60*6.4, () => { car.vx = car.vz = 0; }); const x = ABD.x, z = ABD.z, gy = ABD.gy; out.ufoState = ABD.st; LH_FAR.k = 1; await view('ufo_hirvi', x, gy + 8, z, x + 30, gy + 12, z + 26); LH_FAR.k = 1.9; });
return out;
