#!/usr/bin/env python3
# src/game.html (template) → embedded in editor.html → headless editor build → index.html (the playable game)
import re, base64, subprocess, sys, os
R = os.path.dirname(os.path.abspath(__file__))
p = lambda *a: os.path.join(R, *a)
src = open(p('src', 'game.html'), encoding='utf-8').read()
html = open(p('editor.html'), encoding='utf-8').read()
tpl = base64.b64encode(src.encode('utf-8')).decode()
html, n = re.subn(r'const GAME_TPL_B64 = "[A-Za-z0-9+/=]+";', 'const GAME_TPL_B64 = "' + tpl + '";', html, count=1); assert n == 1
open(p('editor.html'), 'w', encoding='utf-8').write(html)
open(p('test', 'editor.js'), 'w', encoding='utf-8').write(re.findall(r'<script>(.*?)</script>', html, re.S)[-1])
open(p('test', 'game.js'), 'w', encoding='utf-8').write(re.findall(r'<script>(.*?)</script>', src, re.S)[-1])
r = subprocess.run(['node', '--check', p('test', 'game.js')], capture_output=True, text=True)
if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
r = subprocess.run(['node', p('test', 'edbuild.js'), p('index.html')], capture_output=True, text=True)
print(r.stdout.strip() or r.stderr[-800:])
# the route for the server's cut check: every track version's points + widths in netlify/lib/tracks.mjs (older tracks kept)
import json
def fnv(sig):
    h = 0x811c9dc5
    for ch in sig: h ^= ord(ch); h = (h * 0x01000193) & 0xffffffff
    return '%08x' % h
r = subprocess.run(['node', p('test', 'real.js'), p('index.html'), p('test', 'export_track.js')], capture_output=True, text=True, cwd=p('test'))
try:
    T = json.loads(r.stdout.strip().splitlines()[-1])['result']; tp = p('netlify', 'lib', 'tracks.mjs'); old = {}
    if os.path.exists(tp): old = json.loads(open(tp, encoding='utf-8').read().split('=', 1)[1].strip().rstrip(';'))
    old[fnv(T['sig'])] = T
    open(tp, 'w', encoding='utf-8').write('// written by build.py: each track version (by trackId of its signature) → route points and road widths, for the cut check in api.mjs\nexport const TRACKS = ' + json.dumps(old, separators=(',', ':')) + ';\n')
    print('track for the server:', fnv(T['sig']), len(T['x']), 'points')
except Exception as e: print('WARNING: track export failed (the server keeps the previous tracks.mjs):', str(e)[:200], r.stderr[-300:])
# the paper as a PDF beside the photos (lehti/ylaston-sanomat.pdf, the ⬇ PDF button in the paper): every page of the built game's PAPER
if not os.environ.get('NOPDF'):
    r = subprocess.run(['node', p('test', 'lehti_pdf.js'), p('index.html'), p('lehti', 'ylaston-sanomat.pdf')], capture_output=True, text=True, cwd=p('test'))
    print(r.stdout.strip() or 'WARNING: paper pdf failed: ' + r.stderr[-400:])
