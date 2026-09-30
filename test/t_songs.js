// the radio's list: the five new songs are in it (over http: the playlist is fetched)
startRace(false); await new Promise(r => setTimeout(r, 3000)); const L = RADIO.list || [], want = ['Paluulippu', 'Kartta luokan seinällä', 'Käsi kädessä rauhan puolesta', 'Yhdessä rakennamme maailmaa', 'Antakaa meille tulevaisuus'];
return { n: L.length, songs: L.filter(t => !t.talk).length, found: want.filter(w => L.some(t => t.title === w)).length };
