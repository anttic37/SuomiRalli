// the start screen before the script has laid anything out (no lh-wide class yet) must already look like after: QR right-middle, no LEHTI button when wide
const st = () => { const r = document.getElementById('share').getBoundingClientRect(), b = getComputedStyle(document.getElementById('lehti-btn')).display; return { qrX: Math.round(r.left), qrY: Math.round(r.top), btn: b }; };
const after = st(); document.body.classList.remove('lh-wide'); const before = st(); document.body.classList.add('lh-wide');
return { W: innerWidth, H: innerHeight, before, after, same: JSON.stringify(before) === JSON.stringify(after) };
