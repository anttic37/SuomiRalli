// verge grass tufts up close and at a distance (they used to look like black blots)
startRace(false); step(30); const R = sideRoads[3] || sideRoads[0], p = R.pts[Math.floor(R.pts.length/2)], q = R.pts[Math.floor(R.pts.length/2) + 1] || R.pts[0];
const ux = q.x - p.x, uz = q.y - p.y, l = Math.hypot(ux, uz) || 1, nx = -uz/l, nz = ux/l, cx = p.x + nx*(R.w*0.5 + 2.5), cz = p.y + nz*(R.w*0.5 + 2.5); car.x = cx + 50; car.z = cz; step(2);
await shot('tuft_close', cx, cz, nx*4 + ux/l*3, nz*4 + uz/l*3, 1.6, 0.2); await shot('tuft_far', cx, cz, nx*14 + ux/l*10, nz*14 + uz/l*10, 6, 0);
return { road: R.name };
