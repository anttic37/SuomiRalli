// street names painted on the road: two of them from the driver's eye (1.3 m, 12 m off) and one from a little above — the texture's sharpness
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; setTimeOfDay('paiva'); startRace(false); for (let i = 0; i < 60; i++) loop(lastTime + 1000/60);
const out = { labels: labelMeshes.length, tex: typeof LABEL_TEX !== 'undefined' ? LABEL_TEX.size : null };
const pick = [...labelMeshes].sort((a, b) => Math.hypot(a.userData.cx, a.userData.cz) - Math.hypot(b.userData.cx, b.userData.cz)).slice(0, 2);
let k = 0; for (const m of pick) { const x = m.userData.cx, z = m.userData.cz, y = Y(x, z);
  for (const [n, d, hh] of [['eye', 12, 1.3], ['up', 9, 6]]) { const a = Math.atan2(x, z) + Math.PI; camera.position.set(x + Math.sin(a)*d, y + hh, z + Math.cos(a)*d); camera.lookAt(x, y, z); camera.fov = 50; camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    skyDome.position.copy(camera.position); dirLight.position.set(x + SUN.x, y + SUN.y, z + SUN.z); dirLight.target.position.set(x, y, z); dirLight.target.updateMatrixWorld(); RR(scene, camera); await __save('lbl_' + k + '_' + n + '.png', renderer.domElement.toDataURL('image/png')); }
  k++; }
return out;
