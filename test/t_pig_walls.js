// the anti-cut pigs: how many, and does any straight short cut over the grass (≥ 8 m saved) stay open? + a look at the sharpest corners
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; setTimeOfDay('paiva');
let TT = performance.now(); const step = (n) => { for (let i = 0; i < n; i++) { TT += 1000/60; loop(TT); } };
startRace(false); step(30);
const n = trackPoints.length, pigs = tires.filter(t => t.kind === 'pig' && !t.off), props = tires.filter(t => !t.off && t.kind !== 'person');
const edge = (k, s) => { const q = (k%n+n)%n, p = trackPoints[q], nm = getNormal(q), o = (wAt(q)*0.5 + 1.2)*s; return [p.x + nm.x*o, p.y + nm.y*o]; };
const blocked = (x, z) => { for (const t of props) if (Math.hypot(t.x - x, t.z - z) < t.r + 0.9) return true; let b = false; staticNear(x, z, 6, B => { if (!b && boxPush(B, x, z, 0.9)) b = true; }); return b; };
let open = 0, cuts = 0; const openAt = [];
for (let i = 0; i < n; i++) for (const s of [-1, 1]) for (let j = i + 6; j <= i + 28; j += 2) { const A = edge(i, s), B = edge(j, s), L = Math.hypot(B[0] - A[0], B[1] - A[1]); let route = 0;
  for (let k = i; k < j; k++) { const p = trackPoints[k % n], q = trackPoints[(k + 1) % n]; route += Math.hypot(q.x - p.x, q.y - p.y); } if (route - L < 8) continue;
  let road = false, blk = false; for (let t = 1.5; t < L - 1.5 && !road; t += 0.5) { const x = A[0] + (B[0] - A[0])*t/L, z = A[1] + (B[1] - A[1])*t/L, r = roadInfo(x, z); if (r.d2 < (wAt(r.idx)*0.5)**2 || onRoad(x, z, 0)) road = true; else if (!blk && blocked(x, z)) blk = true; }
  if (road) continue; cuts++; if (!blk) { open++; if (openAt.length < 12) openAt.push([i, j, Math.round(route - L)]); } }
const cnt = trackPoints.map(p => pigs.filter(t => Math.hypot(t.x - p.x, t.z - p.y) < 30).length), picks = []; for (const i of [...cnt.keys()].sort((a, b) => cnt[b] - cnt[a])) { if (picks.every(p => Math.abs(p - i) > 25 && Math.abs(p - i) < n - 25)) picks.push(i); if (picks.length >= 4) break; }
for (const [k, i] of picks.entries()) { const p = trackPoints[i]; car.x = p.x + 40; car.z = p.y; nearVisT = 0; nearVisUpdate(0.01); camera.position.set(p.x + 0.1, Y(p.x, p.y) + 55, p.y + 0.1); camera.lookAt(p.x, Y(p.x, p.y), p.y); camera.updateMatrixWorld(); skyDome.position.copy(camera.position); RR(scene, camera); await __save('pigw' + k + '.png', renderer.domElement.toDataURL('image/png')); }
return { pigs: pigs.length, tyreStacks: tires.filter(t => t.kind === 'tire').length, cuts, open, openAt, picks };
