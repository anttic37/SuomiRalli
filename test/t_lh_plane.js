// lehti photo: the plane climbing over the village, from its spot past the finish line (↑ held, ↓ at 80 km/h, as a player flies it)
startRace(false); step(30); const P = PLANE; planeEnter(true); step(20); keys.ArrowUp = true; let t = 0, lift = null;
step(60*20, () => { t += 1/60; const V = P.v.length()*3.6, F = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q); keys.ArrowDown = V > 80 && Math.asin(F.y) < 0.17; if (!lift && P.air) lift = t; if (P.crashed) return false; if (lift && t > lift + 9) return false; });
keys.ArrowUp = keys.ArrowDown = false; const F = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q), L2 = new THREE.Vector3(1, 0, 0).applyQuaternion(P.q), fx = F.x, fz = F.z, gy = Y(P.p.x, P.p.z);
await shot('lh_plane', P.p.x, P.p.z, fx*8 + L2.x*11, fz*8 + L2.z*11, P.p.y - gy + 2.5, P.p.y - gy - 1); return { agl: +(P.p.y - gy).toFixed(1), kmh: Math.round(P.v.length()*3.6), crashed: P.crashed };
