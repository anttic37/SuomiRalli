// the API's strike list: Huijari-Ande's row goes, his ghost is kept under struck/ and readable at /api/struck; a RESTOREd driver (Ande)
// comes back from struck/ onto the board with his ghost; others stay. Then the start counters and the server-side cut check.  node t_strike.mjs
import { handle } from '../netlify/functions/api.mjs';
const mem = new Map(), store = { async get(k, o) { const v = mem.get(k); return v === undefined ? null : (o && o.type === 'json' ? JSON.parse(v) : v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async delete(k) { mem.delete(k); } };
const sig = 'test-track', tid = (() => { let h = 0x811c9dc5; for (const ch of sig) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); })();
mem.set('top/' + tid + '.json', JSON.stringify({ sig, list: [{ k: 'huijari-ande', name: 'Huijari-Ande', t: 84.834, d: '2026-09-27' }, { k: 'antti', name: 'Antti', t: 95.2, d: '2026-09-27' }] }));
mem.set('ghost/' + tid + '/huijari-ande.json', JSON.stringify({ name: 'Huijari-Ande', t: 84.834, s: [0, 0, 0, 0], d: '2026-09-27T10:00:00Z' }));
mem.set('struck/' + tid + '/ande.json', JSON.stringify({ name: 'Ande', t: 85.373, s: [0, 0, 0, 0], d: '2026-09-27T09:00:00Z' }));
mem.set('ghost/' + tid + '/antti.json', JSON.stringify({ name: 'Antti', t: 95.2, s: [0, 0, 0, 0], d: '2026-09-27T10:00:00Z' }));
const get = async (q) => { const r = await handle(new Request('http://x/api/' + q), store); return [r.status, await r.json()]; };
const [, top] = await get('top?sig=' + sig), [st, ev] = await get('struck?sig=' + sig + '&k=huijari-ande'), [gs] = await get('ghost?sig=' + sig + '&k=huijari-ande'), [ga] = await get('ghost?sig=' + sig + '&k=ande');
const out = { board: top.list.map(r => r.name), struckGhost: st === 200 && ev.name === 'Huijari-Ande', ghostGone: gs === 404, andeBack: ga === 200 && !mem.has('struck/' + tid + '/ande.json'), anttiGhost: mem.has('ghost/' + tid + '/antti.json') };
console.log(JSON.stringify(out)); if (out.board.join() !== 'Ande,Antti' || !out.andeBack || !out.struckGhost || !out.ghostGone || !out.anttiGhost) process.exit(1);
// the counters: two starts from one browser, one from another → +3 starts, +2 drivers (from the seeded estimate)
{ const post = async (q, b) => { const r = await handle(new Request('http://x/api/' + q, { method: 'POST', body: JSON.stringify(b) }), store); return [r.status, await r.json()]; };
  const [, s0] = await get('stats'); await post('start', { id: 'aaaaaaaa11' }); await post('start', { id: 'aaaaaaaa11' }); const [, s1] = await post('start', { id: 'bbbbbbbb22' }); const [bad] = await post('start', { id: 'X!' });
  const stats = { from: s0, to: s1, ok: s1.starts - s0.starts === 3 && s1.drivers - s0.drivers === 2 && bad === 400 }; console.log(JSON.stringify({ stats }));
  // the server's cut check on the real track: a lap along the road is saved, the same lap straight across a bend is refused
  const { TRACKS } = await import('../netlify/lib/tracks.mjs'), tid2 = Object.keys(TRACKS)[0], T = TRACKS[tid2], n = T.x.length;
  const lap = (skip) => { const pts = []; for (let i = 0; i <= n; i++) { if (skip && i > skip[0] && i < skip[1]) continue; pts.push([T.x[i % n], T.z[i % n]]); }
    const s = []; let t = 0, k = 0, fx = pts[0][0], fz = pts[0][1]; const v = 30; s.push(0, Math.round(fx*100), Math.round(fz*100), 0);
    while (k < pts.length - 1) { let step = v*0.05; while (step > 0 && k < pts.length - 1) { const [bx, bz] = pts[k + 1], d = Math.hypot(bx - fx, bz - fz); if (d <= step) { fx = bx; fz = bz; k++; step -= d; } else { fx += (bx - fx)/d*step; fz += (bz - fz)/d*step; step = 0; } }
      t += 50; s.push(t, Math.round(fx*100), Math.round(fz*100), 0); } return { s, t: t/1000 }; };
  const good = lap(null), cut = lap([200, 260]), sig2 = T.sig;
  const [gs, gd] = await post('lap', { sig: sig2, name: 'Rehti', t: good.t, s: good.s }), [cs, cd] = await post('lap', { sig: sig2, name: 'Oikaisija', t: cut.t, s: cut.s });
  const cutTest = { honest: gs === 200 && gd.saved, cutRefused: cs === 400 && cd.error === 'cut', saved: cd.saved }; console.log(JSON.stringify({ cutTest }));
  if (!stats.ok || !cutTest.honest || !cutTest.cutRefused) process.exit(1); }
