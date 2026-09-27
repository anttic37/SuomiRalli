// the API's strike list: ANDE's row goes, his ghost is kept under struck/ and readable at /api/struck; others stay.  node t_strike.mjs
import { handle } from '../netlify/functions/api.mjs';
const mem = new Map(), store = { async get(k, o) { const v = mem.get(k); return v === undefined ? null : (o && o.type === 'json' ? JSON.parse(v) : v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async delete(k) { mem.delete(k); } };
const sig = 'test-track', tid = (() => { let h = 0x811c9dc5; for (const ch of sig) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); })();
mem.set('top/' + tid + '.json', JSON.stringify({ sig, list: [{ k: 'ande', name: 'ANDE', t: 70.1, d: '2026-09-27' }, { k: 'antti', name: 'Antti', t: 95.2, d: '2026-09-27' }] }));
mem.set('ghost/' + tid + '/ande.json', JSON.stringify({ name: 'ANDE', t: 70.1, s: [0, 0, 0, 0], d: '2026-09-27T10:00:00Z' }));
mem.set('ghost/' + tid + '/antti.json', JSON.stringify({ name: 'Antti', t: 95.2, s: [0, 0, 0, 0], d: '2026-09-27T10:00:00Z' }));
const get = async (q) => { const r = await handle(new Request('http://x/api/' + q), store); return [r.status, await r.json()]; };
const [, top] = await get('top?sig=' + sig), [st, ev] = await get('struck?sig=' + sig + '&k=ande'), [gs] = await get('ghost?sig=' + sig + '&k=ande');
const out = { board: top.list.map(r => r.name), struckGhost: st === 200 && ev.name === 'ANDE', ghostGone: gs === 404, anttiGhost: mem.has('ghost/' + tid + '/antti.json') };
console.log(JSON.stringify(out)); if (out.board.join() !== 'Antti' || !out.struckGhost || !out.ghostGone || !out.anttiGhost) process.exit(1);
