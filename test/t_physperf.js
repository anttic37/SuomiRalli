initAudio = () => {}; renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3.3); let t0 = performance.now(); for (let i = 0; i < 1200; i++) vehiclesPhysics(1/120); const vp = (performance.now() - t0)/1200;
t0 = performance.now(); for (let i = 0; i < 600; i++) worldUpdate(1/60); const wu = (performance.now() - t0)/600;
return { vehiclesPhysicsMsPerStep: vp.toFixed(3), worldUpdateMs: wu.toFixed(3), active: VEHICLES.filter(v => v.ai || v.awake).length };
