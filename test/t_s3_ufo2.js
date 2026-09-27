// the UFO chain over seven minutes: who comes, who gets shot, whether the ones after the cap get the job done
startRace(false); step(60*4); const out = {}, U = UFOS[0], a = Math.atan2(car.x - U.x, car.z - U.z);
car.x = U.x + Math.sin(a)*60; car.z = U.z + Math.cos(a)*60; car.angle = a + Math.PI; car.vx = car.vz = 0;
step(60*8, () => { keys.ArrowUp = Math.hypot(car.vx, car.vz) < 9; car.angle = Math.atan2(U.x - car.x, U.z - car.z); return !WRECK.on; }); keys.ArrowUp = false;
out.wreck = WRECK.on; const log = [];
step(60*420, (i) => { if (i % (60*30) === 0) log.push(Math.round(i/60) + 's k' + U.kills + ' q' + DISPATCH.queue.length + ' f' + FIRES.length + ' [' + VEHICLES.filter(v => (v.kind === 'ambulance' || v.kind === 'fire') && !v.ufoHit).map(v => v.kind[0] + ':' + (v.job && v.job.phase) + ':' + Math.round(v.total - v.s) + ':' + (v.stuckT || 0).toFixed(0)).join(' ') + '] down' + HUMANS.filter(h => h.down && !h.gone).length); });
out.log = log; out.driverGone = WRECK.driver && WRECK.driver.gone; out.wrecks = VEHICLES.filter(v => v.ufoHit).length;
return out;
