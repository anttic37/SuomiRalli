// paper photo: the paper boy at a letterbox, pushing Ylästön Sanomat in
setTimeOfDay('paiva'); startRace(false); step(20); const Pb = X2.paperBoy, res = {}; let took = false;
for (let i = 0; i < 60*120 && !took; i++) { car.x = 900; car.z = 900; worldUpdate(1/60); const PS = Pb.s;
  if (PS.mode === 'drop' && PS.t > 0.95) { took = true; const stp = PS.last; car.x = PS.bx + 45; car.z = PS.bz + 45; nearVisT = 0; nearVisUpdate(0.01);
    for (let k = 0; k < 12; k++) worldUpdate(1/60); const [cx, cz] = lloc(PS.bx, PS.bz, PS.yaw, -PS.side*4, 3.5); LH_FAR.k = 1.0;
    await view('lehdenjakaja', (PS.bx + stp.mx)/2, Y(PS.bx, PS.bz) + 0.9, (PS.bz + stp.mz)/2, cx, Y(cx, cz) + 2.0, cz); } }
res.shot = took; return res;
