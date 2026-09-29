// lehti photo retakes (far view): the bear, the bonfire, the post van from a spot with nothing in front; the captured UFO over the car
startRace(false); setTimeOfDay('paiva'); step(60*1.2);
const freeCam = (x, z, D, pref) => { for (let k = 0; k < 36; k++) { const a = pref + k*0.1745*(k % 2 ? 1 : -1)*Math.ceil(k/2)/Math.max(1, k), cx = x + Math.sin(a)*D, cz = z + Math.cos(a)*D; let hit = false;
    staticNear(cx, cz, 9, B => { if (!hit && B.kind === 'house' && boxPush(B, cx, cz, 7)) hit = true; }); if (!hit && clearLine(x, z, cx, cz) && !treeNear(cx, cz, 4)) return a; } return pref; };
const shotFar = async (name, x, z, D, el, ly, pref) => { LH_FAR.k = 1; const a = freeCam(x, z, D, pref), gy = Y(x, z); await view(name, x, gy + ly, z, x + Math.sin(a)*D, gy + ly + D*Math.tan(el), z + Math.cos(a)*D); LH_FAR.k = 1.9; };
await TRY('karhu', async () => { const h = X3.bear; let spot = null;   // (for the photo: out of the forest onto open grass by the road)
  for (let i = 0; i < n && !spot; i += 7) { const p = route(i), a = angAt(i) + Math.PI/2; for (const s of [1, -1]) { const x = p.x + Math.sin(a)*s*16, z = p.y + Math.cos(a)*s*16; if (!onRoad(x, z, 3) && treeCount(x, z, 14) === 0) { let hit = false; staticNear(x, z, 14, () => { hit = true; }); if (!hit) { spot = [x, z, i]; break; } } } }
  h.x = h.home.x = spot[0]; h.z = h.home.z = spot[1]; put(spot[2], 0); hold(40); await shotFar('karhu', h.x, h.z, 16, 0.6, 1, h.yaw + 0.8); });
await TRY('posti', async () => { const V = VEHICLES.find(v => v.kind === 'postvan'); car.x = V.x + 30; car.z = V.z; hold(60*2); await shotFar('posti', V.x, V.z, 20, 0.62, 1, V.yaw + 1.1); });
await TRY('kokko', async () => { setTimeOfDay('ilta'); const E = EMITTERS.find(e => e.kind === 'kokko'); car.x = E.x + 30; car.z = E.z; hold(60*3); await shotFar('kokko', E.x, E.z, 22, 0.95, 1.2, 0.7); setTimeOfDay('paiva'); });
await TRY('ufo_a', async () => { const U = UFOS[0]; car.x = U.x + 30; car.z = U.z + 5; car.vx = car.vz = 0; step(60*6);
  const gun = HUMANS.find(q => q.task && q.task.kind === 'alien' && q.propR && Math.hypot(q.x - U.x, q.z - U.z) < 15) || HUMANS.find(q => q.task && q.task.kind === 'alien' && Math.hypot(q.x - U.x, q.z - U.z) < 15);
  if (WRECK.on) wreckReset(); car.x = gun.x - 8*Math.sin(0.3); car.z = gun.z - 8*Math.cos(0.3); car.angle = 0.3;
  for (let i = 0; i < 60 && !U.captured; i++) { car.vx = Math.sin(car.angle)*12; car.vz = Math.cos(car.angle)*12; car.speed = 12; step(1); } if (!U.captured) knock(gun, 5, 0, 8);
  step(60*5); for (let i = 0; i < 60*3; i++) { car.vx = Math.sin(car.angle)*15; car.vz = Math.cos(car.angle)*15; car.speed = 15; step(1); } out.captured = U.captured;
  const gy = Y(car.x, car.z), a = car.angle + 2.3; LH_FAR.k = 1; await view('ufo_a', car.x, gy + 8, car.z, car.x + Math.sin(a)*26, gy + 15, car.z + Math.cos(a)*26); LH_FAR.k = 1.9; });
return out;
