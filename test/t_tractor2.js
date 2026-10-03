initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); }; st(30);
const v = VEHICLES.find(q => q.kind === 'tractor' && q.view && q.view.g); car.x = v.x + 30; car.z = v.z + 30; st(5); const gy = Y(v.x, v.z);
R0(scene, camera); for (let k = 0; k < 4; k++) { const a = v.yaw + k*Math.PI/2 + 0.4; camera.position.set(v.x + Math.sin(a)*6, gy + 2, v.z + Math.cos(a)*6); camera.lookAt(v.x, gy + 0.9, v.z); R0(scene, camera); await __save('tq' + k, renderer.domElement.toDataURL('image/jpeg', 0.5)); }
return { yaw: v.yaw, sc: v.view.g.scale.toArray(), layers: v.view.g.children.slice(0, 4).map(m => m.layers.mask) };
