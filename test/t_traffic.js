// GTA traffic: 15 cars + 3 buses set off in FREE mode and keep driving the streets (no jams, no pile-ups, on the road); the race keeps
// them parked; leaving FREE puts them home
initAudio = () => {}; renderer.render = () => {}; const realRender = renderer.__rr;
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
startRace(false); step(60*4); const out = { raceMoving: VEHICLES.filter(v => v.kind === 'car' && Math.hypot(v.x - v.home.x, v.z - v.home.z) > 1).length };
freeEnter(); out.n = TRAFFIC.list.length; out.buses = TRAFFIC.list.filter(v => v.kind === 'bus').length;
{ const b = BALES[0]; car.x = b.x + 4; car.z = b.z + 4; car.vx = car.vz = 0; }   // (the rally car out of the way: on a field)
const S = TRAFFIC.list.map(v => ({ v, dist: 0, px: v.x, pz: v.z, still: 0, maxStill: 0, stills: 0, off: 0, dmg0: v.damage }));
const secs = 80; let t0 = performance.now();
step(60*secs, () => { for (const s of S) { const d = Math.hypot(s.v.x - s.px, s.v.z - s.pz); s.dist += d; s.px = s.v.x; s.pz = s.v.z;
  if (d < 0.01) { s.still += 1/60; if (s.still > s.maxStill) s.maxStill = s.still; } else { if (s.still > 12) s.stills++; s.still = 0; }
  if (!onRoad(s.v.x, s.v.z, 1.5)) s.off += 1/60; } });
out.msPerFrame = +((performance.now() - t0)/(60*secs)).toFixed(2);
out.cars = S.map(s => [s.v.kind[0], Math.round(s.dist), +s.maxStill.toFixed(0), s.stills, +s.off.toFixed(0), +(s.v.damage - s.dmg0).toFixed(1), s.v.fire ? 'FIRE' : '', s.v.traffic ? s.v.traffic.mode : '-'].join(' '));
out.summary = { meanDist: Math.round(S.reduce((a, s) => a + s.dist, 0)/S.length), under100m: S.filter(s => s.dist < 100).length, longStills: S.reduce((a, s) => a + s.stills, 0), fires: S.filter(s => s.v.fire).length, damaged: S.filter(s => s.v.damage - s.dmg0 > 3).length, offRoadSecs: Math.round(S.reduce((a, s) => a + s.off, 0)) };
freeExit(); out.afterExit = { list: TRAFFIC.list.length, notHome: VEHICLES.filter(v => !v.temp && Math.hypot(v.x - v.home.x, v.z - v.home.z) > 0.5).length, withAi: S.filter(s => s.v.ai).length };
return out;
