// the paper boy: on his street, stops at the letterboxes (a paper each), U-turns at the ends, stays on the street; knocked: papers fly; R puts him back
initAudio = () => {}; renderer.render = () => {}; startRace(false); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f) f(i); loop(lastTime + 1000/60); } };
step(60*3); const Pb = X2.paperBoy; if (!Pb) return { none: true }; const h = HUMANS.find(o => o.mPb === Pb), out = { stops: Pb.stops.length, len: Math.round(Pb.L.total) };
let offRoad = 0, drops = 0, turns = 0, prev = 'ride', phi = -1; car.x = 900; car.z = 900;
for (let i = 0; i < 60*150; i++) { car.x = 900; car.z = 900; car.vx = car.vz = 0; worldUpdate(1/60); const S = Pb.s; if (S.mode === 'drop' && prev !== 'drop') drops++; prev = S.mode; if (S.phi >= 0 && phi < 0) turns++; phi = S.phi; if (!onRoad(S.bx, S.bz, 0.5)) offRoad++; }
out.run = { delivered: Pb.n, drops, turns, offRoadSecs: +(offRoad/60).toFixed(1), fromRoute: Math.round(distRoute(Pb.s.bx, Pb.s.bz)) };
knock(h, 4, 0, 5); step(30); out.knocked = { down: h.down, papers: X2.flying.length, bikeOver: Math.abs(Pb.bike.rotation.z) > 1 };
startRace(false); step(20); out.afterR = { mode: Pb.s.mode, s: Math.round(Pb.s.s), down: h.down };
return out;
