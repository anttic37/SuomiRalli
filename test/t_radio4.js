initAudio(); renderer.render = () => {}; await new Promise(r => setTimeout(r, 500)); startRace(false); await new Promise(r => setTimeout(r, 800)); const res = [];
for (const i of [6, 7, 8, 9]) { RADIO.i = i; radioPlay(); await new Promise(r => setTimeout(r, 1500)); res.push(RADIO.list[i].title + ' ' + Math.round(RADIO.el.duration) + 's err=' + (RADIO.el.error && RADIO.el.error.code)); }
return { n: RADIO.list.length, res };
