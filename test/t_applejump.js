// apple picking as a jump (the hand at the apple at the top), and the owner: out of the house, a look round, a shout, then the chase
initAudio = () => {}; const R0 = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); }; st(60);
const res = { picks: [], modes: [] };
const A = APPLES.list.find(a => Math.hypot(a.x, a.z) < 300 && clearSpot(a.x + 1.2, a.z, 0.4));
car.x = A.x + 9; car.z = A.z + 9; car.vx = car.vz = car.speed = 0; st(2); walkOut(); const h = WALK.h; h.x = A.x + 1.6; h.z = A.z; h.vx = h.vz = 0;
let lastM = null, shotPeak = false, shotShout = false, shotOut = false, maxHop = 0;
for (let f = 0; f < 60*7; f++) { st(1); maxHop = Math.max(maxHop, h.hop);
  for (const F of APPLES.fly) if (!F.done && F.t >= F.tp) { F.done = true; const hx = h.x + Math.sin(h.yaw)*0.4, hz = h.z + Math.cos(h.yaw)*0.4, hy = Y(h.x, h.z) + h.hop + APPLES.HAND;
    res.picks.push({ t: +(f/60).toFixed(2), appleUp: +(F.p[1] - Y(h.x, h.z)).toFixed(2), hop: +h.hop.toFixed(2), handToApple: +Math.hypot(F.p[0] - hx, F.p[1] - hy, F.p[2] - hz).toFixed(2) });
    if (!shotPeak) { shotPeak = true; renderer.render = R0; const cp = camera.position.clone(), cq = camera.quaternion.clone(); { const ux = h.x - A.x, uz = h.z - A.z, ul = Math.hypot(ux, uz) || 1, sx = -uz/ul, sz = ux/ul; camera.position.set(h.x + sx*6 + ux/ul*2, Y(h.x, h.z) + 2.6, h.z + sz*6 + uz/ul*2); camera.lookAt(h.x, Y(h.x, h.z) + 1.9, h.z); } await __shot('aj_peak'); camera.position.copy(cp); camera.quaternion.copy(cq); await __shot('aj_peakgame'); renderer.render = () => {}; } }
  const C = APPLES.chase[0]; if (C && C.m !== lastM) { lastM = C.m; res.modes.push([C.m, +(f/60).toFixed(2), Math.round(Math.hypot(C.h.x - h.x, C.h.z - h.z))]); }
  if (C && C.m === 'out' && C.t > 0.5 && !shotOut) { shotOut = true; renderer.render = R0; await __shot('aj_out'); renderer.render = () => {}; }
  if (C && C.m === 'shout' && C.t > 0.4 && !shotShout) { shotShout = true; renderer.render = R0; await __shot('aj_shout'); renderer.render = () => {}; }
  if (C && C.m === 'run' && f > 0) { h.x = A.x + 1.6; h.z = A.z; } }
res.maxHop = +maxHop.toFixed(2); res.bag = APPLES.bag;
return res;
