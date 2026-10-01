// paper photos: the tow truck winching a burnt-out car up behind it; and taking it away down the street
setTimeOfDay('paiva'); startRace(false); step(20); const res = {};
const w = VEHICLES.find(v => v.kind === 'car' && !v.ai && !v.temp && onRoad(v.x, v.z, 2) && distRoute(v.x, v.z) > 30 && distRoute(v.x, v.z) < 160 && Math.abs(v.x) < 450 && Math.abs(v.z) < 450);
charVehicle(w, true); w.damage = 99; let TT = null, shot1 = false, shot2 = false;
for (let i = 0; i < 60*200 && !shot2; i++) { car.x = 900; car.z = 900; car.vx = car.vz = 0; worldUpdate(1/60); vehiclesPhysics(1/60); if (!TT && TOW.v) TT = TOW.v; if (!TT) continue; const J = TT.job;
  if (!shot1 && J.phase === 'winch' && J.t > 3.2) { shot1 = true; const [cx, cz] = lloc(TT.x, TT.z, TT.yaw, -7, -(TT.hl + 4)), [tx, tz] = lloc(TT.x, TT.z, TT.yaw, 0, -(TT.hl + 1.5)); car.x = TT.x + 40; car.z = TT.z + 40; nearVisT = 0; nearVisUpdate(0.01); LH_FAR.k = 1.0; await view('hinaus', tx, Y(tx, tz) + 1.2, tz, cx, Y(cx, cz) + 2.6, cz); }
  if (shot1 && !shot2 && J.phase === 'leave' && J.t > 6 && Math.abs(TT.vF) > 4) { shot2 = true; const [cx, cz] = lloc(TT.x, TT.z, TT.yaw, -6, 9); car.x = TT.x + 40; car.z = TT.z + 40; nearVisT = 0; nearVisUpdate(0.01); LH_FAR.k = 1.0; await view('hinaus2', TT.x, Y(TT.x, TT.z) + 1.2, TT.z, cx, Y(cx, cz) + 3.0, cz); } }
res.shots = [shot1, shot2]; res.w = !!w; res.truck = !!TT; res.phase = TT && TT.job.phase; res.done = TOW.done; res.seen = [...TOW.seen.values()]; return res;
