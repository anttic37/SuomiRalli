# TESTIT — tarkistusketjun kirjanpito (uusin ylimpänä)

- ODOTTAA (Rapier, 3.10. 19.13): cd test && npm i (uusi riippuvuus @dimforge/rapier3d-compat), sitten t_rapier (ready true, restErr 0, baleMoved > 8, resetBack < 0.2), t_rapierperf2 (on ≈ off), t_garbage, t_binstick, t_ghost.

- 3.10. OK ac1cd68 (tarkistusketju; hääsaattue + äänet): t_ghost 129.972 / 118.157 / 144.414, t_paper_fit "bad":[], t_lap kierros 148.83 s stuck 0, t_start ja t_phases OK, t_wedding gap 3.8–19 m (ilman SEEDiä; SEED=1: 7.4–20.7) dmg 0 joined true, t_wedding_hit angry/pairOut/calm/backIn true, t_apples OK, virheitä 0. Äänet http:llä (serve.mjs 8787, uusi test/t_voice.js via runall_http.sh): omena1–2 ja morsian1–2 latautuvat ja dekoodautuvat (2.0/2.08/2.08/1.2 s), voicePlay OK. Huom: väli-min 3.8 m alittaa "n. 7" kerran ilman siementä – ei törmäystä. serve.mjs vaatii juuren `npm i` (@netlify/blobs).

- 3.10. OK cb0311c (tarkistusketju, lähtötaso): t_ghost 129.972 / 118.157 / 144.414, t_paper_fit "bad":[]. Huom: kaksi rinnakkain → page.goto-aikakatkaisu, yksin OK.
- 3.10. lähtötaso: t_ghost 129.972 / 118.157 / 144.414, t_paper_fit "bad":[] (pääketju).
