// the finish area: the scoreboard (top five), the small grandstands, the service park
startRace(false); step(60*2); const out = { stands: STANDS.map(S => S.L), board: !!FINISH_AREA.ctx, pits: FINISH_AREA.pits && FINISH_AREA.pits.map(Math.round) };
ONLINE.list = [{ k: 'mane', name: 'Mane', t: 86.618 }, { k: 'anba', name: 'ANBA', t: 88.512 }, { k: 'hafe', name: 'häfe', t: 89.165 }, { k: 'wihka', name: 'Wihka', t: 89.9 }, { k: 'ari', name: 'Ari', t: 92.4 }]; renderTop10();
const f = finishLine.position; car.x = f.x + 20; car.z = f.y + 20; step(10);
const bd = lifeGroup.children.find(g => g.children && g.children.some(m => m.material && m.material.map === FINISH_AREA.tex));
if (bd) { const fx = Math.sin(bd.rotation.y), fz = Math.cos(bd.rotation.y); await shot('board', bd.position.x, bd.position.z, fx*16, fz*16, 4, 5); }
await shot('finish_wide', f.x, f.y, 40, 30, 30, 0);
if (FINISH_AREA.pits) { const [px, pz] = FINISH_AREA.pits; car.x = px + 25; car.z = pz + 25; step(30); await shot('pits', px, pz, 16, 14, 10, 0.5); await shot('pits2', px, pz, -14, 12, 5, 1); }
return out;
