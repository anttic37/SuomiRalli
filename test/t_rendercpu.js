// the CPU side of drawing (render stubbed): scene.updateMatrixWorld (three does it every render), batchFill, bodyFill; object counts
initAudio = () => {}; renderer.render = () => {};
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
startRace(false); for (let i = 0; i < 60*3.3; i++) loop(lastTime + 1000/60); for (let i = 0; i < 60*5; i++) { steer(); loop(lastTime + 1000/60); }
let objs = 0, auto = 0, meshes = 0, visMeshes = 0; scene.traverse(o => { objs++; if (o.matrixAutoUpdate) auto++; if (o.isMesh) { meshes++; } }); scene.traverseVisible(o => { if (o.isMesh || o.isPoints || o.isLine) visMeshes++; });
let bm = 0; for (const B of BATCH.groups.values()) bm += B.meshes.length;
const T = { mw: 0, batch: 0, body: 0, loop: 0 }, N = 600;
for (let i = 0; i < N; i++) { steer(); let t = performance.now(); loop(lastTime + 1000/60); T.loop += performance.now() - t;
  t = performance.now(); scene.updateMatrixWorld(); T.mw += performance.now() - t; t = performance.now(); batchFill(); T.batch += performance.now() - t; t = performance.now(); bodyFill(camera); T.body += performance.now() - t; }
for (const k in T) T[k] = +(T[k]/N).toFixed(3);
return { perFrameMs: T, objs, matrixAuto: auto, meshes, visibleDrawables: visMeshes, batchedMeshes: bm, batchGroups: BATCH.groups.size, humans: HUMANS.length };
