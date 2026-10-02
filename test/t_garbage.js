// the bin lorry and the bins: bins in front of the houses (none on the road, in a wall or another prop), the lorry goes round emptying
// them (the binman off the back step, the bin to the back, up and back), keeps off the rally route; the rally car sends a bin flying; R puts them back
initAudio = () => {}; renderer.render = () => {}; startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3); const out = { bins: BINS.list.length, lorry: !!BINS.lorry };
out.binsOnRoad = BINS.list.filter(B => onRoad(B.x, B.z, 0.3)).length; out.binsInWall = BINS.list.filter(B => staticHit(B.x, B.z, 3, 0.3)).length;
out.binsFromHouse = (() => { const d = BINS.list.map(B => { let m = 99; staticNear(B.x, B.z, 30, H => { if (H.kind === 'house') m = Math.min(m, Math.hypot(H.x - B.x, H.z - B.z)); }); return m; }).sort((a, b) => a - b); return [d[0], d[d.length >> 1], d[d.length - 1]].map(x => +x.toFixed(1)); })();
if (!BINS.lorry) return out; const V = BINS.lorry, v = V.v; const p0 = [v.x, v.z];
let minRoute = 1e9, onRouteT = 0, modes = {}, wm = {}, maxOut = 0;
for (let i = 0; i < 60*240; i++) { car.x = v.x + 400; car.z = v.z; car.vx = car.vz = 0; worldUpdate(1/60); vehiclesPhysics(1/60);
  const d = distRoute(v.x, v.z); minRoute = Math.min(minRoute, d); if (d < 8) onRouteT += 1/60; modes[V.mode] = (modes[V.mode] || 0) + 1; wm[V.w.m] = (wm[V.w.m] || 0) + 1;
  if (!V.man.seat) maxOut = Math.max(maxOut, Math.hypot(V.man.x - v.x, V.man.z - v.z)); }
out.run = { emptied: V.emptied, drove: Math.round(Math.hypot(v.x - p0[0], v.z - p0[1])), minFromRoute: Math.round(minRoute), onRouteSecs: +onRouteT.toFixed(1), modes, worker: wm, manWalkedMax: Math.round(maxOut), damage: Math.round(v.damage), fire: !!v.fire, empty: BINS.list.filter(B => !B.full).length };
// the rally car into a bin at 15 m/s
// (along the street with the near side clipping it, as it happens in a race)
const B = BINS.list.find(b => !b.down && b.full && Math.hypot(b.x - v.x, b.z - v.z) > 40 && distRoute(b.x, b.z) > 10); if (B) { const a = B.yaw, fx = Math.sin(a), fz = Math.cos(a), dx = Math.cos(a), dz = -Math.sin(a), ang = Math.atan2(dx, dz);
  car.angle = ang; car.x = B.x + fx*1.1 - dx*20; car.z = B.z + fz*1.1 - dz*20; car.vx = dx*15; car.vz = dz*15; let flew = 0;
  step(60*2.5, (i) => { if (i < 90) { car.vx = dx*15; car.vz = dz*15; car.angle = ang; } if (B.rb) flew = Math.max(flew, B.rb.p.y - 0.46 - Y(B.rb.p.x, B.rb.p.z)); });
  const up = B.rb ? new THREE.Vector3(0, 1, 0).applyQuaternion(B.rb.q).y : 1; out.hit = { down: B.down, rb: !!B.rb, maxHeight: +flew.toFixed(2), moved: B.rb ? +Math.hypot(B.rb.p.x - B.hx, B.rb.p.z - B.hz).toFixed(1) : 0, tiltDeg: Math.round(Math.acos(Math.max(-1, Math.min(1, up)))*57.3), asleep: B.rb ? B.rb.sleep : null };
  // drive into it again where it lies
  if (B.rb) { const p0 = B.rb.p.clone(); car.x = p0.x - dx*12; car.z = p0.z - dz*12; car.angle = ang; step(60*2, (i) => { if (i < 60) { car.vx = dx*12; car.vz = dz*12; car.angle = ang; } }); out.hit.again = +Math.hypot(B.rb.p.x - p0.x, B.rb.p.z - p0.z).toFixed(1); } }
startRace(false); step(10); out.afterR = { down: BINS.list.filter(b => b.down).length, empty: BINS.list.filter(b => !b.full).length, worker: V.w.m, home: Math.round(Math.hypot(v.x - v.home.x, v.z - v.home.z)) };
return out;
