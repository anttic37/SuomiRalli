// apple thieving: picking, the owner running out, caught on foot (apples lost), away by car 200 m+ (apples banked → RAP.o)
initAudio = () => {}; renderer.render = () => {}; startRace(false); const st = (n) => { for (let i = 0; i < n; i++) loop(lastTime + 1000/60); }; st(60);
const res = { trees: APPLES.list.length, apples: APPLES.pos.length };
const A = APPLES.list.find(a => Math.hypot(a.x, a.z) < 300 && clearSpot(a.x + 1.2, a.z, 0.4)); res.tree = [Math.round(A.x), Math.round(A.z)];
const goWalk = () => { car.x = A.x + 6; car.z = A.z + 6; car.vx = car.vz = car.speed = 0; st(2); walkOut(); const h = WALK.h; h.x = A.x + 1.2; h.z = A.z; h.vx = h.vz = 0; return h; };
let h = goWalk(); st(60*1.2); res.bag2s = APPLES.bag; res.owner = APPLES.chase.length; res.ownerMode = APPLES.chase[0] && APPLES.chase[0].m;
// stand there: they catch you
let t = 0; while (APPLES.bag > 0 && t < 60*20) { st(1); t++; h.x = A.x + 4; h.z = A.z + 4; }   // (step aside so no more picking)
res.caughtAfter = +(t/60).toFixed(1); res.bagAfterCatch = APPLES.bag; res.oBefore = RAP.o;
st(60*4); walkIn(true); st(60*3);
// grabbed: a punch gets you loose and the apples stay in your pocket
lifeExtras2Reset(); for (const f of X3.reset) f(); st(5); h = goWalk(); st(60*1.2); const bagG = APPLES.bag; let g = 0; while (!WALK.grab && g < 60*15) { st(1); g++; }
res.grabbed = !!WALK.grab; res.grabAfter = +(g/60).toFixed(1); const bagAtGrab = APPLES.bag; if (WALK.grab) { const O = WALK.grab.h; h.yaw = Math.atan2(O.x - h.x, O.z - h.z); walkPunch(h); res.punchFree = !WALK.grab; res.ownerDown = O.down; res.bagKept = APPLES.bag === bagAtGrab && bagAtGrab > 0; }
st(60*2); res.stillChasing = APPLES.chase.some(C => C.m === 'run'); const oBank = RAP.o; walkIn(true); st(30); res.notBankedNearby = RAP.o === oBank;
st(60*2); walkIn(true); st(10);
// again: pick, then into the car and away
lifeExtras2Reset(); for (const f of X3.reset) f(); st(5); res.leftAfterReset2 = true; res.leftAfterReset = APPLES.list.reduce((s, a) => s + a.left, 0) === APPLES.pos.length;
h = goWalk(); st(60*1.5); const got = APPLES.bag; res.bag2 = got; walkIn(true); const C = APPLES.chase[0];
for (let i = 0; i < 60*8 && APPLES.bag > 0; i++) { car.x += 0.7; car.vx = 42; car.vz = 0; st(1); }
res.banked = RAP.o - res.oBefore; res.gotBack = got; res.ownerDist = C ? Math.round(Math.hypot(car.x - C.h.x, car.z - C.h.z)) : null; res.life = RAP.life.o;
st(60*30); res.ownerGone = !!(C && C.h.gone); return res;
