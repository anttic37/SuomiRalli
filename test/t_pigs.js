// a side-street mouth from above: the concrete pigs and the tyres in front (OUT = file prefix)
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {};
for (let i = 0; i < 5; i++) loop(lastTime + 1000/60);
const pigs = tires.filter(t => t.kind === 'pig' && !t.off && !(DEPOTS.list || []).some(D => Math.hypot(D.x - t.x, D.z - t.z) < 30));
const near = (x, z) => { let bi = 0, bd = 1e9; trackPoints.forEach((p, i) => { const d = (p.x - x)**2 + (p.y - z)**2; if (d < bd) { bd = d; bi = i; } }); return [bi, Math.sqrt(bd)]; };
const P = pigs[Math.floor(pigs.length*0.3)], [ti, d] = near(P.x, P.z), tp = trackPoints[ti];
const out = { pigs: pigs.length, pigDist: +d.toFixed(1), stacksNear: tires.filter(t => t.kind !== 'pig' && Math.hypot(t.x - P.x, t.z - P.z) < 12).length };
const cx = (P.x + tp.x)/2, cz = (P.z + tp.y)/2; camera.position.set(cx + 14, Y(cx, cz) + 26, cz + 14); camera.lookAt(cx, Y(cx, cz), cz); camera.updateMatrixWorld(); RR(scene, camera);
await __save((window.OUT || 'pigs') + '.png', renderer.domElement.toDataURL('image/png')); return out;
