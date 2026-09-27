// people in the road at the corners: a full lap on the autopilot, three times (a new draw each race) — how many ran clear, how many
// got knocked; a shot of a bunch as the car comes
const n = trackPoints.length, out = { laps: [] };
const steer = () => { const tp = trackPoints[(car.prog + 6) % n]; let dA = angDiff(Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle); const tp2 = trackPoints[(car.prog + 14) % n], dB = angDiff(Math.atan2(tp2.x - car.x, tp2.y - car.z) - car.angle);
  keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; const vmax = Math.abs(dB) > 0.6 ? 11 : Math.abs(dB) > 0.3 ? 16 : 24, v = Math.hypot(car.vx, car.vz); keys.ArrowUp = v < vmax; keys.ArrowDown = v > vmax + 3; };
for (let lap = 0; lap < 3; lap++) { startRace(false); step(60*3.3); const R = ROADIES.pool.filter(h => !h.inside), corners = ROADIES.corners.slice(); let shotDone = lap > 0, t = 0, minD = R.map(() => 1e9);
  step(60*300, () => { steer(); t += 1/60; R.forEach((h, k) => { minD[k] = Math.min(minD[k], Math.hypot(h.x - car.x, h.z - car.z)); });
    if (!shotDone) { const h = R.find(h => h.st && h.st.mode === 'run' && Math.hypot(h.x - car.x, h.z - car.z) < 30); if (h) { shotDone = true; return false; } }
    if (gameState === State.FINISHED || POLICE.hold > 0) return false; });
  if (lap === 0) { const fx = Math.sin(car.angle), fz = Math.cos(car.angle); await shot('roadies', car.x + fx*14, car.z + fz*14, -fx*20 + fz*6, -fz*20 - fx*6, 5, 0.8);
    step(60*300, () => { steer(); R.forEach((h, k) => { minD[k] = Math.min(minD[k], Math.hypot(h.x - car.x, h.z - car.z)); }); if (gameState === State.FINISHED || POLICE.hold > 0) return false; }); }
  keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = keys.ArrowDown = false;
  out.laps.push({ corners: corners.join(','), people: R.length, knocked: R.filter(h => h.down).length, clear: R.filter(h => !h.down && h.st && (h.st.mode === 'safe' || h.st.mode === 'back' || h.st.mode === 'stand')).length, closest: +Math.min(...minD).toFixed(1), finished: gameState === State.FINISHED, police: POLICE.n, raceTime: +raceTime.toFixed(1) }); }
return out;
