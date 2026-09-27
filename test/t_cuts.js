// where the route can be cut: for pairs of route points, the shortest drivable path between them (1 m grid round houses, rocks,
// tyre walls and trees; no checkpoint skipped) against the road between them. Sorted by metres saved → { cuts: [...] }
initAudio = () => {}; renderer.render = () => {}; startRace(false); for (let i = 0; i < 60; i++) loop(lastTime + 1000/60);
const P = trackPoints, n = P.length, arc = [0]; for (let i = 1; i <= n; i++) { const a = P[i - 1], b = P[i % n]; arc[i] = arc[i - 1] + Math.hypot(b.x - a.x, b.y - a.y); }
const L = arc[n], A = (i, j) => j >= i ? arc[j] - arc[i] : L - arc[i] + arc[j], cps = checkpoints.map(c => c.ti);
let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const p of P) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); z0 = Math.min(z0, p.y); z1 = Math.max(z1, p.y); }
x0 = Math.floor(x0 - 40); z0 = Math.floor(z0 - 40); const W = Math.ceil(x1 + 40 - x0), Hh = Math.ceil(z1 + 40 - z0), blk = new Int8Array(W*Hh).fill(-1), why = {};
const blockedAt = (x, z) => { let b = null; staticNear(x, z, 2, B => { if (!b && boxPush(B, x, z, 0.9)) b = 'talo'; }); if (b) return b;
  forStaticNear(x, z, t => { if (!b && t.kind === 'tire' && !t.off && Math.hypot(t.x - x, t.z - z) < t.r + 0.9) b = 'renkaat'; }); if (b) return b;
  if (ROCK_HILLS.length && rockSolidAt(x, z) > 0.5) return 'kallio'; if (treeNear(x, z, 1.1)) return 'puu'; return null; };
const isBlk = (c) => { if (blk[c] < 0) { const x = x0 + (c % W) + 0.5, z = z0 + Math.floor(c/W) + 0.5; blk[c] = blockedAt(x, z) ? 1 : 0; } return blk[c]; };
const cell = (x, z) => Math.floor(z - z0)*W + Math.floor(x - x0);
function shortest(a, b, lim) {   // Dijkstra on the grid from a to b inside their box + 30 m; gives up past lim metres
  const bx0 = Math.max(0, Math.floor(Math.min(a.x, b.x) - x0 - 30)), bx1 = Math.min(W - 1, Math.ceil(Math.max(a.x, b.x) - x0 + 30)), bz0 = Math.max(0, Math.floor(Math.min(a.y, b.y) - z0 - 30)), bz1 = Math.min(Hh - 1, Math.ceil(Math.max(a.y, b.y) - z0 + 30));
  const dist = new Map(), hp = [], push = (c, d) => { hp.push([d, c]); let i = hp.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (hp[p][0] <= hp[i][0]) break; [hp[p], hp[i]] = [hp[i], hp[p]]; i = p; } },
    pop = () => { const top = hp[0], last = hp.pop(); if (hp.length) { hp[0] = last; let i = 0; for (;;) { const l = 2*i + 1, r = l + 1; let m = i; if (l < hp.length && hp[l][0] < hp[m][0]) m = l; if (r < hp.length && hp[r][0] < hp[m][0]) m = r; if (m === i) break; [hp[m], hp[i]] = [hp[i], hp[m]]; i = m; } } return top; };
  const s = cell(a.x, a.y), t = cell(b.x, b.y); dist.set(s, 0); push(s, 0);
  while (hp.length) { const [d, c] = pop(); if (c === t) return d; if (d > lim) return Infinity; if (d > dist.get(c)) continue; const cx = c % W, cz = Math.floor(c/W);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) { if (!dx && !dz) continue; const nx = cx + dx, nz = cz + dz; if (nx < bx0 || nx > bx1 || nz < bz0 || nz > bz1) continue; const nc = nz*W + nx;
      if (nc !== t && isBlk(nc)) continue; const nd = d + (dx && dz ? 1.4142 : 1); if (nd < (dist.has(nc) ? dist.get(nc) : Infinity)) { dist.set(nc, nd); push(nc, nd); } } }
  return Infinity; }
const found = [];
for (let i = 0; i < n; i += 4) for (let k = 16; k <= 72; k += 4) { const j = (i + k) % n; if (cps.some(c => (c - i + n) % n > 0 && (c - i + n) % n < k)) continue;
  const a = P[i], b = P[j], D = Math.hypot(b.x - a.x, b.y - a.y), ar = A(i, j); if (ar - D < 15) continue;
  const sp = shortest(a, b, ar - 12); if (ar - sp >= 12) found.push({ i, j, gain: Math.round(ar - sp), road: Math.round(ar), path: Math.round(sp), at: [Math.round((a.x + b.x)/2), Math.round((a.y + b.y)/2)] }); }
found.sort((p, q) => q.gain - p.gain); const top = []; for (const f of found) if (!top.some(t => Math.abs(t.i - f.i) < 30 && Math.abs(t.j - f.j) < 30)) top.push(f);
return { lap: Math.round(L), cps, cuts: top.slice(0, 12) };
