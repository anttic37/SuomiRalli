# YLÄSTÖ 1988 — korkeuserot (SuomiRalli)

Single-file Three.js rally game on the real streets of Ylästö, Vantaa, with 8× terrain relief.

- **Play:** open `index.html` (or GitHub Pages)
- **Editor:** `editor.html` — edits the world/track and builds the game
- **Source:** `src/game.html` (game template) → `python3 build.py` → `index.html`
- **Tests:** `test/` (Playwright harness), see CLAUDE.md
- **History:** NOTES.md

Version 6: one driving model for every vehicle, soft pedestrian impacts (bonnet ride), fires + fire brigade, every person a
Human with the same collisions, slippery grass.
