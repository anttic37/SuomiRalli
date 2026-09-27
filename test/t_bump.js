// people vs things (within 120 m of the car): over 30 s of racing, how often each kind of person stands inside a house, tree trunk, yard thing, vehicle or another person
initAudio = () => {}; renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 14; };
step(60*3.3); treeNear(0, 0, 0);
const bad = {}, add = (k, w) => { const o = bad[k] || (bad[k] = { house: 0, tree: 0, yard: 0, veh: 0, ppl: 0 }); o[w]++; };
for (let f = 0; f < 60*30; f++) { step(1, steer); if (f % 6) continue;
  for (const h of HUMANS) { if (h.gone || h.inside || h.seat || h.ride || h.down || h.animal || (h.task && h.task.onRoad && h.task.onRoad())) continue; const k = h.task ? h.task.kind : '-';
    if (k === 'roofer' || k === 'stand' || Math.hypot(h.x - car.x, h.z - car.z) > 120) continue;   // (the bumping runs within 130 m of the car)
    let hit = false; staticNear(h.x, h.z, 1, B => { if (!hit && boxPush(B, h.x, h.z, h.r - 0.05)) hit = true; }); if (hit) add(k, 'house');
    if (treeNear(h.x, h.z, h.r + 0.1)) add(k, 'tree');
    if (typeof YARD_SOLID !== 'undefined' && YARD_SOLID.some(t => Math.hypot(t[0] - h.x, t[1] - h.z) < t[2] + h.r - 0.05)) add(k, 'yard');
    for (const v of VEHICLES) if (Math.abs(v.x - h.x) < 7 && Math.abs(v.z - h.z) < 7 && boxPush(v, h.x, h.z, h.r - 0.05)) { add(k, 'veh'); break; }
    let pp = false; forHumansNear(h.x, h.z, 1, o => { if (o !== h && !o.down && !o.inside && !o.seat && Math.hypot(o.x - h.x, o.z - h.z) < (h.r + o.r)*0.6) pp = true; }); if (pp) add(k, 'ppl'); } }
return bad;
