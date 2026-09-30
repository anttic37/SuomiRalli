// lehti photo: the plane just off Ylästöntie, climbing over the village
startRace(false); step(30); const P = PLANE; planeEnter(true); const [sx, sz] = P.home.runway.s, [ex, ez] = P.home.runway.e, ang = Math.atan2(ex - sx, ez - sz);
planeInit({ x: sx + Math.sin(ang)*5, z: sz + Math.cos(ang)*5, angle: ang }); step(20); keys.KeyW = true; let t = 0;
step(60*9.5, () => { t += 1/60; const V = P.v.length(); const F = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q); keys.ArrowDown = V > 23.5 && Math.asin(F.y) < 0.14; });
keys.ArrowDown = false; const F = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q), fx = F.x, fz = F.z, l = Math.hypot(fx, fz), gy = Y(P.p.x, P.p.z);
await shot('lh_plane', P.p.x, P.p.z, (-fx*14 + fz*16)/l, (-fz*14 - fx*16)/l, P.p.y - gy + 4, P.p.y - gy); return { agl: +(P.p.y - gy).toFixed(1), kmh: Math.round(P.v.length()*3.6) };
