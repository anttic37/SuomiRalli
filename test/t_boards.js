// 30.9.: three scoreboards round the lap, the PAULIN KAALI board at the cabbage field, the HONK-OLYMPIALAISET banner; moped boys
// give chase at the looser pace (FLOW off, FLOW.mopo on)
startRace(false); step(60); out.boards = ( SCOREBOARDS.map(B => [Math.round(B.x), Math.round(B.z), Math.round(Math.sqrt(roadInfo(B.x, B.z).d2))]));
LH_FAR.k = 1; for (let i = 0; i < SCOREBOARDS.length; i++) { const B = SCOREBOARDS[i], fx = Math.sin(B.yaw), fz = Math.cos(B.yaw); await view('board' + i, B.x, Y(B.x, B.z) + 5, B.z, B.x + fx*16 + fz*6, Y(B.x, B.z) + 7, B.z + fz*16 - fx*6); }
out.cabbage = CABBAGE.length; out.signs = CABBAGE.filter(C => C.P.sign).length; const C = CABBAGE.find(C => C.P.sign); if (C) { const S = C.P.sign; car.x = S.x + S.nx*12; car.z = S.z + S.nz*12; LH_FAR.k = 1; await view('pauli', S.x - S.nx*6, Y(S.x, S.z) + 1.5, S.z - S.nz*6, S.x + S.nx*10 + S.nz*5, Y(S.x, S.z) + 6, S.z + S.nz*10 - S.nx*5); }
const O = X3.oly; if (O && O.banner) { const [bx, bz, by] = O.banner, fx = Math.sin(by), fz = Math.cos(by); car.x = bx + fx*14; car.z = bz + fz*14; LH_FAR.k = 1; await view('honk', bx + fx*3, Y(bx, bz) + 1.5, bz + fz*3, bx + fx*13 + fz*3, Y(bx, bz) + 9, bz + fz*13 - fx*3); }
return out;
