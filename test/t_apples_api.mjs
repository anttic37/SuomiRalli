// the rap sheet's apples: POST /api/rap with o → GET /api/rap's apples list (top 10, most first) and total.o; o capped per post.  node t_apples_api.mjs
import { handle } from '../netlify/functions/api.mjs';
const mem = new Map(), store = { async get(k, o) { const v = mem.get(k); return v === undefined ? null : (o && o.type === 'json' ? JSON.parse(v) : v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async delete(k) { mem.delete(k); } };
const post = async (b) => (await handle(new Request('http://x/api/rap', { method: 'POST', body: JSON.stringify(b) }), store)).status;
const s = [await post({ id: 'aaaaaaaa1', name: 'Antti', o: 7 }), await post({ id: 'bbbbbbbb2', name: 'Mane', o: 3 }), await post({ id: 'aaaaaaaa1', o: 5 }), await post({ id: 'cccccccc3', name: 'Huijari', o: 9999 }), await post({ id: 'dddddddd4', o: -1 })];
const j = await (await handle(new Request('http://x/api/rap'), store)).json();
console.log(JSON.stringify({ status: s, apples: j.apples, total: j.total.o, ok: JSON.stringify(j.apples) === JSON.stringify([{ name: 'Huijari', n: 120 }, { name: 'Antti', n: 12 }, { name: 'Mane', n: 3 }]) && s[4] === 400 }));
