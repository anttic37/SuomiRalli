// GTA mode: tyre storage in the yards (knockable), the K-shop's grandstand and sausage cart gone, the big ES campaign up; back on exit
startRace(false); step(60*3.5); const tyres = () => tires.filter(t => t.kind === 'tire' && !t.off).length, K = STANDS.find(S => S.kshop), P = ES.promo;
const out = { race: { tyres: tyres(), yard: tires.filter(t => t.yard).length, stand: K && K.built.objs[0].visible, gta: P && P.gta.g.visible } };
car.x = P.x + 30; car.z = P.z + 30; step(20); await shot('es_race', P.x, P.z, 26, 18, 12, 1);
freeEnter(); step(10); const Y1 = tires.filter(t => t.yard);
out.free = { yardStacks: Y1.length, piles: new Set(Y1.map(t => Math.round(t.ox/6) + ',' + Math.round(t.oz/6))).size, standHidden: K && !K.built.objs[0].visible, standPeopleHidden: K && K.built.humans.every(h => h.inside || h.gone), boxesMoved: K && K.built.boxes.every(b => b.gone), gta: P.gta.g.visible, dancers: P.gta.people.filter(h => !h.inside).length, canScale: P.can.scale.x };
car.x = P.x + 30; car.z = P.z + 30; car.vx = car.vz = 0; step(60*2); await shot('es_gta', P.x, P.z, 26, 18, 12, 1); await shot('es_gta2', P.x, P.z, -24, 30, 11, 1.5); await shot('es_gta3', P.x, P.z, 34, -8, 7, 2);
const t0 = Y1[0]; await shot('yard_tyres', t0.x, t0.z, 9, 7, 5, 0.5);
// knock one
car.x = t0.x - 6; car.z = t0.z; car.angle = Math.PI/2; car.vx = 10; car.vz = 0; step(60); out.knocked = Y1.some(t => Math.hypot(t.x - t.ox, t.z - t.oz) > 0.5);
startRace(false); step(10); out.back = { free: FREE.on, yard: tires.filter(t => t.yard).length, tyres: tyres(), stand: K && K.built.objs[0].visible, standPeople: K && K.built.humans.filter(h => !h.inside && !h.gone).length, boxes: K && K.built.boxes.every(b => !b.gone), gta: P.gta.g.visible, canScale: P.can.scale.x };
return out;
