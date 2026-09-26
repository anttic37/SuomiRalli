// Local stand-in for suomiralli.netlify.app: the repo's static files + the real /api function (netlify/functions/api.mjs)
// over an in-memory store. node serve.mjs [port]  → http://localhost:8787/
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { handle } from '../netlify/functions/api.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), PORT = +(process.argv[2] || 8787), mem = new Map();
const store = { async get(k, o) { const v = mem.get(k); return v === undefined ? null : (o && o.type === 'json' ? JSON.parse(v) : v); }, async setJSON(k, v) { mem.set(k, JSON.stringify(v)); }, async delete(k) { mem.delete(k); } };
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:' + PORT);
  if (url.pathname.startsWith('/api/')) { const body = req.method === 'POST' ? await new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => r(b)); }) : undefined;
    const out = await handle(new Request(url, { method: req.method, headers: req.headers, body }), store); res.writeHead(out.status, Object.fromEntries(out.headers)); res.end(await out.text()); return; }
  if (url.pathname === '/__store') { res.writeHead(200, { 'content-type': 'application/json' }); res.end(JSON.stringify([...mem.keys()])); return; }
  const f = path.join(ROOT, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname)); if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log('http://localhost:' + PORT + '/'));
