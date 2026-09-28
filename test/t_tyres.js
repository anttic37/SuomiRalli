// tyres: the rally car's and a parked car's wheels, a tractor's lugs, a white tractor-tyre flower bed, a tyre pile, the barrier stacks
startRace(false); step(60*2); const out = {};
const fx = Math.sin(car.angle), fz = Math.cos(car.angle); await shot('ty_car', car.x + fz*1.2, car.z - fx*1.2, fz*4.5 + fx*1.5, -fx*4.5 + fz*1.5, 0.9, 0.3);
const TR = VEHICLES.find(v => v.kind === "tractor"); out.tractor = !!TR; if (TR) { car.x = TR.x + 30; car.z = TR.z + 30; step(5); const tx = Math.sin(TR.yaw), tz = Math.cos(TR.yaw); await shot("ty_tractor", TR.x, TR.z, tz*6 - tx*2, -tx*6 - tz*2, 1.6, 0.8); }
const bed = lifeGroup.children.find(g => g.children && g.children.length > 10 && g.children[0].geometry === lgeo('ttyre0.75,0.42', () => null) && g.children[0].material.color.getHex() === 0xf0f0ea);
out.bed = !!bed; if (bed) { car.x = bed.position.x + 30; car.z = bed.position.z + 30; step(5); await shot('ty_bed', bed.position.x, bed.position.z, 3.2, 2.4, 2.2, 0.2); }
const pile = lifeGroup.children.find(g => g.children && g.children.length >= 3 && g.children.length <= 4 && g.children.every(m => m.geometry === lgeo('ttyre0.75,0.42', () => null)));
out.pile = !!pile; if (pile) { car.x = pile.position.x + 30; car.z = pile.position.z + 30; step(5); await shot('ty_pile', pile.position.x, pile.position.z, 4, 3.4, 2.4, 0.6); }
const st = tires.find(t => t.kind === 'tire' && !t.off); if (st) { car.x = st.x + 20; car.z = st.z + 20; step(5); await shot('ty_stack', st.x, st.z, 3, 2.2, 1.4, 1.0); }
const pc = VEHICLES.find(v => v.kind === 'car' && !v.ai); if (pc) { car.x = pc.x + 30; car.z = pc.z + 30; step(5); const px = Math.sin(pc.yaw), pz = Math.cos(pc.yaw); await shot('ty_parked', pc.x, pc.z, pz*4.5 + px*1.6, -px*4.5 + pz*1.6, 0.8, 0.3); }
return out;
