await new Promise(r => setTimeout(r, 2500)); await __pageshot('pp_menu.png'); paperOpen(0); const n = PAPER.views.length;
for (let k = 0; k < n; k++) { PAPER.v = k; paperShow(); await new Promise(r => setTimeout(r, 900)); await __pageshot('pp_' + String(k).padStart(2, '0') + '.png'); }
return { views: n, pages: PAPER.pages.length };
