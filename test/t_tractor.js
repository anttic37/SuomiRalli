initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); }; st(30);
const v = VEHICLES.find(q => q.kind === 'tractor' && q.view && q.view.g); car.x = v.x + 30; car.z = v.z + 30; st(5);
const sx = Math.cos(v.yaw), sz = -Math.sin(v.yaw); camera.position.set(v.x + sx*5 + Math.sin(v.yaw)*-1, Y(v.x, v.z) + 1.6, v.z + sz*5 + Math.cos(v.yaw)*-1); camera.lookAt(v.x, Y(v.x, v.z) + 0.8, v.z); R0(scene, camera);
await __save('tr1', renderer.domElement.toDataURL('image/jpeg', 0.6));
camera.position.set(v.x - sx*5, Y(v.x, v.z) + 2.5, v.z - sz*5); camera.lookAt(v.x, Y(v.x, v.z) + 0.8, v.z); R0(scene, camera); await __save('tr2', renderer.domElement.toDataURL('image/jpeg', 0.6));
const w = v.wheels || []; return { wheels: w.length, mats: (v.view.g.children || []).length };
