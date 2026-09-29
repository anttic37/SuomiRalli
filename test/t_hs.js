step(30);
const pick = [];
const eraOf = (B, bi) => { const [x,z,w,d] = B, L = Math.max(w,d), S = Math.min(w,d), a = L/S; if (L < 4.5 || S < 3) return 'shed';
  return (L <= 7.2 && a <= 1.5) || (L <= 8.5 && a <= 1.7 && bi % 5 < 2) ? 'rinta' : (a >= 1.55 && L >= 6.5 && (bi % 3 !== 0)) ? (bi % 4 === 0 ? 'flat' : 'matala') : 'kasari'; };
const cnt = {}; const want = { rinta: 3, matala: 3, flat: 2, kasari: 3, shed: 1 };
BUILDINGS.forEach((B, bi) => { if (B.length > 5 || Math.min(B[2], B[3]) < 2) return; const e = eraOf(B, bi); cnt[e] = (cnt[e] || 0) + 1; if (Math.abs(B[0]) > 300 || Math.abs(B[1]) > 300) return;
  if ((pick.filter(p => p.e === e).length) < want[e] && bi % 7 === 3) pick.push({ e, bi, B }); });
for (const p of pick) { const [x, z, w, d, th] = p.B; const r = Math.max(w, d) + 9;
  // look from the nearest street side
  let best = null; for (let a = 0; a < 16; a++) { const ang = a/16*Math.PI*2, cx = x + Math.cos(ang)*r, cz = z + Math.sin(ang)*r; if (onRoad(cx, cz, 0)) { best = ang; break; } }
  const ang = best ?? 0.7; car.x = x; car.z = z;
  await shot(p.e + p.bi, x, z, Math.cos(ang)*r, Math.sin(ang)*r, 3.2, 2.5); }
return { cnt, pick: pick.map(p => p.e + p.bi + ' ' + p.B.slice(2, 4).join('x')) };
