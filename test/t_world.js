initAudio = () => {}; renderer.render = () => {};
const kinds = {}; HUMANS.forEach(h => { const k = h.task ? h.task.kind : 'none'; kinds[k] = (kinds[k] || 0) + 1; });
const vk = {}; VEHICLES.forEach(v => { vk[v.kind] = (vk[v.kind] || 0) + 1; });
const sk = {}; STATIC_LIST.forEach(b => { sk[b.kind] = (sk[b.kind] || 0) + 1; });
const personsLeft = tires.filter(t => t.kind === 'person').length;
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const t0 = performance.now(); step(60*6); const ms = (performance.now() - t0)/360;
const down = HUMANS.filter(h => h.down).length, nanH = HUMANS.filter(h => !isFinite(h.x) || !isFinite(h.z)).length, nanV = VEHICLES.filter(v => !isFinite(v.x)).length;
return { kinds, vk, sk, personsLeft, humans: HUMANS.length, aoFree: CROWD.aoFree.length, down, nanH, nanV, msPerFrame: ms.toFixed(2), car: [car.x.toFixed(1), car.z.toFixed(1)], worldT: worldT.toFixed(1), crowdIm: CROWD.im.length };
