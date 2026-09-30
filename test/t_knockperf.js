const t0 = performance.now(); knockBuild(); const t1 = performance.now(); let verts = 0; for (const it of KNOCK.items) for (const r of it.ranges) verts += r[2];
startRace(false); step(30); lapStarted = true; const it = KNOCK.items.find(i => i.kind === 'tree' && i.ranges.length); knockOver(it, 1, 0, 10); let t2 = performance.now(); for (let k = 0; k < 60; k++) knockAnim(1/60); const t3 = performance.now();
return { buildMs: +(t1 - t0).toFixed(1), verts, animMsPerFrame: +((t3 - t2)/60).toFixed(3) };
