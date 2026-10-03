// GTA mode: moving yard cars keep their wheels (far-detail) and aren't culled away from their parked chunk
initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); }; st(30);
freeEnter(); st(60*20); R0(scene, camera); const bad = []; let n = 0;
for (const v of TRAFFIC.list) { if (v.view.kind !== 'inst') continue; n++; for (const P of v.view.c.inst) if (!P.im.visible || P.im.frustumCulled) bad.push([P.im.userData.key, P.im.visible, P.im.frustumCulled, !!P.im.userData.dyn, !!P.im.userData.farHid, _fdList.includes(P.im)]); }
return { traffic: n, bad: bad.length, sample: bad.slice(0, 5) };
