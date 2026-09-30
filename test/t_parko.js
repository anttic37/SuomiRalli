// the Markkinarako show: all five episodes in the radio's list, tuned to its own station; its page in the paper
startRace(false); step(20); const out = {}; await new Promise(r => setTimeout(r, 2500));
const L = RADIO.list || []; out.parko = L.filter(t => t.show === 'parko').map(t => t.title); const i = L.findIndex(t => t.show === 'parko');
if (i >= 0) { RADIO.i = i; radioTune(); out.station = RADIO.st && RADIO.st.name + ' ' + RADIO.st.freq; }
await lhFonts(); lehtiBuild(); await new Promise(r => setTimeout(r, 1000)); const j = PAPER.pages.findIndex(h => h.includes('Helsinki on brändi</h')); out.page = j + 1; paperOpen(j); await new Promise(r => setTimeout(r, 1500)); await __pageshot('parko_page.png'); return out;
