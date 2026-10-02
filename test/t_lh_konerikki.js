// paper photo: OH-YLÄ broken in a yard (PLANE_FLY off)
setTimeOfDay('paiva'); startRace(false); step(30); const res = {}; const W = PLANE.wreck; res.wreck = W ? [Math.round(W.x), Math.round(W.z)] : null; res.home = !!PLANE.home;
car.x = W.x + 60; car.z = W.z + 60; let best = null;
for (let k = 0; k < 16; k++) { const a = W.yaw + 0.7 + k*0.39, cx = W.x + Math.sin(a)*11, cz = W.z + Math.cos(a)*11; if (clearLine(W.x, W.z, cx, cz) && clearSpot(cx, cz, 1.5)) { best = a; break; } }
const a = best === null ? W.yaw + 0.8 : best; LH_FAR.k = 1; await view('konerikki', W.x, Y(W.x, W.z) + 1.0, W.z, W.x + Math.sin(a)*11, Y(W.x, W.z) + 4.5, W.z + Math.cos(a)*11);
res.near = planeNear({ x: W.x, z: W.z }); return res;
