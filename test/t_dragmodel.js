// the new dragster model (parts as groups for the physics to come) and its lay-by by the start straight, seen from above and close up
startRace(false); step(30); out.lay = LAY.pts.length; const H = DRAG.home; out.home = H && [Math.round(H.x), Math.round(H.z)]; if (!H) return out;
const P = DRAG.parkMesh.userData.parts; out.parts = Object.keys(P); out.wheels = Object.keys(P.wheels);
car.x = RI.x = H.x + 40; car.z = RI.z = H.z; step(5);
const g = trackPoints[gridIndex()]; LH_FAR.k = 1; await view('lay_top', (H.x + g.x)/2, Y(H.x, H.z), (H.z + g.y)/2, (H.x + g.x)/2 + 2, Y(H.x, H.z) + 70, (H.z + g.y)/2 - 30);
await view('drag_close', H.x, Y(H.x, H.z) + 0.8, H.z, H.x + Math.cos(H.angle)*5.5 + Math.sin(H.angle)*2.5, Y(H.x, H.z) + 2.4, H.z - Math.sin(H.angle)*5.5 + Math.cos(H.angle)*2.5);
await view('drag_rear', H.x, Y(H.x, H.z) + 0.9, H.z, H.x - Math.sin(H.angle)*7 - Math.cos(H.angle)*3, Y(H.x, H.z) + 2.8, H.z - Math.cos(H.angle)*7 + Math.sin(H.angle)*3);
return out;
