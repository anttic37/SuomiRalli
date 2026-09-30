// the dragster's modelled V8 (AudioWorklet) rendered offline: levels against the old oscillator synth, and demo clips (idle, rev, launch) as WAV
const SR = 44100, wav = (buf) => { const d = buf.getChannelData(0), n = d.length, ab = new ArrayBuffer(44 + n*2), v = new DataView(ab); const w = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, 'RIFF'); v.setUint32(4, 36 + n*2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, SR, true); v.setUint32(28, SR*2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n*2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i*2, Math.max(-1, Math.min(1, d[i]))*32767, true); let s = ''; const u = new Uint8Array(ab); for (let i = 0; i < u.length; i += 8192) s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); return 'data:audio/wav;base64,' + btoa(s); };
const rms = (buf, a, b) => { const d = buf.getChannelData(0); let s = 0; for (let i = Math.floor(a*SR); i < b*SR; i++) s += d[i]*d[i]; return Math.sqrt(s/((b - a)*SR)); };
const peak = (buf) => { const d = buf.getChannelData(0); let m = 0; for (const x of d) m = Math.max(m, Math.abs(x)); return m; };
// a script: [t, rpm, thr]
const script = [[0, 1000, 0], [3, 1000, 0], [3.1, 4500, 1], [3.6, 2200, 0], [4.4, 1000, 0], [5, 5200, 1], [5.5, 1800, 0], [6.5, 1000, 0], [7.5, 1500, 1], [9.8, 8200, 1], [10.2, 8200, 0], [11.5, 1100, 0], [13, 1000, 0]];
const at = (t) => { let k = 0; while (k < script.length - 1 && script[k + 1][0] <= t) k++; const [t0, r0, h0] = script[k], n = script[k + 1] || script[k]; const f = n[0] > t0 ? Math.min(1, (t - t0)/(n[0] - t0)) : 0; return [r0 + (n[1] - r0)*f, h0]; };
async function render(useNew, dur) { const ctx = new OfflineAudioContext(1, SR*dur, SR);
  if (useNew) { await ctx.audioWorklet.addModule(URL.createObjectURL(new Blob([DRAG_WORKLET], { type: 'application/javascript' }))); const n = new AudioWorkletNode(ctx, 'drag-v8', { numberOfInputs: 0, outputChannelCount: [1] }); n.connect(ctx.destination);
    for (let t = 0; t < dur; t += 1/60) { const [r, h] = at(t); n.parameters.get('rpm').setValueAtTime(r, t); n.parameters.get('load').setValueAtTime(h, t); n.parameters.get('level').setValueAtTime(DRAG_V8_LEVEL*(1.5 - 0.5*h), t); } }
  else { const S = createDragSynth(ctx, ctx.destination); for (let t = 0; t < dur; t += 1/60) { const [r, h] = at(t); S.update({ rpm: r, thr: h, on: true, scrape: 0, volume: 1 }, t, 1/60); } }
  return ctx.startRendering(); }
const nb = await render(true, 13); await __save('/tmp/claude-0/-home-user-SuomiRalli/fed9fe44-2f84-5613-a849-ba31b6a5a3e9/scratchpad/dragster_uusi.wav', wav(nb));
const res = { idle: rms(nb, 1, 3).toFixed(3), launch: rms(nb, 8.5, 9.8).toFixed(3), revs: rms(nb, 3.1, 3.6).toFixed(3), peak: peak(nb).toFixed(2) };
const ob = await render(false, 13); await __save("/tmp/claude-0/-home-user-SuomiRalli/fed9fe44-2f84-5613-a849-ba31b6a5a3e9/scratchpad/dragster_vanha.wav", wav(ob)); res.old = { idle: rms(ob, 1, 3).toFixed(3), launch: rms(ob, 8.5, 9.8).toFixed(3), revs: rms(ob, 3.1, 3.6).toFixed(3), peak: peak(ob).toFixed(2) };
return res;
