# SuomiRalli — YLÄSTÖ 1988 (korkeusversio)

Antti's single-file Three.js r128 rally game on the real streets of Ylästö, Vantaa (OSM road network, 1990-stock houses),
with 8× placeholder terrain relief. Antti writes Finnish, informally and tersely; answer in Finnish, handle implementation
decisions yourself, and verify before delivering. Full history of decisions and versions: NOTES.md (read it first).

## Layout
- `index.html` — the playable game, BUILT (don't edit by hand)
- `editor.html` — the track/world editor; it embeds the game template (base64) and builds the game itself ("▶ Pelaa rata")
- `src/game.html` — the game template: ALL game code lives here
- `build.py` — src/game.html → embedded into editor.html → headless editor build → index.html (also `node --check`s the code)
- `test/` — Playwright + SwiftShader harness: `node real.js ../index.html t_x.js [w h]` runs a script inside the real page;
  `SEED=n` makes runs reproducible; `runall.sh outdir t_a t_b …` runs a list two at a time (more in parallel times out)
- `tools/dem/` — importer for the real MML 2 m elevation model (pending: Antti hasn't uploaded the GeoTIFF yet)

## Setup
```
cd test && npm i            # playwright-core + three@0.128.0
# real.js launches Chromium from /opt/pw-browsers/chromium-1194/chrome-linux/chrome — adjust executablePath if different
```
In test scripts: stub `renderer.render` while simulating, step with `loop(lastTime + 1000/60)`, render only for `__shot`/`__save`.

## Architecture (see "THE WORLD" section in src/game.html and NOTES.md "How to add something")
- Terrain: "build flat, lift once" — world built at Y=0, then buildHeightField() + liftWorld() + worldBuild(); Y()=H() after.
- Human (every person, tasks for what they do), Vehicle (one driving model for all non-player vehicles, VSPEC per kind, AI
  sets v.ctrl), STATIC (houses/shops/pines/poles as solid boxes), FIRES, DISPATCH (hurt → ambulance, fire → fire engine).
- Patch edits with exact-match replacements that assert a single match; rebuild with `python3 build.py`; rerun regressions
  (t_lap, t_start, t_phases, t_ghost) plus the tests for what changed.

## Working rules from Antti
- Keep earlier versions safe (he asked for new versions so the old one stays intact); the flat original game is separate.
- He plays from the published build; deliver the built game, keep the editor in sync (editor is the source of truth).
