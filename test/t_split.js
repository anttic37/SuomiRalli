// split reference: leading → own best; behind → the nearest faster rival
renderer.render = () => {}; const mk = (name, t) => ({ name, t, splits: [t*0.1], s: [] });
ghost = { time: 90, splits: [9], s: [] }; ONLINE.name = 'Ande';
ONLINE.list = [{ k: 'ande', name: 'Ande', t: 86 }, { k: 'mane', name: 'Mane', t: 87 }, { k: 'aki', name: 'aki', t: 95 }]; ONLINE.opp = [mk('Mane', 87), mk('aki', 95)];
const lead = splitRef(); ONLINE.list = [{ k: 'x', name: 'X', t: 80 }, { k: 'y', name: 'Y', t: 84 }, { k: 'ande', name: 'Ande', t: 86 }]; ONLINE.opp = [mk('Y', 84), mk('X', 80)];
const behind = splitRef(); ghost = null; ONLINE.list = [{ k: 'ande', name: 'Ande', t: 86 }, { k: 'mane', name: 'Mane', t: 87 }]; ONLINE.opp = [mk('Mane', 87)];
return { leadRef: lead === ghost || (lead && lead.time === 90) ? 'own best' : lead && lead.name, behindRef: behind && behind.name, leadNoLocal: splitRef() };
