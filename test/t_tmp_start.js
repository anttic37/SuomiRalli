setTimeOfDay('paiva'); startRace(false); step(60*1.5);
const gi = gridIndex(), p = trackPoints[gi], d = getDir(gi); camera.position.set(p.x - d.x*9, Y(p.x, p.y) + 9, p.y - d.y*9); camera.lookAt(p.x + d.x*10, Y(p.x, p.y), p.y + d.y*10); camera.updateMatrixWorld();
RR(scene, camera); await __save('start_view2.png', renderer.domElement.toDataURL('image/png')); return 1;
