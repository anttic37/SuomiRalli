initAudio = () => {}; renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
const t0 = performance.now(); while (!PHYS.ready && !PHYS.failed && performance.now() - t0 < 60000) await new Promise(r => setTimeout(r, 200));
car.x = BALES[0].x + 400; car.z = BALES[0].z; st(300);
const m = (f) => { const t = performance.now(); f(); return +((performance.now() - t)/300).toFixed(2); }; const r = [];
for (let k = 0; k < 3; k++) { PHYS.balesOn = true; r.push(['on', m(() => st(300))]); PHYS.balesOn = false; r.push(['off', m(() => st(300))]); }
PHYS.balesOn = true; return { r, sleeping: BALES.filter(q => q.rb.isSleeping()).length };
