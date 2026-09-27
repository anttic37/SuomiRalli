startRace(false); step(30);
const c = {}; trackMeshGroup.children.forEach(m => { const k = (m.userData.key || m.name || '-') + (m.userData.phase ? ':ph' : '') + ':' + m.type; c[k] = (c[k] || 0) + 1; });
const t = {}; tires.forEach(x => { const k = x.kind + (x.gate ? ':gate' : '') + (x.off ? ':off' : ''); t[k] = (t[k] || 0) + 1; });
const sc = {}; scene.children.forEach(m => { const k = (m.userData.key || m.name || '-') + ':' + m.type; sc[k] = (sc[k] || 0) + 1; });
return { track: c, tires: t, scene: sc, cornerTractors: CORNER_TRACTORS.length };
