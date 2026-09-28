// UFO landing sites: nothing solid (house, shed, car, tree, prop) on the crater, the furrow or the saucer; a top-down look at each
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; setTimeOfDay('paiva');
let TT = performance.now(); const step = (n) => { for (let i = 0; i < n; i++) { TT += 1000/60; loop(TT); } };
startRace(false); step(30);
const out = UFOS.map((U, i) => { const near = []; for (const B of STATIC_LIST) { const d = Math.hypot(B.x - U.x, B.z - U.z) - Math.hypot(B.hw, B.hl); if (d < 14 && B.kind !== 'lm') near.push(B.kind + '@' + d.toFixed(1)); }
  let bd = 1e9; for (const B of BUILDINGS) bd = Math.min(bd, Math.hypot(B[0] - U.x, B[1] - U.z) - Math.hypot(B[2], B[3]));
  const props = tires.filter(t => !t.off && Math.hypot(t.x - U.x, t.z - U.z) < 13).length, trees = typeof treeNear === 'function' ? treeNear(U.x, U.z, 9) : null;
  return { x: Math.round(U.x), z: Math.round(U.z), near, bldg: +bd.toFixed(1), props, tree9: trees }; });
for (const [i, U] of UFOS.entries()) { camera.position.set(U.x + 0.1, Y(U.x, U.z) + 70, U.z + 0.1); camera.lookAt(U.x, Y(U.x, U.z), U.z); car.x = U.x + 30; car.z = U.z; nearVisT = 0; nearVisUpdate(0.01); camera.updateMatrixWorld(); skyDome.position.copy(camera.position); RR(scene, camera); await __save('ufo_site' + i + '.png', renderer.domElement.toDataURL('image/png')); }
return out;
