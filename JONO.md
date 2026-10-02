# JONO — jääneet asiat (ehdota Antille kun hiljaista)

Uusin ylimpänä. Poista rivi kun tehty tai Antti sanoo ei.

- **Varjo autojen alla musta laatikko (2.10.)** — korjattu oletuksella (canvas blur puuttuu selaimesta → softRectTex). Ei toistunut testikoneella:
  varmista Antilta onko poissa ja mikä selain. Jos ei, epäilty seuraava: varjokartta (SHADOW_R 85) tai FAR_DETAIL-pihojen autot.
- **Lehti jäljessä (2.10.)** — omenajutut (ravistelu, ovesta repiminen, hyppy omenaan, isännän huuto), fps-rajoitin, varjokorjaus eivät ole lehdessä;
  lehti.json/PDF päivittyy vain `PDF=1`. Tee vain käskystä.
- **FPS-rajoitin (2.10.)** — 144 Hz → 72 fps tasaisesti. Varmista Antilta onko kävelyn nykiminen poissa; jos ei, V:llä raja pois ja vertaa.
- **Omenan poiminta** — omenat nyt 2,4–3 m latvassa; ukko hyppää 0,4–0,8 m. Jos näyttää kömpelöltä (puun latvan sisällä), harkitse omenat
  kauemmas latvasta tai matalampi hyppy.
- **Isännän huuto** — näkyy talon läpi (depthTest pois). Jos häiritsee, pienennä tai piilota kun talo välissä.
