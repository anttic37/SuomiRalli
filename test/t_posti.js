// the post to the maker: the start-screen button opens the letter, typing doesn't drive, Ctrl+Enter sends → /api/posti;
// (needs the post key: run with `const __KEY='…';` in front — see NOTES.md)
// posti.html reads them with the key (checked outside: GET without the key is 403). Run against serve.mjs.
await new Promise(r => setTimeout(r, 2500)); const out = {};
const btn = document.getElementById('posti-btn'), br = btn.getBoundingClientRect(); out.btn = [Math.round(br.x), Math.round(br.y), Math.round(br.width), Math.round(br.height), getComputedStyle(btn).display];
btn.click(); await new Promise(r => setTimeout(r, 400)); out.open = POSTI.open && document.activeElement.id;
const ta = document.getElementById('po-text'); ta.value = 'Moi Antti! Paras peli. Lisää hirviä.\nT: testi'; document.getElementById('po-name').value = 'Testi-Pate';
const st0 = gameState; ta.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', bubbles: true })); out.enterNoRace = gameState === st0 && POSTI.open;
ta.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', key: 'ArrowUp', bubbles: true })); out.noGas = !keys['ArrowUp'];
await __pageshot('s3_lh_posti.png');
ta.dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter', ctrlKey: true, bubbles: true })); await new Promise(r => setTimeout(r, 1500));
out.sentClosed = !POSTI.open; out.status = document.querySelector('#posti .po-st').textContent;
out.noKey = (await fetch('/api/posti')).status; out.badKey = (await fetch('/api/posti?key=nope')).status;
out.withKey = await (await fetch('/api/posti?key=' + __KEY)).json();
// five more in a row: the sixth within ten minutes is refused
const codes = []; for (let i = 0; i < 5; i++) codes.push((await fetch('/api/posti', { method: 'POST', body: JSON.stringify({ id: ONLINE.id, text: 'spam ' + i }) })).status); out.codes = codes;
out.del = (await fetch('/api/postidel', { method: 'POST', body: JSON.stringify({ key: __KEY, i: 1 }) })).status; out.after = (await (await fetch('/api/posti?key=' + __KEY)).json()).list.length;
return out;
