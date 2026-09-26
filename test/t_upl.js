// which buffers get re-uploaded every frame: attribute versions before/after one frame
initAudio = () => {}; renderer.render = () => {}; startRace(false);
const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 6) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI; keys.ArrowLeft = dA > 0.04; keys.ArrowRight = dA < -0.04; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 16; };
step(60*3.3);
const name = o => { let s = o.userData.key || o.name || ''; for (let p = o.parent; !s && p; p = p.parent) s = p.userData.key || p.name || ''; return (s || o.type) + (o.isInstancedMesh ? '[inst ' + o.count + '/' + o.instanceMatrix.count + ']' : '') + ' ' + (o.geometry && o.geometry.type || ''); };
const agg = {};
for (let k = 0; k < 6; k++) { step(60*4, steer);
  const attrs = []; scene.traverse(o => { if (o.isInstancedMesh) attrs.push([o, 'instanceMatrix', o.instanceMatrix]); if (o.isInstancedMesh && o.instanceColor) attrs.push([o, 'instanceColor', o.instanceColor]);
    if (o.geometry && o.geometry.attributes) for (const a in o.geometry.attributes) attrs.push([o, a, o.geometry.attributes[a]]); });
  const v0 = attrs.map(a => a[2].version); step(1, steer);
  attrs.forEach((a, i) => { if (a[2].version === v0[i]) return; const kk = name(a[0]) + ' .' + a[1]; const r = a[2].updateRange; const bytes = (r && r.count > 0 ? r.count : a[2].array.length)*a[2].array.BYTES_PER_ELEMENT; (agg[kk] = agg[kk] || [0, 0])[0]++; agg[kk][1] += bytes; }); }
return Object.entries(agg).sort((a, b) => b[1][1] - a[1][1]).slice(0, 40).map(([k, v]) => Math.round(v[1]/6/1024) + 'kB/f  ' + v[0] + '/6  ' + k);
