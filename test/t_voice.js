// recorded voices (audio/*.mp3) load and decode over http — run with runall_http.sh (test/serve.mjs)
initAudio();
const t0 = performance.now(); while (Object.keys(VOICE.buf).length < VOICE.want.length && performance.now() - t0 < 15000) await new Promise(r => setTimeout(r, 200));
const got = Object.fromEntries(VOICE.want.map(n => [n, VOICE.buf[n] ? +VOICE.buf[n].duration.toFixed(2) : null]));
return { protocol: location.protocol, ctx: audio && audio.ctx.state, got, allLoaded: VOICE.want.every(n => VOICE.buf[n]), playOk: voicePlay('morsian1') };
