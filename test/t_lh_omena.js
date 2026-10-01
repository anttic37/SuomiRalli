// paper photos: the apple thief at a yard apple tree, the owner running out after him
setTimeOfDay('paiva'); startRace(false); step(30); const res = {};
const cands = APPLES.list.filter(a => Math.hypot(a.x, a.z) < 320 && clearSpot(a.x + 1.2, a.z, 0.4) && clearLine(a.x, a.z, a.x + 9, a.z + 9));
const AT = cands[3] || cands[0]; res.tree = [Math.round(AT.x), Math.round(AT.z)];
car.x = AT.x + 7; car.z = AT.z + 7; car.vx = car.vz = car.speed = 0; step(2); walkOut(); const wh = WALK.h; wh.x = AT.x + 1.2; wh.z = AT.z; wh.vx = wh.vz = 0;
let k = 0; while (APPLES.bag < 2 && k < 600) { step(1); k++; } res.bag = APPLES.bag;
// the owner: let them get going, the thief running off toward the car
const OC = APPLES.chase[0]; res.owner = !!OC; for (let i = 0; i < 400 && OC && (OC.m !== 'run' || Math.hypot(OC.h.x - wh.x, OC.h.z - wh.z) > 2.8 || Math.hypot(AT.x - wh.x, AT.z - wh.z) < 4); i++) { const dx = car.x - wh.x, dz = car.z - wh.z, dd = Math.hypot(dx, dz) || 1; wh.yaw = Math.atan2(dx, dz); if (OC.m === 'run') { wh.x += dx/dd*0.1; wh.z += dz/dd*0.1; } step(1); }
res.gap = OC ? +Math.hypot(OC.h.x - wh.x, OC.h.z - wh.z).toFixed(1) : null; res.mode = OC && OC.m;
const mx = (wh.x + OC.h.x)/2, mz = (wh.z + OC.h.z)/2, run = Math.atan2(wh.x - OC.h.x, wh.z - OC.h.z); let ang = run + Math.PI/2;
for (const a of [run + Math.PI/2, run - Math.PI/2, run + 1.1, run - 1.1, run + 2.0, run - 2.0]) { const cx = mx + Math.sin(a)*8, cz = mz + Math.cos(a)*8; if (clearLine(mx, mz, cx, cz) && clearSpot(cx, cz, 2) && APPLES.list.every(t => Math.hypot(t.x - cx, t.z - cz) > 3)) { ang = a; break; } }
res.ang = +ang.toFixed(2); LH_FAR.k = 1.0; await view('omenavaras', mx, Y(mx, mz) + 1.1, mz, mx + Math.sin(ang)*8, Y(mx, mz) + 3.0, mz + Math.cos(ang)*8);
const B2 = cands.find(a => a !== AT && a.left === a.n && Math.hypot(a.x - wh.x, a.z - wh.z) > 40) || AT; car.x = B2.x + 50; car.z = B2.z + 50;
for (const a of [0.5, 2.1, 3.7, 5.2]) { const cx = B2.x + Math.sin(a)*5.5, cz = B2.z + Math.cos(a)*5.5; if (clearLine(B2.x, B2.z, cx, cz) && clearSpot(cx, cz, 1.5)) { await view('omenapuu', B2.x, Y(B2.x, B2.z) + 1.8, B2.z, cx, Y(cx, cz) + 2.4, cz); break; } }
return res;
