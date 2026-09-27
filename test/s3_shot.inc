initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; setTimeOfDay('paiva');
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
const shot = async (n, x, z, dx, dz, up, ly) => { const gy = H(x, z); HUMANS.forEach(q => { q.far = Math.hypot(q.x - car.x, q.z - car.z) >= 240; if (q.view.kind === 'rig') humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
  camera.position.set(x + dx, gy + up, z + dz); camera.lookAt(x, gy + (ly || 1), z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  dirLight.position.set(x + SUN.x, gy + SUN.y, z + SUN.z); dirLight.target.position.set(x, gy, z); dirLight.target.updateMatrixWorld(); RR(scene, camera); await __save('s3_' + n + '.png', renderer.domElement.toDataURL('image/png')); };
