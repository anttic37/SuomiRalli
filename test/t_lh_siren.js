// paper photo: a car pulled over to the right, a police car with its beacons coming up behind it
setTimeOfDay('paiva'); startRace(false); step(60*3); freeEnter(); { const b = BALES[0]; car.x = b.x + 4; car.z = b.z + 4; car.vx = car.vz = 0; } step(60*12);
const v = TRAFFIC.list.filter(o => o.kind === 'car' && o.vF > 6 && distRoute(o.x, o.z) > 15).sort((a, b) => b.vF - a.vF)[0]; const M = makePoliceCar(); lifeGroup.add(M.G);
const P = new Vehicle({ kind: 'police', x: v.x, z: v.z, yaw: v.yaw, hw: 0.88, hl: 2.4, view: { kind: 'mesh', g: M.G }, axle: [0.8, 1.4, -1.35], temp: true }); P.chase = true; P.fx = M;
let back = 30; for (let i = 0; i < 60*6; i++) { back = Math.max(9, back - 0.06); const [x, z] = lloc(v.x, v.z, v.yaw, -0.6, -back); P.x = x; P.z = z; P.yaw = v.yaw; vehicleSync(P);
  M.bm.forEach((m, k) => { const q = Math.pow(Math.max(0, Math.sin(i*0.2 + k*Math.PI)), 3); m.emissiveIntensity = 0.2 + q*3.2; M.glows[k].material.opacity = q; M.glows[k].visible = q > 0.02; }); step(1); }
const [cx, cz] = lloc(v.x, v.z, v.yaw, -6, 12); car.x = v.x + 40; car.z = v.z + 40; nearVisT = 0; nearVisUpdate(0.01); LH_FAR.k = 1.0;
await view('vaisto', (v.x + P.x)/2, Y(v.x, v.z) + 1, (v.z + P.z)/2, cx, Y(cx, cz) + 3.0, cz);
return { kmh: +(Math.abs(v.vF)*3.6).toFixed(1), sw: +(v.sw || 0).toFixed(2) };
