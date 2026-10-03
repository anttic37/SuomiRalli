# AGENTIT — kolme ketjua, yksi repo

Antti puhuu kaikille kolmelle. Tieto kulkee tämän repon kautta (main-haara): jokainen `git pull` ennen työtä, `git push` heti valmiina.

| Ketju | Tehtävä | Koskee tiedostoihin |
|---|---|---|
| **Suomiralli** (pääketju) | Koodaa featuret, oma pikatesti, CHANGES-rivi, julkaisee editorin | kaikki koodi |
| **SuomiRalli – tarkistus** | Ajaa isot testit kun pääketju on valmis, kirjaa tulokset | vain `TESTIT.md` (+ uudet `test/t_*.js`) |
| **SuomiRalli – lehti** | Taittaa Ylästön Sanomat: jutut, kuvat, PDF, julkaisee | vain `LEHTI`-taulukko src/game.html:ssä, `lehti/`, `test/t_lh_*.js` |

## Kulku ("Hei, nyt on featureita tullu")
1. **Pääketju** tekee ja pushaa featuren → kirjoittaa `TESTIT.md`:n alkuun rivin `ODOTTAA: <commit> <mitä muuttui, mitkä testit>` ja herättää tarkistusketjun (fire_trigger). Antti voi jatkaa pääketjussa heti.
2. **Tarkistus**: `git pull`, `python3 build.py`, ajaa regressiot (t_ghost 129.972/118.157/144.414, t_paper_fit "bad":[], t_lap, t_start, t_phases) + muutoksen testit. Kirjaa `TESTIT.md`:hen `OK` tai `RIKKI` (testi, tulos, epäilty commit). RIKKI → herättää pääketjun (fire_trigger + text), ei korjaa koodia itse. OK → herättää lehtiketjun.
3. **Lehti**: lukee CHANGES-rivit edellisen lehden jälkeen (`lehti/VIIMEISIN.txt` = viimeisin käsitelty CHANGES-rivi), päättää mistä juttu (isot featuret, kuvat test/lhrun.sh) ja mistä riittää Lyhyesti. `PDF=1 python3 build.py`, t_paper_fit, push, julkaisee editorin (Artifact, url alla). Max 2 numeroa päivässä, ellei Antti pyydä.

## Herättäminen (toimii pilvestä pilveen)
SendMessage ei välttämättä kulje pilviketjusta toiseen, joten herätä **fire_trigger**-työkalulla (claude-code-remote; voit antaa `text`-lisäviestin):
- tarkistus: `trig_01MHeLR5Q2zt4KVkJgnWcsUg`
- lehti: `trig_0177DaR3uKZN4ZNBCqvx7QKx`
- pääketju: `trig_01BLjw69Zv7RCzzezn4wczY7`

## Säännöt
- Push-kilpa: `git pull --rebase origin main` ennen pushia; jos rebase osuu index.html/editor.html/lehti.json → ota upstream-versio ja **rakenna uudelleen** (`python3 build.py`), älä yhdistä käsin.
- Vain pääketju kirjoittaa CHANGES-rivejä ja muuttaa pelikoodia. Lehti ja tarkistus eivät koske koodiin.
- Commit-viestin loppuun kunkin ketjun oma Co-Authored-By/Claude-Session -rivi.
- Editori-artifact: https://claude.ai/artifact/XX6ZiDEBgrZ97AsxEWf58b (julkaisu: Artifact publish editor.html tällä url:lla, lue ensin `action: read`).
- Postiavainta ei koskaan repoon.
- Vastaa Antille suomeksi, lyhyesti. Projektin ohjeet: CLAUDE.md, historia NOTES.md, jono JONO.md.
