// lehti photo: the "Poliisi tiedottaa" page open, with a rap sheet on the local server → lehti/rekisteri.jpg (via rekisteri.png); run over serve.mjs at 1000×625
const post = (id, name, f, p) => fetch('/api/rap', { method: 'POST', body: JSON.stringify({ id, name, f, p, a: 0 }) });
await post('aaaaaaaaaaaa', 'Pyromaani-Pena', 14, 9); await post('bbbbbbbbbbbb', 'Rälläkkä-Raimo', 6, 31); await post('cccccccccccc', 'Wihka', 3, 12); await post('dddddddddddd', '', 2, 22); await post('eeeeeeeeeeee', 'Mane', 1, 4);
RAP.life = { f: 3, p: 8, a: 1 }; lehtiBuild(); const pi = PAPER.pages.findIndex(h => h.includes('POLIISI TIEDOTTAA</span>')); paperOpen(pi);
for (let i = 0; i < 60 && !RAP.list; i++) await new Promise(r => setTimeout(r, 100)); lhRapFill(document.querySelector('#paper .pv-stage')); await new Promise(r => setTimeout(r, 1200));
await __pageshot('rekisteri.png'); return { page: pi + 1, list: RAP.list && RAP.list.fires.length };
