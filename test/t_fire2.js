// close-ups of a burning house (day + evening) and a burning car
const B = STATIC_LIST.filter(b => b.kind === 'house' && Math.min(b.hw, b.hl) > 3 && Math.abs(b.x) < 250 && Math.abs(b.z) < 250)[5];
car.x = B.x + 40; car.z = B.z; startFire({ house: B }); const f = B.fire; step(3);
await shot('fire_ign', B.x, B.z, 20, 14, 7, 4);
f.level = 1; DISPATCH.queue.length = 0; step(60*4);
await shot('fire_day', B.x, B.z, 20, 14, 7, 4);
setTimeOfDay('ilta'); step(30); await shot('fire_eve', B.x, B.z, 16, -18, 5, 4);
const v = VEHICLES.find(o => !o.ai && Math.hypot(o.x - B.x, o.z - B.z) < 200) || VEHICLES.find(o => !o.ai);
setTimeOfDay('paiva'); car.x = v.x + 30; car.z = v.z; startFire({ vehicle: v }); v.fire.level = 1; step(60*3); await shot('fire_car', v.x, v.z, 8, 6, 3, 1);
return { house: [B.x, B.z], fires: FIRES.length };
