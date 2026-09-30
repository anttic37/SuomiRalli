// the dragster's own rigid-body physics: settles on its springs, launches (wheelspin, wheelie bars), the chute, steering, follows the
// route on its wheels over the hills, a crash into a house (spin, parts off, no NaN), on its roof → fire + the driver thrown out
startRace(false); step(60); lapStarted = true; if (!DRAG.home) return { home: false }; const H = DRAG.home;
car.x = RI.x = H.x + Math.cos(H.angle)*4; car.z = RI.z = H.z - Math.sin(H.angle)*4; car.vx = car.vz = 0; step(20); walkOut(); const w = WALK.h; w.x = H.x + Math.cos(H.angle)*1.6; w.z = H.z - Math.sin(H.angle)*1.6; step(5);
const ev = (c) => { dispatchEvent(new KeyboardEvent('keydown', { code: c })); dispatchEvent(new KeyboardEvent('keyup', { code: c })); };
ev('KeyF'); step(120); out.inDrag = DRAG.on;
const up = () => new THREE.Vector3(0, 1, 0).applyQuaternion(DP.q), fwd = () => new THREE.Vector3(0, 0, 1).applyQuaternion(DP.q), r2 = (x) => Math.round(x*100)/100;
out.settle = { loads: DP.wh.map(s => Math.round(s.load)), sum: Math.round(DP.wh.reduce((a, s) => a + s.load, 0)), weight: Math.round(DP.m*9.81), upY: r2(up().y), hGround: r2(DP.p.y - Y(DP.p.x, DP.p.z)), v: r2(DP.v.length()) };
const toRoad = (back) => { const n = trackPoints.length, g = gridIndex(), i = (g - back + n) % n, a = trackPoints[i], b = trackPoints[(i + 3) % n]; car.x = RI.x = a.x; car.z = RI.z = a.y; car.angle = RI.a = Math.atan2(b.x - a.x, b.y - a.y); car.vx = car.vz = 0; DP.ok = false; dragInit(car.x, car.z, car.angle); step(60); return i; };
const enter = () => { if (WRECK.on || !DRAG.on) { startRace(false); step(30); lapStarted = true; dragSwap(true); step(10); } };
toRoad(40);
let t100 = null, t200 = null, vmax = 0, t = 0, pitch = 0, minUp = 1, spinMax = 0; keys.ArrowUp = true;
step(60*3, () => { t += 1/60; const v = Math.hypot(car.vx, car.vz)*3.6; vmax = Math.max(vmax, v); if (t100 === null && v >= 100) t100 = r2(t); if (t200 === null && v >= 200) t200 = r2(t); pitch = Math.max(pitch, fwd().y); minUp = Math.min(minUp, up().y); spinMax = Math.max(spinMax, DP.spin);
  if (t < 0.3 && !out.launchShot) { out.launchShot = 1; } });
keys.ArrowUp = false; out.launch = { t0_100: t100, t0_200: t200, vmaxKmh: Math.round(vmax), maxNoseUpDeg: r2(Math.asin(pitch)*57.3), minUpY: r2(minUp), spinMax: r2(spinMax), rpm: Math.round(DP.rpm) };
step(20); out.chute = DRAG.chute > 0; const v0 = Math.hypot(car.vx, car.vz); step(120); out.chuteDecel = r2((v0 - Math.hypot(car.vx, car.vz))/2/9.81);
out.launch.wreckAfter = WRECK.on; await view('dragphys_launch', car.x, Y(car.x, car.z) + 1, car.z, car.x - Math.sin(car.angle)*10 + Math.cos(car.angle)*4, Y(car.x, car.z) + 4, car.z - Math.cos(car.angle)*10 - Math.sin(car.angle)*4);
// the route on its wheels: an autopilot steering at a point 25 m ahead, up to 30 m/s
enter(); toRoad(200); let flips = 0, travelled = 0, lx = car.x, lz = car.z, air = 0, minUp2 = 1;
step(60*25, () => { const ri = roadInfo(car.x, car.z), n = trackPoints.length, p = trackPoints[(ri.idx + 18) % n], want = Math.atan2(p.x - car.x, p.y - car.z); let d = want - car.angle; while (d > Math.PI) d -= 2*Math.PI; while (d < -Math.PI) d += 2*Math.PI;
  const v = Math.hypot(car.vx, car.vz); keys.ArrowLeft = d > 0.04; keys.ArrowRight = d < -0.04; const tv = Math.max(7, 30 - Math.abs(d)*25); keys.ArrowUp = v < tv; keys.ArrowDown = v > tv + 5;
  const u = up().y; minUp2 = Math.min(minUp2, u); if (u < 0.3) flips++; if (!DP.wh.some(s => s.on)) air++; travelled += Math.hypot(car.x - lx, car.z - lz); lx = car.x; lz = car.z; });
for (const k of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']) keys[k] = false;
out.route = { m: Math.round(travelled), flipFrames: flips, airFrames: air, minUpY: r2(minUp2), wreck: WRECK.on, nan: !isFinite(DP.p.x + DP.q.w) };
await view('dragphys_route', car.x, Y(car.x, car.z) + 1, car.z, car.x - Math.sin(car.angle)*10 + Math.cos(car.angle)*4, Y(car.x, car.z) + 4, car.z - Math.cos(car.angle)*10 - Math.sin(car.angle)*4);
enter();
// a crash: 40 m/s square into the nearest house
{ let best = null; for (const B of STATIC_LIST) { if (B.kind !== 'house') continue; const d = Math.hypot(B.x - car.x, B.z - car.z); if (d > 30 && d < 150 && (!best || d < best.d)) best = { B, d }; }
  if (best) { const B = best.B, a = Math.atan2(B.x - car.x, B.z - car.z) + 0.25; const sx = B.x - Math.sin(a)*30, sz = B.z - Math.cos(a)*30; car.x = RI.x = sx; car.z = RI.z = sz; car.angle = RI.a = a; DP.ok = false; dragInit(sx, sz, a); step(30);
    DP.v.set(Math.sin(a)*40, 0, Math.cos(a)*40); let wMax = 0, hitMax = 0, nan = false; step(60*4, () => { wMax = Math.max(wMax, DP.w.length()); hitMax = Math.max(hitMax, DP.hit); if (!isFinite(DP.p.x + DP.v.x + DP.q.w)) nan = true; });
    out.crash = { wMax: r2(wMax), lost: Object.keys(DP.lost), fire: !!B.fire, nan, upY: r2(up().y), inHouse: !!boxPush(B, car.x, car.z, 0) };
    await view('dragphys_crash', car.x, Y(car.x, car.z) + 1, car.z, car.x - 9, Y(car.x, car.z) + 6, car.z - 9); } }
// on its roof: set it upside down just above the ground
enter(); toRoad(150); DP.q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI)); DP.p.y = Y(DP.p.x, DP.p.z) + 1.6; step(60*4);
out.roof = { wreck: WRECK.on, driverHidden: !DRAG.carMesh.userData.parts.driver.visible, driverOut: !!(WRECK.driver && WRECK.driver.down), upY: r2(up().y) };
await view('dragphys_roof', car.x, Y(car.x, car.z) + 1, car.z, car.x - 8, Y(car.x, car.z) + 5, car.z - 8);
startRace(false); step(30); out.afterR = { on: DRAG.on, wreck: WRECK.on, parts: DRAG.carMesh.userData.parts.wing.visible };
return out;
