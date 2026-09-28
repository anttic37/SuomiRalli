// z-fight hunt: GTA-mode chase views over the junctions; each rendered twice with the camera nudged 2 cm — a stable surface barely
// changes, a z-fighting one changes in blotches (compared outside, in python)
startRace(false); step(60*3.5); freeEnter(); step(10); const { nodes, adj } = roadGraph(), V = [];
for (let i = 0; i < nodes.length && V.length < (typeof NV === 'undefined' ? 10 : NV); i++) { if (adj[i].length < 3) continue; const n = nodes[i]; if (V.some(q => Math.hypot(q.x - n.x, q.z - n.z) < 60)) continue; V.push(n); }
let k = 0; for (const n of V) { const a = (k*2.39) % 6.28, fx = Math.sin(a), fz = Math.cos(a); car.x = n.x - fx*25; car.z = n.z - fz*25; car.angle = a; step(2);
  const cx = car.x - fx*21, cz = car.z - fz*21, cy = Y(car.x, car.z) + 43, lx = car.x + fx*15, lz = car.z + fz*15, ly = Y(lx, lz);
  for (const [tag, d] of [['a', 0], ['b', 0.02]]) { camera.position.set(cx + d, cy + d, cz - d); camera.lookAt(lx + d, ly, lz); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
    HUMANS.forEach(q => { q.far = Math.hypot(q.x - car.x, q.z - car.z) >= 240; if (q.view.kind === 'rig') humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
    dirLight.position.set(car.x + SUN.x, Y(car.x, car.z) + SUN.y, car.z + SUN.z); dirLight.target.position.set(car.x, Y(car.x, car.z), car.z); dirLight.target.updateMatrixWorld();
    RR(scene, camera); await __save('fz' + k + tag + '.png', renderer.domElement.toDataURL('image/png')); } k++; }
return { views: V.length };
