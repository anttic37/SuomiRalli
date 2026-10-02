// the author's counters: POST /api/start with ev (enter, r, load, lap; none = enter) → totals + a row a day; GET /api/postistats needs the key.  node t_stats_api.mjs
import { handle } from '../netlify/functions/api.mjs';
const mem = new Map(), store = { async get(k, o) { const v = mem.get(k); return v === undefined ? null : (o && o.type === 'json' ? JSON.parse(v) : v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async delete(k) { mem.delete(k); } };
const post = async (b) => (await handle(new Request('http://x/api/start', { method: 'POST', body: JSON.stringify(b) }), store)).json();
await post({ id: 'aaaaaaaa1', ev: 'load' }); await post({ id: 'aaaaaaaa1' }); await post({ id: 'aaaaaaaa1', ev: 'r' }); await post({ id: 'aaaaaaaa1', ev: 'r' }); await post({ id: 'aaaaaaaa1', ev: 'lap' }); await post({ id: 'bbbbbbbb2', ev: 'load' }); const last = await post({ id: 'bbbbbbbb2', ev: 'enter' });
const no = (await handle(new Request('http://x/api/postistats?key=wrong'), store)).status, st = JSON.parse(mem.get('stats.json')), day = Object.keys(st.days)[0], D = st.days[day];
console.log(JSON.stringify({ last, noKey: no, ev: st.ev, day, D, ok: no === 403 && last.starts === 704 && last.drivers === 47 && st.ev.load === 2 && st.ev.r === 2 && st.ev.enter === 2 && st.ev.lap === 1 && D.l === 2 && D.e === 2 && D.r === 2 && D.k === 1 && D.nd === 2 }));
