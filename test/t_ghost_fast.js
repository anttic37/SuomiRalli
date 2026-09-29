// (the lap poster from t_online)
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {};
const sig = trackSignature(), n = trackPoints.length;
const lap = (T) => { let L = 0; const cum = [0]; for (let i = 1; i <= n; i++) { const a = trackPoints[i - 1], b = trackPoints[i % n]; L += Math.hypot(b.x - a.x, b.y - a.y); cum.push(L); }
  const v = L/T, s = []; let j = 0; for (let ms = 0; ms <= T*1000 + 1e-6; ms += 50) { const d = Math.min(L, v*ms/1000); while (j < n - 1 && cum[j + 1] < d) j++; const a = trackPoints[j], b = trackPoints[(j + 1) % n], f = (d - cum[j])/((cum[j + 1] - cum[j]) || 1);
    s.push(ms, Math.round((a.x + (b.x - a.x)*f)*100), Math.round((a.y + (b.y - a.y)*f)*100), Math.round(Math.atan2(b.x - a.x, b.y - a.y)*1000)); }
  if (s[s.length - 4] !== Math.round(T*1000)) { const k = s.length - 4; s.push(Math.round(T*1000), s[k+1], s[k+2], s[k+3]); }
  return { s, splits: [1, 2, 3, 4, 5, 6, 7].map(c => +(T*c/8).toFixed(3)) }; };
const post = async (name, T) => { const L = lap(T); const r = await fetch('/api/lap', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sig, name, t: T, splits: L.splits, s: L.s }) }); return r.json(); };
// ghosts fast: the leader sees their own record + two chasers; a second refresh takes every ghost from the browser cache (no ghost requests)
for (const [nm, T] of [['Wihka', 140], ['Ari', 150], ['Juha', 160], ['Kalle', 170]]) await post(nm, T);
for (const k of Object.keys(localStorage)) if (/^yl-g|^yl-opp/.test(k)) localStorage.removeItem(k);
ONLINE.name = 'Wihka'; ghost = null; bestTime = Infinity;
let calls = 0; const f0 = window.fetch; window.fetch = (u, o) => { if (String(u).includes('/api/ghost')) calls++; return f0(u, o); };
await onlineRefresh(); const first = { opp: ONLINE.opp.map(o => o.name + ' ' + o.t), ghostCalls: calls, cached: Object.keys(localStorage).filter(k => /^yl-g:/.test(k)).length, last: localStorage.getItem('yl-opp-last') && JSON.parse(localStorage.getItem('yl-opp-last')).list.map(r => r.k).join(','), self: !!ONLINE.self };
calls = 0; await onlineRefresh(); const second = { opp: ONLINE.opp.map(o => o.name), ghostCalls: calls };
ONLINE.name = 'Juha'; calls = 0; await onlineRefresh(); const juha = { opp: ONLINE.opp.map(o => o.name), ghostCalls: calls };
window.fetch = f0; return { first, second, juha };
