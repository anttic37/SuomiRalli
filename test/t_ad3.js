startRace(false); step(60*4); setTimeOfDay('ilta'); step(5);
const U = UFOS[0]; ufoCapture(U); for (let i = 0; i < 60*4; i++) step(1);
const i0 = 630, p = trackPoints[i0], q = trackPoints[(i0 + 8) % trackPoints.length], ang = Math.atan2(q.x - p.x, q.y - p.y);
for (let i = 0; i < 60*3; i++) { car.x = p.x; car.z = p.y; car.angle = ang; car.vx = Math.sin(ang)*14; car.vz = Math.cos(ang)*14; step(1); car.x = p.x; car.z = p.y; }
carGroup.position.set(car.x, Y(car.x, car.z), car.z); carGroup.rotation.set(0, ang, 0);
const sx = Math.cos(ang), sz = -Math.sin(ang);   // camera off to the side and a bit ahead, looking back up at it
camera.position.set(car.x + Math.sin(ang)*16 + sx*9, Y(car.x, car.z) + 3, car.z + Math.cos(ang)*16 + sz*9); camera.lookAt(car.x, Y(car.x, car.z) + 11, car.z); camera.fov = 62; camera.updateProjectionMatrix(); camera.updateMatrixWorld(); skyDome.position.copy(camera.position);
dirLight.position.set(car.x + SUN.x, Y(car.x, car.z) + SUN.y, car.z + SUN.z); dirLight.target.position.set(car.x, Y(car.x, car.z), car.z); dirLight.target.updateMatrixWorld();
RR(scene, camera); await __save('s3_ad_ufo.png', renderer.domElement.toDataURL('image/png'));
return [U.G.position.y - Y(car.x, car.z), Math.hypot(U.x - car.x, U.z - car.z)];
