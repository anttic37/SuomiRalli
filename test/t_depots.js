// GTA mode: the concrete pigs in the council's street depots (real props); gone again in the race; the same depots the next time
startRace(false); step(60*3.5); freeEnter(); step(10);
const dp = tires.filter(t => t.kind === 'pig' && t.yard && !t.off), out = { depots: DEPOTS.list.length, pigs: dp.length, raceWallsHidden: tires.filter(t => t.kind === 'pig' && !t.yard && !t.off).length === 0 };
const D = DEPOTS.list[0]; if (D) { car.x = D.x + 25; car.z = D.z + 25; step(10); await shot('depot', D.x, D.z, Math.sin(D.yaw + 0.7)*16, Math.cos(D.yaw + 0.7)*16, 7, 0.5); await shot('depot2', D.x, D.z, -Math.sin(D.yaw)*12 + 4, -Math.cos(D.yaw)*12, 3, 0.6); }
const first = DEPOTS.list.map(D => [Math.round(D.x), Math.round(D.z)]).join(' ');
startRace(false); step(10); out.afterR = { yardPigs: tires.filter(t => t.kind === 'pig' && t.yard).length, depotsVisible: DEPOTS.list.filter(D => D.g.visible).length, racePigs: tires.filter(t => t.kind === 'pig' && !t.off).length };
step(60*3.5); freeEnter(); step(5); out.sameDepots = DEPOTS.list.map(D => [Math.round(D.x), Math.round(D.z)]).join(' ') === first;
return out;
