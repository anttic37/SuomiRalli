const pl = await (await fetch('music/playlist.json')).json(); const out = {};
for (const e of pl) { const d = await new Promise(r => { const a = new Audio(); a.preload = 'metadata'; a.onloadedmetadata = () => r(a.duration); a.onerror = () => r(-1); a.src = 'music/' + encodeURIComponent(e.file); setTimeout(() => r(-2), 8000); });
  const k = e.hevi ? 'hevi' : e.koe ? 'koe' : e.sport ? 'sport' : e.weather ? 'weather' : e.talk ? 'talk' : 'song'; out[k] = out[k] || [0, 0]; out[k][0]++; out[k][1] += d; if (/koelahetys-11/.test(e.file)) out.koe11 = d; }
return out;
