// the paper with real input: click the small paper open, turn pages with the arrow keys, the nav buttons (mouse) and the wheel; the AVAA LEHTI tag is fully visible
await new Promise(r => setTimeout(r, 2500)); lehtiBuild(); await new Promise(r => setTimeout(r, 300));
const mini = document.getElementById('lehti-mini'), tag = mini.querySelector('.lm-btn'), mr = mini.getBoundingClientRect(), tr = tag.getBoundingClientRect();
const at = document.elementFromPoint(tr.left + tr.width/2, tr.top + tr.height/2);
return { mini: [mr.left, mr.top, mr.right, mr.bottom].map(Math.round), tag: [tr.left, tr.top, tr.right, tr.bottom].map(Math.round), tagOnTop: !!(at && at.closest('.lm-btn')), clickAt: [Math.round(mr.left + mr.width/2), Math.round(mr.top + mr.height/2)] };
