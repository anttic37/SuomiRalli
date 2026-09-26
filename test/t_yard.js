// yard things vs drives and cars: sample merged yard parts' object anchors
const obj = []; treeMeshes.forEach(m => { const P = m.geometry.attributes.position.array;   // (fused meshes list their parts: [key, first vertex, vertex count])
  for (const [k0, v0, nv] of m.geometry.userData.parts || [[m.userData.key, 0, P.length/3]]) { const k = (k0 || '').replace(/\d+$/, ''); if (!['swing', 'woodpile', 'laundry', 'sand', 'bush', 'mailbox'].includes(k)) continue;
    for (let i = v0*3; i < (v0 + nv)*3; i += 3*24) obj.push([k, P[i], P[i+2]]); } });
const drives = sceneryDebug.drives.map(d => ({ ax: d.x + d.dx*d.startD, az: d.z + d.dz*d.startD, bx: d.x + d.dx*d.endD, bz: d.z + d.dz*d.endD }));
let onDrive = 0, onCar = 0; const ex = [];
for (const [k, x, z] of obj) { if (k === 'mailbox') continue;
  if (drives.some(S => { const vx = S.bx - S.ax, vz = S.bz - S.az, L2 = vx*vx + vz*vz || 1; let t = ((x - S.ax)*vx + (z - S.az)*vz)/L2; t = Math.max(0, Math.min(1, t)); return Math.hypot(S.ax + vx*t - x, S.az + vz*t - z) < 1.15; })) { onDrive++; if (ex.length < 6) ex.push(k + ' @' + x.toFixed(0) + ',' + z.toFixed(0)); }
  if (YARD_CARS.some(c => Math.hypot(c.x - x, c.z - z) < 1.9)) onCar++; }
return { sampled: obj.length, onDrive, onCar, ex };
