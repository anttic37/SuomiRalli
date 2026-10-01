// the plane flown straight at the map's edge: no turn by itself, over the edge it blows up (SELITTÄMÄTÖN VIKA); on foot: runs by default,
// Shift creeps; the messages sit up under the top HUD rows (a shot)
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
startRace(false); step(20); const out = {}, P = PLANE; planeEnter(true); planeInit({ x: 0, z: 0, angle: -Math.PI/2 }); P.p.y = Y(0, 0) + 80; P.v.set(-40, 0, 0); P.thr = 0.6; P.air = true; P.airT = 1; step(2);
const hd0 = Math.atan2(P.v.x, P.v.z); let edgeOn = 0, t = 0; step(60*40, () => { if (P.crashed) return; t += 1/60; if (P.edge) edgeOn++; });
out.plane = { crashed: P.crashed, at: [Math.round(P.p.x), Math.round(P.p.z)], t: +t.toFixed(1), turned: +Math.abs(angDiff(Math.atan2(P.v.x, P.v.z) - hd0)).toFixed(2), edgeFrames: edgeOn, msg: document.getElementById('pizza-msg').textContent };
startRace(false); step(30); walkOut(); const h = WALK.h; keys.ArrowUp = true; step(60); out.runKmh = +(Math.hypot(h.vx, h.vz)*3.6).toFixed(1);
keys.ShiftLeft = true; step(30); out.sneakKmh = +(Math.hypot(h.vx, h.vz)*3.6).toFixed(1); out.sneakTilt = +h.tilt.toFixed(2); keys.ShiftLeft = false; keys.ArrowUp = false; step(5);
policeMsg('🚨 POLIISIT TULEVAT!', true); pizzaMsg('🍕 PIZZA TOIMITETTU +10 %', true); centerMsg('VÄLIAIKA 1'); RR(scene, camera); await __save('msgs.png', renderer.domElement.toDataURL('image/png'));
const r = (id) => { const b = document.getElementById(id).getBoundingClientRect(); return [Math.round(b.top), Math.round(b.bottom)]; }; out.msgY = { police: r('police-msg'), pizza: r('pizza-msg'), cp: r('checkpoint-display'), screenH: innerHeight };
return out;
