// the police station stands at its own spot beside the sports field (not on it, not in the trees), a view from above
initAudio = () => {}; const RR = renderer.render.bind(renderer); renderer.render = () => {};
for (let i = 0; i < 5; i++) loop(lastTime + 1000/60);
const S = X3.station, F = LANDMARKS.find(L => L[0] === 'kentta'), onField = F ? [[0,0],[6,4],[-6,4],[6,-4],[-6,-4]].some(([a, b]) => { const [x, z] = lloc(S.x, S.z, S.yaw, a, b); return inLandmark(x, z, F, 0); }) : null;
const trees = typeof treeCount === 'function' ? treeCount(S.x, S.z, 10) : null, spot = POLICE_SPOT && POLICE_SPOT.map(v => +v.toFixed(1));
const cx = (S.x + (F ? F[1] : S.x))/2, cz = (S.z + (F ? F[2] : S.z))/2; camera.position.set(cx + 30, Y(cx, cz) + 90, cz + 30); camera.lookAt(cx, Y(cx, cz), cz); camera.updateMatrixWorld(); RR(scene, camera);
if (window.SHOT) await __save('station.png', renderer.domElement.toDataURL('image/png'));
return { station: [+S.x.toFixed(1), +S.z.toFixed(1)], spot, usedSpot: !!spot && Math.hypot(spot[0] - S.x, spot[1] - S.z) < 6, onField, treesWithin10: trees, route: +Math.sqrt(roadInfo(S.x, S.z).d2).toFixed(1) };
