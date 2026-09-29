// a few fixed views of the village (menu state, fixed time of day) for before/after pixel comparison: OUT=prefix
initAudio = () => {}; const RR = renderer.render.bind(renderer);
const views = [[-269, -203, 60, 0.8], [0, 0, 90, 2.2], [150, -120, 45, 4.0], [-80, 160, 70, 5.5]];
const out = []; for (let i = 0; i < views.length; i++) { const [x, z, h, a] = views[i]; for (let k = 0; k < 3; k++) loop(lastTime + 1000/60);
  camera.position.set(x + Math.sin(a)*h, Y(x, z) + h*0.8, z + Math.cos(a)*h); camera.lookAt(x, Y(x, z), z); camera.updateMatrixWorld(); RR(scene, camera);
  await __save((window.OUT || 'pic') + i + '.png', renderer.domElement.toDataURL('image/png')); out.push(i); }
return out;
