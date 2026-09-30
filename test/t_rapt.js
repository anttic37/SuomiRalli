// trees felled → the rap sheet (t, lumber) → the radio's village gossip (run over serve.mjs)
const g0 = gameState; startRace(false); for (let i = 0; i < 60; i++) loop(lastTime + 1000/60);
const it = KNOCK.items.find(i => i.kind === 'tree' && i.ranges.length); knockOver(it, 1, 0, 10); const hot = radioNewsLine();
const f = KNOCK.items.find(i => i.kind === 'fence' && i.ranges.length); knockOver(f, 1, 0, 10); const hot2 = radioNewsLine();
ONLINE.name = 'Metsuri-Mikko'; await rapSend(false); await new Promise(r => setTimeout(r, 400));
const other = await fetch('/api/rap', { method: 'POST', body: JSON.stringify({ id: 'zzzzzzzzzzzz', name: 'Moto-Kalle', t: 12 }) }).then(r => r.json());
const list = await fetch('/api/rap').then(r => r.json()); RAP.list = list; const lines = new Set(); for (let i = 0; i < 300; i++) lines.add(radioNewsLine());
return { hot, hot2, total: list.total, lumber: list.lumber, radio: [...lines].filter(l => /puu/.test(l)) };
