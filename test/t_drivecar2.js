initAudio = () => {}; startRace(false); for (let i = 0; i < 30; i++) loop(lastTime + 1000/60);
const c = YARD_CARS.find(c => !c.street && Math.abs(c.x - 287) < 2 && Math.abs(c.z + 73) < 2); car.x = c.x + 12; car.z = c.z + 12; for (let i = 0; i < 20; i++) loop(lastTime + 1000/60);
camera.position.set(c.x + 3, Y(c.x, c.z) + 9, c.z + 5); camera.lookAt(c.x, Y(c.x, c.z), c.z); await __shot('dd0');
AO.meshes.forEach(m => m.visible = false); camera.position.set(c.x + 3, Y(c.x, c.z) + 9, c.z + 5); camera.lookAt(c.x, Y(c.x, c.z), c.z); await __shot('dd1'); AO.meshes.forEach(m => m.visible = true);
yardCarMeshes.forEach(m => m.visible = false); camera.position.set(c.x + 3, Y(c.x, c.z) + 9, c.z + 5); camera.lookAt(c.x, Y(c.x, c.z), c.z); await __shot('dd2'); yardCarMeshes.forEach(m => m.visible = true);
// what's within 3 m of the car, flat and dark
const hits = []; scene.traverse(o => { if (!o.isMesh || !o.visible) return; const m = o.material; if (!m || Array.isArray(m)) return; if (m.color && m.color.getHex() < 0x202020) { hits.push([o.name || o.userData.key || o.type, m.type, m.color.getHexString(), o.isInstancedMesh ? o.count : 1, m.transparent]); } });
return { hits: hits.slice(0, 40), cy: Y(c.x, c.z) };
