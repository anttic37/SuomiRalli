startRace(false); step(60*2); const Hh = X3.heli; car.x = Hh.x + 40; car.z = Hh.z; step(60*2);
const P = HUMANS.find(h => h.task && h.task.kind === 'patient'), M = HUMANS.filter(h => h.task && h.task.kind === 'cpr');
const bb = new THREE.Box3().setFromObject(P.view.g), c = bb.getCenter(new THREE.Vector3()); const fx = Math.sin(P.yaw), fz = Math.cos(P.yaw);
const rel = (x, z) => [+((x - P.x)*fx + (z - P.z)*fz).toFixed(2), +((x - P.x)*fz - (z - P.z)*fx).toFixed(2)];
return { bodyCentre: rel(c.x, c.z), size: bb.getSize(new THREE.Vector3()).toArray().map(v => +v.toFixed(2)), medics: M.map(h => rel(h.x, h.z)), medicBoxes: M.map(h => { const b = new THREE.Box3().setFromObject(h.view.g).getCenter(new THREE.Vector3()); return rel(b.x, b.z); }) };
