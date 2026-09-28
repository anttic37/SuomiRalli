// the ES STOP pad: centred in front of the shop door, its street side painted on the street surface (not under it); a look at it
startRace(false); step(30); const [kx, kz, kth, W, D] = ES.zone, P = ES.promo, out = { pad: [Math.round(P.x), Math.round(P.z)] };
out.padAB = [ES.padA, +ES.padB.toFixed(1), +(D/2).toFixed(1)]; const hw = Math.min(7, W*0.55)/2, corners = []; for (const a of [-hw, 0, hw]) for (const b of [-2.8, 0, 2.8]) { const [x, z] = lloc(P.x, P.z, kth, a, b), r = roadInfo(x, z); corners.push([a, b, onRoad(x, z, 0) ? 'ROAD' : onRoad(x, z, 1.5) ? 'near' : 'ok', +(Math.sqrt(r.d2) - wAt(r.idx)/2).toFixed(1)]); }
out.corners = corners.map(c => c.join(' ')); car.x = kx + 40; car.z = kz; step(2);
const [cx, cz] = lloc(P.x, P.z, kth, 0, 12); await shot('es_pad', P.x, P.z, cx - P.x, cz - P.z, 9, 0); await shot('es_pad_top', P.x, P.z, 0.1, 0.1, 22, 0);
return out;
