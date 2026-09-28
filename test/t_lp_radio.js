// with the real playlist: Havuhelvetti isn't on the normal radio; after the LP it's all there is; the gig bus plays their songs
initAudio(); renderer.render = () => {}; const wait = (ms) => new Promise(r => setTimeout(r, ms)); await wait(900); startRace(false); await wait(4500);
const out = { heviTracks: RADIO.hevi.length, heviInNormal: RADIO.list.filter(t => t.hevi).length, normal: RADIO.list.length };
radioStart(); await wait(300); out.before = document.getElementById('radio-title').textContent;
radioLp(); await wait(1500); out.after = { list: RADIO.list.length, allHevi: RADIO.list.every(t => t.hevi), title: document.getElementById('radio-title').textContent, st: RADIO.st.name + ' ' + RADIO.st.freq, playing: !RADIO.el.paused && RADIO.el.currentTime > 0, src: decodeURIComponent(RADIO.el.src.split('/').pop()) };
radioNext(); await wait(600); out.next = document.getElementById('radio-title').textContent;
bassToggle(); await wait(400); const v = HEVI.v; out.bus = !!v; if (v) { for (let k = 0; k < 8; k++) { const [x, z] = pathAt(v, v.s + 20); car.x = x + Math.cos(v.yaw)*6; car.z = z - Math.sin(v.yaw)*6; await wait(250); }
  out.busSong = { el: !!HEVI.el, playing: HEVI.el && !HEVI.el.paused, t: HEVI.el && +HEVI.el.currentTime.toFixed(1), src: HEVI.el && decodeURIComponent(HEVI.el.src.split('/').pop()), gain: +HEVI.g.gain.value.toFixed(2), rate: HEVI.el && +HEVI.el.playbackRate.toFixed(2), synthSteps: HEVI.step }; }
bassToggle(); car.x += 500; await wait(800); out.busPausedAfter = HEVI.el ? HEVI.el.paused : null; RADIO.el.pause();
return out;
