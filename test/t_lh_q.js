// lehti photos: Radio Ylästö's four voices — together on the K-kauppa yard, Marjatta at a grill, Aki on Pauli's cabbage field
// ("kolhoosin henki"), Kari at the sports field, Seppo under a flag reading the wind
startRace(false); step(40); lapStarted = true; WALK.on = false;
const LOOK = { aki: [0x6b4a2a, 0x34343a, 0x3a2a1c, { hair: 2, top: 0, longSleeve: 1, longPants: 1, glasses: 1, tache: 1 }], kari: [0x2a52be, 0x2a2a30, 0x6a4a2a, { hair: 2, top: 0, longSleeve: 1, longPants: 1, hat: 1 }],
  seppo: [0x8a8a86, 0x40403c, 0xb8b8b0, { hair: 0, top: 0, longSleeve: 1, longPants: 1, glasses: 1 }], marjatta: [0xe86aa0, 0xe86aa0, 0xd8a040, { hair: 1, top: 6, longSleeve: 0, longPants: 0, bareLegs: 1, glasses: 1 }] };
const host = (k, x, z, yaw, arms) => { const [s, p, hr, sel] = LOOK[k], h = new Human({ x, z, yaw, rig: makeAdult(s, p, hr, { sel }), temp: true }); h.far = false; if (arms) { h.pose.armL = arms[0]; h.pose.armR = arms[1]; } humanSync(h); return h; };
const park = (x, z) => { car.x = RI.x = x; car.z = RI.z = z; car.vx = car.vz = 0; carGroup.position.set(car.x, Y(car.x, car.z), car.z); };
await TRY('radiot', async () => { const K = LANDMARKS.find(L => L[0] === 'kauppa'), [W, D] = lmSize(K), yaw = K[3], [cx, cz] = lloc(K[1], K[2], yaw, 0, D/2 + 6);
  park(cx + 40, cz + 40); ['aki', 'kari', 'seppo', 'marjatta'].forEach((k, i) => { const [x, z] = lloc(cx, cz, yaw, (i - 1.5)*1.2, 0); host(k, x, z, yaw, k === 'marjatta' ? [-0.3, -1.3] : k === 'aki' ? [0, -0.6] : null); }); hold(20);
  const fx = Math.sin(yaw), fz = Math.cos(yaw); LH_FAR.k = 1; await view('radiot', cx, Y(cx, cz) + 1.1, cz, cx + fx*6.5 + fz*1.2, Y(cx, cz) + 2.6, cz + fz*6.5 - fx*1.2); });
await TRY('keittio', async () => { const G = EMITTERS.find(e => e.kind === 'grill' && !inPaved(e.x, e.z) && Math.hypot(e.x - car.x, e.z - car.z) > 20); if (!G) throw new Error('no grill');
  park(G.x + 40, G.z + 40); for (let i = HUMANS.length - 1; i >= 0; i--) { const h = HUMANS[i]; if (!h.gone && Math.hypot(h.x - G.x, h.z - G.z) < 4) humanRemove(h); }   // (the guests step aside for the photo)
  const m = host('marjatta', G.x + 0.9, G.z + 0.2, Math.atan2(4.5, 1.5), [-1.1, -1.4]); hold(40); LH_FAR.k = 1; await view('keittio', G.x + 0.6, Y(G.x, G.z) + 1.0, G.z + 0.2, G.x + 5.2, Y(G.x, G.z) + 2.3, G.z + 1.9); });
await TRY('naapurivartti', async () => { const C = sceneryDebug.cabbage && sceneryDebug.cabbage[0]; if (!C) throw new Error('no field');
  const a = Math.atan2(C.ux, C.uz), x = C.x - C.uz*(C.W/2 + 2), z = C.z + C.ux*(C.W/2 + 2); park(x + 50, z + 50); const ccx = x - C.uz*3.5 + C.ux*3.5, ccz = z + C.ux*3.5 + C.uz*3.5; host('aki', x, z, Math.atan2(ccx - x, ccz - z) - 0.5, [0, -1.5]); hold(30);
  LH_FAR.k = 1; await view('naapurivartti', x + C.uz*3, Y(x, z) + 1.2, z - C.ux*3, x - C.uz*3.5 + C.ux*3.5, Y(x, z) + 2.8, z + C.ux*3.5 + C.uz*3.5); });
await TRY('urheilukierros', async () => { const fx0 = finishLine.position.x, fz0 = finishLine.position.y, i = nearIdx(fx0, fz0), p = route(i), q = route(i + 4), dl = Math.hypot(q.x - p.x, q.y - p.y), dx = (q.x - p.x)/dl, dz = (q.y - p.y)/dl, w2 = wAt(i)/2;
  const x = p.x + dz*(w2 - 0.8) + dx*4, z = p.y - dx*(w2 - 0.8) + dz*4, cx = p.x - dz*(w2 - 1) + dx*1, cz = p.y + dx*(w2 - 1) + dz*1; park(p.x + dx*60, p.y + dz*60);
  host('kari', x, z, Math.atan2(cx - x, cz - z), [-1.3, -0.2]); hold(60); LH_FAR.k = 1; await view('urheilukierros', x - dx*1.2, Y(x, z) + 1.2, z - dz*1.2, (x + cx)/2 - dx*2, Y(cx, cz) + 2.4, (z + cz)/2 - dz*2); });
await TRY('merisaa', async () => { const F = LIFE_PLAN.find(q => q.kind === 'flag' && q.hoist) || LIFE_PLAN.find(q => q.kind === 'flag'); if (!F) throw new Error('no flag'); park(F.x + 40, F.z + 40);
  host('seppo', F.x + 1.2, F.z + 0.6, Math.PI*0.9, [0, -1.5]); hold(60); LH_FAR.k = 1; await view('merisaa', F.x + 0.5, Y(F.x, F.z) + 2.6, F.z, F.x + 5.5, Y(F.x, F.z) + 2.2, F.z - 4.5); });
return out;
