// P pauses: the clock and the world stop, the pause box shows; P again goes on; R / Esc from the pause work; the start screen's PC sticker;
// the GTA minimap (2×, on the car)
initAudio = () => {}; const RR = renderer.render.bind(renderer);
const out = {}; renderer.render = () => {}; await new Promise(r => setTimeout(r, 300)); await __pageshot('pause_menu.png');
out.sticker = (document.getElementById('pcnote') || {}).textContent || null;   // (the PC sticker left the start screen 29.9.)
renderer.render = () => {}; startRace(false); let T0 = performance.now(); const step = (n) => { for (let i = 0; i < n; i++) { T0 += 1000/60; loop(T0); } };
const key = (c) => { dispatchEvent(new KeyboardEvent('keydown', { code: c })); dispatchEvent(new KeyboardEvent('keyup', { code: c })); };
step(60*6); keys.ArrowUp = true; step(60); const t0 = raceTime, w0 = worldT, x0 = car.x;
key('KeyP'); step(120); out.paused = { on: PAUSE.on, clockMoved: +(raceTime - t0).toFixed(3), worldMoved: +(worldT - w0).toFixed(3), carMoved: +Math.abs(car.x - x0).toFixed(3), box: document.getElementById('pause').style.display };

key('KeyP'); keys.ArrowUp = true; step(60); out.resumed = { on: PAUSE.on, worldMoved: +(worldT - w0).toFixed(2) };
key('KeyP'); key('KeyR'); step(5); out.rFromPause = { on: PAUSE.on, state: gameState };
step(60*4); key('KeyP'); key('Escape'); out.escFromPause = { on: PAUSE.on, state: gameState };
key('KeyP'); out.pInMenu = PAUSE.on;
startRace(false); step(60*3.5); freeEnter(); step(30); await __save('mm_gta.png', mmCanvas.toDataURL('image/png'));
return out;
