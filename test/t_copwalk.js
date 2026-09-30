// on foot the police come for you, not the parked car: they drive to you, and standing (or walking) you're caught — the officer
// wags his finger at you face to face; running away you can get off
initAudio = () => {}; renderer.render = () => {};
const step = (k, f) => { for (let i = 0; i < k; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
startRace(false); step(60*2); walkOut(); const h = WALK.h, out = {}; keys.ArrowUp = true; step(60*4); keys.ArrowUp = false; step(10);
out.fromCar = +Math.hypot(h.x - car.x, h.z - car.z).toFixed(1); policeSpawn(1); let minD = 1e9;
step(60*30, () => { for (const v of POLICE.cars) if (!v.gone) minD = Math.min(minD, Math.hypot(v.x - h.x, v.z - h.z)); if (POLICE.hold > 0 && !out.bustS) out.bustS = true; if (h.down) out.knocked = true; if (POLICE.hold > 0 && POLICE.hold < 3) { const off = HUMANS.find(q => q.task && q.task.kind === 'officer' && !q.gone); if (off) { out.officerToYou = +Math.hypot(off.x - h.x, off.z - h.z).toFixed(1); out.officerToCar = +Math.hypot(off.x - car.x, off.z - car.z).toFixed(1); } } });
out.nearestCar = +minD.toFixed(1); out.busted = !!out.bustS;
walkIn(true); return out;
