// real physics from the grid: countdown, then an autopilot through the corner onto Ylästöntie
initAudio = () => {}; startRace(false);
const realRender = renderer.render.bind(renderer); renderer.render = () => {};
window.__shot = async (n) => { realRender(scene, camera); await __save(n, renderer.domElement.toDataURL('image/png')); };
let T = performance.now(); const step = (n, f) => { for (let i = 0; i < n; i++) { f && f(i); T += 1000/60; loop(T); } };
step(60*1.5);                                            // mid-countdown
const fx = Math.sin(car.angle), fz = Math.cos(car.angle);
camera.position.set(car.x - fx*11 + fz*4, 7, car.z - fz*11 - fx*4); camera.lookAt(car.x + fx*14, 0, car.z + fz*14); camera.updateMatrixWorld();
lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(car.x + SUN.x, SUN.y, car.z + SUN.z); dirLight.target.position.set(car.x, 0, car.z); dirLight.target.updateMatrixWorld();
await __shot('grid.png');
const onStreetAtGrid = (() => { let best = null; sideRoads.forEach(R => R.pts.forEach(p => { const d = Math.hypot(p.x - car.x, p.y - car.z); if (!best || d < best.d) best = { d, name: R.name }; })); return best.name; })();
step(60*2);                                              // GO
const steer = () => { const n = trackPoints.length, tp = trackPoints[(car.prog + 7) % n]; let dA = Math.atan2(tp.x - car.x, tp.y - car.z) - car.angle; while (dA > Math.PI) dA -= 2*Math.PI; while (dA < -Math.PI) dA += 2*Math.PI;
  keys.ArrowLeft = dA > 0.05; keys.ArrowRight = dA < -0.05; keys.ArrowUp = Math.hypot(car.vx, car.vz) < 17; keys.ArrowDown = false; };
let startedAtS = null, t = 0, offRoad = 0;
step(60*12, i => { steer(); t += 1/60; if (lapStarted && startedAtS === null) startedAtS = +t.toFixed(2); if (!onRoad(car.x, car.z, 0.3)) offRoad++; });
keys.ArrowUp = keys.ArrowLeft = keys.ArrowRight = false;
return { onStreetAtGrid, timerDuringApproach: 'started after ' + startedAtS + ' s', lapStarted, raceTime: +raceTime.toFixed(2), kmh: Math.round(Math.hypot(car.vx, car.vz)*3.6), prog: car.prog, offRoadFrames: offRoad, gear: engine.gear };
