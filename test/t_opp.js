renderer.render = () => {}; const L = Array.from({ length: 25 }, (_, i) => ({ k: 'k' + i, name: 'K' + (i + 1), t: 80 + i*0.9 }));   // 80.0 … 101.6; +10 % of 80 = 88
const names = (p) => p.map(r => r.name + ' ' + r.t.toFixed(1)).join(', ');
return { newcomer: names(oppPick(L, Infinity, null)), mid15: names(oppPick(L.filter(r => r.k !== 'k14'), L[14].t, L[14])), third: names(oppPick(L.filter(r => r.k !== 'k2'), L[2].t, L[2])), leader: names(oppPick(L.filter(r => r.k !== 'k0'), 80, L[0])),
  wideGap: names(oppPick([{ name: 'A', t: 80 }, { name: 'B', t: 95 }, { name: 'C', t: 99 }], Infinity, null)) };
