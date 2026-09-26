renderer.render = () => {}; ONLINE.api = '/api';
ONLINE.ok = false; ONLINE.busy = true; renderTop10(); await new Promise(r => setTimeout(r, 1500)); await __pageshot('menu_loading.png');
ONLINE.ok = true; ONLINE.busy = false; ONLINE.name = 'ANBA'; ONLINE.list = [{ k: 'mane', name: 'Mane', t: 86.618 }, { k: 'anba', name: 'ANBA', t: 88.512 }, { k: 'häfe', name: 'häfe', t: 89.165 }]; ONLINE.opp = [{ name: 'Mane', t: 86.618 }]; renderTop10(); await __pageshot('menu_list.png');
ONLINE.busy = true; renderTop10(); await __pageshot('menu_refresh.png');
ONLINE.ok = false; ONLINE.busy = false; renderTop10(); await __pageshot('menu_err.png');
return document.querySelector('#overlay h1').getBoundingClientRect().width;
