// real_noraf.js: real.js without animation frames — the page never runs loop(), so a test sees the world exactly as built (deterministic with SEED)
// Real-browser harness: load a built game in headless Chromium (three.js served locally), run a script inside the page.
// usage: node real.js <game.html> <script.js> [w h]   — the script runs in the page and may call __shot(name) to save a PNG.
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
(async () => {
  const [game, scriptFile, W = 900, H = 560] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: +W, height: +H } });
  if (process.env.SEED) await page.addInitScript((seed) => { let a = seed >>> 0; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0)/4294967296; }; }, +process.env.SEED);
  await page.addInitScript(() => { window.requestAnimationFrame = () => 0; });
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(require.resolve('three/build/three.min.js')), contentType: 'text/javascript' }));
  await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await page.goto('file://' + path.resolve(game));
  await page.waitForFunction(() => typeof generateTrack === 'function' && typeof trackPoints !== 'undefined' && trackPoints.length > 10, null, { timeout: 90000 });
  await page.exposeFunction('__save', async (name, dataUrl) => fs.writeFileSync(name, Buffer.from(dataUrl.split(',')[1], 'base64')));
  const body = fs.readFileSync(scriptFile, 'utf8');
  const res = await page.evaluate(`(async () => { window.__shot = async (n) => { renderer.render(scene, camera); await __save(n, renderer.domElement.toDataURL('image/png')); }; ${body} })()`);
  console.log(JSON.stringify({ result: res, errors: errors.slice(0, 8) }));
  await browser.close();
})().catch(e => { console.error('HARNESS', e.message); process.exit(1); });
