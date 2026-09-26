initAudio = () => {}; if (typeof setTimeOfDay === 'function') setTimeOfDay('paiva');
const realRender = renderer.render.bind(renderer); renderer.render = () => {};
const rows = [];
sideRoads.forEach((R, ri) => { for (let i = 1; i < R.pts.length; i++) { const a = R.pts[i-1], b = R.pts[i], L = Math.hypot(b.x - a.x, b.y - a.y); if (L < 0.5) continue; const ux = (b.x - a.x)/L, uz = (b.y - a.y)/L, nx = -uz, nz = ux, hw = R.w*0.5;
  for (let t = 0; t <= L; t += 3) { const x = a.x + ux*t, z = a.y + uz*t, cross = (H(x + nx*hw, z + nz*hw) - H(x - nx*hw, z - nz*hw))/(2*hw), grade = (H(x + ux*2, z + uz*2) - H(x - ux*2, z - uz*2))/4;
    rows.push({ name: R.name, x, z, cross, grade, ux, uz }); } } });
const byCross = rows.slice().sort((p, q) => Math.abs(q.cross) - Math.abs(p.cross)), byGrade = rows.slice().sort((p, q) => Math.abs(q.grade) - Math.abs(p.grade));
const view = async (name, ex, ez, eh, tx, tz, th) => { const ey = H(ex, ez) + eh, ty = H(tx, tz) + th; skyDome.position.set(ex, ey, ez);
  camera.position.set(ex, ey, ez); camera.lookAt(tx, ty, tz); camera.updateMatrixWorld();
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(tx + SUN.x, ty + SUN.y, tz + SUN.z); dirLight.target.position.set(tx, ty, tz); dirLight.target.updateMatrixWorld();
  realRender(scene, camera); await __save('' + name + '.png', renderer.domElement.toDataURL('image/png')); };
const picked = []; for (const r of byCross) { if (picked.length >= 3) break; if (picked.some(p => Math.hypot(p.x - r.x, p.z - r.z) < 60)) continue; picked.push(r); }
for (let k = 0; k < picked.length; k++) { const r = picked[k]; await view('road' + k, r.x - r.ux*16 + r.uz*6, r.z - r.uz*16 - r.ux*6, 6, r.x, r.z, 0); }
const f = (r) => `${r.name} @${r.x.toFixed(0)},${r.z.toFixed(0)} cross ${(r.cross*100).toFixed(0)}% grade ${(r.grade*100).toFixed(0)}%`;
return { cross: byCross.slice(0, 8).map(f), grade: byGrade.slice(0, 5).map(f), shots: picked.map(f) };
