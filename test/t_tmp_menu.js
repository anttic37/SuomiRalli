await new Promise(r => setTimeout(r, 2500)); const a = document.getElementById('stats').textContent;
initAudio = () => {}; startRace(false); await new Promise(r => setTimeout(r, 1500)); const b = document.getElementById('stats').textContent; toMenu(); await new Promise(r => setTimeout(r, 1500));
await __pageshot('menu_stats.png'); return { before: a, afterStart: b };
