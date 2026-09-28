// the pizzeria's rooftop sign (and its pizza turning); the ES STOP pad solid black
startRace(false); step(60*2); const S = PIZZA.shops[0], out = { shops: PIZZA.shops.length, signs: PIZZA_SIGNS.length };
if (S) { const fx = Math.sin(S.th), fz = Math.cos(S.th); car.x = S.x + fx*40; car.z = S.z + fz*40; step(5); const r0 = PIZZA_SIGNS[0].userData.spin.rotation.y; step(60); out.spin = +(PIZZA_SIGNS[0].userData.spin.rotation.y - r0).toFixed(2);
  await shot('pizza_front', S.x, S.z, fx*24 + fz*8, fz*24 - fx*8, 9, 4); await shot('pizza_high', S.x, S.z, fx*30, fz*30, 30, 2); }
const P = ES.promo; car.x = P.x + 25; car.z = P.z + 25; step(10); await shot('es_pad', P.x, P.z, 8, 6, 7, 0);
return out;
