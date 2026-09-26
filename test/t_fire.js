// drive into a house at speed: the car must stop at the wall (not pass through), the house catches fire, a fire engine
// comes, three firefighters get out, hose it down, get back in, and the engine drives off
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3);
let pick = null;
for (const B of STATIC_LIST) { if (B.kind !== 'house' || Math.min(B.hw, B.hl) < 3) continue; const p = ambPath(B.x, B.z); if (!p) continue; const [ex, ez] = p[p.length - 1], d = Math.hypot(ex - B.x, ez - B.z); if (d < 9 || d > 22) continue;
  if (Math.hypot(B.x - car.x, B.z - car.z) < 60) continue;
  const ux = (ex - B.x)/d, uz = (ez - B.z)/d, clear = (px, pz, r) => { const t = Math.max(0, Math.min(d, (px - B.x)*ux + (pz - B.z)*uz)), qx = B.x + ux*t, qz = B.z + uz*t; return Math.hypot(px - qx, pz - qz) > r; };
  if (VEHICLES.some(v => !clear(v.x, v.z, v.hl + 1.8)) || STATIC_LIST.some(o => o !== B && !clear(o.x, o.z, Math.hypot(o.hw, o.hl) + 1.2))) continue;
  pick = { B, ex, ez }; break; }
const B = pick.B, dx = pick.ex - B.x, dz = pick.ez - B.z, dl = Math.hypot(dx, dz), ux = dx/dl, uz = dz/dl;
// how far the wall is along u from the centre
const fx = Math.sin(B.yaw), fz = Math.cos(B.yaw), rx = fz, rz = -fx, ext = B.hl*Math.abs(ux*fx + uz*fz) + B.hw*Math.abs(ux*rx + uz*rz);
const place = () => { car.x = B.x + ux*(ext + 7); car.z = B.z + uz*(ext + 7); car.angle = Math.atan2(-ux, -uz); car.vx = -ux*17; car.vz = -uz*17; };
place();
const dists = []; let minD = 1e9;
step(60*1.5, i => { const d = (car.x - B.x)*ux + (car.z - B.z)*uz; minD = Math.min(minD, d); if (i % 10 === 0) dists.push(d.toFixed(1)); });
const burning = !!B.fire, wallGap = (minD - ext).toFixed(2);
// park the car well out of the way and watch
car.x = pick.ex + ux*40; car.z = pick.ez + uz*40; car.vx = car.vz = 0;
const log = []; let last = '', maxLevel = 0, sprayed = 0, crewOut = 0, engineSeen = null;
step(60*240, i => { car.vx = car.vz = 0;
  const v = VEHICLES.find(o => o.kind === 'fire'), f = B.fire; if (f) maxLevel = Math.max(maxLevel, f.level);
  const st = (v ? v.job.phase : DISPATCH.queue.some(q => q.kind === 'fire') ? 'queued' : 'none') + (f ? (f.out ? ' out' : ' burning') : ' nofire');
  if (v) { engineSeen = engineSeen || { len: v.total.toFixed(0) }; crewOut = Math.max(crewOut, v.crew.filter(h => !h.inside).length); if (v.job.phase === 'spray') sprayed += 1/60; }
  if (st !== last) { log.push((i/60).toFixed(1) + 's ' + st + (v ? ' @' + v.x.toFixed(0) + ',' + v.z.toFixed(0) + ' d' + Math.hypot(v.x - B.x, v.z - B.z).toFixed(0) : '') + (f ? ' lvl ' + f.level.toFixed(2) : '')); last = st; }
  if (i === 60*50 && v) __shot('fire_spray.png');
});
return { house: [B.x.toFixed(0), B.z.toFixed(0), (B.hw*2).toFixed(1), (B.hl*2).toFixed(1)], ext: ext.toFixed(1), dists, wallGap, burning, maxLevel: maxLevel.toFixed(2), sprayed: sprayed.toFixed(1), crewOut, engineSeen, log, vehiclesLeft: VEHICLES.filter(v => v.temp).length, humansTemp: HUMANS.filter(h => h.temp).length };
