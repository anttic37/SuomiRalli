renderer.render = () => {}; const R = HUMANS.filter(h => h.task && h.task.kind === 'ring'), groups = [];
for (const h of R) { let g = groups.find(g => Math.hypot(g.x - h.x, g.z - h.z) < 10); if (!g) groups.push(g = { x: h.x, z: h.z, n: 0 }); g.n++; }
return groups.map(g => ({ at: Math.round(g.x) + ',' + Math.round(g.z), n: g.n, fromRoute: Math.round(distRoute(g.x, g.z)) }));
