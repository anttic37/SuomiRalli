// paper photo: a close-up of a villager — "Mantti Anttila", the camera man (the bearded mower at the tyre wall)
setTimeOfDay('paiva'); startRace(false); step(30); const res = { c: [] }; LH_FAR.k = 1.0;
const q = HUMANS.find(h => h.view.kind === 'rig' && !h.kid && h.task && h.task.kind === 'mow'); car.x = q.x + 60; car.z = q.z + 60;
let k = 0; step(1); for (const a of [-0.5]) { const ry = q.view.g.rotation.y + a, cx = q.x + Math.sin(ry)*1.9, cz = q.z + Math.cos(ry)*1.9, gy = Y(q.x, q.z);
  res.c.push([q.yaw, q.view.g.rotation.y]); await view('mantti', q.x, gy + 1.35, q.z, cx, gy + 1.6, cz); k++; }
return res;
