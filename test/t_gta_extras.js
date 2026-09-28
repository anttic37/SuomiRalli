// GTA (FREE) mode: the ice-cream van still drives and sells, the pizzerias still hand out pizza, the ES stand still gives the can
initAudio = () => {}; setTimeOfDay('paiva'); const RR = renderer.render.bind(renderer); renderer.render = () => {};
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { if (f && f(i) === false) return; T += 1000/60; loop(T); } };
startRace(false); step(60*3.5); freeEnter(); step(10);
const out = { free: FREE.on, state: gameState, racing: gameState === State.RACING };
// 1) the ice-cream van: over 3 minutes it drives, stops, the kids come
const V = VEHICLES.find(v => v.kind === 'icecream'); out.ice = !!V;
if (V) { const S = V.ai.V, modes = {}; let dist = 0, px = V.x, pz = V.z, kids = 0;
  { const b = BALES[0]; car.x = b.x + 4; car.z = b.z + 4; car.vx = car.vz = 0; }   // (the rally car out of the way)
  step(60*180, () => { dist += Math.hypot(V.x - px, V.z - pz); px = V.x; pz = V.z; modes[S.mode] = (modes[S.mode] || 0) + 1; kids = Math.max(kids, S.order.length); });
  out.iceVan = { drove: Math.round(dist), modes: Object.fromEntries(Object.entries(modes).map(([k, v]) => [k, Math.round(v/60)])), maxQueue: kids, fire: !!V.fire }; }
// 2) a pizzeria: stop in its yard → the guy brings the pizza → +10 %
const P = PIZZA.shops[0]; out.pizzaShops = PIZZA.shops.length;
if (P) { const [yx, yz] = lloc(P.x, P.z, P.th, 0, (P.P.yard0 + P.P.yard1)/2), park = () => { car.x = yx; car.z = yz; car.angle = P.th + Math.PI/2; car.vx = car.vz = 0; };
  park(); step(60*12, () => { park(); if (PIZZA.got) return false; }); out.pizza = { got: PIZZA.got, k: PIZZA.k, hud: document.getElementById('pizza-hud').textContent }; }
// 3) ES: stop in the ES STOP box → the can
if (ES.zone) { const [kx, kz, kth, W, D] = ES.zone, [zx, zz] = lloc(kx, kz, kth, 0, D/2 + 6), park = () => { car.x = zx; car.z = zz; car.angle = kth + Math.PI/2; car.vx = car.vz = 0; };
  park(); step(60*12, () => { park(); if (ES.on) return false; }); out.es = { on: ES.on, t: +ES.t.toFixed(1), hud: document.getElementById('es-hud').textContent, promo: !!ES.promo }; }
out.stillFree = FREE.on;
return out;
