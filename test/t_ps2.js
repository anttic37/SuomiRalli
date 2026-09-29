startRace(false); step(60*3); const St = X3.station; car.x = St.x + 40; car.z = St.z; const out = { station: !!St };
if (!St) return out; const modes = []; for (let k = 0; k < 6; k++) { step(60*3); modes.push(HUMANS.filter(h => h.task && h.task.kind === 'scuffle').length); }
const [fx, fz] = lloc(0, 0, St.yaw, 12, 26); await shot('st_yard', St.x, St.z, fx, fz, 9, 2);
const D = HUMANS.find(h => h.task && h.task.kind === 'scuffle'); const [gx, gz] = lloc(0, 0, St.yaw, 4, 5); await shot('st_fight', D.x, D.z, gx, gz, 2.2, 0.9);
step(60*4); await shot('st_fight2', D.x, D.z, gx, gz, 2.2, 0.9);
out.n = modes; return out;
