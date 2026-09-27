// language: FI · EN · NO on the start screen (L cycles); the menu, HUD, messages and the road paint follow; remembered
initAudio = () => {}; const out = {};
const realRender = renderer.render.bind(renderer);
const visible = () => { const txt = []; document.querySelectorAll('#overlay *, #hud *, #controls-hint *').forEach(el => { if (el.children.length === 0 && el.offsetParent !== null && el.textContent.trim()) txt.push(el.textContent.trim()); }); return txt; };
const FI = /\b(ja|aja|jarru|kaasu|uusi|lähtö|haamu|aika|paras|kuskit?|tarkastus|kesä|paina|sinä)\b/i;
for (const l of ['en', 'no', 'fi']) { document.querySelector('#lang button[data-l="' + l + '"]').click(); await new Promise(r => setTimeout(r, 300));
  const v = visible(); out[l] = { lang: LANG, stored: localStorage.getItem('ylasto1988-kieli'), finnishLeft: l === 'fi' ? null : v.filter(t => FI.test(t) && !/Ylästö|Vantaa/.test(t)), sample: v.slice(0, 12) };
  await __pageshot('lang_' + l + '.png'); }
// L cycles in the menu
const k = (c) => dispatchEvent(new KeyboardEvent('keydown', { code: c })); k('KeyL'); out.afterL = LANG; addEventListener; dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyL' }));
setLang('en'); renderer.render = () => {}; startRace(false); let T0 = performance.now(); for (let i = 0; i < 60*2; i++) { T0 += 1000/60; loop(T0); }
out.hud = [document.querySelector('#hud .hud-label').textContent, document.getElementById('controls-hint').textContent.replace(/\s+/g, ' ').trim()];
policeMsg(T('PÄÄSIT KARKUUN!'), true); out.msg = document.getElementById('police-msg').textContent;
const fx = Math.sin(car.angle), fz = Math.cos(car.angle), S = START_SPLIT; camera.position.set(S.x - S.dx*6, Y(S.x, S.z) + 14, S.z - S.dz*6); camera.lookAt(S.x + S.dx*10, Y(S.x, S.z), S.z + S.dz*10); camera.updateMatrixWorld();
realRender(scene, camera); await __save('lang_road_en.png', renderer.domElement.toDataURL('image/png'));
setLang('no'); realRender(scene, camera); await __save('lang_road_no.png', renderer.domElement.toDataURL('image/png'));
out.hudNo = document.querySelector('#hud .hud-label').textContent; await __pageshot('lang_hud_no.png');
setLang('fi'); return out;
