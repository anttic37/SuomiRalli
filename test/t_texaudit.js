// every canvas texture in the world after the start: how many, how many pixel-identical copies, the memory they take (w×h×4)
initAudio = () => {}; renderer.render = () => {}; startRace(false); for (let i = 0; i < 120; i++) loop(lastTime + 1000/60);
const T = new Map(), who = new Map(); const take = (m, o) => { if (!m) return; for (const k of ['map', 'emissiveMap', 'alphaMap', 'bumpMap']) { const t = m[k]; if (t && t.isCanvasTexture) { T.set(t.uuid, t); if (!who.has(t.uuid)) { let p = o, path = []; for (let i = 0; i < 4 && p; i++, p = p.parent) path.push((p.name || p.type) + (p.geometry ? '/' + p.geometry.type : '')); who.set(t.uuid, path.join('<')); } } } };
scene.traverse(o => { const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; ms.forEach(m => take(m, o)); });
const H = new Map(); let bytes = 0;
for (const t of T.values()) { const c = t.image; if (!c || !c.width) continue; bytes += c.width*c.height*4; let h = 0; const d = c.toDataURL(); for (let i = 0; i < d.length; i += 7) h = (h*31 + d.charCodeAt(i)) | 0; const k = c.width + 'x' + c.height + ':' + h + ':' + d.length;
  const e = H.get(k) || { n: 0, w: c.width, h: c.height }; e.n++; H.set(k, e); }
let dupBytes = 0; const dups = []; for (const e of H.values()) if (e.n > 1) { dupBytes += (e.n - 1)*e.w*e.h*4; dups.push(e.n + '×' + e.w + 'x' + e.h); }
const big = [...T.values()].filter(t => t.image && t.image.width).sort((a, b) => b.image.width*b.image.height - a.image.width*a.image.height).map(t => t.image.width + 'x' + t.image.height + ' ' + (t.wrapS === 1000 ? 'rep ' : '') + who.get(t.uuid));
return { big, canvasTextures: T.size, unique: H.size, MB: +(bytes/1048576).toFixed(1), dupMB: +(dupBytes/1048576).toFixed(1), dups: dups.sort((a, b) => parseInt(b) - parseInt(a)).slice(0, 25) };
