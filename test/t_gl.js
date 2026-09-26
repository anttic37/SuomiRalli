// real GL work per frame (shadow pass included): wrap the draw calls on the context
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
step(60*3.3);
const gl = renderer.getContext(); const C = { calls: 0, verts: 0, inst: 0, prog: 0, tex: 0, buf: 0, bufBytes: 0 };
const wrap = (n, f) => { const o = gl[n].bind(gl); gl[n] = (...a) => { f(a); return o(...a); }; };
wrap('drawElements', a => { C.calls++; C.verts += a[1]; }); wrap('drawArrays', a => { C.calls++; C.verts += a[2]; });
wrap('drawElementsInstanced', a => { C.calls++; C.verts += a[1]*a[4]; C.inst++; }); wrap('drawArraysInstanced', a => { C.calls++; C.verts += a[2]*a[3]; C.inst++; });
wrap('useProgram', () => C.prog++); wrap('bindTexture', () => C.tex++); wrap('bufferSubData', a => { C.buf++; C.bufBytes += a[2].byteLength; }); wrap('bufferData', a => { C.buf++; C.bufBytes += a[1] && a[1].byteLength || 0; });
const out = [];
for (let k = 0; k < 5; k++) { step(60*5, steer); RR(scene, camera); step(1, steer); RR(scene, camera); step(1, steer); for (const key in C) C[key] = 0; let shadowCalls = 0;
  const sr = renderer.shadowMap.render.bind(renderer.shadowMap); renderer.shadowMap.render = (...a) => { const c0 = C.calls; sr(...a); shadowCalls = C.calls - c0; };
  RR(scene, camera); renderer.shadowMap.render = sr;
  out.push({ ...C, kverts: Math.round(C.verts/1000), verts: undefined, shadowCalls, kB: Math.round(C.bufBytes/1024), bufBytes: undefined }); }
return out;
