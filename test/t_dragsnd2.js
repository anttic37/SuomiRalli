// in the running game (over http): the dragster's V8 worklet loads and plays, no errors
initAudio(); startRace(false); for (let i = 0; i < 30; i++) loop(lastTime + 1000/60); lapStarted = true; dragSwap(true);
await new Promise(r => setTimeout(r, 1500)); keys['ArrowUp'] = true; for (let i = 0; i < 60; i++) loop(lastTime + 1000/60); keys['ArrowUp'] = false;
return { v8: audio.dragSynth.v8, ctx: audio.ctx.state, drag: DRAG.on, rpm: Math.round(DP.rpm) };
