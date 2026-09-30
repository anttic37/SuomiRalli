// lehti photo: the first backwoods strip — the plane on the strip by the hut, the windsock, the forest round it
startRace(false); step(20); const N0 = nearestAirfield(0, 0), A = N0.A; planeEnter(true);
const [px, pz] = [A.x - A.fx*(AF_L/2 - 110) + A.fz*4, A.z - A.fz*(AF_L/2 - 110) - A.fx*4]; planeInit({ x: px, z: pz, angle: A.a + 0.5 }); step(40);
camera.position.set(0, 0, 0); const [hx, hz] = [A.x - A.fx*(AF_L/2 - 70) + A.fz*(AF_W/2 + 16), A.z - A.fz*(AF_L/2 - 70) - A.fx*(AF_W/2 + 16)];
const tx = (px + hx)/2, tz = (pz + hz)/2; await shot('lh_korpi', tx, tz, A.fx*34 - A.fz*22, A.fz*34 + A.fx*22, 13, 0.5); return { name: A.name, h: A.h };
