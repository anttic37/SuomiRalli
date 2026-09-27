startRace(false); step(60*3); const out = {};
out.fields = FIELD_GAMES.map(F => ({ at: [Math.round(F.lx), Math.round(F.lz)], th: +F.th.toFixed(2), w: F.w, d: F.d, fromRoute: Math.round(distRoute(F.lx, F.lz)) }));
out.kentta = LANDMARKS.filter(L => L[0] === 'kentta').map(L => [Math.round(L[1]), Math.round(L[2])]);
const F = FIELD_GAMES[0]; out.oly = [Math.round(X3.oly.x), Math.round(X3.oly.z)];
const trees = sceneryDebug.trees; out.treesNearField = trees.filter(t => Math.hypot(t[0] - F.lx, t[1] - F.lz) < 60).length;
// land classes on a ring round the field
const cls = {}; for (let a = 0; a < 6.28; a += 0.2) for (const r of [35, 45]) { const c = landClassAt(F.lx + Math.sin(a)*r, F.lz + Math.cos(a)*r); cls[c] = (cls[c] || 0) + 1; } out.ringClasses = cls;
car.x = F.lx + 30; car.z = F.lz + 30; step(5);
{ const gy = H(F.lx, F.lz); HUMANS.forEach(q => { q.far = false; if (q.view.kind === 'rig') humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
  camera.position.set(F.lx + 1, gy + 120, F.lz + 1); camera.lookAt(F.lx, gy, F.lz); camera.updateMatrixWorld(); RR(scene, camera); await __save('s3_field_top.png', renderer.domElement.toDataURL('image/png')); }
return out;
