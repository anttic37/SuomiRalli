// the rap sheet: counts → /api/rap (deltas) → the list → "Poliisi tiedottaa" in the paper (run over serve.mjs)
const g0 = gameState; gameState = State.RACING; for (let i = 0; i < 5; i++) rapCount('f'); for (let i = 0; i < 12; i++) rapCount('p'); rapCount('a'); gameState = g0;
ONLINE.name = 'Tuho-Timo'; rapSend(false); await new Promise(r => setTimeout(r, 500));
const other = await fetch('/api/rap', { method: 'POST', body: JSON.stringify({ id: 'zzzzzzzzzzzz', name: 'Pyromaani-Pena', f: 9, p: 2, a: 0 }) }).then(r => r.json());
const anon = await fetch('/api/rap', { method: 'POST', body: JSON.stringify({ id: 'yyyyyyyyyyyy', f: 0, p: 30 }) }).then(r => r.json());
const bad = await fetch('/api/rap', { method: 'POST', body: JSON.stringify({ id: 'x', f: 1 }) }).then(r => r.status);
rapSend(false); const list = await fetch('/api/rap').then(r => r.json());   // (nothing new to send: no request)
lehtiBuild(); const pi = PAPER.pages.findIndex(h => h.includes('POLIISI TIEDOTTAA</span>')); paperOpen(pi);
for (let i = 0; i < 60 && !RAP.list; i++) await new Promise(r => setTimeout(r, 100)); lhRapFill(document.querySelector('#paper .pv-stage'));
await new Promise(r => setTimeout(r, 900)); await __pageshot('rap_page.png');
const txt = (k) => [...document.querySelectorAll('#paper [data-rp="' + k + '"]')].map(e => e.textContent).join('|');
return { page: pi + 1, other, anon, bad, list, wanted: txt('w'), own: txt('own'), f0: document.querySelector('#paper [data-rp="f0"]').textContent, p0: document.querySelector('#paper [data-rp="p0"]').textContent };
