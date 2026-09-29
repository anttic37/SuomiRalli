// paper layout: every page fits its frame (nothing cut: .lh-in inside the page, half texts inside their column), no big holes; lists what filled the gaps
await new Promise(r => setTimeout(r, 1500)); const host = document.createElement('div'); host.className = 'lh-measure'; document.body.appendChild(host); const rep = [], bad = [];
PAPER.pages.forEach((h, i) => { host.innerHTML = h; const pg = host.firstChild, inn = pg.querySelector(':scope > .lh-in'), cs = getComputedStyle(pg), avail = pg.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const over = Math.round(inn.scrollHeight - avail), frees = [...pg.querySelectorAll('.lh-frame'), pg].filter(F => F.dataset.free != null).map(F => +F.dataset.free);
  const txtOver = [...pg.querySelectorAll('.lh-htxt')].map(t => t.scrollHeight - t.clientHeight).filter(d => d > 1);
  const r = (i + 1) + ':' + pg.className.replace('pv-page ', '') + ' free' + JSON.stringify(frees) + (pg.querySelector('.lh-ad') ? ' AD' : '') + (pg.querySelector('.lh-pull') ? ' PULL' : '') + (pg.querySelector('.tight') ? ' tight' : '') + (pg.querySelector('.tighter') ? 'er' : '');
  rep.push(r); if (over > 1 || txtOver.length || frees.some(f => f < -1)) bad.push(r + ' over ' + over + ' ' + txtOver); });
host.remove(); return { pages: PAPER.pages.length, bad, rep };
