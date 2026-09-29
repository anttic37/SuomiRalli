await new Promise(r => setTimeout(r, 2500)); const out = {};
// the menu radio, playing
RADIO.started = true; RADIO.off = false; RADIO.vol = 7; RADIO.list = [{ file: 'etsin-sua-rakas.mp3', title: 'Etsin sua rakas' }]; RADIO.i = 0; RADIO.st = { name: 'Radio Ylästö', freq: '98.4' }; mradioShow();
document.getElementById('mradio').classList.add('play'); document.getElementById('mradio').classList.remove('off');
await new Promise(r => setTimeout(r, 400)); const rr = document.getElementById('mradio').getBoundingClientRect(); out.radio = [rr.x, rr.y, rr.width, rr.height].map(Math.round); await __pageshot('lh_menu_radio.png');
ONLINE.api = '/api'; ONLINE.ok = true; ONLINE.busy = false; ONLINE.name = 'ANBA'; ONLINE.list = [{ k: 'mane', name: 'Mane', t: 86.618 }, { k: 'anba', name: 'ANBA', t: 88.512 }, { k: 'hafe', name: 'häfe', t: 89.165 }, { k: 'wihka', name: 'Wihka', t: 89.0 }, { k: 'pate', name: 'Pate', t: 93.44 }]; ONLINE.opp = [{ name: 'Mane', t: 86.618 }]; renderTop10();
await new Promise(r => setTimeout(r, 400)); const tr = document.getElementById('top10').getBoundingClientRect(); out.top = [tr.x, tr.y, tr.width, tr.height].map(Math.round); await __pageshot('lh_menu_top.png');
return out;
