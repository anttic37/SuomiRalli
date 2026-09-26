initAudio(); const RR = renderer.render.bind(renderer); renderer.render = () => {}; await new Promise(r => setTimeout(r, 500)); startRace(false);
await new Promise(r => setTimeout(r, 1500)); const key = (c) => { dispatchEvent(new KeyboardEvent('keydown', { code: c })); dispatchEvent(new KeyboardEvent('keyup', { code: c })); };
const v0 = RADIO.vol, g0 = RADIO.gain && RADIO.gain.gain.value; key('Digit2'); key('Digit2'); key('Digit1'); const v1 = RADIO.vol; await new Promise(r => setTimeout(r, 400));
const st = []; for (let k = 0; k < 3; k++) { key('KeyE'); st.push(RADIO.off ? 'OFF' : RADIO.st.freq + ' ' + RADIO.st.name + ' / ' + RADIO.list[RADIO.i].title); }
await new Promise(r => setTimeout(r, 1500)); RR(scene, camera); await __pageshot('radio_hud2.png');
return { v0, v1, gain: RADIO.gain && +RADIO.gain.gain.value.toFixed(2), stored: localStorage.getItem('yl-radio-vol'), st, lcd: document.getElementById('radio').innerText };
