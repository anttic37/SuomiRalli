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
