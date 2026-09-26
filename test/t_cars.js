// yard / street cars: 2D overlaps with houses, landmarks, other cars, trees, props; and how they sit on the ground
const obb = (x, z, hw, hl, yaw) => { const c = Math.cos(yaw), s = Math.sin(yaw); return [[-hw, -hl], [hw, -hl], [hw, hl], [-hw, hl]].map(([a, b]) => [x + c*a + s*b, z - s*a + c*b]); };
const sepAxis = (A, B) => { for (const P of [A, B]) for (let i = 0; i < 4; i++) { const p = P[i], q = P[(i+1) % 4], nx = q[1] - p[1], nz = p[0] - q[0]; let a0 = 1e9, a1 = -1e9, b0 = 1e9, b1 = -1e9;
  for (const v of A) { const d = v[0]*nx + v[1]*nz; a0 = Math.min(a0, d); a1 = Math.max(a1, d); } for (const v of B) { const d = v[0]*nx + v[1]*nz; b0 = Math.min(b0, d); b1 = Math.max(b1, d); } if (a1 < b0 || b1 < a0) return true; } return false; };
const hits = { house: [], landmark: [], car: [], tree: [], prop: [], road: [] }, sit = []; const cars = YARD_CARS;
cars.forEach((c, i) => { const A = obb(c.x, c.z, 0.82, 1.85, c.yaw);
  BUILDINGS.forEach(B => { if (B.length > 5 && Math.abs(B[0] - c.x) < 0.01 && Math.abs(B[1] - c.z) < 0.01) return; if (Math.hypot(B[0] - c.x, B[1] - c.z) > 40) return;
    const isCar = B.length > 5 && Math.abs(B[2] - 1.8) < 0.01 && Math.abs(B[3] - 3.9) < 0.01; const Bo = obb(B[0], B[1], B[2]/2, B[3]/2, B[4]);
    if (!sepAxis(A, Bo)) (isCar ? hits.car : B.length > 5 ? hits.landmark : hits.house).push(`${c.street ? 'street' : 'yard'} car ${i} @${c.x.toFixed(1)},${c.z.toFixed(1)} vs ${isCar ? 'car' : 'bld'} @${B[0].toFixed(1)},${B[1].toFixed(1)} ${B[2].toFixed(1)}x${B[3].toFixed(1)}`); });
  sceneryDebug.trees.forEach(([tx, tz]) => { if (Math.hypot(tx - c.x, tz - c.z) > 4) return; const Bo = obb(tx, tz, 0.35, 0.35, 0); if (!sepAxis(A, Bo)) hits.tree.push(`car ${i} @${c.x.toFixed(1)},${c.z.toFixed(1)} tree @${tx.toFixed(1)},${tz.toFixed(1)}`); });
  tires.forEach(t => { if (Math.hypot(t.x - c.x, t.z - c.z) > 4) return; const Bo = obb(t.x, t.z, (t.r || 0.4), (t.r || 0.4), 0); if (!sepAxis(A, Bo)) hits.prop.push(`car ${i} @${c.x.toFixed(1)},${c.z.toFixed(1)} ${t.kind} @${t.x.toFixed(1)},${t.z.toFixed(1)}`); });
  if (!c.street && A.some(([x, z]) => onRoad(x, z, -0.3))) hits.road.push(`yard car ${i} @${c.x.toFixed(1)},${c.z.toFixed(1)} pokes onto a road`);
  // sitting: ground at the 4 wheels vs the tilted car plane
  const q = new THREE.Quaternion(); groundQuat(c.x, c.z, c.yaw, q); const y0 = (c.street ? ROAD_Y : 0.05) + H(c.x, c.z); let worst = 0;
  for (const [a, b] of [[-0.7, 1.25], [0.7, 1.25], [-0.7, -1.25], [0.7, -1.25]]) { const v = new THREE.Vector3(a, 0, b).applyQuaternion(q); const gy = H(c.x + v.x, c.z + v.z) + (c.street ? ROAD_Y : 0.05); worst = Math.max(worst, Math.abs(y0 + v.y - gy)); }
  const e = new THREE.Euler().setFromQuaternion(q, 'YXZ'); sit.push([worst, i, c.x, c.z, Math.max(Math.abs(e.x), Math.abs(e.z))]);
});
sit.sort((a, b) => b[0] - a[0]);
return { cars: cars.length, street: cars.filter(c => c.street).length, counts: Object.fromEntries(Object.entries(hits).map(([k, v]) => [k, v.length])), hits: Object.values(hits).flat().slice(0, 30), worstSit: sit.slice(0, 6).map(s => `car ${s[1]} @${s[2].toFixed(0)},${s[3].toFixed(0)} wheel gap ${s[0].toFixed(2)} tilt ${(s[4]*57.3).toFixed(1)}°`) };
