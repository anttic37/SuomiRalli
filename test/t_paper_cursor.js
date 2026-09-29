// the pointer stays visible over the open paper (body has cursor:none for driving)
await new Promise(r => setTimeout(r, 1500)); paperOpen(0); PAPER.v = 2; paperShow(); await new Promise(r => setTimeout(r, 300));
const at = (x, y) => getComputedStyle(document.elementFromPoint(x, y)).cursor;
return { stage: at(innerWidth/2, innerHeight/2), bg: at(5, innerHeight - 5), nav: at(40, innerHeight/2) };
