startRace(false); step(40); lapStarted = true; let best = null; for (const B of STATIC_LIST) { if (B.kind !== 'house') continue; const d = Math.hypot(B.x - car.x, B.z - car.z); if (d > 40 && d < 200 && (!best || d < best.d)) best = { B, d }; }
const B = best.B; startFire({ house: B }); B.fire.level = 0.9; car.x = RI.x = B.x + 40; car.z = RI.z = B.z; step(60*6);
LH_FAR.k = 1; await view('tuli_uusi', B.x, Y(B.x, B.z) + 4, B.z, B.x + 16, Y(B.x, B.z) + 9, B.z + 12); return { fires: FIRES.length };
