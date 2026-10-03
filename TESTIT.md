# TESTIT — tarkistusketjun kirjanpito (uusin ylimpänä)

- ODOTTAA: ac1cd68 (3.10. 18.18, pääketju) — hääsaattue + ääniefektit. Aja: python3 build.py, regressiot (t_ghost 129.972/118.157/144.414, t_paper_fit "bad":[], t_lap, t_start, t_phases) sekä test/t_wedding.js (gap n. 7–21 m, dmg 0, joined true), test/t_wedding_hit.js (angry, pairOut, calm, backIn true) ja test/t_apples.js. Tarkista että audio/*.mp3 (omena1–2, morsian1–2) latautuvat http:llä (test/serve.mjs, portti 8787). Älä ota isoja PNG-kuvia: __save on tässä ympäristössä hyvin hidas. OK → kirjaa ja kerro Antille, että lehti voi tehdä hääsaattuejutun.

- 3.10. OK cb0311c (tarkistusketju, lähtötaso): t_ghost 129.972 / 118.157 / 144.414, t_paper_fit "bad":[]. Huom: kaksi rinnakkain → page.goto-aikakatkaisu, yksin OK.
- 3.10. lähtötaso: t_ghost 129.972 / 118.157 / 144.414, t_paper_fit "bad":[] (pääketju).
