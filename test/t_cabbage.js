// cabbage patches (and other instanced meshes fitted by fitInstanceBounds): every one's bounding sphere must hold its own instances
renderer.render = () => {}; const out = [], M = new THREE.Matrix4(), P = new THREE.Vector3(); const list = [];
scene.traverse(o => { if (o.isInstancedMesh && o.frustumCulled && o.count && o.geometry.boundingSphere) list.push(o); });
let bad = 0, checked = 0; for (const im of list) { const S = im.geometry.boundingSphere; let miss = 0; for (let k = 0; k < im.count; k++) { im.getMatrixAt(k, M); if (Math.abs(M.elements[0]) + Math.abs(M.elements[5]) + Math.abs(M.elements[10]) < 1e-6) continue; P.setFromMatrixPosition(M); if (P.distanceTo(S.center) > S.radius + 0.01) miss++; }
  checked++; if (miss) { bad++; out.push((im.userData.key || im.parent && im.parent.userData.key || '?') + ':' + !!im.userData.ownBounds + ':' + yardCarMeshes.includes(im) + ':' + propInst.includes(im) + ' misses ' + miss + '/' + im.count); } }
const cab = []; lifeGroup.children.forEach(o => { if (o.isInstancedMesh && o.count > 40) cab.push(o); });
return { checked, bad, cabbagePatches: cab.length, cabbageShared: new Set(cab.map(o => o.geometry)).size, samples: out.slice(0, 6) };
