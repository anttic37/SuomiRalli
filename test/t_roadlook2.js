initAudio = () => {}; setTimeOfDay('paiva'); const RR = renderer.render.bind(renderer); renderer.render = () => {};
const view = async (name, ex, ez, eh, tx, tz, th) => { const ey = H(ex, ez) + eh, ty = H(tx, tz) + th; skyDome.position.set(ex, ey, ez); car.x = tx; car.z = tz; carGroup.position.set(0, -500, 0);
  HUMANS.forEach(q => { q.far = true; if (q.view.kind === 'rig') humanSync(q); });
  camera.position.set(ex, ey, ez); camera.lookAt(tx, ty, tz); camera.updateMatrixWorld();
  lightAnchor.x = lightAnchor.z = 1e9; dirLight.position.set(tx + SUN.x, ty + SUN.y, tz + SUN.z); dirLight.target.position.set(tx, ty, tz); dirLight.target.updateMatrixWorld(); U_TIME.value = 0;
  RR(scene, camera); await __save(name + '.png', renderer.domElement.toDataURL('image/png')); };
const bends = []; for (let i = 6; i < trackPoints.length - 6; i++) { const a = trackPoints[i - 5], b = trackPoints[i], c = trackPoints[i + 5]; const t = angDiff(Math.atan2(c.x - b.x, c.y - b.y) - Math.atan2(b.x - a.x, b.y - a.y)); bends.push({ x: b.x, z: b.y, t, i }); }
bends.sort((a, b) => Math.abs(b.t) - Math.abs(a.t)); const out = [];
for (let k = 0; k < 3; k++) { const b = bends[k * 7], i = b.i, d = getDir(i), side = b.t > 0 ? 1 : -1, nx = -d.y*side, nz = d.x*side, hw = wAt(i)*0.5;   // inner side
  const ix = b.x + nx*hw, iz = b.z + nz*hw; await view('rc_in' + k, ix - nx*6 - d.x*6, iz - nz*6 - d.y*6, 2.2, ix, iz, 0); await view('rc_top' + k, ix + 0.5, iz + 0.5, 9, ix, iz, 0); out.push([Math.round(b.x), Math.round(b.z), b.t.toFixed(2)]); }
return out;
