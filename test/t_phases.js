const n = trackPoints.length, cum = [0]; for (let i = 1; i <= n; i++) { const a = trackPoints[i-1], b = trackPoints[i % n]; cum.push(cum[i-1] + Math.hypot(b.x-a.x, b.y-a.y)); }
const L = cum[n], posAt = (s) => { s = ((s % L) + L) % L; let i = 1; while (cum[i] < s) i++; const a = trackPoints[i-1], b = trackPoints[i % n], f = (s - cum[i-1])/(cum[i] - cum[i-1] || 1); return { x: a.x + (b.x-a.x)*f, z: a.y + (b.y-a.y)*f, ang: Math.atan2(b.x-a.x, b.y-a.y) }; };
startRace(false); gameState = State.RACING; const phStart = zonePhase.join(''); let s = cum[gridIndex()], last = phStart; const log = [];
let gatesOnRouteAhead = 0;
for (let k = 0; k < 60*200 && gameState === State.RACING; k++) { s += 20/60; const P = posAt(s); car.x = P.x; car.z = P.z; car.angle = P.ang; updateCheckpoints(1/60); updateHUD(1/60);
  const ph = zonePhase.join(''); if (ph !== last) { log.push(car.prog + ':' + ph); last = ph; }
  if (k % 30 === 0) for (const t of tires) { if (!t.gate || t.off) continue; for (let q = 0; q < 60; q++) { const r = trackPoints[(car.prog + q) % n]; if (Math.hypot(r.x - t.x, r.y - t.z) < wAt((car.prog + q) % n)*0.5 + 0.5) { gatesOnRouteAhead++; break; } } } }
const finished = gameState === State.FINISHED;
// R mid-race resets the lap clock and hides the ghost; G toggles it
startRace(false); gameState = State.RACING; for (let k = 0; k < 60*6; k++) { s = cum[gridIndex()] + k*20/60; const P = posAt(s); car.x = P.x; car.z = P.z; car.angle = P.ang; updateCheckpoints(1/60); updateHUD(1/60); updateGhost(1/60); }
const midRace = { lapStarted, raceTime: +raceTime.toFixed(2) };
const dispatch = (code) => window.dispatchEvent(new KeyboardEvent('keydown', { code }));
initAudio = () => {}; dispatch('KeyR'); const afterR = { lapStarted, raceTime, state: gameState, ghostVisible: ghostGroup.visible, prog: car.prog };
const g0 = ghostEnabled; dispatch('KeyG'); const g1 = ghostEnabled; dispatch('KeyG');
return { phasesAtStart: phStart, switches: log, finished, gatesOnRouteAhead, midRace, afterR, ghostToggle: [g0, g1, ghostEnabled] };
