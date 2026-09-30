// the dragster's feel: numbers for the driver's inputs — lane change, full lock circle, a tap at 300, braking, grass, parking speed, reverse
startRace(false); step(60); lapStarted = true; const r2 = (x) => Math.round(x*100)/100;
DRAG.on = true; DRAG.carMesh.visible = true; DRAG.hidden = carGroup.children.filter(c => c !== DRAG.carMesh && c.visible); DRAG.hidden.forEach(c => c.visible = false);
const place = (back, v) => { const n = trackPoints.length, g = gridIndex(), i = (g - back + n) % n, a = trackPoints[i], b = trackPoints[(i + 3) % n]; car.x = RI.x = a.x; car.z = RI.z = a.y; car.angle = RI.a = Math.atan2(b.x - a.x, b.y - a.y); DP.ok = false; dragInit(car.x, car.z, car.angle); step(40);
  if (v) { DP.v.set(Math.sin(car.angle)*v, 0, Math.cos(car.angle)*v); } };
const K = (o) => { for (const k of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space']) keys[k] = !!o[k]; };
const up = () => new THREE.Vector3(0, 1, 0).applyQuaternion(DP.q).y, vel = () => DP.v.length(), slip = () => { const f = new THREE.Vector3(0, 0, 1).applyQuaternion(DP.q); return Math.abs(Math.atan2(f.x*DP.v.z - f.z*DP.v.x, f.x*DP.v.x + f.z*DP.v.z))*57.3; };
const run = (frames, keysAt) => { let m = { maxYawRate: 0, maxSlipDeg: 0, minUp: 1, maxLatG: 0 }; let pv = DP.v.clone(), i = 0;
  step(frames, () => { K(keysAt(i++)); m.maxYawRate = Math.max(m.maxYawRate, Math.abs(DP.w.y)); if (vel() > 3) m.maxSlipDeg = Math.max(m.maxSlipDeg, slip()); m.minUp = Math.min(m.minUp, up());
    const a = DP.v.clone().sub(pv).multiplyScalar(60); pv.copy(DP.v); const f = new THREE.Vector3(0, 0, 1).applyQuaternion(DP.q); m.maxLatG = Math.max(m.maxLatG, Math.abs(a.x*f.z - a.z*f.x)/9.81); });
  K({}); for (const k in m) m[k] = r2(m[k]); m.v = r2(vel()*3.6); return m; };
const out = {};
place(40, 100/3.6); out.laneChange100 = run(90, i => i < 25 ? { ArrowUp: 1, ArrowLeft: 1 } : i < 50 ? { ArrowUp: 1, ArrowRight: 1 } : { ArrowUp: 0 });
place(40, 50/3.6); { const a0 = car.angle, p0 = [car.x, car.z]; let pts = []; out.fullLock50 = run(150, i => { if (i % 10 === 0) pts.push([car.x, car.z]); return { ArrowLeft: 1, ArrowUp: vel() < 50/3.6 ? 1 : 0 }; });
  let cx = 0, cz = 0; pts.forEach(p => { cx += p[0]; cz += p[1]; }); cx /= pts.length; cz /= pts.length; out.fullLock50.radius = r2(vel()/Math.max(0.01, Math.abs(DP.w.y))); }
place(40, 10/3.6); { let pts = []; out.fullLock10 = run(240, i => { if (i % 10 === 0) pts.push([car.x, car.z]); return { ArrowLeft: 1, ArrowUp: vel() < 10/3.6 ? 1 : 0 }; });
  let cx = 0, cz = 0; pts.forEach(p => { cx += p[0]; cz += p[1]; }); cx /= pts.length; cz /= pts.length; out.fullLock10.radius = r2(vel()/Math.max(0.01, Math.abs(DP.w.y))); }
place(40, 300/3.6); out.tap300 = run(60, i => i < 6 ? { ArrowUp: 1, ArrowLeft: 1 } : { ArrowUp: 1 });
place(40, 200/3.6); { const x0 = car.x, z0 = car.z; out.brake200 = run(420, i => ({ ArrowDown: vel() > 0.6 ? 1 : 0 })); out.brake200.dist = r2(Math.hypot(car.x - x0, car.z - z0)); }
place(40, 0); out.powerTurn = run(120, i => ({ ArrowUp: 1, ArrowLeft: 1 }));
place(40, 0); { const x0 = car.x, z0 = car.z; out.reverse = run(180, i => ({ ArrowDown: 1 })); out.reverse.dist = r2(Math.hypot(car.x - x0, car.z - z0)); }
place(40, 60/3.6); out.handbrake60 = run(90, i => i < 30 ? { Space: 1, ArrowLeft: 1 } : {});
// grass: well off the road, 60 km/h and a turn
{ const n = trackPoints.length, g = gridIndex(), i = (g - 300 + n) % n, p = trackPoints[i], nm = getNormal(i); let x = p.x + nm.x*25, z = p.y + nm.y*25; car.x = RI.x = x; car.z = RI.z = z; DP.ok = false; dragInit(x, z, car.angle); step(30); DP.v.set(Math.sin(car.angle)*17, 0, Math.cos(car.angle)*17);
  out.grass = run(90, i => ({ ArrowUp: 1, ArrowLeft: i > 30 ? 1 : 0 })); out.grass.onTrack = car.onTrack; }
return out;
