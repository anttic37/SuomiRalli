startRace(false); step(60*4); setTimeOfDay('ilta'); step(5);
// a view over the village: from a spot on the route high enough to see houses
let best = null; for (let i = 0; i < trackPoints.length; i += 15) { const p = trackPoints[i]; let n = 0; for (const B of STATIC_LIST) if (B.kind === 'house' && Math.hypot(B.x - p.x, B.z - p.y) < 120) n++; const sc = n + Y(p.x, p.y)*0.5; if (!best || sc > best.sc) best = { sc, i }; }
const p = trackPoints[best.i], q = trackPoints[(best.i + 8) % trackPoints.length], ang = Math.atan2(q.x - p.x, q.y - p.y);
car.x = p.x; car.z = p.y; car.angle = ang; car.vx = car.vz = 0; step(10);
nukeBoom(); NUKE.hit = true; NUKE.flash.style.opacity = 0; NUKE.gx = car.x + Math.sin(ang)*560; NUKE.gz = car.z + Math.cos(ang)*560; NUKE.cloud.G.position.set(NUKE.gx, Y(NUKE.gx, NUKE.gz), NUKE.gz); NUKE.t = 7.5; step(3); NUKE.ring.visible = false;
carGroup.position.set(car.x, Y(car.x, car.z), car.z); carGroup.rotation.y = ang;
camera.position.set(car.x - Math.sin(ang)*14, Y(car.x, car.z) + 5, car.z - Math.cos(ang)*14); camera.lookAt(NUKE.gx, Y(NUKE.gx, NUKE.gz) + 120, NUKE.gz); camera.fov = 60; camera.updateProjectionMatrix(); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
dirLight.position.set(car.x + SUN.x, Y(car.x, car.z) + SUN.y, car.z + SUN.z); dirLight.target.position.set(car.x, Y(car.x, car.z), car.z); dirLight.target.updateMatrixWorld();
RR(scene, camera); await __save('s3_ad_nuke.png', renderer.domElement.toDataURL('image/png'));
return best;
