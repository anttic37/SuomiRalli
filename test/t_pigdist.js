// how far every concrete pig is from the route's edge (depot pigs apart): none at the kerb any more
for (let i = 0; i < 3; i++) loop(lastTime + 1000/60);
const hw = (i) => (typeof wAt === 'function' ? wAt(i) : 9.5)*0.5;
const d = tires.filter(t => t.kind === 'pig' && !(DEPOTS.list || []).some(D => Math.hypot(D.x - t.x, D.z - t.z) < 30)).map(t => { const r = roadInfo(t.x, t.z); return Math.sqrt(r.d2) - hw(r.idx); });
const b = [0, 2, 4, 6, 8, 12, 99], hist = b.slice(1).map((v, i) => d.filter(x => x >= b[i] && x < v).length);
return { pigs: d.length, edgeDistHist_0_2_4_6_8_12_plus: hist, min: +Math.min(...d).toFixed(1), stacks: tires.filter(t => t.kind === 'tire').length };
