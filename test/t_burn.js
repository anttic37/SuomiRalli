// burnout (throttle + brake) and the V8's sound rendered offline: level, low-end share (the "brrom")
startRace(false); step(40); lapStarted = true; dragSwap(true); step(30); const x0 = car.x, z0 = car.z;
keys.ArrowUp = true; keys.ArrowDown = true; let spin = 0, rpm = 0; step(120, () => { spin = Math.max(spin, DP.spin); rpm = Math.max(rpm, DP.rpm); }); keys.ArrowUp = keys.ArrowDown = false;
const moved = Math.hypot(car.x - x0, car.z - z0);
const render = async (rpmF, thrF) => { const sr = 22050, oc = new OfflineAudioContext(1, sr*2, sr), syn = createDragSynth(oc, oc.destination); for (let i = 0; i < 120; i++) syn.update({ rpm: rpmF(i/60), thr: thrF(i/60), on: true, scrape: 0, volume: 1 }, i/60, 1/60);
  const buf = await oc.startRendering(), d = buf.getChannelData(0); let e = 0, lo = 0, prev = 0; for (let i = sr/2; i < d.length; i++) { e += d[i]*d[i]; prev += (d[i] - prev)*0.04; lo += prev*prev; } const n = d.length - sr/2; return { rms: +Math.sqrt(e/n).toFixed(3), lowShare: +(lo/Math.max(1e-9, e)).toFixed(2) }; };
const idle = await render(() => 1800, () => 0), rev = await render(t => 1800 + Math.min(1, t*2)*6000, () => 1);
const renderP = async (rpm, thr) => { const sr = 22050, oc = new OfflineAudioContext(1, sr*2, sr), syn = createEngineSynth(oc, oc.destination); for (let i = 0; i < 120; i++) syn.update({ rpm, throttle: thr, gear: 2, on: true, volume: 1 }, i/60, 1/60); const d = (await oc.startRendering()).getChannelData(0); let e = 0; for (let i = sr/2; i < d.length; i++) e += d[i]*d[i]; return +Math.sqrt(e/(d.length - sr/2)).toFixed(3); };
const poko = { idle: await renderP(900, false), rev: await renderP(6000, true) };
return { poko, burnout: { moved: +moved.toFixed(2), spin: +spin.toFixed(1), rpm: Math.round(rpm) }, idle, rev };
