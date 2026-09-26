// draw batching is exact: the same frame drawn batched and as the original meshes (same page, same state) → pixel diff
// run with real_noraf.js (no animation frames, so nothing moves between the two renders)
initAudio = () => {}; setTimeOfDay('paiva');
const gl = renderer.getContext(), W = gl.drawingBufferWidth, Hh = gl.drawingBufferHeight;
const grab = () => { renderer.render(scene, camera); const px = new Uint8Array(W*Hh*4); gl.readPixels(0, 0, W, Hh, gl.RGBA, gl.UNSIGNED_BYTE, px); return px; };
const set = (tx, tz, ex, ez, up) => { car.x = tx + 20; car.z = tz + 20; HUMANS.forEach(h => { h.far = Math.hypot(h.x - car.x, h.z - car.z) >= 240; if (h.view.kind === 'rig') humanSync(h); }); nearVisT = 0; nearVisUpdate(0.01);
  camera.position.set(ex, H(ex, ez) + up, ez); camera.lookAt(tx, H(tx, tz) + 1, tz); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
  dirLight.position.set(tx + SUN.x, H(tx, tz) + SUN.y, tz + SUN.z); dirLight.target.position.set(tx, H(tx, tz), tz); dirLight.target.updateMatrixWorld(); U_TIME.value = 0; };
const onOff = (on) => { if (on) { BATCH.dirty = true; scene.onBeforeRender = batchFill; } else { scene.onBeforeRender = () => {}; for (const B of BATCH.groups.values()) { for (const m of B.meshes) m.layers.set(0); if (B.im) B.im.visible = false; } } };
const out = {};
for (const kind of ['cook', 'football', 'mow', 'hoist', 'ride', 'fight', 'bus']) {
  const o = kind === 'bus' ? VEHICLES.find(v => v.kind === 'bus') : HUMANS.find(h => h.task && h.task.kind === kind); if (!o) continue;
  set(o.x, o.z, o.x + 7, o.z + 6, 3); onOff(true); const a = grab(); onOff(false); const b = grab(); onOff(true);
  let mx = 0, n = 0; for (let i = 0; i < a.length; i += 4) { const e = Math.abs(a[i] - b[i]) + Math.abs(a[i+1] - b[i+1]) + Math.abs(a[i+2] - b[i+2]); if (e > mx) mx = e; if (e > 12) n++; }
  out[kind] = 'max ' + mx + ' px>12 ' + n; }
out.batches = [...BATCH.groups.values()].filter(b => b.on).length; out.batchedMeshes = [...BATCH.groups.values()].reduce((s, b) => s + (b.on ? b.meshes.length : 0), 0);
return out;
