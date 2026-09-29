startRace(false); setTimeOfDay('paiva'); step(60*1.2);
await TRY('ralli_a', async () => { await around('ralli_a', car.x, car.z, 10, 3, car.angle + Math.PI + 0.35, 1.2); });
step(60*3.5);
await TRY('ralli_b', async () => { let best = null; for (let i = 0; i < n; i += 5) { const a = angAt(i - 8), b = angAt(i + 8); let c = Math.abs(angDiff(b - a)); let t = 0; for (const q of tires) if (Math.abs(q.x - route(i).x) < 25 && Math.abs(q.z - route(i).y) < 25) t++; const sc = c*10 + Math.min(t, 30)*0.4; if (!best || sc > best.sc) best = { sc, i }; }
  put(best.i, 17); hold(2); const r = car.angle + Math.PI/2; await around('ralli_b', car.x, car.z, 13, 4, r + 0.6, 1); });
await TRY('haamu_a', async () => { put(300, 15); hold(2); const fx = Math.sin(car.angle), fz = Math.cos(car.angle); ghostGroup.visible = true; placeGhost(ghostGroup, { x: car.x + fx*7 - fz*2.6, z: car.z + fz*7 + fx*2.6, a: car.angle }, 0.8);
  await view('haamu_a', car.x + fx*5, Y(car.x, car.z) + 1, car.z + fz*5, car.x - fx*9 + fz*3, Y(car.x, car.z) + 3.2, car.z - fz*9 - fx*3); ghostGroup.visible = false; });
await TRY('jalan', async () => { put(420, 0); hold(5); walkOut(); const h = WALK.h; keys.ArrowUp = true; hold(60*2); keys.ArrowUp = false; hold(10); await around('jalan', h.x, h.z, 5.5, 2, h.yaw + 0.5, 1.1); walkIn(true); });
await TRY('bass', async () => { const i0 = gridIndex(); put(i0 + 20, 0); bassToggle(); hold(60*4); await around('bass', car.x, car.z, 13, 5, car.angle + 2.3, 1); bassToggle(); hold(30); });
await TRY('renkaat', async () => { let best = null; for (let i = 0; i < n; i += 4) { let t = 0; for (const q of tires) if (q.kind === 'person' && Math.abs(q.x - route(i).x) < 18 && Math.abs(q.z - route(i).y) < 18) t++; if (!best || t > best.t) best = { t, i }; }
  put(best.i, 0); hold(20); const p = route(best.i); await around('renkaat', p.x, p.y, 16, 3.5, car.angle + 2.6, 1.2); });
await TRY('maali', async () => { const f = finishLine.position, S = STANDS[0]; const tx = S ? S.x : f.x, tz = S ? S.z : f.y; const i = nearIdx(f.x, f.y); put(i + 30, 0); hold(10);
  await view('maali', (f.x + tx)/2, Y(tx, tz) + 3, (f.y + tz)/2, f.x + (f.x - tx)*0.8 + 6, Y(f.x, f.y) + 7, f.y + (f.y - tz)*0.8 + 6); });
await TRY('kyla', async () => { const H = STATIC_LIST.filter(b => b.kind === 'house'); const cx = H.reduce((a, b) => a + b.x, 0)/H.length, cz = H.reduce((a, b) => a + b.z, 0)/H.length; car.x = cx; car.z = cz; hold(10); await view('kyla', cx, Y(cx, cz), cz, cx + 110, Y(cx, cz) + 95, cz + 90); });
await TRY('aika', async () => { const H = STATIC_LIST.filter(b => b.kind === 'house'); const cx = H.reduce((a, b) => a + b.x, 0)/H.length, cz = H.reduce((a, b) => a + b.z, 0)/H.length; for (const t of ['aamu', 'paiva', 'ilta']) { setTimeOfDay(t); hold(3); await view('aika_' + t, cx, Y(cx, cz) + 5, cz, cx - 70, Y(cx, cz) + 30, cz - 60); } setTimeOfDay('paiva'); });
await TRY('gta_a', async () => { const B = VEHICLES.find(v => v.kind === 'bus' && !v.gone); car.x = B.x + 20; car.z = B.z; hold(10); const fx = Math.sin(B.yaw), fz = Math.cos(B.yaw); await view('gta_a', B.x, B.gy + 1.5, B.z, B.x + fx*14 + fz*8, B.gy + 3.5, B.z + fz*14 - fx*8); });
await TRY('gta_b', async () => { const H = STATIC_LIST.filter(b => b.kind === 'house'); const cx = H.reduce((a, b) => a + b.x, 0)/H.length + 60, cz = H.reduce((a, b) => a + b.z, 0)/H.length - 40; car.x = cx; car.z = cz; hold(10); await view('gta_b', cx, Y(cx, cz), cz, cx - 70, Y(cx, cz) + 60, cz + 80); });
await TRY('radio_b', async () => { setTimeOfDay('ilta'); let best = null; for (let i = 0; i < n; i += 7) { let h = 0; const p = route(i); for (const b of STATIC_LIST) if (b.kind === 'house' && Math.abs(b.x - p.x) < 60 && Math.abs(b.z - p.y) < 60) h++; if (!best || h < best.h) best = { h, i }; }
  put(best.i, 15); hold(3); await around('radio_b', car.x, car.z, 11, 3.5, car.angle + Math.PI + 0.3, 1.5); setTimeOfDay('paiva'); });
// police last (they chase)
await TRY('poliisi_a', async () => { put(600, 0); hold(10); policeSpawn(3); let v = null; for (let k = 0; k < 60*25; k++) { hold(1); v = POLICE.cars.filter(o => !o.gone).sort((a, b) => Math.hypot(a.x - car.x, a.z - car.z) - Math.hypot(b.x - car.x, b.z - car.z))[0]; if (v && Math.hypot(v.x - car.x, v.z - car.z) < 14) break; }
  const dx = car.x - v.x, dz = car.z - v.z, l = Math.hypot(dx, dz) || 1; await view('poliisi_a', (car.x + v.x)/2, Y(car.x, car.z) + 1, (car.z + v.z)/2, v.x - dx/l*9 + dz/l*6, Y(v.x, v.z) + 3.2, v.z - dz/l*9 - dx/l*6);
  for (let k = 0; k < 60*20 && !(POLICE.hold > 0); k++) hold(1); hold(60*2.5); const o = HUMANS.find(h => h.task && h.task.kind === 'officer' && !h.gone); if (o) await around('poliisi_b', o.x, o.z, 6, 2, o.yaw + 0.8, 1.1); else out.poliisi_b = 'no officer'; });
return out;
