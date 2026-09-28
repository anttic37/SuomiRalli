startRace(false); step(60*4); bassToggle(); step(2); { const b = BALES[0]; car.x = b.x + 4; car.z = b.z + 4; car.vx = car.vz = 0; }
let v = HEVI.v, dist = 0, px = v.x, pz = v.z, vmax = 0, off = 0, slow = 0, respawn = 0;
step(60*120, () => { if (HEVI.v !== v) { respawn++; v = HEVI.v; if (!v) return false; px = v.x; pz = v.z; } dist += Math.hypot(v.x - px, v.z - pz); px = v.x; pz = v.z; const sp = Math.hypot(v.vx, v.vz); vmax = Math.max(vmax, sp); if (sp < 3) slow++; if (v.offPath > 5) off++; });
return { avg: Math.round(dist/120*3.6), max: Math.round(vmax*3.6), slowS: +(slow/60).toFixed(1), offS: +(off/60).toFixed(1), respawn, alive: !!HEVI.v };
