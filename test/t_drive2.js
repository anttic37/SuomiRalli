// responders with the driving model: several patients in different places → each ambulance drives there, parks, leaves
initAudio = () => {}; renderer.render = () => {};
startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3); UFOS.forEach(U => { U.cool = 1e9; });   // (the car is parked next to random patients, one may be by a UFO: this test is about the driving)
const pool = HUMANS.filter(h => h.task.kind === 'spectate' || h.task.kind === 'cook' || h.task.kind === 'mow');
const picks = []; for (let k = 0; k < 40 && picks.length < 6; k++) { const h = pool[Math.floor(Math.random()*pool.length)]; if (picks.some(p => Math.hypot(p.x - h.x, p.z - h.z) < 80)) continue; picks.push(h); }
const res = [];
for (const vic of picks) {
  worldReset(); car.x = vic.x + 60; car.z = vic.z + 60; car.vx = car.vz = 0; step(5); knock(vic, 0, 0, 1);
  const L = { vic: [vic.x.toFixed(0), vic.z.toFixed(0), vic.task.kind], phases: [], maxOff: 0, turned: false, exitFwd: null, hits: 0 }; let last = '', A = null;
  const dmg0 = new Map(VEHICLES.map(v => [v, v.damage]));
  const diag = (A) => { const { nodes } = roadGraph(), fx = Math.sin(A.yaw), fz = Math.cos(A.yaw); let si = -1, sd = 1e9; for (let i = 0; i < nodes.length; i++) { const n = nodes[i], dx = n.x - A.x, dz = n.z - A.z, d = Math.hypot(dx, dz); if (d < 4 || d > 22 || dx*fx + dz*fz < 0.75*d) continue; if (d < sd) { sd = d; si = i; } }
    const rej = { cand: 0, back: 0, past: 0 }; if (si >= 0) { const { dist, prev } = rgDijkstra(si); for (let i = 0; i < nodes.length; i++) { const d = dist[i]; if (!isFinite(d) || d < 120 || d > 320) continue; rej.cand++;
      const P = []; for (let j = i; j >= 0; j = prev[j]) { P.push(j); if (j === si) break; } P.reverse(); const n0 = nodes[P[0]], n1 = nodes[P[1]]; if ((n1.x - n0.x)*fx + (n1.z - n0.z)*fz < 0) { rej.back++; continue; } if (P.some(j => Math.hypot(nodes[j].x - A.x, nodes[j].z - A.z) < 3.5)) { rej.past++; continue; } } }
    return { si, sd: sd.toFixed(1), rej, yaw: A.yaw.toFixed(2) }; };
  step(60*150, i => { car.vx = car.vz = 0; const a = VEHICLES.find(v => v.kind === 'ambulance'); if (a) A = a; if (!A) return;
    const ph = A.gone ? 'gone' : A.job.phase; if (ph !== last) { L.phases.push((i/60).toFixed(1) + ' ' + ph + (ph === 'leave' ? (A.turn ? '(turn)' : '(fwd)') : '')); if (ph === 'leave') L.exitFwd = !A.turn; if (ph === 'shut') L.diag = diag(A); last = ph; }
    if (!A.gone && (ph === 'drive' || ph === 'leave') && !A.turn) L.maxOff = Math.max(L.maxOff, A.offPath || 0); if (A.turn) L.turned = true; if (!A.gone && ph === 'leave' && i % 90 === 0) { (L.tr = L.tr || []).push([(i/60).toFixed(0), A.x.toFixed(0), A.z.toFixed(0), A.yaw.toFixed(2), A.vF.toFixed(1), A.s.toFixed(0) + '/' + A.total.toFixed(0), (A.offPath||0).toFixed(1), A.ctrl.thr.toFixed(2), A.ctrl.steer.toFixed(2), A.turn ? 'T' + A.turn.dir + '/' + A.turn.n : '', (A.stuckT||0).toFixed(1), (A.unstickT||0).toFixed(1)].join(' ')); if (L.tr.length > 60) L.tr.shift(); if (A.damage && !L.dmgAt) L.dmgAt = (i/60).toFixed(1) + ' dmg ' + A.damage.toFixed(1) + ' @' + A.x.toFixed(0) + ',' + A.z.toFixed(0); }
    if (A.gone && ph === 'gone') return; });
  if (A && !A.gone) { L.stuck = true; L.fire = !!A.fire; } else delete L.tr; L.carsBumped = VEHICLES.filter(v => !v.temp && v.damage !== dmg0.get(v)).length; L.maxOff = L.maxOff.toFixed(1); L.picked = vic.gone; res.push(L);
}
return res;
