// people (body v2): the game view and the biggest crowd close up, with how many bodies each LOD mesh drew (s3_shot.inc in front)
startRace(false); step(60*4);
RR(scene, camera); await __save('bv_game.png', renderer.domElement.toDataURL('image/png'));
const nGame = BODY.n.slice();
// close to the nearest crowd of people
let best = null; for (const h of HUMANS) { if (!h.look || h.inside || h.gone) continue; let c = 0; forHumansNear(h.x, h.z, 6, () => c++); if (!best || c > best.c) best = { h, c }; }
const h = best.h; await shot('bv_crowd', h.x, h.z, 7, 7, 3.5, 1);
const nClose = BODY.n.slice();
// a rig person with a prop / role
const kinds = {}; for (const q of HUMANS) if (q.task) kinds[q.task.kind] = (kinds[q.task.kind] || 0) + 1;
return { nGame, nClose, humans: HUMANS.length, withLook: HUMANS.filter(q => q.look).length, kinds, near: best.c };
