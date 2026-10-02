initAudio = () => {}; renderer.render = () => {}; startRace(false); for (let i = 0; i < 30; i++) loop(lastTime + 1000/60);
const A = APPLES.list[100]; car.x = A.x + 20; car.z = A.z + 20; for (let i = 0; i < 20; i++) loop(lastTime + 1000/60);
const im = APPLES.im, m = new THREE.Matrix4(), v = new THREE.Vector3(); let near = 0; for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, m); v.setFromMatrixPosition(m); if (Math.hypot(v.x - A.x, v.z - A.z) < 4) near++; }
return { at: APPLES.at && APPLES.at.map(Math.round), car: [Math.round(car.x), Math.round(car.z)], count: im.count, nearTree: near, n: A.n, left: A.left };
