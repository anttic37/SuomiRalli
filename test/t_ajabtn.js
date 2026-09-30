// the big AJA button on the start screen starts the race like Enter
await new Promise(r => setTimeout(r, 2500)); const b = document.getElementById('aja-btn'), r = b.getBoundingClientRect(); const out = { btn: [r.x, r.y, r.width, r.height].map(Math.round), text: b.textContent, st0: gameState };
await __pageshot('aja_btn.png'); b.click(); await new Promise(r => setTimeout(r, 300)); out.st1 = gameState; out.racing = gameState === State.RACING; return out;
