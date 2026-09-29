// on foot: the arrows move you the way they point on the screen (camera held), faster walking, Space punches — the one hit runs off and the police come
initAudio = () => {}; renderer.render = () => {};
const step = (k) => { for (let i = 0; i < k; i++) loop(lastTime + 1000/60); };
startRace(false); step(60*2); walkOut(); const h = WALK.h, A = WALK.camA, r = {};
const go = (key) => { const x0 = h.x, z0 = h.z; keys[key] = true; step(60); keys[key] = false; step(5); const dx = h.x - x0, dz = h.z - z0, l = Math.hypot(dx, dz);
  const scrUp = (dx*Math.sin(A) + dz*Math.cos(A))/l, scrRight = (dx*Math.cos(A) - dz*Math.sin(A))/l; return { m: +l.toFixed(1), up: +scrUp.toFixed(2), right: +scrRight.toFixed(2) }; };
r.up = go('ArrowUp'); r.right = go('ArrowRight'); r.left = go('ArrowLeft'); r.down = go('ArrowDown'); r.camHeld = Math.abs(camAngle.current - A) < 0.05;
// a punch at someone in front
const o = HUMANS.find(q => !q.gone && !q.player && !q.animal && !q.seat && !q.inside && q.task && q.task.kind !== 'officer'); const fx = Math.sin(h.yaw), fz = Math.cos(h.yaw);
o.x = h.x + fx*1.1; o.z = h.z + fz*1.1; const p0 = POLICE.cars.filter(v => !v.gone).length; keys.Space = true; step(2); keys.Space = false; r.dodge = !!o.dodge; const d0 = Math.hypot(o.x - h.x, o.z - h.z); step(60*2);
r.fled = +(Math.hypot(o.x - h.x, o.z - h.z) - d0).toFixed(1); r.police = POLICE.cars.filter(v => !v.gone).length - p0; walkIn(true); return r;
