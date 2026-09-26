// deterministic laps: drive the car along the route at a fixed speed (no physics), through the real timing/ghost code
localStorage.removeItem('ylasto1988-haamu-v1'); ghost = null; bestTime = Infinity;
const n = trackPoints.length, cum = [0];
for (let i = 1; i <= n; i++) { const a = trackPoints[i-1], b = trackPoints[i % n]; cum.push(cum[i-1] + Math.hypot(b.x-a.x, b.y-a.y)); }
const L = cum[n];
const posAt = (s) => { s = ((s % L) + L) % L; let i = 1; while (cum[i] < s) i++; const a = trackPoints[i-1], b = trackPoints[i % n], f = (s - cum[i-1])/(cum[i] - cum[i-1] || 1); return { x: a.x + (b.x-a.x)*f, z: a.y + (b.y-a.y)*f, ang: Math.atan2(b.x-a.x, b.y-a.y) }; };
const gi = gridIndex(), sGrid = cum[gi];
const lap = (speed, probeAt) => {
  startRace(false); gameState = State.RACING; const dt = 1/60; let s = sGrid, frames = 0, probe = null, startedAt = null, deltas = [];
  const origShow = showDelta; showDelta = (d, big) => { deltas.push(+d.toFixed(2)); };
  while (gameState === State.RACING && frames < 60*400) {
    s += speed*dt; const P = posAt(s); car.x = P.x; car.z = P.z; car.angle = P.ang; car.vx = Math.sin(P.ang)*speed; car.vz = Math.cos(P.ang)*speed;
    updateCheckpoints(dt); if (gameState !== State.RACING) break; updateHUD(dt); updateGhost(dt); frames++;
    if (lapStarted && startedAt === null) startedAt = +((s - sGrid)/speed).toFixed(2);
    if (probeAt && !probe && raceTime > probeAt && ghostGroup.visible) probe = { t: +raceTime.toFixed(2), playerToGhostM: +Math.hypot(ghostGroup.position.x - car.x, ghostGroup.position.z - car.z).toFixed(1), ghostAhead: (() => { const d = getDir(car.prog); return (ghostGroup.position.x - car.x)*d.x + (ghostGroup.position.z - car.z)*d.y > 0; })() };
  }
  showDelta = origShow;
  return { speed, time: +raceTime.toFixed(3), expected: +(L/speed).toFixed(3), clockStartedAfterS: startedAt, cps: checkpointsPassed + '/' + totalCheckpoints, ghostTime: ghost ? +ghost.time.toFixed(3) : null, samples: ghost ? ghost.s.length/4 : 0, deltas, probe };
};
const g0 = trackPoints[gi], line = finishLine.position;
const grid = { idx: gi, n, metresBeforeLine: +(L - sGrid).toFixed(1), onStreet: (() => { let best = null; sideRoads.forEach(R => R.pts.forEach(p => { const d = Math.hypot(p.x - g0.x, p.y - g0.y); if (!best || d < best.d) best = { d, name: R.name }; })); return best.name; })(), carAtGrid: (() => { startRace(false); return Math.hypot(car.x - g0.x, car.z - g0.y) < 0.01; })(), timerAtGo: raceTime };
const r1 = lap(20), r2 = lap(22, 30), r3 = lap(18, 30);
const saved = JSON.parse(localStorage.getItem('ylasto1988-haamu-v1') || 'null');
return { grid, r1, r2, r3, stored: saved ? { time: +saved.time.toFixed(3), samples: saved.s.length/4, kb: +(JSON.stringify(saved).length/1024).toFixed(1) } : null, bestTime: +bestTime.toFixed(3) };
