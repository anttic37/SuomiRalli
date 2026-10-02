initAudio = () => {}; renderer.render = () => {}; startRace(false); const hs = [], ds = [];
for (const A of APPLES.list.slice(0, 80)) for (let k = A.i0; k < A.i0 + A.n; k++) { const p = APPLES.pos[k]; hs.push(+(p[1] - Y(A.x, A.z)).toFixed(1)); ds.push(+Math.hypot(p[0] - A.x, p[2] - A.z).toFixed(1)); }
hs.sort((a, b) => a - b); ds.sort((a, b) => a - b); const q = (a) => [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1].map(f => a[Math.min(a.length - 1, Math.floor(f*a.length))]);
return { h: q(hs), d: q(ds), n: APPLES.list[0].n };
