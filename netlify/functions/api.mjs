// YLÄSTÖ 1988 online: the leaderboard and everyone's best lap (their ghost), kept in Netlify Blobs.
//   GET  /api/top?sig=…          → { list: [{ k, name, t, d }] }  fastest first — one row per driver, per track version
//   GET  /api/ghost?sig=…&k=…    → { name, t, splits, s }          a driver's best lap (s = [ms, x·100, z·100, yaw·1000] every 50 ms)
//   GET  /api/struck?sig=…&k=…   → a struck-off driver's ghost, kept as evidence (where did they cut?)
//   GET  /api/stats              → { starts, drivers }   races started and drivers (browsers) seen, all tracks
//   POST /api/start { id }       → { starts, drivers }   one race started by browser id (a new id: one more driver)
//   GET  /api/rap              → { fires: [{ name, n }], people: [...], animals: [...], drivers, total }   the police's rap sheet: who set most fires, ran most people over
//   POST /api/rap { id, name, f, p, a } → { ok }   this browser's new fires / people / animals since its last report (capped)
//   POST /api/lap  { sig, name, t, splits, s } → { saved, best, rank, list }   kept only if it beats that name's best
// Files: top/<track>.json (the leaderboard) and ghost/<track>/<driver>.json (one per ghost). `sig` is the game's
// trackSignature(): a changed track is a new leaderboard, the old one stays where it was.
import { getStore } from '@netlify/blobs';
import { badName } from '../lib/badwords.mjs';
import { TRACKS } from '../lib/tracks.mjs';

export const config = { path: ['/api/top', '/api/ghost', '/api/lap', '/api/struck', '/api/stats', '/api/start', '/api/rap'] };
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

// the cut check, the same rule as the game's: off the road (> 3 m past its edge) the route gained and the metres driven are summed;
// back on the road a gain of more than CUT_M over what was driven, having been more than 8 m out, is a cut (slipping over the
// inside of a sharp corner a few metres in is not). → the biggest saving on the lap (m), 0 for none.
// T: the track (build.py → tracks.mjs); s: the ghost samples [ms, x·100, z·100, yaw·1000]…
const CUT_M = 15;   // (the game flags 12: the 50 ms samples are a little coarser than its frames)
export function routeCut(s, T) {
  const n = T.x.length, arc = new Float64Array(n + 1); for (let k = 1; k <= n; k++) arc[k] = arc[k - 1] + Math.hypot(T.x[k % n] - T.x[k - 1], T.z[k % n] - T.z[k - 1]);
  const L = arc[n], nearAll = (x, z) => { let bi = 0, bd = Infinity; for (let i = 0; i < n; i++) { const dx = T.x[i] - x, dz = T.z[i] - z, d = dx*dx + dz*dz; if (d < bd) { bd = d; bi = i; } } return [bi, bd]; };
  let prog = nearAll(s[1]/100, s[2]/100)[0], pp = prog, px = s[1]/100, pz = s[2]/100, on = false, drv = 0, gain = 0, far = 0, worst = 0;
  for (let j = 4; j < s.length; j += 4) { const x = s[j + 1]/100, z = s[j + 2]/100;
    let best = prog, bd = Infinity; for (let k = -15; k <= 60; k++) { const i = (prog + k + n) % n, dx = T.x[i] - x, dz = T.z[i] - z, d = dx*dx + dz*dz; if (d < bd) { bd = d; best = i; } }   // (the progress, as the game follows it)
    if (prog > n - 60 && best < 60) prog = best; else if (best >= prog - 15) prog = best;
    const [ri, d2] = nearAll(x, z), off = Math.sqrt(d2) - T.w[ri]/2;
    if (!on && off > 3) { on = true; drv = gain = far = 0; }
    if (on) { far = Math.max(far, off); drv += Math.hypot(x - px, z - pz); let g = arc[prog] - arc[pp]; if (g < -L/2) g += L; if (g > L/2) g -= L; gain += g;
      if (off < 1 || j === s.length - 4) { if (far > 8) worst = Math.max(worst, gain - drv); on = false; } }
    px = x; pz = z; pp = prog; }
  return worst; }
// started races and drivers: one counter file; a driver is a browser id seen for the first time (a marker file each).
// Before the counting began (27.9.) there were no numbers: it starts from an estimate (19 names on the board, most who drive never save a name).
const STATS_SEED = { starts: 700, drivers: 45 };
async function statsGet(store) { return (await store.get('stats.json', { type: 'json' })) || { ...STATS_SEED, since: new Date().toISOString().slice(0, 10), seeded: true }; }

// the rap sheet: one file (rap.json) of every browser's totals, by browser id; the name is the one they save laps with (or none: "Tuntematon kuski")
const RAP_MAX = { f: 40, p: 150, a: 40 }, RAP_ROWS = 3000;
async function rapGet(store) { return (await store.get('rap.json', { type: 'json' })) || { rows: {} }; }
function rapTop(R, k, n = 7) { return Object.values(R.rows).filter(r => r[k] > 0).sort((a, b) => b[k] - a[k]).slice(0, n).map(r => ({ name: r.name || '', n: r[k] })); }

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
    if (req.method === 'GET' && route === 'stats') { const st = await statsGet(store); return json({ starts: st.starts, drivers: st.drivers }); }
    if (req.method === 'POST' && route === 'start') {
      let b; try { b = JSON.parse(await req.text()); } catch (e) { return json({ error: 'bad json' }, 400); }
      const id = String(b && b.id || ''); if (!/^[a-z0-9]{8,32}$/.test(id)) return json({ error: 'id' }, 400);
      const st = await statsGet(store); st.starts++;
      if (!(await store.get('players/' + id + '.json', { type: 'json' }))) { await store.setJSON('players/' + id + '.json', { d: new Date().toISOString() }); st.drivers++; }
      await store.setJSON('stats.json', st); return json({ starts: st.starts, drivers: st.drivers });
    }
    if (req.method === 'GET' && route === 'rap') { const R = await rapGet(store), rows = Object.values(R.rows);
      return json({ fires: rapTop(R, 'f'), people: rapTop(R, 'p'), animals: rapTop(R, 'a', 3), drivers: rows.length, total: { f: rows.reduce((s, r) => s + r.f, 0), p: rows.reduce((s, r) => s + r.p, 0), a: rows.reduce((s, r) => s + r.a, 0) } }); }
    if (req.method === 'POST' && route === 'rap') {
      let b; try { b = JSON.parse(await req.text()); } catch (e) { return json({ error: 'bad json' }, 400); }
      const id = String(b && b.id || ''); if (!/^[a-z0-9]{8,32}$/.test(id)) return json({ error: 'id' }, 400);
      const d = {}; for (const k of ['f', 'p', 'a']) { const v = b[k] === undefined ? 0 : b[k]; if (!Number.isInteger(v) || v < 0) return json({ error: k }, 400); d[k] = Math.min(v, RAP_MAX[k]); }
      const name = cleanName(b.name), R = await rapGet(store);
      if (!d.f && !d.p && !d.a && (!R.rows[id] || !name || badName(name) || R.rows[id].name === name)) return json({ ok: true });   // (nothing new — unless it names an existing row)
      const r = R.rows[id] || (R.rows[id] = { name: '', f: 0, p: 0, a: 0 });
      if (name && !badName(name)) r.name = name; r.f += d.f; r.p += d.p; r.a += d.a; r.d = new Date().toISOString().slice(0, 10);
      const ids = Object.keys(R.rows); if (ids.length > RAP_ROWS) { ids.sort((x, y) => (R.rows[x].f + R.rows[x].p) - (R.rows[y].f + R.rows[y].p)); for (const x of ids.slice(0, ids.length - RAP_ROWS)) delete R.rows[x]; }   // (the mildest go first)
      await store.setJSON('rap.json', R); return json({ ok: true }); }
    if (req.method === 'POST' && route === 'lap') {
      const text = await req.text(); if (text.length > 1_500_000) return json({ error: 'too big' }, 413);
      let b; try { b = JSON.parse(text); } catch (e) { return json({ error: 'bad json' }, 400); }
      const bad = checkLap(b); if (bad) return json({ error: bad }, 400);
      const tid = trackId(b.sig), name = cleanName(b.name), k = nameKey(name), t = Math.round(b.t*1000)/1000;
      if (TRACKS[tid]) { const cut = routeCut(b.s, TRACKS[tid]); if (cut > CUT_M) return json({ error: 'cut', saved: Math.round(cut) }, 400); }   // (a track the build hasn't exported: not checked)
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
