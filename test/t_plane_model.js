// the new plane model: close-ups from four sides (parked), and one in the air with the controls deflected
startRace(false); step(30); const P = PLANE, H0 = P.home; const pics = [];
const look = async (n, dx, dy, dz, tx, ty, tz) => { const gy = Y(P.p.x, P.p.z); camera.position.set(P.p.x + dx, P.p.y + dy, P.p.z + dz); camera.lookAt(P.p.x + (tx || 0), P.p.y + (ty || 0), P.p.z + (tz || 0)); camera.fov = 45; camera.updateProjectionMatrix(); camera.updateMatrixWorld(); RR(scene, camera); await __save('s3_pm_' + n + '.png', renderer.domElement.toDataURL('image/png')); };
const F = new THREE.Vector3(0, 0, 1).applyQuaternion(P.q), L = new THREE.Vector3(1, 0, 0).applyQuaternion(P.q);
await look('front34', F.x*8 + L.x*6, 2.5, F.z*8 + L.z*6); await look('side', -L.x*11, 1.2, -L.z*11); await look('rear34', -F.x*9 - L.x*5, 3.5, -F.z*9 - L.z*5); await look('top', F.x*0.5, 14, F.z*0.5 + 0.01);
P.da = 1; P.de = 1; P.dr = 1; planeView(0); await look('controls', -F.x*7 - L.x*6, 3, -F.z*7 - L.z*6, -F.x*2, 0, -F.z*2); P.da = P.de = P.dr = 0; planeView(0);
return { ok: true, parts: Object.keys(P.mesh.userData.parts) };
