startRace(false); step(60*3); const S = X3.sauna; car.x = S.x + 35; car.z = S.z; step(60*12);
await shot('sauna_smoke', S.x, S.z, 26, 20, 5, 9); setTimeOfDay('ilta'); step(10); await shot('sauna_eve', S.x, S.z, 14, 10, 3, 3);
return 1;
