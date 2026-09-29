// lehti photo: the menu radio showing a village rumour (a page shot, cropped round the radio afterwards)
await new Promise(r => setTimeout(r, 2500)); const out = {};
RADIO.started = true; RADIO.off = false; RADIO.vol = 7; RADIO.list = [{ file: 'etsin-sua-rakas.mp3', title: 'Etsin sua rakas' }]; RADIO.i = 0; RADIO.st = { name: 'Radio Ylästö', freq: '98.4' };
ONLINE.list = [{ k: 'mane', name: 'Mane', t: 86.618, d: '2026-09-29' }]; RADIO.news = '📻 ' + T('KYLÄHUHU') + ': ' + T('{0} johtaa ennätyslistaa ajalla {1}', 'Mane', formatTime(86.618)); mradioShow();
document.getElementById('mradio').classList.add('play'); document.getElementById('mradio').classList.remove('off');
await new Promise(r => setTimeout(r, 300)); document.getElementById('mr-title').classList.remove('scroll'); const MR = document.getElementById('mradio'); MR.style.transform = 'scale(2.6)'; MR.style.transformOrigin = '50% 50%'; await new Promise(r => setTimeout(r, 200)); const rr = document.getElementById('mradio').getBoundingClientRect(); out.radio = [rr.x, rr.y, rr.width, rr.height].map(Math.round); await __pageshot('s3_lh_radio_full.png');
return out;
