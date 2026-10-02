// on foot: speed ramps, stride bob, lean into the run and into turns (2.10. 'joustoa')
initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); }; st(60);
walkOut(); st(60); const h = WALK.h, rec = [];
keys.ArrowUp = true; for (let i = 0; i < 40; i++) { st(1); if (i % 4 === 0) rec.push(['go', +WALK.spd.toFixed(2), +h.tilt.toFixed(3), +h.pose.dy.toFixed(3)]); }
keys.ArrowLeft = true; WALK.camA = h.yaw; let maxRoll = 0; for (let i = 0; i < 30; i++) { st(1); maxRoll = Math.min(maxRoll, h.roll); }
renderer.render = R0; camera.position.set(h.x - Math.sin(h.yaw)*4, Y(h.x, h.z) + 1.8, h.z - Math.cos(h.yaw)*4); camera.lookAt(h.x, Y(h.x, h.z) + 1, h.z); await __shot('wf_turn'); renderer.render = () => {}; keys.ArrowLeft = false; st(30);
keys.ArrowUp = false; for (let i = 0; i < 30; i++) { st(1); if (i % 4 === 0) rec.push(['stop', +WALK.spd.toFixed(2), +h.tilt.toFixed(3)]); }
return { rec, maxRoll: +maxRoll.toFixed(3), endRoll: +h.roll.toFixed(3) };
