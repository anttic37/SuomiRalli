// lehti photo: the paper open in the viewer, the ⬇ PDF button in the corner → lehti/pdf.jpg (via pdf.png)
await new Promise(r => setTimeout(r, 2500)); paperOpen(0); PAPER.v = 1; paperShow(); await new Promise(r => setTimeout(r, 1500));
await __pageshot('pdf.png'); return { views: PAPER.views.length, href: document.querySelector('.pv-pdf').href };
