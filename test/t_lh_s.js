// lehti photo: Parko Markkinen (Markkinarako) by the plane — arms up, he's seen a concept in it
startRace(false); step(40); lapStarted = true; WALK.on = false;
const park = (x, z) => { car.x = RI.x = x; car.z = RI.z = z; car.vx = car.vz = 0; carGroup.position.set(car.x, Y(car.x, car.z), car.z); };
await TRY('parko', async () => { const P = PLANE; if (!P.home) throw new Error('no plane'); const a = P.home.angle, fx = Math.sin(a), fz = Math.cos(a), lx = Math.cos(a), lz = -Math.sin(a);
  park(P.p.x + 60, P.p.z + 60); const x = P.p.x + fx*4.2 - lx*1.5, z = P.p.z + fz*4.2 - lz*1.5;
  const cx = x + fx*6.5 - lx*2.5, cz = z + fz*6.5 - lz*2.5, cy = Math.max(Y(cx, cz), Y(x, z)) + 2.4;
  const h = new Human({ x, z, yaw: Math.atan2(cx - x, cz - z) - 0.3, rig: makeAdult(0xeeeae0, 0x8fa2c4, 0x2a1a10, { sel: { hair: 2, top: 0, longSleeve: 1, longPants: 1, glasses: 1 } }), temp: true }); h.far = false; h.pose.armL = -2.5; h.pose.armR = -1.0; humanSync(h); hold(30);
  LH_FAR.k = 1; await view('parko', x - fx*2.5 + lx*1.5, Y(x, z) + 1.3, z - fz*2.5 + lz*1.5, cx, cy, cz); });
return out;
