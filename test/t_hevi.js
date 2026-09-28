// the gig bus: B on → it comes; it tears round the streets (too fast), never stuck for long, never burns; parked in its way the rally
// car gets shoved; people get bowled over; B off → it goes out of sight and is gone; a restart clears it
startRace(false); step(60*4); const out = {}; bassToggle(); step(2); const v = HEVI.v; out.spawned = !!v; if (!v) return out;
out.from = Math.round(Math.hypot(v.x - car.x, v.z - car.z));
{ const b = BALES[0]; car.x = b.x + 4; car.z = b.z + 4; car.vx = car.vz = 0; }   // (the rally car out of the way)
let dist = 0, px = v.x, pz = v.z, vmax = 0, slow = 0, off = 0, down0 = HUMANS.filter(h => h.down).length, revs = 0, wasRev = false, stills = 0;
step(60*90, () => { dist += Math.hypot(v.x - px, v.z - pz); px = v.x; pz = v.z; const sp = Math.hypot(v.vx, v.vz); vmax = Math.max(vmax, sp); if (sp < 2) slow++; if (v.offPath > 6) off++; if (v.H.rev > 0 && !wasRev) revs++; wasRev = v.H.rev > 0; });
out.drive90 = { m: Math.round(dist), avgKmh: Math.round(dist/90*3.6), maxKmh: Math.round(vmax*3.6), slowS: +(slow/60).toFixed(1), offPathS: +(off/60).toFixed(1), reversals: revs, fire: !!v.fire, gone: !!v.gone, knocked: HUMANS.filter(h => h.down).length - down0 };
{ let k = 0; while (k++ < 60*20 && (v.offPath > 1 || Math.hypot(v.vx, v.vz) < 12)) step(1); }   // (on the road, going)
{ const bx = car.x, bz = car.z; car.x = v.x + 60; car.z = v.z; const fx = Math.sin(v.yaw), fz = Math.cos(v.yaw); await shot('hevi_side', v.x, v.z, fz*13 + fx*6, -fx*13 + fz*6, 3.5, 1.8); await shot('hevi_roof', v.x + fx*1, v.z + fz*1, fx*7 + fz*4, fz*7 - fx*4, 5.2, 4.0); await shot('hevi_rear', v.x, v.z, -fx*16 - fz*3, -fz*16 + fx*3, 5, 2); out.roofBand = v.crew.filter(h => h.seat && !h.far && h.view.g.visible).length; car.x = bx; car.z = bz; }
// the rally car parked in its way, 45 m ahead on its path
{ const [cx, cz] = pathAt(v, v.s + 45), [nx, nz] = pathAt(v, v.s + 47); car.x = cx; car.z = cz; car.angle = Math.atan2(nx - cx, nz - cz) + Math.PI/2; car.vx = car.vz = 0; const c0 = [car.x, car.z], s0 = Math.hypot(v.vx, v.vz); let minD = 99, spAt = 0, dmg0 = carParts.filter(p => p.state !== 'ok').length;
  step(60*6, () => { const d = Math.hypot(v.x - car.x, v.z - car.z); if (d < minD) { minD = d; spAt = Math.hypot(v.vx, v.vz); } });
  out.ram = { busKmhBefore: Math.round(s0*3.6), closest: +minD.toFixed(1), busKmhAtHit: Math.round(spAt*3.6), carShovedM: +Math.hypot(car.x - c0[0], car.z - c0[1]).toFixed(1), carDents: carParts.filter(p => p.state !== 'ok').length - dmg0, busKmhAfter: Math.round(Math.hypot(v.vx, v.vz)*3.6), busFire: !!v.fire }; }
{ const b = BALES[0]; car.x = b.x + 4; car.z = b.z + 4; car.vx = car.vz = 0; }
bassToggle(); let goneAt = null; step(60*40, (i) => { if (v.gone) { goneAt = +(i/60).toFixed(1); return false; } }); out.bassOff = { leave: HEVI.leave, goneAfterS: goneAt, cleared: HEVI.v === null };
bassToggle(); step(2); out.again = !!HEVI.v; startRace(false); step(5); out.afterRestart = { bass: BASS.on, bus: !!HEVI.v, inList: VEHICLES.some(q => q.kind === 'hevi') };
return out;
