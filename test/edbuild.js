// Build the game from the editor (headless): runs the editor script against a no-op DOM, then calls buildGameHtml().
const fs = require('fs');
const js = fs.readFileSync(__dirname + '/editor.js', 'utf8');
const noop = () => {};
const chain = () => new Proxy(function () {}, { get: (t, k) => k === Symbol.toPrimitive ? () => 0 : (k === 'length' ? 0 : chain()), apply: () => chain(), set: () => true });
const mkEl = () => { const el = { style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, children: [], value: '', checked: true, textContent: '', innerHTML: '', width: 2227, height: 1540,
  addEventListener: noop, removeEventListener: noop, appendChild: c => c, removeChild: noop, append: noop, prepend: noop, remove: noop, setAttribute: noop, getAttribute: () => null, focus: noop, blur: noop, click: noop,
  getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 800, right: 1200, bottom: 800 }), querySelector: () => mkEl(), querySelectorAll: () => [], getContext: () => chain(), contentWindow: { focus: noop }, set onclick(v) {}, get onclick() { return null; } }; return el; };
global.window = global; global.document = { getElementById: mkEl, createElement: mkEl, querySelectorAll: () => [], querySelector: mkEl, addEventListener: noop, body: mkEl(), activeElement: null, execCommand: noop };
global.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
global.addEventListener = noop; global.removeEventListener = noop; global.requestAnimationFrame = noop; global.alert = m => { throw new Error('alert: ' + m); };
global.Image = function () { const o = { width: 4467, height: 3080 }; setTimeout(() => o.onload && o.onload(), 0); return o; };
global.devicePixelRatio = 1; global.innerWidth = 1400; global.innerHeight = 900; global.URL = { createObjectURL: () => '' }; global.Blob = function () {};
global.atob = s => Buffer.from(s, 'base64').toString('binary'); global.btoa = s => Buffer.from(s, 'binary').toString('base64');
global.TextDecoder = require('util').TextDecoder; global.TextEncoder = require('util').TextEncoder;
const out = process.argv[2] || __dirname + '/../index.html';
(0, eval)(js + '\n;globalThis.__build = () => buildGameHtml();');
setTimeout(() => { const g = globalThis.__build(); fs.writeFileSync(out, g.src); console.log('built', out, 'track points', g.n, 'bytes', g.src.length); }, 20);
