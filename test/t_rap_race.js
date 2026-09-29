// the rap sheet counts in the timed race too: start a race, run into a person standing on the course
initAudio = () => {}; renderer.render = () => {};
const step = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); };
startRace(false); step(200); const st0 = gameState;
const H = HUMANS.filter(h => !h.gone && !h.down && !h.inside && !h.seat && !h.animal && !h.big && !h.player);
let hits = 0, tried = 0; const p0 = RAP.p;
for (const h of H.slice(0, 40)) { if (RAP.p > p0) break; tried++; const a = Math.random()*6.28; car.angle = a; car.x = h.x - Math.sin(a)*9; car.z = h.z - Math.cos(a)*9; car.vx = Math.sin(a)*20; car.vz = Math.cos(a)*20; step(40); }
const out = { state0: st0, racing: State.RACING, lapStarted, tried, rapP: RAP.p - p0, rapF: RAP.f, life: { ...RAP.life } };

// after the finish line it still counts; Esc sends at once; the paper shows what was just done; a name given later reaches the old row
gameState = State.FINISHED; const pf = RAP.p; rapCount('p'); out.countsFinished = RAP.p - pf; gameState = State.RACING;
if (ONLINE.api) { ONLINE.name = ''; toMenu(); await new Promise(r => setTimeout(r, 600));
  lehtiBuild(); paperOpen(PAPER.pages.findIndex(h => h.includes('POLIISI TIEDOTTAA</span>'))); for (let i = 0; i < 60 && !RAP.list; i++) await new Promise(r => setTimeout(r, 100));
  out.listAfterOpen = RAP.list && RAP.list.people; paperClose();
  ONLINE.name = 'Myöhä-Matti'; await rapSend(false); RAP.at = -1e9; rapFetch(); await new Promise(r => setTimeout(r, 600)); out.renamed = RAP.list && RAP.list.people; }
return out;