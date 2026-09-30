// the dragster "lives": the engine rocks with the torque, the chassis twists, the wings flutter, the driver is pressed back, the slicks squat/grow
startRace(false); step(40); lapStarted = true; dragSwap(true); step(90); const P = DRAG.carMesh.userData.parts, out = {};
const snap = (k) => { out[k] = { eng: +P.engine.rotation.z.toFixed(3), wing: +P.wing.rotation.x.toFixed(3), nose: +P.nose.rotation.x.toFixed(3), drv: +P.driver.position.z.toFixed(3), tyre: +P.wheels.RL.g.scale.y.toFixed(3), kmh: Math.round(Math.hypot(car.vx, car.vz)*3.6) }; };
const cam = (n, side, back, up) => { const fx = Math.sin(car.angle), fz = Math.cos(car.angle); return shot(n, car.x - fx*0.8, car.z - fz*0.8, fz*side - fx*back, -fx*side - fz*back, up, 0.8); };
const idle = []; for (let i = 0; i < 40; i++) { step(1); idle.push(P.engine.rotation.z); } out.idleRange = +(Math.max(...idle) - Math.min(...idle)).toFixed(4); snap('idle'); await cam('alive_idle', 4.2, 1.5, 1.4);
keys['ArrowUp'] = true; step(20); snap('launch'); await cam('alive_launch', 4.2, 1.5, 1.4);
const sv = [car.vx, car.vz]; car.vx = Math.sin(car.angle)*110; car.vz = Math.cos(car.angle)*110; for (let i = 0; i < 40; i++) { DRAG_LIVE.pv = 110; dragView(1/60); } snap('fast'); await cam('alive_fast', 4.2, 1.5, 1.4); car.vx = sv[0]; car.vz = sv[1];
keys['ArrowUp'] = false; return out;
