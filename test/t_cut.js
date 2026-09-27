// corner cutting: an honest autopilot lap stays valid; a lap with a cut across the grass is flagged (no best, no ghost, no leaderboard)
initAudio = () => {}; startRace(false); renderer.render = () => {};
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI;
  const tp2 = trackPoints[(car.prog + 14) % n]; let dB = Math.atan2(tp2.x - car.x, tp2.y - car.z) - car.angle; while (dB > Math.PI) dB -= 2*Math.PI; while (dB < -Math.PI) dB += 2*Math.PI;
  keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; const vmax = Math.abs(dB) > 0.6 ? 9 : Math.abs(dB) > 0.3 ? 13 : 19; const v = Math.hypot(car.vx, car.vz); keys.ArrowUp = v < vmax; keys.ArrowDown = v > vmax + 3; };
const out = {};
// 1. an honest lap
step(60*3.2); step(60*400, () => { steer(); if (gameState === State.FINISHED) return false; });
out.honest = { finished: gameState === State.FINISHED, cut: CUT.bad, best: isFinite(bestTime), offered: !!ONLINE.lastRun || !ONLINE.ok, text: document.getElementById('best-time-display').textContent.slice(0, 40) };
// 2. a lap with a cut: at a stretch whose straight line is ≥ 40 m shorter than the road (no checkpoint in it), the car goes straight across
const best0 = bestTime; startRace(false); step(60*3.2); const P = trackPoints, n = P.length, cps = checkpoints.map(c => c.ti);
let pair = null; for (let i = 60; i < n - 80 && !pair; i += 2) { const j = i + 60; if (cps.some(c => c > i && c < j)) continue; let ar = 0; for (let k = i; k < j; k++) ar += Math.hypot(P[k + 1].x - P[k].x, P[k + 1].y - P[k].y); if (ar - Math.hypot(P[j].x - P[i].x, P[j].y - P[i].y) > 40) pair = [i, j]; }
step(60*300, () => { steer(); if (car.prog >= pair[0] && lapStarted) return false; });
{ const a = P[car.prog], b = P[pair[1]], D = Math.hypot(b.x - a.x, b.y - a.y), ux = (b.x - a.x)/D, uz = (b.y - a.y)/D;   // straight across at 15 m/s (through whatever is there: only the rule is tested)
  for (let s = 0; s <= D; s += 0.25) { car.x = a.x + ux*s; car.z = a.y + uz*s; car.vx = ux*15; car.vz = uz*15; car.angle = Math.atan2(ux, uz); T += 1000/60; loop(T); car.x = a.x + ux*s; car.z = a.y + uz*s; } }
out.cutFlagged = CUT.bad; out.cutAt = CUT.at; out.pair = pair;
step(60*400, () => { steer(); if (gameState === State.FINISHED) return false; });
out.cutLap = { finished: gameState === State.FINISHED, bestKept: bestTime === best0, offered: !!ONLINE.lastRun, text: document.getElementById('best-time-display').textContent.slice(0, 40) };
return out;
