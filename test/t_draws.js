// draw calls per object, main pass vs shadow pass (steady state: renders every frame for a while first)
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
step(60*3.3);
const RIGOF = new Map(); HUMANS.forEach(h => { if (h.view.kind === 'rig') h.view.g.traverse(m => RIGOF.set(m, 'rig:' + (h.task ? h.task.kind : '-'))); }); VEHICLES.forEach(v => { if (v.view.g) v.view.g.traverse(m => RIGOF.set(m, 'veh:' + v.kind)); });
const name0 = o => { let s = o.userData.key || o.name || ''; for (let p = o.parent; !s && p; p = p.parent) s = p.userData.key || p.name || ''; return (s || '?') + (o.isInstancedMesh ? '[inst]' : '') + ':' + (o.geometry && o.geometry.type || '') + ':' + (o.material && (o.material.name || o.material.type)); };
const name = o => (RIGOF.get(o) || '') + ' ' + name0(o);
let pass = 'main'; const agg = { main: {}, shadow: {} }; let frames = 0;
const rbd = renderer.renderBufferDirect.bind(renderer);
renderer.renderBufferDirect = (cam, sc, geo, mat, obj, grp) => { if (frames) { const k = name(obj); agg[pass][k] = (agg[pass][k] || 0) + 1; } return rbd(cam, sc, geo, mat, obj, grp); };
const sr = renderer.shadowMap.render.bind(renderer.shadowMap); renderer.shadowMap.render = (...a) => { pass = 'shadow'; sr(...a); pass = 'main'; };
for (let k = 0; k < 4; k++) { step(60*6, steer); frames = 0; RR(scene, camera); frames = 1; RR(scene, camera); step(1); RR(scene, camera); frames = 0; }
const top = o => { const e = Object.entries(o).sort((a, b) => b[1] - a[1]); return { total: e.reduce((s, x) => s + x[1], 0)/8, top: e.slice(0, 30).map(([k, v]) => (v/8).toFixed(1) + ' ' + k) }; };
return { main: top(agg.main), shadow: top(agg.shadow) };
