// hands off at a 40° bank: the wing leveller brings it back level, no oscillation
startRace(false); step(20); const P = PLANE; planeEnter(true); planeInit({ x: 0, z: 0, angle: 0 }); P.p.y = Y(0, 0) + 120; P.v.set(0, 0, 40); P.thr = 0.6; P.air = true; P.airT = 1;
P.q.setFromEuler(new THREE.Euler(0, 0, 0.7, 'YXZ')); step(2); const bank = () => +(Math.asin(-new THREE.Vector3(1, 0, 0).applyQuaternion(P.q).y)*57.3).toFixed(1), tr = [];
for (let i = 0; i < 8; i++) { step(60); tr.push(bank()); } return { start: 40, bankEverySecond: tr, crashed: P.crashed };
