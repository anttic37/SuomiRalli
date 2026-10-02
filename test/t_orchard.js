initAudio = () => {}; startRace(false); for (let i = 0; i < 30; i++) loop(lastTime + 1000/60);
const o = sceneryDebug.orchards || []; const big = APPLE_TREES.filter(t => APPLE_TREES.filter(u => Math.hypot(u.x - t.x, u.z - t.z) < 5).length >= 4)[0];
if (big) { car.x = big.x + 20; car.z = big.z + 20; for (let i = 0; i < 20; i++) loop(lastTime + 1000/60); camera.position.set(big.x + 14, Y(big.x, big.z) + 22, big.z + 14); camera.lookAt(big.x, Y(big.x, big.z), big.z); await __shot('orch'); }
return { trees: APPLE_TREES.length, apples: APPLES.pos.length, orchards: o.length, sizes: o.reduce((m, n) => (m[n] = (m[n] || 0) + 1, m), {}) };
