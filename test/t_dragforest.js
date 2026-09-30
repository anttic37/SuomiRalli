// the dragster into the forest: how the car and the camera turn (Antti: "kamera pyörii hallitsemattomasti")
startRace(false); step(60); lapStarted = true; dragSwap(true); step(10);
let best = null; for (const it of KNOCK.items) { if (it.kind !== 'tree' || !it.ranges.length) continue; let n = 0; knockNear(it.x, it.z, 10, o => { if (o.kind === 'tree') n++; }); if (n > 12 && (!best || n > best.n)) best = { it, n }; if (best && best.n > 20) break; }
const it = best.it, a = 0.6, x = it.x - Math.sin(a)*40, z = it.z - Math.cos(a)*40; car.x = RI.x = x; car.z = RI.z = z; car.angle = RI.a = a; DP.ok = false; dragInit(x, z, a); step(20); DP.v.set(Math.sin(a)*40, 0, Math.cos(a)*40);
const log = []; let pa = car.angle, pc = camAngle.current, carTurn = 0, camTurn = 0, maxW = 0, frames = 0, maxCam = 0; keys.ArrowUp = true;
step(60*6, () => { frames++; const da = Math.atan2(Math.sin(car.angle - pa), Math.cos(car.angle - pa)), dc = Math.atan2(Math.sin(camAngle.current - pc), Math.cos(camAngle.current - pc)); carTurn += Math.abs(da); camTurn += Math.abs(dc); maxCam = Math.max(maxCam, Math.abs(dc)*60); pa = car.angle; pc = camAngle.current; maxW = Math.max(maxW, DP.w.length());
  if (frames % 20 === 0) log.push([frames, Math.round(DP.v.length()), +DP.w.y.toFixed(2), +new THREE.Vector3(0, 1, 0).applyQuaternion(DP.q).y.toFixed(2), KNOCK.down.length].join(' ')); });
keys.ArrowUp = false; return { maxCamRate: +maxCam.toFixed(2), carTurnRad: +carTurn.toFixed(1), camTurnRad: +camTurn.toFixed(1), maxW: +maxW.toFixed(1), felled: KNOCK.down.length, wreck: WRECK.on, log };
