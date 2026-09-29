// the hitchhiker: stop by him → he walks to the passenger door and gets in (HUD, minimap); stop in the K-shop yard → out, thanks,
// a good deed (RAP.h); speeding past → a fist; R → back at his spot
initAudio = () => {}; renderer.render = () => {}; startRace(false); let T0 = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); T0 += 1000/60; loop(T0); } };
step(30); lapStarted = true; const out = { built: !!HITCH.h, spot: HITCH.spot && [Math.round(HITCH.spot.x), Math.round(HITCH.spot.z)] }; if (!HITCH.h) return out; const h = HITCH.h, S = HITCH.spot;
const put = (x, z, a) => { car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; car.vx = car.vz = car.speed = 0; };
const uc = updateCar; let fist = false; const V = [S.ux*25, S.uz*25]; updateCar = (dt) => { car.vx = V[0]; car.vz = V[1]; car.x += V[0]*dt; car.z += V[1]*dt; };
put(S.x - S.ux*40 - S.uz*4.5, S.z - S.uz*40 + S.ux*4.5, Math.atan2(S.ux, S.uz));
step(60*3, () => { if (HITCH.fistT > 0) fist = true; }); out.fist = fist;
put(S.x - S.uz*4.5, S.z + S.ux*4.5, Math.atan2(S.ux, S.uz)); out.downAfterPass = h.down; updateCar = (dt) => { car.vx = car.vz = car.speed = 0; };
const h0 = RAP.h; let t = 0; step(60*12, () => { if (!HITCH.aboard) t++; else if (!out.boardS) out.boardS = +(t/60).toFixed(1); });
out.aboard = HITCH.aboard; out.inside = h.inside; out.hud = document.getElementById('hitch-hud').textContent;
const K = HITCH.K; put(ES.door[0] + 8, ES.door[1] + 8, 0); step(60*2); out.dropped = !HITCH.aboard; out.good = RAP.h - h0; out.hudAfter = document.getElementById('hitch-hud').textContent;
step(60*12); out.inShop = h.inside && h.st && h.st.mode;
updateCar = uc; startRace(false); step(30); out.afterR = [Math.round(Math.hypot(h.x - S.x, h.z - S.z)*10)/10, h.inside, HITCH.aboard, h.st ? h.st.mode : null];
return out;
