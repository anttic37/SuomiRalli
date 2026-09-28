// a car at 15 m/s square into a concrete pig vs into a tyre stack: speed kept right after, how far each one goes
startRace(false); step(60*2); const out = {};
for (const kind of ['tire', 'pig']) { const L = tires.filter(t => t.kind === kind && !t.off), P = L[Math.floor(L.length/3)], a = Math.random()*6.3, nx = Math.sin(a), nz = Math.cos(a);
  car.x = P.x - nx*6; car.z = P.y === undefined ? P.z - nz*6 : P.z - nz*6; car.angle = a; car.vx = nx*15; car.vz = nz*15; const p0 = [P.x, P.z]; let after = null, hitI = -1;
  step(120, (i) => { keys.ArrowUp = true; const sp = car.vx*nx + car.vz*nz; if (hitI < 0 && Math.hypot(P.x - p0[0], P.z - p0[1]) > 0.05) hitI = i; if (hitI >= 0 && i === hitI + 12) after = +sp.toFixed(1); });
  keys.ArrowUp = false; out[kind] = { keptMs: after, of: 15, movedM: +Math.hypot(P.x - p0[0], P.z - p0[1]).toFixed(1) }; startRace(false); step(60*2); }
return out;
