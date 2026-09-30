startRace(false); step(20); const cx = 285, cz = 20; camera.fov = 50; camera.updateProjectionMatrix();
await shot('plane_map', cx, cz, 0.01, 0.01, 330, 0); return 1;
