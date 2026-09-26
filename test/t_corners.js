// inside corners: tyre walls across the cuts and parked tractors; views from above at each tractor and at the finish-line bend
initAudio = () => {}; setTimeOfDay('paiva'); const RR = renderer.render.bind(renderer); renderer.render = () => {};
const view = async (name, tx, tz, h, ox, oz) => { const ty = H(tx, tz), ex = tx + (ox || 0), ez = tz + (oz || 0); camera.position.set(ex, ty + h, ez); camera.lookAt(tx, ty, tz); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  car.x = tx; car.z = tz; HUMANS.forEach(q => { q.far = Math.hypot(q.x - tx, q.z - tz) >= 240; if (q.view.kind === 'rig') humanSync(q); }); nearVisT = 0; nearVisUpdate(0.01);
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(tx + SUN.x, ty + SUN.y, tz + SUN.z); dirLight.target.position.set(tx, ty, tz); dirLight.target.updateMatrixWorld(); U_TIME.value = 0;
  RR(scene, camera); await __save(name + '.png', renderer.domElement.toDataURL('image/png')); };
const T = VEHICLES.filter(v => v.kind === 'tractor' && !v.ai), onRoute = tires.filter(t => t.kind === 'tire' && (() => { const r = roadInfo(t.x, t.z); return r.d2 < (wAt(r.idx)*0.5 + 0.8)**2; })()).length;
for (let k = 0; k < Math.min(3, T.length); k++) await view('corner_t' + k, T[k].x, T[k].z, 45, 0.5, 0.5);
if (finishLine) await view('corner_finish', finishLine.position.x, finishLine.position.y, 70, 0.5, 30);
if (T[0]) { await view('corner_t0_far', T[0].x, T[0].z, 70, 0.5, 30); }
const fl = finishLine ? [Math.round(finishLine.position.x), Math.round(finishLine.position.y)] : null;
// drive-through check: from each tractor's corner, is the straight cut blocked? count props within 2 m of the chord mid
return { fl, tractors: T.length, tractorMass: T.map(v => v.mass), tyres: tires.filter(t => t.kind === 'tire').length, tyresOnRoute: onRoute, at: T.map(v => Math.round(v.x) + ',' + Math.round(v.z)) };
