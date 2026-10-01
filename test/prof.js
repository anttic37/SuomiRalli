// CPU profile: node prof.js <game.html> <script.js> [w h] — the script runs twice, first to warm up (window.__warm = true), then under the
// sampling profiler (window.__warm = false); prints the top functions by self and inclusive time. (SwiftShader draws on the CPU: profile logic, not rendering.)
const { chromium } = require('playwright-core');
const fs = require('fs'), path = require('path');
(async () => {
  const [game, scriptFile, W = 1280, H = 720] = process.argv.slice(2);
  const browser = await chromium.launch({ executablePath: process.env.PW_CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const page = await browser.newPage({ viewport: { width: +W, height: +H } });
  if (process.env.SEED) await page.addInitScript((seed) => { let a = seed >>> 0; Math.random = () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0)/4294967296; }; }, +process.env.SEED);
  await page.route('**/three.min.js', r => r.fulfill({ body: fs.readFileSync(require.resolve('three/build/three.js')), contentType: 'text/javascript' }));
  await page.route('https://fonts.googleapis.com/**', r => r.fulfill({ body: '', contentType: 'text/css' }));
  await page.goto('file://' + path.resolve(game));
  await page.waitForFunction(() => typeof generateTrack === 'function' && typeof trackPoints !== 'undefined' && trackPoints.length > 10, null, { timeout: 90000 });
  const body = fs.readFileSync(scriptFile, 'utf8');
  await page.evaluate(`(async () => { window.__warm = true; ${body} })()`);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 200 }); await cdp.send('Profiler.start');
  const res = await page.evaluate(`(async () => { window.__warm = false; ${body} })()`);
  const { profile } = await cdp.send('Profiler.stop');
  const self = {}, dt = profile.timeDeltas, byId = {}; profile.nodes.forEach(n => byId[n.id] = n);
  const cnt = {}; profile.samples.forEach((s, i) => cnt[s] = (cnt[s] || 0) + (dt[i] || 0));
  let tot = 0; for (const id in cnt) { const n = byId[id], cf = n.callFrame, k = (cf.functionName || '(anon)') + ' ' + path.basename(cf.url) + ':' + (cf.lineNumber + 1); self[k] = (self[k] || 0) + cnt[id]; tot += cnt[id]; }
  // inclusive
  const incl = {}; const walk = (n, stack) => { const cf = n.callFrame, k = (cf.functionName || '(anon)') + ' ' + path.basename(cf.url) + ':' + (cf.lineNumber + 1); const ns = stack.includes(k) ? stack : stack.concat(k); let t = cnt[n.id] || 0; (n.children || []).forEach(c => t += walk(byId[c], ns)); if (!stack.includes(k)) incl[k] = (incl[k] || 0) + t; return t; };
  walk(byId[profile.nodes[0].id], []);
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => (v/1000).toFixed(0).padStart(7) + 'ms ' + (100*v/tot).toFixed(1).padStart(5) + '% ' + k).join('\n');
  console.log('RESULT', JSON.stringify(res)); console.log('TOTAL', (tot/1000).toFixed(0), 'ms\n--- self ---\n' + top(self, 45) + '\n--- inclusive ---\n' + top(incl, 45));
  await browser.close();
})().catch(e => { console.error('HARNESS', e.message); process.exit(1); });
