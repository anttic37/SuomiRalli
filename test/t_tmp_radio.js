initAudio = () => {}; renderer.render = () => {}; await new Promise(r => setTimeout(r, 1500));
return { n: RADIO.list.length, order: RADIO.list.map(t => t.talk ? 'T' : 's').join('') };
