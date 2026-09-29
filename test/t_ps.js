startRace(false); step(60*3); const out = {}; const St = X3.station, S = X3.sauna; out.station = St ? [St.x|0, St.z|0] : null; out.sauna = S ? [S.x|0, S.z|0] : null;
const K = LANDMARKS.find(L => L[0] === 'kauppa'); out.kDist = St ? +Math.hypot(St.x - K[1], St.z - K[2]).toFixed(1) : null;
out.patrol = VEHICLES.filter(v => v.kind === 'policeP').length;
if (St) { const [fx, fz] = lloc(0, 0, St.yaw, 9, 22); car.x = St.x + 40; car.z = St.z; step(20); await shot('station', St.x, St.z, fx, fz, 6, 3); const [gx, gz] = lloc(0, 0, St.yaw, -14, 12); await shot('station2', St.x, St.z, gx, gz, 3, 3); }
if (S) { car.x = S.x + 35; car.z = S.z; step(60*20); out.saunaIn = HUMANS.filter(h => h.task && h.task.kind === 'sauna' && h.inside).length; await shot('sauna', S.x, S.z, 12, 9, 4, 2); await shot('sauna_far', S.x, S.z, 45, 35, 18, 8); }
// ram a patrol car
const P = VEHICLES.find(v => v.kind === 'policeP'); const n0 = POLICE.n; car.x = P.x - Math.sin(P.yaw + 1.57)*9; car.z = P.z - Math.cos(P.yaw + 1.57)*9; car.angle = P.yaw + 1.57;
POLICE.lastT = -99; for (let i = 0; i < 60; i++) { if (i < 30) { car.vx = Math.sin(car.angle)*14; car.vz = Math.cos(car.angle)*14; } step(1); } out.policeN = [n0, POLICE.n]; out.patrolMoved = +Math.hypot(P.x - P.home.x, P.z - P.home.z).toFixed(2);
return out;
