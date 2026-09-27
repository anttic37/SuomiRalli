// the post van: five minutes on its round with the car parked out of the way — stops, deliveries, never on the route, no fires
startRace(false); step(60*4); const out = {}, V = X3.postVan, v = V.v; car.x = v.x + 350; car.z = v.z;
let minRoute = 1e9, onRouteT = 0, maxOut = 0, stops = 0, last = V.mode; const p0 = [v.x, v.z]; let shotDone = false;
for (let i = 0; i < 60*300; i++) { car.x = v.x + 350; car.z = v.z; car.vx = car.vz = 0; worldUpdate(1/60); vehiclesPhysics(1/60);
  const d = distRoute(v.x, v.z); minRoute = Math.min(minRoute, d); if (d < 8) onRouteT += 1/60; if (V.mode !== last) { if (V.mode === 'stop') stops++; last = V.mode; }
  if (V.out) maxOut = Math.max(maxOut, Math.hypot(V.man.x - v.x, V.man.z - v.z));
  if (!shotDone && V.out && V.man.st && V.man.st.mode === 'go' && Math.hypot(V.man.x - v.x, V.man.z - v.z) > 3) { shotDone = true; car.x = v.x + 30; car.z = v.z + 30; const [cx, cz] = lloc(v.x, v.z, v.yaw, -8, 4); await shot('postvan', v.x, v.z, cx - v.x, cz - v.z, 3.2, 1.2); } }
out.run = { stops, deliveries: V.deliveries || 0, drove: Math.round(Math.hypot(v.x - p0[0], v.z - p0[1])), minFromRoute: Math.round(minRoute), onRouteSecs: +onRouteT.toFixed(1), manWalkedMax: Math.round(maxOut), damage: v.damage, fire: !!v.fire, mode: V.mode };
// knock the postman while he's out: letters fly, the ambulance comes, the van goes on without him
for (let i = 0; i < 60*120 && !V.out; i++) { car.x = v.x + 350; car.z = v.z; worldUpdate(1/60); vehiclesPhysics(1/60); }
if (V.out) { const m = V.man; car.x = m.x + 20; car.z = m.z; knock(m, 6, 1, 6); for (let i = 0; i < 60*40; i++) { car.x = v.x + 350; car.z = v.z; worldUpdate(1/60); vehiclesPhysics(1/60); }
  out.knocked = { letters: X2.flying.length, vanMode: V.mode, amb: VEHICLES.some(o => o.kind === 'ambulance') || DISPATCH.queue.length > 0 }; }
startRace(false); step(30); out.afterReset = { inside: V.man.inside, down: V.man.down, home: Math.round(Math.hypot(v.x - v.home.x, v.z - v.home.z)) };
return out;
