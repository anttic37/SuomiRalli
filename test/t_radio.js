initAudio(); const RR = renderer.render.bind(renderer); renderer.render = () => {};
let T = performance.now(); const step = (n) => { for (let i = 0; i < n; i++) { T += 1000/60; loop(T); } };
await new Promise(r => setTimeout(r, 500)); const out = { list: RADIO.list.length, keyHint: document.getElementById('radio-key').style.display };
RADIO.i = 0; startRace(false); step(60*4); out.started = RADIO.started; out.src = RADIO.el && RADIO.el.src.split('/').pop(); out.i0 = RADIO.i;
out.box = getComputedStyle(document.getElementById('radio')).display; out.title = document.getElementById('radio-title').textContent;
RADIO.i = 0; radioPlay(); radioShow(true); await new Promise(r => setTimeout(r, 1800)); RR(scene, camera); await __pageshot('radio_hud.png');
const seq = []; for (let k = 0; k < 5; k++) { dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' })); dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyE' })); seq.push(RADIO.off ? 'OFF' : RADIO.i + ':' + RADIO.el.src.split('/').pop()); }
out.seq = seq; await new Promise(r => setTimeout(r, 2500)); out.afterEnded = RADIO.off ? 'OFF' : RADIO.i + ' paused=' + RADIO.el.paused;
return out;
