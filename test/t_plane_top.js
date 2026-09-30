startRace(false); step(30); const PH = PLANE.home; camera.fov = 50; camera.updateProjectionMatrix();
const fx0 = finishLine.position.x, fz0 = finishLine.position.y; await shot('plane_top', (PH.x + fx0)/2, (PH.z + fz0)/2, -30, 60, 150, 0); return { home: [Math.round(PH.x), Math.round(PH.z)], runway: PH.runway };
