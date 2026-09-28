// the gig bus with real audio: no errors, the bus's gain goes up as it comes by, the radio ducks, and back when it's gone
initAudio(); renderer.render = () => {}; await new Promise(r => setTimeout(r, 500)); startRace(false); const out = { g: [] };
const wait = (ms) => new Promise(r => setTimeout(r, ms)); for (let i = 0; i < 20; i++) { await wait(50); }
await wait(4500); bassToggle(); await wait(300); const v = HEVI.v; out.state0 = gameState; out.spawned = !!v; if (!v) return out;
for (let k = 0; k < 12; k++) { const [x, z] = pathAt(v, v.s + 30 - k*6); car.x = x + Math.cos(v.yaw)*6; car.z = z - Math.sin(v.yaw)*6; await wait(250); out.g.push(+HEVI.g.gain.value.toFixed(2)); }
out.state = audio.ctx.state; out.step = HEVI.step; out.ducked = HEVI.ducked; bassToggle(); car.x = v.x + 400; await wait(800); out.goneAfterOff = !HEVI.v; out.gAfter = +HEVI.g.gain.value.toFixed(3);
return out;
