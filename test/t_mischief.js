// village mischief: counts per task, the K-shop queue cycling, a knocked dog (no ambulance), a burning roofer jumping, close-ups
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; setTimeOfDay('paiva');
const out = {}, kinds = {}; HUMANS.forEach(h => { const k = h.task ? h.task.kind : '-'; kinds[k] = (kinds[k] || 0) + 1; }); out.kinds = kinds;
out.smokingYardCars = EMITTERS.filter(E => E.v).length; out.queue = EXTRA.queue ? EXTRA.queue.order.length : 0;
const shot = async (n, h, dx, dz, up, ly) => { car.x = h.x + 30; car.z = h.z + 30; HUMANS.forEach(q => { q.far = Math.hypot(q.x - car.x, q.z - car.z) >= 240; if (q.view.kind === 'rig') humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
  for (let i = 0; i < 20; i++) worldUpdate(1/60);
  camera.position.set(h.x + dx, H(h.x, h.z) + up, h.z + dz); const gy = h.view.kind === 'rig' ? h.view.g.position.y : H(h.x, h.z); camera.position.y = gy + up; camera.lookAt(h.x, gy + (ly || 1), h.z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  dirLight.position.set(h.x + SUN.x, H(h.x, h.z) + SUN.y, h.z + SUN.z); dirLight.target.position.set(h.x, H(h.x, h.z), h.z); dirLight.target.updateMatrixWorld(); U_TIME.value = 0;
  RR(scene, camera); await __save('mis_' + n + '.png', renderer.domElement.toDataURL('image/png')); };
const find = k => HUMANS.find(h => h.task && h.task.kind === k);
// the queue over 60 s: someone goes in and later someone rejoins
const Q = EXTRA.queue; const seen = { entered: 0, rejoined: 0 };
if (Q) { car.x = Q.door[0] + 40; car.z = Q.door[1] + 40; const inside0 = new Set(); for (let i = 0; i < 60*60; i++) { worldUpdate(1/60); for (const h of Q.all) { if (h.inside && !inside0.has(h)) { inside0.add(h); seen.entered++; } if (inside0.has(h) && !h.inside && h.st.mode === 'queue') { inside0.delete(h); seen.rejoined++; } } } }
out.queueCycle = seen;
for (const [k, dx, dz, up] of [['fight', 5, 4, 2.6], ['cheer', 6, 5, 3], ['roofer', 10, 8, 3], ['fix', 3.5, -4, 2.2], ['walk', 6, 5, 3], ['fan', 8, 6, 4], ['queue', 7, 6, 3.5]]) {
  const h = k === 'fight' ? HUMANS.find(q => q.kid && q.task && q.task.kind === 'fight') : find(k); if (h) await shot(k, h, dx, dz, up); }
// a dog knocked over: no ambulance
const dog = HUMANS.find(h => h.animal); if (dog) { const q0 = DISPATCH.queue.length; knock(dog, 3, 0, 5); out.dogKnock = { down: dog.down, ambulanceQueued: DISPATCH.queue.length > q0 }; }
// a roofer's house catches fire: he jumps
const rf = find('roofer'); if (rf) { const S = STATIC_LIST.find(b => b.kind === 'house' && Math.hypot(b.x - rf.x, b.z - rf.z) < 8); car.x = rf.x + 20; car.z = rf.z; startFire({ house: S }); for (let i = 0; i < 60*4; i++) worldUpdate(1/60); out.rooferJumped = { down: rf.down, onGround: rf.hop <= 0.01, queued: DISPATCH.queue.length > 0 || VEHICLES.some(v => v.kind === 'ambulance') }; }
worldReset(); out.afterReset = { queue: Q ? Q.order.length : 0, rooferUp: rf ? !rf.down : null, dogUp: dog ? !dog.down : null };
return out;
