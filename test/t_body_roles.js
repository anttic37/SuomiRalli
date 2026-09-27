// people (body v2): the village roles close up in a 4×5 grid → bv_roles.png (run with s3_shot.inc in front)
startRace(false); step(60*3); gameState = State.MENU;
const want = ['moped', 'post', 'seated', 'party', 'olympics', 'ring', 'badminton', 'beat', 'hoist', 'cook', 'horse', 'fight', 'roofer', 'ladder', 'mow', 'ride', 'football', 'laundry', 'queue', 'fan'];
const W = renderer.domElement.width, Hh = renderer.domElement.height, tw = 300, th = Math.round(300*Hh/W), cols = 4, c2 = document.createElement('canvas'); c2.width = tw*cols; c2.height = th*Math.ceil(want.length/cols); const g2 = c2.getContext('2d');
const out = {};
for (let k = 0; k < want.length; k++) { const h = HUMANS.find(q => q.task && q.task.kind === want[k] && !q.inside && !q.gone); if (!h) { out[want[k]] = 'none'; continue; }
  car.x = h.x + 30; car.z = h.z + 30; step(20); HUMANS.forEach(q => { q.far = Math.hypot(q.x - car.x, q.z - car.z) >= 240; humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
  const hx = h.view.kind === 'rig' ? h.view.g.position : { x: h.x, y: Y(h.x, h.z), z: h.z }, f = h.yaw, gy = hx.y;
  camera.position.set(hx.x + Math.sin(f + 0.6)*3.6, gy + 2.0, hx.z + Math.cos(f + 0.6)*3.6); camera.lookAt(hx.x, gy + 0.8, hx.z); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  dirLight.position.set(hx.x + SUN.x, gy + SUN.y, hx.z + SUN.z); dirLight.target.position.set(hx.x, gy, hx.z); dirLight.target.updateMatrixWorld(); RR(scene, camera);
  const X = (k % cols)*tw, Yp = Math.floor(k/cols)*th; g2.drawImage(renderer.domElement, X, Yp, tw, th); g2.font = 'bold 16px Arial'; g2.lineWidth = 3; g2.strokeStyle = '#000'; g2.strokeText(want[k], X + 6, Yp + 18); g2.fillStyle = '#fff'; g2.fillText(want[k], X + 6, Yp + 18); out[want[k]] = 'ok'; }
await __save('bv_roles.png', c2.toDataURL('image/png'));
return out;
