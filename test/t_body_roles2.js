// people (body v2): the special roles side by side (medic kneeling, firefighter, police, pizza, ES, rally driver, sitting, kid) → bv_roles2.png (s3_shot.inc in front)
setTimeOfDay('paiva'); startRace(false); step(60*3); gameState = State.MENU;
let sp = null; for (let k = 0; k < 80 && !sp; k++) { const c = openSpot(10, 14, 70); if (!c) continue; let ok = true; for (let a = -8; a <= 8 && ok; a += 2) for (let b = -8; b <= 8 && ok; b += 2) if (treeNear(c[0] + a, c[1] + b, 1.5)) ok = false; if (ok) sp = c; }
const [x0, z0] = sp; car.x = x0 + 40; car.z = z0 + 40; step(2);
const sl = Math.hypot(SUN.x, SUN.z) || 1, sx = SUN.x/sl, sz = SUN.z/sl, px = -sz, pz = sx, YW = Math.atan2(SUN.x, SUN.z) + 0.3;
const L = [['ensihoitaja', makeCrew('medic'), P => { P.legs = 1.35; P.armL = -1.1; P.armR = -0.8; P.dy = -0.52; }, 0.32],
  ['palomies', makeCrew('fire'), null], ['poliisi', null, null], ['pizza', makePizzaGuy(), null], ['ES', makeEsGuy(), P => { P.armR = -1.4; }],
  ['kuski', makeAdult(0xf2f2ee, 0xf2f2ee, 0x5a3a1c, { sel: { hair: 2, top: 11, longSleeve: 1, longPants: 1, tache: 1 }, acc: 0xd9262e }), null],
  ['istuu', makeAdult(0xd83b2c, 0x2f4a78, 0x3a2616), P => { P.legs = -1.45; P.armL = P.armR = -0.9; P.dy = -0.45; }], ['pyörällä', makeKid(0xe8c02a), P => { P.walk = 0.8; P.ph = 1; }]];
{ const rig = makeAdult(0x2a3a60, 0x1c2c5a, 0x3a2616, { sel: { hat: 3, top: 8, longSleeve: 1, longPants: 1, tache: 1 }, acc: 0x1c2540, shoes: 0x141414, w: 1.05 }); L[2][1] = rig; }
const HS = L.map(([n, rig, pf, tilt], i) => { const k = (i - 3.5)*1.1, h = new Human({ x: x0 + px*k, z: z0 + pz*k, yaw: YW, rig, kid: n === 'pyörällä' }); h.far = false; if (pf) pf(h.pose); if (tilt) h.tilt = tilt; if (n === 'pizza') h.pose.armL = h.pose.armR = -1.2; humanSync(h); return h; });
const down = new Human({ x: x0 + sx*1.5, z: z0 + sz*1.5, yaw: YW + 1, inst: 3 }); down.down = true; down.tilt = -Math.PI/2 + 0.15; humanSync(down);
const gy = Y(x0, z0); camera.position.set(x0 + sx*6.2, gy + 1.9, z0 + sz*6.2); camera.lookAt(x0, gy + 0.7, z0); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
dirLight.position.set(x0 + SUN.x, gy + SUN.y, z0 + SUN.z); dirLight.target.position.set(x0, gy, z0); dirLight.target.updateMatrixWorld(); RR(scene, camera);
const c2 = document.createElement('canvas'); c2.width = renderer.domElement.width; c2.height = renderer.domElement.height; const g2 = c2.getContext('2d'); g2.drawImage(renderer.domElement, 0, 0);
g2.font = 'bold 18px Arial'; g2.textAlign = 'center'; g2.lineWidth = 3; g2.strokeStyle = '#000';
for (let i = 0; i < L.length; i++) { const h = HS[i], p = new THREE.Vector3(h.x, Y(h.x, h.z) - 0.1, h.z).project(camera), X = (p.x + 1)/2*c2.width, Yy = (1 - p.y)/2*c2.height + 20; g2.strokeText(L[i][0], X, Yy); g2.fillStyle = '#fff'; g2.fillText(L[i][0], X, Yy); }
await __save('bv_roles2.png', c2.toDataURL('image/png')); return sp;
