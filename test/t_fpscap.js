// the frame cap: at 144 / 120 / 165 / 60 Hz refreshes, which get drawn and how evenly (lastTime moves only on drawn frames)
initAudio = () => {}; renderer.render = () => {}; startRace(false); const res = {};
for (const hz of [144, 120, 165, 60]) { FPS_CAP = 60; FPS_EMA = 0; FPS_N = 1; FPS_PREV = -1; let t = lastTime; const gaps = {}; let prev = lastTime;
  for (let i = 0; i < 600; i++) { t += 1000/hz; loop(t); if (lastTime !== prev) { if (i > 200) { const g = Math.round(lastTime - prev); gaps[g] = (gaps[g] || 0) + 1; } prev = lastTime; } }
  res[hz] = { n: FPS_N, gaps }; }
FPS_CAP = 0; return res;
