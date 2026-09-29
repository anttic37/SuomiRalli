startRace(false); step(60*3); const S = X3.sauna; car.x = S.x + 35; car.z = S.z; step(60*14);
await shot('savu_paiva', S.x, S.z, 22, 16, 4, 8); setTimeOfDay('ilta'); step(20); await shot('savu_ilta', S.x, S.z, 9, 7, 2.5, 3.5);
return 1;
