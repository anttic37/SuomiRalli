// GTA mode: every junction of a street with the route (and the other street junctions near it), from a chase-like height
startRace(false); step(60*3.5); freeEnter(); step(10); const { nodes, adj } = roadGraph(), J = [];
for (let i = 0; i < nodes.length; i++) { if (adj[i].length < 3) continue; const n = nodes[i]; if (J.some(q => Math.hypot(q.x - n.x, q.z - n.z) < 25)) continue; const r = roadInfo(n.x, n.z); J.push({ x: n.x, z: n.z, route: Math.sqrt(r.d2) < wAt(r.idx)*0.5 + 2, sf: surfaceAt(n.x, n.z) }); }
const pick = (typeof JSET === 'undefined' ? 'route' : JSET) === 'route' ? J.filter(q => q.route) : J.filter(q => !q.route); const out = { all: J.length, route: J.filter(q => q.route).length, shots: [] };
const from = typeof JFROM === 'undefined' ? 0 : JFROM, cnt = typeof JCNT === 'undefined' ? 12 : JCNT;
for (const [k, q] of pick.slice(from, from + cnt).entries()) { car.x = q.x + 60; car.z = q.z; step(1); await shot('jn' + (from + k), q.x, q.z, 9, 14, 20, 0); out.shots.push([from + k, Math.round(q.x), Math.round(q.z), q.sf]); }
return out;
