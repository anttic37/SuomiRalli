// where the ES campaign stands at the K-shop (race and GTA), from above and from the street
startRace(false); step(30); const K = LANDMARKS.find(L => L[0] === 'kauppa'), [W, D] = lmSize(K), P = ES.promo, out = { shop: [Math.round(K[1]), Math.round(K[2]), +K[3].toFixed(2), W, D], pad: [+ES.padA, +ES.padB.toFixed(1)] };
const [fx, fz] = lloc(K[1], K[2], K[3], 0, D/2 + 5); car.x = fx + 40; car.z = fz; step(2);
const [sx, sz] = lloc(K[1], K[2], K[3], 0, D/2 + 22); await shot('esw_top', fx, fz, 0.1, 0.1, 34, 0); await shot('esw_front', fx, fz, sx - fx, sz - fz, 8, 1);
startRace(false); step(60*3.5); freeEnter(); step(10); car.x = fx + 40; car.z = fz; step(2); await shot('esw_gta_top', fx, fz, 0.1, 0.1, 34, 0);
return out;
