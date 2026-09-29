// The paper as a PDF: load the built game, lay every page of Ylästön Sanomat (PAPER.pages) one per PDF page, print → lehti/ylaston-sanomat.pdf
// usage: node lehti_pdf.js ../index.html ../lehti/ylaston-sanomat.pdf   (build.py runs it; the page links "s. 12" jump inside the PDF)
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
(async () => {
  const [game, out] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 760, height: 1000 } });
  await page.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(require.resolve('three/build/three.min.js')), contentType: 'text/javascript' }));
  await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await page.goto('file://' + path.resolve(game));
  await page.waitForFunction(() => typeof PAPER !== 'undefined' && PAPER.pages.length > 5, null, { timeout: 90000 });
  const n = await page.evaluate(async () => {
    window.requestAnimationFrame = () => 0;   // (the game stops: only the paper is left)
    const st = document.createElement('style'); st.textContent = '@page { size: 760px 1000px; margin: 0; } html, body { margin: 0 !important; padding: 0 !important; background: #f1ead8 !important; overflow: visible !important; height: auto !important; } body > .pv-page { break-after: page; page-break-after: always; } body > .pv-page:last-child { break-after: auto; } .lh-photo .lh-miss { display: none; } .lh-photo img { filter: none !important; transition: none !important; opacity: 1 !important; }';
    document.body.innerHTML = PAPER.pages.join(''); document.querySelectorAll('body > .pv-page').forEach((p, i) => p.id = 's' + (i + 1));
    document.head.appendChild(st); document.body.className = '';
    document.querySelectorAll('[data-go]').forEach(a => a.setAttribute('href', '#s' + a.dataset.go));
    const ims = [...document.querySelectorAll('img[data-src]')];
    await Promise.all(ims.map(im => new Promise(ok => { im.onload = () => { im.parentNode.classList.add('ok'); ok(); }; im.onerror = () => { im.parentNode.classList.add('miss'); ok(); }; im.src = im.dataset.src; })));
    for (const im of ims) { if (!im.naturalWidth) continue; const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const g = c.getContext('2d');   // (the sepia baked into the JPEG: a CSS filter would print as a huge raw bitmap)
      g.filter = 'sepia(0.15) contrast(1.05)'; g.drawImage(im, 0, 0); await new Promise(ok => { im.onload = ok; im.src = c.toDataURL('image/jpeg', 0.86); }); }
    await document.fonts.ready; return { pages: PAPER.pages.length, imgs: ims.length, missing: ims.filter(im => !im.naturalWidth).length };
  });
  await page.pdf({ path: out, width: '760px', height: '1000px', printBackground: true, preferCSSPageSize: true });
  console.log('paper pdf:', n.pages, 'pages,', n.imgs, 'photos' + (n.missing ? ', MISSING ' + n.missing : '') + ',', (fs.statSync(out).size/1e6).toFixed(1), 'MB');
  await browser.close();
})().catch(e => { console.error('PDF', e.message); process.exit(1); });
