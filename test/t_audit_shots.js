// audit: pictures of the new things (grid, grandstands + sausage carts, ES stand, people close, GTA junctions + minimap)
initAudio = () => {}; setTimeOfDay('paiva'); startRace(false);
const realRender = renderer.render.bind(renderer); renderer.render = () => {};
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
const look = async (name, tx, tz, dist, h, yaw) => { const cx = tx - Math.sin(yaw)*dist, cz = tz - Math.cos(yaw)*dist; camera.position.set(cx, Y(cx, cz) + h, cz); camera.lookAt(tx, Y(tx, tz) + 1, tz); camera.updateMatrixWorld();
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(tx + SUN.x, SUN.y, tz + SUN.z); dirLight.target.position.set(tx, 0, tz); dirLight.target.updateMatrixWorld(); scene.onBeforeRender && scene.onBeforeRender(renderer, scene, camera); realRender(scene, camera); await __save(name, renderer.domElement.toDataURL('image/png')); };
const out = {};
step(60*1.5);
await look('a_grid.png', car.x, car.z, 16, 8, car.angle + 0.3);
STANDS.forEach((S, i) => out['stand' + i] = [Math.round(S.x), Math.round(S.z), S.people.length]);
for (let i = 0; i < STANDS.length; i++) { const S = STANDS[i]; const fx = Math.sin(S.yaw), fz = Math.cos(S.yaw); await look('a_stand' + i + '.png', S.x, S.z, 18, 5, Math.atan2(-fx, -fz) + 0.4); }
const P = ES.promo; out.es = P ? [Math.round(P.x), Math.round(P.z), P.dancers.length, P.speakers.length] : null;
if (P) { await look('a_es.png', P.x, P.z, 20, 7, 0.8); await look('a_es2.png', P.x, P.z, 14, 4, -2.2); }
// people close: a few different tasks
const kinds = {}; HUMANS.forEach(h => { const k = h.task ? h.task.kind : '-'; if (!kinds[k] && !h.inside && !h.gone) kinds[k] = h; }); out.kinds = Object.keys(kinds);
let n = 0; for (const k of ['walk', 'garden', 'ride', 'cook', 'spectate', 'dog', 'wash', 'chat']) { const h = kinds[k]; if (!h) continue; step(1); await look('a_h_' + k + '.png', h.x, h.z, 6, 2, h.yaw + Math.PI*0.8); if (++n > 5) break; }
// GTA: the right lane at the split
startRace(false); step(60*3.2); { const S = START_SPLIT; const drive = (tx, tz) => { let dA = Math.atan2(tx - car.x, tz - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.05; keys.ArrowRight = dA < -0.05; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 12; };
  step(60*20, () => { drive(S.x - S.lx*S.hw*0.5 + S.dx*10, S.z - S.lz*S.hw*0.5 + S.dz*10); if (S.done) return false; }); }
keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = false; step(60*2); out.free = FREE.on;
realRender(scene, camera); await __save('a_free_play.png', renderer.domElement.toDataURL('image/png')); await __save('a_free_map.png', mmCanvas.toDataURL('image/png'));
// junctions: the three graph nodes with most edges, from above
const G = roadGraph(); const deg = G.nodes.map((q, i) => [G.adj ? G.adj[i].length : 0, i]); deg.sort((a, b) => b[0] - a[0]); out.deg = deg.slice(0, 3).map(d => d[0]);
for (let j = 0; j < 3; j++) { const q = G.nodes[deg[j * 4][1]]; await look('a_junc' + j + '.png', q.x, q.z, 14, 22, j); }
return out;
