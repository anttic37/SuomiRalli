// the weather forecasts on the radio: in the list, 🌦 on the display, on a weather station, and the mp3s really play
initAudio(); renderer.render = () => {}; await new Promise(r => setTimeout(r, 800)); startRace(false); await new Promise(r => setTimeout(r, 800));
const out = { n: RADIO.list.length, wx: [] }; let prev = -9;
RADIO.list.forEach((t, i) => { if (t.talk && RADIO.list[i - 1] && RADIO.list[i - 1].talk) out.twoTalksInARow = true; });
for (const [i, t] of RADIO.list.entries()) if (t.weather) { RADIO.started = true; RADIO.off = false; RADIO.i = i; radioTune(); radioPlay(); radioShow(); await new Promise(r => setTimeout(r, 1500));
  out.wx.push({ i, title: document.getElementById('radio-title').textContent, st: RADIO.st.name + ' ' + RADIO.st.freq, dur: Math.round(RADIO.el.duration), err: RADIO.el.error && RADIO.el.error.code, playing: !RADIO.el.paused && RADIO.el.currentTime > 0 }); }
RADIO.el.pause(); return out;
