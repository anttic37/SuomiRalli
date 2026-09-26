initAudio = () => {}; if (typeof setTimeOfDay === 'function') setTimeOfDay('paiva'); const realRender = renderer.render.bind(renderer); renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; loop(lastTime + 1000/60); } };
step(60*3.3);
let victim = null, bd = 1e9; HUMANS.forEach(h => { if (h.task.kind !== 'spectate') return; const d = Math.hypot(h.x - car.x, h.z - car.z); if (d < bd && d > 25) { bd = d; victim = h; } });
knock(victim, 1.5, 0, 3);
const log = []; let last = '';
step(60*80, i => { car.vx = car.vz = 0; const A = VEHICLES.find(v => v.kind === 'ambulance'); if (!A) return;
  const ph = A.job.phase; if (ph !== last || (i % 60 === 0 && (ph === 'go' || ph === 'treat'))) { last = ph; log.push((i/60).toFixed(1) + ' ' + ph + ' amb ' + A.x.toFixed(1) + ',' + A.z.toFixed(1) + ' vic ' + victim.x.toFixed(1) + ',' + victim.z.toFixed(1) + ' | ' + A.crew.map(h => h.x.toFixed(1) + ',' + h.z.toFixed(1) + (h.inside ? 'I' : '') + (h.down ? 'D' : '') + (h.st && h.st.ok ? 'ok' : '') + ' v' + Math.hypot(h.vx, h.vz).toFixed(2)).join(' / ')); }
  if (ph === 'treat' && A.job.t > 1.5 && !window.__shotDone) { window.__shotDone = A; return false; } });
const A = window.__shotDone; if (A) { const p = new THREE.Vector3(victim.x, H(victim.x, victim.z), victim.z), ex = victim.x + 4, ez = victim.z + 3.2;
  camera.position.set(ex, H(ex, ez) + 2.2, ez); camera.lookAt(p.x, p.y + 0.5, p.z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(p.x + SUN.x, p.y + SUN.y, p.z + SUN.z); dirLight.target.position.copy(p); dirLight.target.updateMatrixWorld();
  realRender(scene, camera); await __save('w_medic.png', renderer.domElement.toDataURL('image/png')); }
return { log: log.slice(-3), crewVis: A ? A.crew.map(h => [h.view.g.visible, h.far, h.inside, h.gone, h.view.g.position.x.toFixed(1), h.view.g.position.y.toFixed(1), h.view.g.position.z.toFixed(1)]) : null };
