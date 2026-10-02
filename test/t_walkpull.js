// on foot: how often and how hard the camera is pulled in by a house or a crest between (judder = boom lurching in and out)
initAudio = () => {}; renderer.render = () => {}; startRace(false); for (let i = 0; i < 60*2; i++) loop(lastTime + 1000/60);
walkOut(); for (let i = 0; i < 90; i++) loop(lastTime + 1000/60); const h = WALK.h; keys.ArrowUp = true;
let ev = 0, prev = 1, minP = 1, big = 0, steps = []; const p0 = camera.position.clone();
for (let i = 0; i < 60*40; i++) { keys.ArrowLeft = (i % 400) < 70; keys.ArrowRight = (i % 400) > 200 && (i % 400) < 240; car.x = h.x + 30; car.z = h.z; loop(lastTime + 1000/60);
  const p = camera.position, st = p.distanceTo(p0); p0.copy(p); steps.push(st); if (CAM.pull < 0.97 && prev >= 0.97) ev++; prev = CAM.pull; minP = Math.min(minP, CAM.pull); }
keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = false; steps.sort((a, b) => a - b);
return { pullEvents: ev, minPull: +minP.toFixed(2), stepMed: +steps[steps.length >> 1].toFixed(3), step99: +steps[Math.floor(steps.length*0.99)].toFixed(3), stepMax: +steps[steps.length - 1].toFixed(3) };
