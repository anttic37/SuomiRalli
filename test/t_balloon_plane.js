// the plane and the hot-air balloons: a fast hit tears the envelope (the balloon comes down, the plane flies on slowed), a slow nudge bumps
// off, the basket at speed breaks the plane; momentum: plane Δv × 650 ≈ balloon Δv × 3500
startRace(false); step(20); const P = PLANE, out = {}; planeEnter(true); const B = BALLOONS[0];
const setup = (y, V, back) => { const ang = 0.7, fx = Math.sin(ang), fz = Math.cos(ang); planeInit({ x: B.x - fx*back, z: B.z - fz*back, angle: ang }); P.p.y = y; P.v.set(fx*V, 0, fz*V); P.air = true; P.airT = 1; P.thr = 0.6; P.upFree = true; return [fx, fz]; };
const snap = () => ({ mode: B.mode, torn: !!B.torn, kmh: Math.round(P.v.length()*3.6), crashed: P.crashed, bcv: +B.cv.length().toFixed(2), spin: +P.w.length().toFixed(2), sw: +Math.hypot(B.sw.xw, B.sw.zw).toFixed(3) });
// A: 145 km/h into the envelope's middle
setup(B.y + PB_ENV[2], 40, 40); const v0 = P.v.length(); let shotDone = false; out.before = snap();
for (let i = 0; i < 180; i++) { step(1); if (B.torn && !shotDone) { shotDone = true; out.atTear = { ...snap(), momentumRatio: +((v0 - P.v.length())*650/(B.cv.length()*3500)).toFixed(2) }; const d = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q); camera.position.set(P.p.x - d.x*18 + 12, P.p.y + 5, P.p.z - d.z*18 - 8); camera.lookAt(B.x, B.y + 9, B.z); camera.fov = 60; camera.updateProjectionMatrix(); RR(scene, camera); await __save('s3_bp_tear.png', renderer.domElement.toDataURL('image/png')); } }
out.A = { ...snap(), dvPlane: +(v0 - P.v.length()).toFixed(2) };
step(60*8); out.A.later = { mode: B.mode, planeCrashed: P.crashed };
// B: a slow nudge (4 m/s) against the other balloon's envelope
const B2 = BALLOONS[1]; { const ang = 0.2; planeInit({ x: B2.x - Math.sin(ang)*7.2, z: B2.z - Math.cos(ang)*7.2, angle: ang }); P.p.y = B2.y + PB_ENV[2]; P.v.set(Math.sin(ang)*4, 0, Math.cos(ang)*4); P.air = true; P.airT = 1; P.thr = 0; }
const b0 = B2.cv.length(); for (let i = 0; i < 60; i++) step(1); out.B = { torn: !!B2.torn, mode: B2.mode, cvGain: +(B2.cv.length() - b0).toFixed(3), kmh: Math.round(P.v.length()*3.6), crashed: P.crashed, sw: +Math.hypot(B2.sw.xw, B2.sw.zw).toFixed(3) };
// C: into the basket of B2 at 130 km/h
{ const ang = -0.4; planeInit({ x: B2.x - Math.sin(ang)*30, z: B2.z - Math.cos(ang)*30, angle: ang }); P.p.y = B2.y + 1.2; P.v.set(Math.sin(ang)*36, 0, Math.cos(ang)*36); P.air = true; P.airT = 1; P.thr = 0.5; P.crashed = false; }
const c0 = B2.cv.clone(); for (let i = 0; i < 120 && !P.crashed; i++) step(1); out.C = { crashed: P.crashed, basketDv: +B2.cv.clone().sub(c0).length().toFixed(2), torn: !!B2.torn, mode: B2.mode, swing: +Math.hypot(B2.sw.xw, B2.sw.zw).toFixed(3) };
step(60*4); out.C.later = { swingAngle: +Math.hypot(B2.sw.x, B2.sw.z).toFixed(3), mode: B2.mode };
// D: taxiing into a landed basket (A's, moved onto the open runway for the test): slowly it stops the plane, fast it breaks it
const taxi = (V) => { planeInit(PLANE.home); const a = PLANE.home.angle; B.x = P.p.x + Math.sin(a)*12; B.z = P.p.z + Math.cos(a)*12; B.y = Y(B.x, B.z); P.v.set(Math.sin(a)*V, 0, Math.cos(a)*V); P.thr = 0; let i = 0, minD = 99; for (; i < 240 && !P.crashed; i++) { step(1); minD = Math.min(minD, Math.hypot(P.p.x - B.x, P.p.z - B.z)); } return { crashed: P.crashed, kmh: Math.round(P.v.length()*3.6), minD: +minD.toFixed(2) }; };
out.D = { mode: B.mode, slow: taxi(3), fast: taxi(14) };
return out;
