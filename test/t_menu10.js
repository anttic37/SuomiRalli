renderer.render = () => {}; ONLINE.api = '/api'; ONLINE.ok = true; ONLINE.busy = false; ONLINE.name = 'ANBA';
ONLINE.list = ['ANBA','Mane','häfe','aki','Pekka Valonen','Ande','Iompo','SpeedkingPepsi87','Mumi87','Tepe','Kalle','Ossi'].concat(Array.from({ length: 13 }, (_, i) => 'Kuski' + (i + 1))).map((n, i) => ({ k: n.toLowerCase(), name: n, t: 86.3 + i*1.7 })); ONLINE.opp = [];
renderTop10(); await new Promise(r => setTimeout(r, 300));
const tb = document.getElementById('top10').getBoundingClientRect(), cb = document.getElementById('changelog').getBoundingClientRect(), ov = document.getElementById('overlay');
const hit = !(cb.right < tb.left || cb.left > tb.right || cb.bottom < tb.top || cb.top > tb.bottom);
await __pageshot('menu10_' + innerWidth + '.png');
const L = document.querySelector('#top10 .t10-list'); return { rows: document.querySelectorAll('#top10 .t10-row').length, listScroll: L && L.scrollHeight > L.clientHeight, listH: L && L.clientHeight, w: innerWidth, h: innerHeight, overlap: hit, scrollable: ov.scrollHeight > ov.clientHeight, clRows: document.querySelectorAll('#changelog .cl-row').length, clBox: [Math.round(cb.left), Math.round(cb.top), Math.round(cb.width), Math.round(cb.height)] };
