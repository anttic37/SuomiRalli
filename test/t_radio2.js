initAudio(); renderer.render = () => {}; await new Promise(r => setTimeout(r, 500)); startRace(false);
await new Promise(r => setTimeout(r, 3000)); RADIO.i = 5; radioPlay(); await new Promise(r => setTimeout(r, 2000)); const el = RADIO.el;
return { list: RADIO.list.map(t => t.title), playing: RADIO.list[RADIO.i].title, duration: el && el.duration, readyState: el && el.readyState, error: el && el.error && el.error.code, t: el && el.currentTime };
