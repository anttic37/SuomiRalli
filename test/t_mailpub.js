// "Lukijoiden kirjeet": letters in, Antti answers two and prints them (postireply, with the key), the paper's letters page shows
// them (postipub); unprinted ones never show. Run against serve.mjs with `const __KEY='…';` in front.
await new Promise(r => setTimeout(r, 2500)); const out = {}, post = (p, b) => fetch('/api' + p, { method: 'POST', body: JSON.stringify(b) });
for (const [n, t] of [['Mane', 'Moi Antti! Lisää hirviä ja isompi ufo. Paras peli ikinä, pelattiin koko ilta porukalla.'], ['Pate', 'Miksi paloauto ajoi metsään?'], ['', 'Salainen kirje, ei lehteen.']]) await post('/posti', { id: 'abcdefgh' + n.length, name: n, text: t });
const L = (await (await fetch('/api/posti?key=' + __KEY)).json()).list; out.n = L.length;
out.r1 = (await post('/postireply', { key: __KEY, i: 1, reply: 'Hirviä tulee! Ufo nappaa niitä jo.', pub: true })).status;
out.r2 = (await post('/postireply', { key: __KEY, i: 2, reply: 'Ennätysvauhti. Ne pelkäävät sinua.', pub: true })).status;
out.bad = (await post('/postireply', { key: 'x', i: 3, reply: 'hax', pub: true })).status;
out.pub = (await (await fetch('/api/postipub')).json()).list.map(m => m.name + ':' + m.reply.slice(0, 10));
MAILPUB.at = -1e9; mailFetch(); await new Promise(r => setTimeout(r, 800));
paperOpen(0); const pg = PAPER.pages.findIndex(p => /Lukijoiden kirjeet<\/h2>/.test(p)); out.page = pg + 1; paperToPage(pg); await new Promise(r => setTimeout(r, 900));
const st = document.querySelector('#paper .pv-stage'); out.shown = [...st.querySelectorAll('.ml-l.on')].map(e => e.querySelector('.ml-f').textContent); out.emptyShown = [...st.querySelectorAll('.ml-empty')].some(e => e.style.display !== 'none');
const ov = [...st.querySelectorAll('.pv-page .lh-in')].map(e => e.scrollHeight - e.clientHeight); out.overflow = ov;
await __pageshot('mailpub.png'); return out;
