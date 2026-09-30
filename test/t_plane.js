// the plane: sits on its wheels, takes off along Ylästöntie, climbs, turns, stalls without blowing up, crashes into the ground
startRace(false); step(30); const P = PLANE, out = { home: P.home && { x: Math.round(P.home.x), z: Math.round(P.home.z), runway: P.home.runway } }; if (!P.home) return out;
const snap = async (n) => { RR(scene, camera); await __save('s3_' + n + '.png', renderer.domElement.toDataURL('image/png')); };
const agl = () => +(P.p.y - 1.05 - Y(P.p.x, P.p.z)).toFixed(2), att = () => { const F = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q), L = new THREE.Vector3(1, 0, 0).applyQuaternion(P.q); return { pitch: +(Math.asin(F.y)*57.3).toFixed(1), bank: +(Math.asin(-L.y)*57.3).toFixed(1), hd: +(Math.atan2(F.x, F.z)*57.3).toFixed(0) }; };
// walk up to it and get in with F
car.x = RI.x = P.p.x - Math.cos(P.home.angle)*4; car.z = RI.z = P.p.z + Math.sin(P.home.angle)*4; car.angle = RI.a = P.home.angle; car.vx = car.vz = 0; step(5); walkOut(); step(3); out.walkD = +Math.hypot(WALK.h.x - P.p.x, WALK.h.z - P.p.z).toFixed(1); dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyF' })); dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyF' })); step(60);
out.inPlane = P.on; out.parked = { agl: agl(), ...att(), v: +P.v.length().toFixed(2) };
for (let i = 0; i < 60; i++) step(1); await snap('plane_park');
// onto the runway start, full throttle, rotate at 85 km/h
const [sx, sz] = P.home.runway.s, [ex, ez] = P.home.runway.e, ang = Math.atan2(ex - sx, ez - sz); planeInit({ x: sx + Math.sin(ang)*5, z: sz + Math.cos(ang)*5, angle: ang }); step(30);
const x0 = P.p.x, z0 = P.p.z; keys.KeyW = true; let lift = null, t = 0, maxV = 0;
step(60*25, () => { t += 1/60; const V = P.v.length(); maxV = Math.max(maxV, V); keys.ArrowDown = V > 23.5; if (!lift && P.air) lift = { t: +t.toFixed(1), d: Math.round(Math.hypot(P.p.x - x0, P.p.z - z0)), kmh: Math.round(V*3.6) }; if (lift && t > lift.t + 2) { keys.ArrowDown = att().pitch < 8; } if (P.crashed) return false; });
out.takeoff = lift; out.after25s = { agl: agl(), kmh: Math.round(P.v.length()*3.6), ...att(), crashed: P.crashed }; await snap('plane_climb');
keys.ArrowDown = false; keys.ArrowRight = true; step(50); keys.ArrowRight = false; const hd0 = att().hd; step(60*6, () => { keys.ArrowDown = att().pitch < 3; if (P.crashed) return false; }); keys.ArrowDown = false;
out.turn = { bankAfterRoll: null, ...att(), hdChange: att().hd - hd0, agl: agl(), kmh: Math.round(P.v.length()*3.6) }; await snap('plane_turn');
keys.ArrowLeft = true; step(40); keys.ArrowLeft = false; step(120); out.levelled = att();
keys.KeyW = false; keys.KeyS = true; keys.ArrowDown = true; step(60*8, () => { if (P.crashed) return false; }); keys.KeyS = false; keys.ArrowDown = false; out.stall = { agl: agl(), kmh: Math.round(P.v.length()*3.6), ...att(), crashed: P.crashed, nan: !isFinite(P.p.x + P.v.x + P.q.w) };
keys.ArrowUp = true; keys.KeyW = true; step(60*30, () => !P.crashed); keys.ArrowUp = false; keys.KeyW = false; out.crash = { crashed: P.crashed, t: 0 };
dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyR' })); dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyR' })); step(30); out.afterR = { on: P.on, crashed: P.crashed, dHome: +Math.hypot(P.p.x - P.home.x, P.p.z - P.home.z).toFixed(1), used: P.used };
return out;
