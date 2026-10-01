// paper photo: Parko Markkinen and Mantti Anttila by a yard apple tree, taking a stand on the apple thefts
setTimeOfDay('paiva'); startRace(false); step(30); const res = {};
const cands = APPLES.list.filter(a => Math.hypot(a.x, a.z) < 330 && a.left === a.n);
let pick = null;
for (const A of cands) { for (const a of [0, 1.05, 2.1, 3.15, 4.2, 5.25]) { const px = A.x + Math.sin(a)*2.4, pz = A.z + Math.cos(a)*2.4, cx = A.x + Math.sin(a)*7.5, cz = A.z + Math.cos(a)*7.5;
    if (clearSpot(px + Math.cos(a)*1.2, pz - Math.sin(a)*1.2, 0.5) && clearSpot(px - Math.cos(a)*1.2, pz + Math.sin(a)*1.2, 0.5) && clearSpot(cx, cz, 1.5) && clearLine(A.x, A.z, cx, cz)) { pick = [A, a]; break; } } if (pick) break; }
const [A, a] = pick; res.tree = [Math.round(A.x), Math.round(A.z)]; car.x = A.x + 60; car.z = A.z + 60;
const lx = Math.cos(a), lz = -Math.sin(a), bx = A.x + Math.sin(a)*2.4, bz = A.z + Math.cos(a)*2.4, cx = A.x + Math.sin(a)*7.5, cz = A.z + Math.cos(a)*7.5;
const face = (x, z) => Math.atan2(cx - x, cz - z);
const Px = bx + lx*1.1, Pz = bz + lz*1.1, Mx = bx - lx*1.1, Mz = bz - lz*1.1;
const parko = new Human({ x: Px, z: Pz, yaw: face(Px, Pz) - 0.35, rig: makeAdult(0xeeeae0, 0x8fa2c4, 0x2a1a10, { sel: { hair: 2, top: 0, longSleeve: 1, longPants: 1, glasses: 1 } }), temp: true });
const mantti = new Human({ x: Mx, z: Mz, yaw: face(Mx, Mz) + 0.5, rig: makeAdult(0xe0502a, 0x8a7a50, 0xd8b36a, { sel: { hair: 0, top: 0, longSleeve: 1, longPants: 1, beard: 1 } }), temp: true });
for (const h of [parko, mantti]) { h.far = false; h.task = { kind: 'pose', update(q) { q.vx = q.vz = 0; } }; }
hold(20); parko.pose.armL = -2.6; parko.pose.armR = -1.2; mantti.pose.armR = -1.5; mantti.pose.armRz = -0.4; humanSync(parko); humanSync(mantti);
LH_FAR.k = 1; await view('omkanta', bx, Y(bx, bz) + 1.5, bz, cx, Y(cx, cz) + 2.3, cz);
return res;
