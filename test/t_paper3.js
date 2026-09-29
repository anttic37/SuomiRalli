await new Promise(r => setTimeout(r, 3000)); await __pageshot('fin_menu_' + innerWidth + '.png');
if (innerWidth >= 1600) { paperOpen(0); PAPER.v = 1; paperShow(); await new Promise(r => setTimeout(r, 1500)); await __pageshot('fin_spread.png'); PAPER.v = 11; paperShow(); await new Promise(r => setTimeout(r, 1500)); await __pageshot('fin_page.png'); }
if (innerWidth < 500) { document.getElementById('lehti-btn').click(); await new Promise(r => setTimeout(r, 1500)); await __pageshot('fin_mobile_paper.png'); }
return { wide: document.body.classList.contains('lh-wide') };
