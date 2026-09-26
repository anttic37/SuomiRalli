initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
step(60*3.3); const outs = [];
for (let s = 0; s < 3; s++) { step(60*6, steer);
  scene.updateMatrixWorld(true); camera.updateMatrixWorld(); const F = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
  const cnt = {}; let total = 0;
  const visit = (o, cat) => { if (!o.visible) return; if (o.isMesh || o.isPoints || o.isLine || o.isSprite) { if (!o.frustumCulled || (o.isSprite ? F.intersectsSprite(o) : F.intersectsObject(o))) { if (!(o.isInstancedMesh && o.count === 0)) { cnt[cat] = (cnt[cat] || 0) + 1; total++; } } }
    for (const c of o.children) visit(c, cat); };
  for (const o of scene.children) { if (o === trackMeshGroup) { for (const c of o.children) visit(c, 'tm:' + String(c.userData.key || c.type).replace(/\d+$/, '').split('|')[0]); continue; }
    visit(o, (typeof lifeGroup !== 'undefined' && o === lifeGroup) ? 'life' : (o.userData.key || o.type) + (o.isInstancedMesh ? ':IM' : '')); }
  outs.push({ total, cnt: Object.fromEntries(Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 18)) }); }
return outs;
