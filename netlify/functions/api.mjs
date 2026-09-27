// YLÄSTÖ 1988 online: the leaderboard and everyone's best lap (their ghost), kept in Netlify Blobs.
//   GET  /api/top?sig=…          → { list: [{ k, name, t, d }] }  fastest first — one row per driver, per track version
//   GET  /api/ghost?sig=…&k=…    → { name, t, splits, s }          a driver's best lap (s = [ms, x·100, z·100, yaw·1000] every 50 ms)
//   GET  /api/struck?sig=…&k=…   → a struck-off driver's ghost, kept as evidence (where did they cut?)
//   POST /api/lap  { sig, name, t, splits, s } → { saved, best, rank, list }   kept only if it beats that name's best
// Files: top/<track>.json (the leaderboard) and ghost/<track>/<driver>.json (one per ghost). `sig` is the game's
// trackSignature(): a changed track is a new leaderboard, the old one stays where it was.
import { getStore } from '@netlify/blobs';
import { badName } from '../lib/badwords.mjs';

export const config = { path: ['/api/top', '/api/ghost', '/api/lap', '/api/struck'] };
export default async (req) => handle(req, getStore({ name: 'suomiralli', consistency: 'strong' }));

const MAX_ROWS = 500;
// struck-off laps: a row with this driver AND this exact time (or, with `until`, any time of theirs saved on or before that
// date) is dropped from the board (and its ghost deleted) the first time the board is read or written after a deploy.
// A later lap by the same name is kept as usual.
const STRUCK = [
  { k: 'anba', t: 86.277, why: 'mutka oikaistu (Antti itse, 26.9.)' },
  { k: 'kurittaja-elli', until: '2026-09-26', why: 'Antti poisti 26.9.' },
  { k: 'huijari-ande', t: 84.834, why: 'neljä mutkaa oikaistu, −149 m (ghost-analyysi 27.9.)' },
];
// restored: struck by mistake, their lap is put back from the struck/ copy (once: the copy is then gone)
const RESTORE = ['ande'];   // (27.9.: 85.373 was a clean lap — the cheat was Huijari-Ande)
const struck = (k, t, d) => STRUCK.some(s => s.k === k && (s.t !== undefined ? Math.abs(s.t - t) < 0.0015 : String(d || '').slice(0, 10) <= s.until));
async function strike(store, tid, top) {
  for (const k of RESTORE) { const key = 'struck/' + tid + '/' + encodeURIComponent(k) + '.json', g = await store.get(key, { type: 'json' }); if (!g) continue;
    if (!top.list.some(r => r.k === k)) { top.list.push({ k, name: g.name, t: g.t, d: String(g.d || '').slice(0, 10) }); top.list.sort((a, c) => a.t - c.t); await store.setJSON('ghost/' + tid + '/' + encodeURIComponent(k) + '.json', g); await store.setJSON('top/' + tid + '.json', top); }
    await store.delete(key); }
  const bad = top.list.filter(r => struck(r.k, r.t, r.d) || badName(r.name)); if (!bad.length) return top;   // (and any name the word filter would refuse today)
  top.list = top.list.filter(r => !bad.includes(r)); await store.setJSON('top/' + tid + '.json', top);
  for (const r of bad) { const key = 'ghost/' + tid + '/' + encodeURIComponent(r.k) + '.json', g = await store.get(key, { type: 'json' }); if (g && (struck(r.k, g.t, g.d) || badName(r.name))) { await store.setJSON('struck/' + tid + '/' + encodeURIComponent(r.k) + '.json', g); await store.delete(key); } }   // (the ghost kept aside under struck/: the evidence)
  return top; }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
// FNV-1a: a short, file-name-safe id for a track signature
const trackId = (sig) => { let h = 0x811c9dc5; for (const ch of String(sig)) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };
export const cleanName = (s) => String(s || '').normalize('NFC').replace(/[^\p{L}\p{N} _.\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 16);
export const nameKey = (name) => name.toLowerCase().replace(/ /g, '_');

// a lap that could have been driven: the samples cover the whole time (one every 50 ms at best — the game records on its frames,
// so a slow or stuttering machine gives fewer), no gap over 1.5 s, at believable speeds
export function checkLap(b) {
  if (!b || typeof b !== 'object') return 'no body';
  if (typeof b.sig !== 'string' || !b.sig || b.sig.length > 160) return 'bad track';
  if (!cleanName(b.name)) return 'no name';
  if (badName(cleanName(b.name))) return 'bad name';
  const t = b.t; if (typeof t !== 'number' || !isFinite(t) || t < 20 || t > 1800) return 'bad time';
  const s = b.s; if (!Array.isArray(s) || s.length % 4 || s.length > 4*40000) return 'bad ghost';
  const n = s.length/4; if (n < t/0.5 || n > t/0.05*1.1 + 10) return 'ghost does not cover the lap';
  if (!s.every(v => Number.isInteger(v) && Math.abs(v) < 1e9)) return 'bad samples';
  if (Math.abs(s[s.length - 4] - Math.round(t*1000)) > 60) return 'ghost ends off the time';
  if (s[0] > 1500) return 'ghost starts late';
  for (let i = 1; i < n; i++) { const dt = (s[i*4] - s[(i-1)*4])/1000; if (dt < 0) return 'time runs back'; if (dt > 1.5) return 'gap in the ghost';
    if (Math.hypot(s[i*4+1] - s[(i-1)*4+1], s[i*4+2] - s[(i-1)*4+2])/100/Math.max(dt, 0.05) > 100) return 'too fast'; }   // (over at least a sample's 50 ms: two samples a few ms apart at the line are not a teleport)
  if (b.splits !== undefined && (!Array.isArray(b.splits) || b.splits.length > 32 || !b.splits.every(v => v === null || (typeof v === 'number' && isFinite(v))))) return 'bad splits';
  return null;
}

export async function handle(req, store) {
  const url = new URL(req.url), route = url.pathname.replace(/\/+$/, '').split('/').pop();
  try {
    if (req.method === 'GET' && route === 'top') {
      const sig = url.searchParams.get('sig'); if (!sig) return json({ error: 'sig' }, 400);
      const tid = trackId(sig), top0 = await store.get('top/' + tid + '.json', { type: 'json' }), top = top0 && await strike(store, tid, top0);
      return json({ list: top ? top.list : [] });
    }
    if (req.method === 'GET' && route === 'ghost') {
      const sig = url.searchParams.get('sig'), k = url.searchParams.get('k'); if (!sig || !k) return json({ error: 'sig, k' }, 400);
      const g = await store.get('ghost/' + trackId(sig) + '/' + encodeURIComponent(k) + '.json', { type: 'json' });
      return g ? json(g) : json({ error: 'none' }, 404);
    }
    if (req.method === 'GET' && route === 'struck') {
      const sig = url.searchParams.get('sig'), k = url.searchParams.get('k'); if (!sig || !k) return json({ error: 'sig, k' }, 400);
      const g = await store.get('struck/' + trackId(sig) + '/' + encodeURIComponent(k) + '.json', { type: 'json' });
      return g ? json(g) : json({ error: 'none' }, 404);
    }
    if (req.method === 'POST' && route === 'lap') {
      const text = await req.text(); if (text.length > 1_500_000) return json({ error: 'too big' }, 413);
      let b; try { b = JSON.parse(text); } catch (e) { return json({ error: 'bad json' }, 400); }
      const bad = checkLap(b); if (bad) return json({ error: bad }, 400);
      const tid = trackId(b.sig), name = cleanName(b.name), k = nameKey(name), t = Math.round(b.t*1000)/1000;
      const top0 = await store.get('top/' + tid + '.json', { type: 'json' }), top = top0 ? await strike(store, tid, top0) : { sig: b.sig, list: [] };
      const mine = top.list.find(r => r.k === k);
      if (mine && mine.t <= t) return json({ saved: false, best: mine.t, rank: top.list.indexOf(mine) + 1, list: top.list });
      await store.setJSON('ghost/' + tid + '/' + encodeURIComponent(k) + '.json', { name, t, splits: b.splits || [], s: b.s, d: new Date().toISOString() });
      const list = top.list.filter(r => r.k !== k); list.push({ k, name, t, d: new Date().toISOString().slice(0, 10) });
      list.sort((a, c) => a.t - c.t); top.list = list.slice(0, MAX_ROWS);
      await store.setJSON('top/' + tid + '.json', top);
      return json({ saved: true, best: t, rank: top.list.findIndex(r => r.k === k) + 1, list: top.list });
    }
    return json({ error: 'not found' }, 404);
  } catch (e) { return json({ error: 'store' }, 500); }
}
