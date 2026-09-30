await lhFonts(); lehtiBuild(); await new Promise(r => setTimeout(r, 1500));
const i = PAPER.pages.findIndex(h => h.includes('traktori perään</h3>')); paperOpen(i); await new Promise(r => setTimeout(r, 1500)); await __pageshot('lead_' + innerWidth + '.png');
const j = PAPER.pages.findIndex(h => h.includes('ja kuski nousee autosta')); paperOpen(j); await new Promise(r => setTimeout(r, 1500)); await __pageshot('lead2_' + innerWidth + '.png');
return { i, j, font: document.fonts.check('16px "YS Serif"'), n: PAPER.pages.length };
