// lehti photos 30.9.: the speed camera flashing, a sausage to the window, the dog on the car, grandma on the zebra, birds, the sauna gang shouting
startRace(false); step(30); lapStarted = true; const uc = updateCar; let V = [0, 0];
const drive = (vx, vz) => { V = [vx, vz]; updateCar = (dt) => { car.vx = V[0]; car.vz = V[1]; car.speed = Math.hypot(V[0], V[1]); car.x += V[0]*dt; car.z += V[1]*dt; }; };
const at = (x, z, a) => { car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; car.vx = car.vz = 0; carGroup.position.set(x, Y(x, z), z); carGroup.rotation.set(0, a, 0); };
await TRY('pelti', async () => { const C = CAMS[0], a = trackPoints[C.i], b = trackPoints[(C.i + 3) % n], ang = Math.atan2(b.x - a.x, b.y - a.y); at(a.x - Math.sin(ang)*30, a.y - Math.cos(ang)*30, ang); drive(Math.sin(ang)*30, Math.cos(ang)*30);
  step(200, () => { if (C.t > 0.2) return false; }); drive(0, 0); LH_FAR.k = 1; C.t = 0.25; C.fl.visible = true; C.fl.material.opacity = 1; const tx = C.x*0.7 + car.x*0.3, tz = C.z*0.7 + car.z*0.3; await view('pelti', tx, Y(tx, tz) + 2, tz, tx + Math.sin(ang)*9 + Math.cos(ang)*6, Y(tx, tz) + 4.5, tz + Math.cos(ang)*9 - Math.sin(ang)*6); LH_FAR.k = 1.9; });
await TRY('makkara', async () => { startRace(false); step(20); lapStarted = true; drive(0, 0); const Ct = MAKKARA.carts.find(c => !c.G.userData.hide), [x, z] = lloc(Ct.x, Ct.z, Ct.yaw, 0, 4.5); at(x, z, Ct.yaw + Math.PI/2);
  step(60*2.8); LH_FAR.k = 1; await around('makkara', (x + Ct.x)/2, (z + Ct.z)/2, 7, 4.5, Ct.yaw + 0.9, 0.9); LH_FAR.k = 1.9; });
await TRY('koira', async () => { startRace(false); step(20); lapStarted = true; drive(0, 0); const d = HUMANS.find(h => h.task && h.task.kind === 'yarddog'); at(d.x + 7, d.z, 0); step(60*5); out.dogIn = !!DOGRIDE.D;
  LH_FAR.k = 1; await around('koira', car.x, car.z, 5.5, 3.2, car.angle + 2.4, 1.0); LH_FAR.k = 1.9; });
await TRY('mummo', async () => { startRace(false); step(20); lapStarted = true; drive(0, 0); const M = MUMMO, p = trackPoints[(M.i - 4 + n) % n], q = trackPoints[M.i], ang = Math.atan2(q.x - p.x, q.y - p.y); at(p.x, p.y, ang);
  step(60*12, () => { if (M.h.st && M.h.st.m === 'cross' && Math.hypot(M.h.x - M.A[0], M.h.z - M.A[1]) > 2.5) return false; }); const tx = (M.A[0] + M.B[0])/2, tz = (M.A[1] + M.B[1])/2;
  LH_FAR.k = 1; await view('mummo', tx, Y(tx, tz) + 0.8, tz, tx - Math.sin(ang)*13 + Math.cos(ang)*6, Y(tx, tz) + 6, tz - Math.cos(ang)*13 - Math.sin(ang)*6); LH_FAR.k = 1.9; });
await TRY('linnut', async () => { startRace(false); step(20); lapStarted = true; let best = null; for (let i = 0; i < n; i += 9) { const p = route(i); const t = treeCount(p.x, p.y, 40); if (!best || t > best.t) best = { i, t }; }
  const p = route(best.i), q = route(best.i + 6), ang = Math.atan2(q.x - p.x, q.y - p.y); at(p.x, p.y, ang); drive(Math.sin(ang)*25, Math.cos(ang)*25); BIRDS.t = 0; step(60*1.6); drive(0, 0);
  const L = BIRDS.list.filter(b => b.live); out.birds = L.length; const bx = L.reduce((s, b) => s + b.x, 0)/L.length, by = L.reduce((s, b) => s + b.y, 0)/L.length, bz = L.reduce((s, b) => s + b.z, 0)/L.length;
  LH_FAR.k = 1; await view('linnut', bx, by - 2, bz, car.x - Math.sin(ang)*6, Y(car.x, car.z) + 5, car.z - Math.cos(ang)*6); LH_FAR.k = 1.9; });
await TRY('saunojat', async () => { startRace(false); step(20); lapStarted = true; const sh = HUMANS.filter(h => h.task && h.task.kind === 'sauna'), R0 = roadInfo(sh[0].x, sh[0].z), p = route(R0.idx - 25), ang = Math.atan2(route(R0.idx).x - p.x, route(R0.idx).y - p.y);
  at(p.x, p.y, ang); drive(Math.sin(ang)*20, Math.cos(ang)*20); step(60*3.5); drive(0, 0); step(60*2.5);
  const S = sh.filter(h => h.st && h.st.m === 'shout'); out.shout = S.length; const tx = S.length ? S.reduce((s, h) => s + h.x, 0)/S.length : sh[0].x, tz = S.length ? S.reduce((s, h) => s + h.z, 0)/S.length : sh[0].z;
  LH_FAR.k = 1; await around('saunojat', tx, tz, 8, 4.5, Math.atan2(car.x - tx, car.z - tz) + 0.5, 1.0); LH_FAR.k = 1.9; });
updateCar = uc; return out;
