// online leaderboard + ghost ladder against test/serve.mjs (the real API function, in-memory store):
//   node serve.mjs & ; node real.js http://localhost:8787/ t_online.js
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {};
const sig = trackSignature(), n = trackPoints.length;
const lap = (T) => { let L = 0; const cum = [0]; for (let i = 1; i <= n; i++) { const a = trackPoints[i - 1], b = trackPoints[i % n]; L += Math.hypot(b.x - a.x, b.y - a.y); cum.push(L); }
  const v = L/T, s = []; let j = 0; for (let ms = 0; ms <= T*1000 + 1e-6; ms += 50) { const d = Math.min(L, v*ms/1000); while (j < n - 1 && cum[j + 1] < d) j++; const a = trackPoints[j], b = trackPoints[(j + 1) % n], f = (d - cum[j])/((cum[j + 1] - cum[j]) || 1);
    s.push(ms, Math.round((a.x + (b.x - a.x)*f)*100), Math.round((a.y + (b.y - a.y)*f)*100), Math.round(Math.atan2(b.x - a.x, b.y - a.y)*1000)); }
  if (s[s.length - 4] !== Math.round(T*1000)) { const k = s.length - 4; s.push(Math.round(T*1000), s[k+1], s[k+2], s[k+3]); }
  return { s, splits: [1, 2, 3, 4, 5, 6, 7].map(c => +(T*c/8).toFixed(3)) }; };
const post = async (name, T) => { const L = lap(T); const r = await fetch('/api/lap', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sig, name, t: T, splits: L.splits, s: L.s }) }); return r.json(); };
const out = {};
for (const [nm, T] of [['Wihka', 140], ['Ari', 150], ['Juha', 160], ['Kalle', 170], ['Mika', 180]]) await post(nm, T);
out.bad = await (await fetch('/api/lap', { method: 'POST', body: JSON.stringify({ sig, name: 'Huijari', t: 30, splits: [], s: lap(140).s }) })).json();
localStorage.removeItem('ylasto1988-nimi'); ONLINE.name = ''; bestTime = Infinity; ghost = null;
await onlineRefresh(); out.list = ONLINE.list.map(r => r.name + ' ' + r.t).join(', '); out.oppNoTime = ONLINE.opp.map(o => o.name).join(',');
out.top10rows = document.querySelectorAll('#top10 .t10-row').length; RR(scene, camera); await __pageshot('online_menu.png');
// race: the rivals on track with their names
startRace(false); setTimeOfDay('paiva'); const step = (k, f) => { for (let i = 0; i < k; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
step(60*3.3); step(60*9, steer); out.ghostsVisible = ONLINE.opp.map(o => o.G.visible); out.lapStarted = lapStarted;
RR(scene, camera); await __save('online_race.png', renderer.domElement.toDataURL('image/png'));
// finish in 165 s (between Juha and Kalle), give a name
const L = lap(165); ghostRec = { s: L.s.slice(0, -4), splits: L.splits, last: 0 }; raceTime = 165; lapStarted = true; car.x = L.s[L.s.length - 3]/100; car.z = L.s[L.s.length - 2]/100; car.angle = L.s[L.s.length - 1]/1000; finishRace();
out.formShown = document.getElementById('name-form').style.display; out.focused = document.activeElement && document.activeElement.id;
await new Promise(r => setTimeout(r, 120)); document.getElementById('name-input').value = 'Antti';
document.getElementById('name-input').dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }));
for (let i = 0; i < 50 && !/sija|ei parannusta|ei onnistunut/.test(document.getElementById('name-status').textContent); i++) await new Promise(r => setTimeout(r, 100));
out.status = document.getElementById('name-status').textContent; out.stateAfterSubmit = gameState;
for (let i = 0; i < 50 && ONLINE.busy; i++) await new Promise(r => setTimeout(r, 100)); await new Promise(r => setTimeout(r, 300));
out.oppAfter = ONLINE.opp.map(o => o.name).join(','); out.meRow = (document.querySelector('#top10 .t10-row.me') || {}).textContent;
RR(scene, camera); await __pageshot('online_results.png');
// a slower lap under the same name is not kept
ONLINE.lastRun = { time: 175, ...lap(175) }; document.getElementById('name-input').value = 'Antti'; await onlineSubmit(); out.slower = document.getElementById('name-status').textContent;
out.store = await (await fetch('/__store')).json();
return out;
