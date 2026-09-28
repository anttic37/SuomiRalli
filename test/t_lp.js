// Havuhelvetti's record stall by the big pine: built by the road; stop by it → the seller brings the LP → LP.got (the radio part: t_lp_radio);
// the band drinking in the woods under the banner; a restart keeps the record
startRace(false); step(60*4); const S = LP.stall, out = { stall: !!S, drinkers: LP.drinkers.length, seller: !!LP.seller }; if (!S) return out;
out.at = [Math.round(S.x), Math.round(S.z)]; out.zoneOnRoad = onRoad(S.zx, S.zz, 0); out.drinkersOffRoad = LP.drinkers.every(h => !onRoad(h.x, h.z, 1));
const M = LANDMARKS.find(L => L[0] === 'manty'); out.stallToPine = +Math.hypot(S.x - M[1], S.z - M[2]).toFixed(1);
car.x = S.zx + 30; car.z = S.zz; step(2); { const [cx, cz] = lloc(S.x, S.z, S.yaw, 5, 13); await shot('lp_stall', S.x, S.z, cx - S.x, cz - S.z, 3.4, 1.6); const [dx2, dz2] = lloc(S.x, S.z, S.yaw, -2, 8); await shot('lp_stall2', S.x, S.z, dx2 - S.x, dz2 - S.z, 1.8, 1.6); }
{ const d = LP.drinkers[0]; if (d) { const [cx, cz] = lloc(d.x, d.z, S.yaw, 5, 8); await shot('lp_band', d.x, d.z, cx - d.x, cz - d.z, 3, 1.2); } }
const h0 = [LP.seller.x, LP.seller.z]; const park = () => { car.x = S.zx; car.z = S.zz; car.angle = S.yaw + Math.PI/2; car.vx = car.vz = 0; }; park(); let tGot = null, maxWalk = 0;
step(60*15, (i) => { park(); maxWalk = Math.max(maxWalk, Math.hypot(LP.seller.x - h0[0], LP.seller.z - h0[1])); if (LP.got && tGot === null) { tGot = +(i/60).toFixed(1); return false; } });
out.buy = { got: LP.got, afterS: tGot, sellerWalkedM: +maxWalk.toFixed(1), radioLp: RADIO.lp };
{ const s = LP.seller; await shot('lp_deliver', s.x, s.z, 4, 3, 2.2, 1.0); }
const trail = []; step(60*25, (i) => { if (i % 150 === 0) trail.push(+Math.hypot(LP.seller.x - LP.seller.home.x, LP.seller.z - LP.seller.home.z).toFixed(1)); }); out.trail = trail; out.sellerBack = +Math.hypot(LP.seller.x - LP.seller.home.x, LP.seller.z - LP.seller.home.z).toFixed(1);
startRace(false); step(30); out.afterRestart = { got: LP.got, lp: RADIO.lp };
return out;
