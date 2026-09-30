// 30.9. six: speed cameras flash over 80 km/h (rap v), a sausage to the window (burp smoke), a yard dog rides along, grandma crosses
// at the zebra (good deed), a flock of birds past the woods, the sauna gang runs to the road to shout
initAudio = () => {}; renderer.render = () => {}; startRace(false); let T0 = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T0 += 1000/60; loop(T0); } };
step(30); lapStarted = true; const out = {}, uc = updateCar; let V = [0, 0];
const drive = (vx, vz) => { V = [vx, vz]; updateCar = (dt) => { car.vx = V[0]; car.vz = V[1]; car.speed = Math.hypot(V[0], V[1]); car.x += V[0]*dt; car.z += V[1]*dt; }; };
const put = (x, z, a) => { car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; car.vx = car.vz = 0; };
// 1 speed camera: 30 m/s past the first
out.cams = CAMS.length; if (CAMS[0]) { const C = CAMS[0], a = trackPoints[C.i], b = trackPoints[(C.i + 3) % trackPoints.length], ang = Math.atan2(b.x - a.x, b.y - a.y); put(a.x - Math.sin(ang)*40, a.y - Math.cos(ang)*40, ang); drive(Math.sin(ang)*30, Math.cos(ang)*30); const v0 = RAP.v; step(60*3); out.camV = RAP.v; out.flashed = RAP.v > v0; }
// 2 sausage: stop at a cart
drive(0, 0); out.carts = MAKKARA.carts.length; const Ct = MAKKARA.carts.find(c => !c.G.userData.hide); if (Ct) { const [x, z] = lloc(Ct.x, Ct.z, Ct.yaw, 0, 5); put(x, z, Ct.yaw); step(60*8); out.sausage = MAKKARA.got; out.smoke = MAKKARA.smoke > 0; }
// 3 a yard dog: stop 8 m off it
const dogs = HUMANS.filter(h => h.task && h.task.kind === 'yarddog'); out.dogs = dogs.length; if (dogs[0]) { const d = dogs[0]; put(d.x + 7, d.z, 0); step(60*6); out.dogIn = !!DOGRIDE.D; drive(0, 12); step(60*7); out.stillIn = !!DOGRIDE.D; drive(0, 0); step(60*3); out.dogOff = !DOGRIDE.D; }
// 4 grandma: stop 10 m short of the zebra
out.mummo = !!MUMMO.h; if (MUMMO.h) { const n = trackPoints.length, p = trackPoints[(MUMMO.i - 5 + n) % n], q = trackPoints[MUMMO.i], ang = Math.atan2(q.x - p.x, q.y - p.y); put(p.x, p.y, ang); const h0 = RAP.h; step(60*25, () => { if (MUMMO.h.st && MUMMO.h.st.m === 'thank') return false; }); out.crossed = RAP.h - h0; out.mSide = MUMMO.h.st && MUMMO.h.st.side; }
// 5 birds: fast past woods
let best = null; for (let i = 0; i < trackPoints.length; i += 9) { const p = trackPoints[i]; const t = treeCount(p.x, p.y, 40); if (!best || t > best.t) best = { i, t }; }
{ const n = trackPoints.length, p = trackPoints[best.i], q = trackPoints[(best.i + 6) % n], ang = Math.atan2(q.x - p.x, q.y - p.y); put(p.x, p.y, ang); drive(Math.sin(ang)*25, Math.cos(ang)*25); BIRDS.t = 0; let fl = 0; step(60*4, () => { fl = Math.max(fl, BIRDS.list.filter(b => b.live).length); }); out.birds = fl; }
// 6 sauna gang
const sh = HUMANS.filter(h => h.task && h.task.kind === 'sauna'); out.sauna = sh.length; if (sh.length) { const S0 = sh[0]; let S = null; out.saunaNearRoute = null;
  const R0 = roadInfo(S0.x, S0.z); out.saunaRouteDist = Math.round(Math.sqrt(R0.d2)); const n = trackPoints.length, p = trackPoints[(R0.idx - 20 + n) % n], ang = Math.atan2(trackPoints[R0.idx].x - p.x, trackPoints[R0.idx].y - p.y); put(p.x, p.y, ang); drive(Math.sin(ang)*20, Math.cos(ang)*20);
  let sh2 = 0; step(60*4, () => { sh2 = Math.max(sh2, sh.filter(h => h.st && h.st.m === 'shout').length); }); out.shouting = sh2; }
updateCar = uc; return out;
