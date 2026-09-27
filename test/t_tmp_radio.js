initAudio = () => {}; renderer.render = () => {}; await new Promise(r => setTimeout(r, 1500)); startRace(false); for (let i = 0; i < 60; i++) loop(lastTime + 1000/60);
radioStart(); RADIO.i = 4; radioNext(); await new Promise(r => setTimeout(r, 1500));
return { n: RADIO.list.length, talks: RADIO.list.filter(t => t.talk).length, i: RADIO.i, title: document.getElementById('radio-title').textContent, src: RADIO.el.src.split('/').pop(), err: RADIO.el.error && RADIO.el.error.code, dur: RADIO.el.duration };
