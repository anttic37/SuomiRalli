// concrete pigs: the anti-cut walls and the side-street mouths are pigs now (far fewer tyres); the car bounces off, dented; a pig hardly moves
startRace(false); step(60*2); const stacks = tires.filter(t => t.kind === 'tire'), pigs = tires.filter(t => t.kind === 'pig');
const out = { stacks: stacks.length, tyres: stacks.reduce((a, t) => a + t.cols.length, 0), pigs: pigs.length, inst: propInst.length };
const P = pigs[Math.floor(pigs.length/2)]; if (P) { const ax = Math.sin(P.yaw), az = Math.cos(P.yaw), nx = az, nz = -ax;   // square into its side at 12 m/s
  car.x = P.x - nx*10; car.z = P.z - nz*10; car.angle = Math.atan2(nx, nz); car.vx = nx*12; car.vz = nz*12; const d0 = carParts.filter(p => p.state !== 'ok').length; let minV = 99, after = null;
  step(90, (i) => { keys.ArrowUp = false; const vf = car.vx*nx + car.vz*nz; minV = Math.min(minV, vf); if (i === 60) after = +vf.toFixed(1); });
  out.hit = { bounceTo: +minV.toFixed(1), pigMoved: +Math.hypot(P.x - P.ox, P.z - P.oz).toFixed(2), carThrough: ((car.x - P.x)*nx + (car.z - P.z)*nz) > 0, dentsNew: carParts.filter(p => p.state !== 'ok').length - d0 };
  car.x = P.x - nx*14; car.z = P.z - nz*14; step(5); await shot('pigs', P.x, P.z, -nx*9 + ax*5, -nz*9 + az*5, 3.5, 0.3); await shot('pigs_hi', P.x, P.z, -nx*16, -nz*16, 14, 0); }
startRace(false); step(10); out.afterR = { pigMovedBack: P ? +Math.hypot(P.x - P.ox, P.z - P.oz).toFixed(2) : null };
freeEnter(); step(5); out.gtaPigsOff = tires.filter(t => t.kind === 'pig' && !t.off).length;
return out;
