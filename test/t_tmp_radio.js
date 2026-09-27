initAudio = () => {}; renderer.render = () => {}; await new Promise(r => setTimeout(r, 1500)); startRace(false); for (let i = 0; i < 60; i++) loop(lastTime + 1000/60);
radioStart(); const k = RADIO.list.findIndex(t => t.sport); RADIO.i = k - 1; radioNext(); await new Promise(r => setTimeout(r, 500));
return { n: RADIO.list.length, order: RADIO.list.map(t => t.sport ? 'U' : t.talk ? 'T' : 's').join(''), title: document.getElementById('radio-title').textContent, station: document.getElementById('radio-station').textContent, freq: document.getElementById('radio-freq').textContent };
