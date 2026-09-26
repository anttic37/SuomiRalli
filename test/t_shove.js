// the rally car into a parked car (clear approach): it gets shoved and spun, comes to rest; into a bus: barely moves
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*2);
const out = {};
for (const [kind, sp] of [['car', 12], ['car', 22], ['bus', 15]]) {
  let v = null;
  for (const o of VEHICLES) { if (o.kind !== kind || o.damage || Math.hypot(o.x - car.x, o.z - car.z) < 50) continue; const ux = Math.cos(o.yaw), uz = -Math.sin(o.yaw);
    const sx = o.x - ux*9, sz = o.z - uz*9, blocked = VEHICLES.some(p => p !== o && Math.hypot(p.x - (o.x - ux*4.5), p.z - (o.z - uz*4.5)) < 5) || STATIC_LIST.some(b => Math.hypot(b.x - (o.x - ux*4.5), b.z - (o.z - uz*4.5)) < Math.hypot(b.hw, b.hl) + 3);
    if (!blocked) { v = o; break; } }
  if (!v) { out[kind + sp] = 'none'; continue; }
  const x0 = v.x, z0 = v.z, y0 = v.yaw, ux = Math.cos(v.yaw), uz = -Math.sin(v.yaw);
  car.x = v.x - ux*7; car.z = v.z - uz*7; car.angle = Math.atan2(ux, uz); car.vx = ux*sp; car.vz = uz*sp;
  let maxV = 0, restT = null;
  const tr = []; step(60*6, i => { if (i < 60 && i % 3 === 0) tr.push(Math.hypot(car.vx, car.vz).toFixed(1) + (v.awake ? '*' : '')); maxV = Math.max(maxV, Math.hypot(v.vx, v.vz)); if (restT === null && i > 10 && !v.awake) restT = (i/60).toFixed(2); });
  out[kind + sp] = { moved: Math.hypot(v.x - x0, v.z - z0).toFixed(2), turned: (v.yaw - y0).toFixed(2), maxV: maxV.toFixed(1), carSpeedAfter: Math.hypot(car.vx, car.vz).toFixed(1), damage: v.damage.toFixed(1), fire: !!v.fire, restT, tr: tr.join(' '), instOK: v.view.kind === 'inst' ? v.view.c.inst.length : 'mesh' };
  car.vx = car.vz = 0; car.x += 200;
}
return out;
