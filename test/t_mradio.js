// the start screen's car radio: shows once the playlist is in; power starts it in the menu, ◀◀ ▶▶ change station, − + the volume;
// the race carries on with the same song
initAudio = initAudio;   // (real audio: it's the radio)
await new Promise(r => { const t0 = Date.now(), w = () => RADIO.list.length || Date.now() - t0 > 8000 ? r() : setTimeout(w, 100); w(); });
const $ = (id) => document.getElementById(id), out = { list: RADIO.list.length, shown: $('mradio').classList.contains('on'), before: $('mr-title').textContent };
await new Promise(r => setTimeout(r, 400)); await __pageshot('mr_off.png');
$('mr-power').click(); await new Promise(r => setTimeout(r, 1500));
out.on = { started: RADIO.started, off: RADIO.off, paused: RADIO.el && RADIO.el.paused, freq: $('mr-freq').textContent, st: $('mr-st').textContent, title: $('mr-title').textContent, state: gameState };
const i0 = RADIO.i; $('mr-next').click(); await new Promise(r => setTimeout(r, 300)); out.next = [i0, RADIO.i, $('mr-freq').textContent];
$('mr-prev').click(); await new Promise(r => setTimeout(r, 300)); out.prev = RADIO.i;
const v0 = RADIO.vol; $('mr-vup').click(); $('mr-vup').click(); out.vol = [v0, RADIO.vol]; $('mr-vdn').click(); out.vol.push(RADIO.vol);
await new Promise(r => setTimeout(r, 600)); await __pageshot('mr_on.png');
$('mr-power').click(); out.offAgain = { off: RADIO.off, paused: RADIO.el.paused, lcd: $('mr-title').textContent }; $('mr-power').click(); out.onAgain = { off: RADIO.off, paused: RADIO.el.paused };
const src = RADIO.el.src; renderer.render = () => {}; startRace(false); let T0 = performance.now(); for (let i = 0; i < 60; i++) { T0 += 1000/60; loop(T0); }
out.race = { sameSong: RADIO.el.src === src, paused: RADIO.el.paused, hud: $('radio').classList.contains('on') };
setLang('en'); out.en = [$('mradio').querySelector('.mr-cap').textContent, $('mradio').querySelectorAll('.grp span')[0].textContent]; setLang('fi');
return out;
