await new Promise(r => setTimeout(r, 2500)); const out = { wide: document.body.classList.contains('lh-wide'), pages: PAPER.pages.length };
await __pageshot('paper_menu_' + innerWidth + '.png');
if (innerWidth > 1000) { paperOpen(0); await new Promise(r => setTimeout(r, 800)); await __pageshot('paper_v0.png');
  for (const [k, n] of [[1, 'v1'], [2, 'v2'], [6, 'v6'], [10, 'v10'], [14, 'v14'], [PAPER.views.length - 3, 'vkeys'], [PAPER.views.length - 1, 'vlast']]) { PAPER.v = k; paperShow(); await new Promise(r => setTimeout(r, 700)); await __pageshot('paper_' + n + '.png'); }
  out.views = PAPER.views.length; const ev = new KeyboardEvent('keydown', { code: 'Enter', bubbles: true }); document.body.dispatchEvent(ev); out.stateAfterEnter = gameState; out.closed = !PAPER.open; }
return out;
