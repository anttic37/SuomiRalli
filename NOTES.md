# YLÄSTÖ 1988 — korkeusversio (terrain heights)

Separate versions; the flat game (artifact 4Rz3NsHQYUDk9uEgt7NLWm, ylasto-race.html / ylasto-editor.html) stays untouched.
- v1: ylasto-korkeus.html → artifact 294oXTyN3moY8VtnQmcyeo (placeholder hills, ≈7 m relief). Editor ylasto-korkeus-editor.html.
- 2×: ylasto-korkeus-2x.html → artifact XaTW29RyURuaYeu6KnvTZr (PLACEHOLDER_AMP = 2, ≈13 m relief, baked hillshade).
- 4×: ylasto-korkeus-4x.html → artifact 1GHN1QN9Vk142i3fMc9PhV (≈26 m relief; + C key = low chase camera).
- 8×: ylasto-korkeus-8x.html → artifact 73kiweQWUwfJhuyeV1oDFZ — the keeper ("tää on hyvä!"). Editor ylasto-korkeus-8x-editor.html. Current template = 8× v6 (artifact Version 6). Earlier builds kept as ylasto-korkeus-8x-v4-backup.html / -v5-backup.html (+ -editor).
  - v1: PLACEHOLDER_AMP = 8 (≈50 m relief, grades up to ~33 %); lakes levelled; trees anchored over half their crown; footprintBase 5×5 grid.
  - v2: terraced lots (plot/landmark pads, 7 m blend, only outside road corridors); driveways subdivided to 1.2 m; plot lawns painted into the ground texture; yard cars 4-wheel fit, > ~13° dropped; plots two-pass (drives/cars first); fitInstanceBounds for culled instanced meshes; surfaceDetail() textures (weatherboards, vertical cladding, brick, grit) + canvas-textured sand pitch.
  - v3 (after "talo ei saa olla tiessä kiinni" + a long wish list):
    - Houses: walls kept ≥ 1.8 m from any road edge — nudged away from the road up to 3.5 m (roadPen), removed only if they'd hit a neighbour; rinta porch goes on the gable away from the road (or none). House anchor margin 1.2 m (porch + steps).
    - Spectators ×~1.4 (corners 22–37, straights p 0.14, 6–12). After a hard hit (carDamage ≥ 4 m/s → crashAt) people within 60 m run to the crash at 3.2–4.6 m/s, stop 3–6 m away and stare/wave; they don't step onto the racing line if the crash was on it.
    - Ambulance: road graph over all streets (nodes ≤ 6 m, T-ends joined), Dijkstra; spawns ~150–280 m away by road, drives on the right up to 10 m/s with siren (two-tone WebAudio) and blue beacons, slows for turns, stops for the rally car and after 2.5 s goes round it; parks beside the patient, two medics walk over, kneel, stretcher back, leave by the reversed path.
    - Village life: planned in the plot pass (LIFE_PLAN, LIFE_GUESTS), built after the lift. ~25 barbecues, ≤ 3 fights, ~15 lawn mowers, ~6 yards with kids cycling, 130 flagpoles with a shared waving flag shader (~35 % hoisted/lowered by a person), 4 cabbage patches (instanced), 2 tractors working boustrophedon passes, 3 smoking broken-down cars with onlookers.
  - v4 (after "paranna ambulanssien malleja, ihmiset pyörivät vaakana, törmäysmalli pielessä"):
    - Ambulance remodelled as an 80s Finnish estate-chassis ambulance (long bonnet with mirrored AMBULANSSI, high box, double red bands, SAIRAANKULJETUS + red cross, rear doors, roof sign, sweeping blue beacons). Medics white shirts / navy trousers; stretcher with legs, wheels, orange blanket.
    - Car vs people as a real box (3.8 × 1.68 m) against slim people (r 0.3). Knocked-down people stop spinning once they land and lie on the ground.
  - v5 (after "kaikilla ihmisillä pitäis olla sama käyttäytyminen … sama autoille … törmää ambulanssiin → palokunta, taloon → tulipalo + paloauto … mieti oikea tapa koodata … normikko liukas"): the life section was rewritten as one world module (the "THE WORLD" section of game.html) so new things plug into shared pieces instead of being rebuilt:
    - **Human** (class): every person — spectators (the tyre-prop crowd is converted in worldBuild), BBQ cooks, fighters, mowers, kids on bikes, flag hoisters, tractor drivers, football kids, medics, firefighters. One body (r 0.3 / kids 0.24), one physics step (humanStep), one knock-down (`knock(h, vx, vz, power)` → hurt → `DISPATCH.hurt`). What they do is a **task** object (`spectate`, `cook`, `fight`, `mow`, `ride`, `hoist`, `seated`, `watch`, `football`, `medic`, `firefighter`) with `update(h, dt, t, near)`, optional `knocked(h)` and `reset(h)`. Views: instanced crowd outfits (+ arms-up pools) or a rigged body; rigs > 240 m from the car hidden. Moving people are pushed out of houses/poles; flying people bowl over others; crews step over tyre walls.
    - **Vehicle** (class): parked cars (instanced, per-car instance slots `c.inst`), buses, tractors, ambulances, fire engines. OBB + mass (∞ = immovable), impulses with angular kick (`obbSat` + `resolvePair`); shoved cars slide/spin to rest in the fixed physics step (`vehiclesPhysics`). `vehicleHit`: dents (engine smoke at damage ≥ 6), fire at an impact ≥ 11 m/s or damage ≥ 15. Every moving box knocks people through the same `boxHitsHumans` (the rally car too). Burnt cars go black, vans/buses get a soot coat. A burning tractor: the driver jumps off and watches, hands on head.
    - **STATIC**: houses (wall/roof heights from the builder's own rules), shops, big pines, power poles as solid boxes in a 10 m grid. The rally car no longer drives through houses (it did before v5). Hitting a house at ≥ 8.5 m/s sets it on fire: flames through the roof and out of the windows, black smoke, embers, walls blacken (soot box), glow.
    - **DISPATCH**: hurt → ambulance (grouped within 14 m; not onto a van whose own crew is down; patients left behind are re-sent when a van leaves); fire → fire engine (80s red cab-over, PALOKUNTA, lockers, roof ladder, blue beacons, 3 firefighters with yellow helmets and hoses; house fire ≈ 30 s of hosing, vehicle ≈ 10 s). ≤ 2 of each kind at once. Responders slow to walking pace and nudge people aside (nobody gets run over by an ambulance), steer round parked vehicles, stop for / pass the rally car, park short of another van, park early and walk if the road's blocked, squeeze through after 8 s stuck. Crews are Humans: hitting a medic brings another ambulance; ramming the ambulance can set it burning → fire engine.
    - Grass: gripGrass 6.5 → 1.9 (slides), dragGrass 1.8 → 0.2 (rolls on: coast 90 → ~53 km/h in 2 s instead of a dead stop), grassPower 0.5 (wheelspin), grassBrake 0.4, loose-surface wander on grass.
    - Fixed a long-standing culling bug: `fitInstanceBounds` grew the bounds on every refit (it read its own previous world sphere as the model size), so verge tufts/lupins and refit yard cars were never culled. The model radius is now measured once. ≈ 350–600 draw calls (was 600–840), ≈ 1.4–1.6 M triangles (was ≈ 2 M); worldUpdate ≈ 0.2–0.5 ms/frame.
    - Particle systems for life smoke, fire and water scale with the screen like the others; emitter/near-visibility lists cleared on rebuild.
  - v6 (after "palomies ei päästänyt letkusta irti, ambulanssi on kuin kiveä — oma ajomalli, sama kaikille autoille; ihmiset lensivät todella pitkälle, niiden pitäisi lösähtää konepeltiin"):
    - **One driving model for every vehicle** (`vehicleStep`, VSPEC per kind: mass, engine, brakes, top speed, wheelbase, steering lock, tyre grip): longitudinal engine/brake/rolling drag, bicycle yaw from steering, tyres that kill sideways slide only up to their grip (a shove slides and spins it, then it recovers), hills, parked = wheels locked. Masses (rally car = 1): car 1.15, ambulance 2.3, tractor 3.2, fire engine 8, bus 12. Nothing is immovable any more; impulses spin both bodies.
    - Drivers only work pedals and wheel (`v.ctrl`): pure-pursuit steering along the road path (`pathProject`, `pathAt`), speed planned for the bends ahead, stop/pass for the rally car, walking pace + people step aside (`h.dodge`), steer into the gap past parked cars (measured from the path, slows until lined up), back up and retry when pushed against something, squeeze through after 8 s blocked. Leaving: on forward to a street 120–320 m away if one exists (`exitRoute`), else back the way it came after a multi-point turn (`turnAround`, `clearAt`). Tractor chases a point along its field pattern (a shove just puts it off course). Drivers only nudge people, never knock them.
    - **Soft people**: knocked people take ~0.85× the speed of what hit them (not 2.4× the closing speed), fly low (vy ≤ 4) and slide/tumble to a stop (5.5 + 1.2·v m/s²). Hit square by the front of the rally car above ~20 km/h they fold onto the bonnet (`h.ride`, lying back against the windscreen) and come off when the car brakes (off the front), turns hard (off the outside) or after 0.45–1.05 s (off a side); above ~70 km/h they go up the screen and over the roof and drop behind. Someone already lying there is tossed aside, not bulldozed. Throw distances (t_soft): 30 km/h ≈ 7 m braking / 15 m not braking; 50 km/h ≈ 12 m / 14–24 m; 80–110 km/h over the roof ≈ 9–13 m (was 40–75 m).
    - Firefighters drop the hose when knocked over: it lies on the ground from the engine to where they let go. Hoses are two segments (coupling → ground → hands).
    - Ambulance heads for where the patient ended up, not where they were hit. Medics kneel (legs behind) and slide along walls to get round houses.
    - Perf: vehicle physics ≈ 0.004 ms per step; humansUpdate ≈ 0.45–0.6 ms (cheap change-key before the height lookup, reused grid lists).
    - Tests: t_soft (throws), t_rideshot (bonnet/roof screenshots), t_drive2 (responders drive in, park, leave; `SEED=n` makes real.js runs reproducible), t_ramamb (rammed parked ambulance slides/turns), t_hose, t_physperf/t_prof2.
  - v7 (repo main, after "tee optimointikierros"): rendering and per-frame work. The look is unchanged. Batching and the bus
    merge were checked pixel for pixel in the same page; the fused scenery was checked against the old build.
    - Measured on the same seeded lap (640×360), old → new:
      - GL draw calls per frame 866–1155 → 438–609.
      - Shadow pass 472–622 → 165–256.
      - Vertices 5.4–6.1 M → 3.9–4.8 M.
      - Logic (loop without render) 0.97 → 0.79 ms/frame.
    - **Draw batching** (`BATCH`, runs as `scene.onBeforeRender`). These meshes are batched:
      - plain-coloured meshes under lifeGroup, the buses and the responders: MeshStandardMaterial with no map, no emissive,
        not transparent, and a geometry shared by ≥ 2 meshes.
      - Covers people's limbs and heads, grills, bikes, mowers and so on.
      They are drawn as one InstancedMesh per geometry (+ roughness/metalness/side/shadow flags) with instance colours.
      - The originals stay in the scene graph, posed and shown or hidden as before. They sit on layer 1, which no camera draws.
      - After three.js updates the matrices, the shown ones are copied into the instance buffers.
      - A batch is uploaded only when something in it changed.
      - Any add/remove/clear anywhere triggers a rescan (the Object3D prototype is patched).
      - Kids' rigs now use shared geometry (lbox/lgeo), so they batch too. A new prop batches automatically if it uses
        lbox/lgeo/lmat.
      - To keep a mesh out: `userData.noBatch`.
    - **Merger.fuse**: scenery groups in the same 160 m chunk whose materials differ only in colour share one mesh. The colour
      is baked into the vertex colours.
      - Example: 6 wall colours, 6 roof colours, 5 spruce greens, 4 leaf greens → one draw each.
      - DRAPE_ALL keys stay apart (they are re-cut and draped vertex by vertex).
      - `geometry.userData.parts` lists [key, first vertex, count].
    - **mergeGroupMeshes**: the same idea for one rigid model. A bus is now 13 meshes (was 47).
    - Ground drawn as 10×10 tiles of 116 m. Normals come from the whole sheet, so the seams match. The camera now draws only the
      tiles in view instead of 673k triangles.
    - Skid marks fade in the vertex shader. Each segment has a birth-time attribute and runs on its own clock, `U_MARKT`. Only
      new segments are uploaded (before, 2 × 216 kB went up whenever marks were live).
    - Particle systems skip the loop and the upload when nothing is alive.
    - HUD: the needle and its soft shadow are pre-rendered sprites (no per-frame shadowBlur). DOM text is written only when it
      changes.
    - A person's AO blob no longer follows their sway (it was recomputed every frame for every spectator near the car).
      humanStep returns early for people standing still.
    - **Adaptive resolution** (`adaptResolution`, `RES`):
      - Under ~48 fps for 2 s of racing → pixel ratio −0.25 (never below 1).
      - Back up after 6 s of headroom, but not to a ratio that was too slow in the last minute.
      - Never triggers in tests (fixed 1/60 steps).
    - Burnt-out vans, buses, the tractor and fire engines now char their own paint: each material gets a darkened copy, and the
      lamps and beacons keep theirs. This replaces the translucent black box that showed as a box over the vehicle.
    - Seeded runs don't reproduce the old build's random details (yard cars, tufts, tyre colours). three.js uuids draw on
      Math.random, and the build creates a different number of objects. Compare builds on things that aren't random.
    - Tests and tools:
      - `t_gl` counts real GL calls (shadow pass included), `t_draws` gives per-object counts per pass, `t_upl` shows buffer
        uploads per frame, `t_logic` times logic.
      - `prof.js` is a CPU profiler (logic only: SwiftShader shades vertices on the CPU, so render timings are meaningless there).
      - `real_noraf.js` loads the world without animation frames (deterministic static shots).
      - `t_batch` (run with real_noraf.js) diffs batched against unbatched rendering.
      - t_audit stitches the ground tiles, and its "m:" rows skip meshes whose world matrix isn't at the origin. t_yard reads
        the fused parts.
  - v8 (after "uusi objekti PITSERIA … pihaan pysähtyy 5 s → tuodaan pitsaa → auto 10 % nopeammin"): a new editor object, 🍕 Pitseria.
    Antti places it himself; the lot's front (the editor's triangle) goes to the street.
    - Lot 16 × 20 m (`pizzeriaLayout`). An 80s red-brick building (11 × 7 m) sits at the back: green fascia, red-and-white
      awning, a PIZZERIA sign on the fascia and PIZZERIA painted on the roof for the high camera. An asphalt yard with three
      parking bays is in front, plus a red "P" pylon.
    - Only the building is solid; the yard is driveable. No verge tufts or edge posts on the yard (`inPaved`).
    - The roof plane rises with the building's own anchor (`userData.liftAnchor` in liftWorld).
    - `PIZZA` / `pizzaUpdate` (called in worldUpdate): while racing, the car standing still (< 0.7 m/s) in a yard →
      - the pizza guy (white shirt, red cap, pizza box) walks out of the door to the car window on his side.
      - After 5 s of standing he hands it over: `PIZZA.k` = 1.1, "🍕 PIZZA! auto +10 %", 🍕 +10 % under the timer.
      - Drive off early and he takes it back in; stop again and he comes back out.
      - He is a temp Human (knock him over → ambulance, no pizza).
      - One pizza per run. Restart clears it (`pizzaReset` in worldReset).
    - The boost: the engine term uses accel × k and maxSpeed × k. With the linear drag this is exactly +10 % shove and +10 % top
      speed (152 → 167 km/h; 81 → 90 km/h after 2 s from the grid).
    - Test: t_pizza (places one beside the start straight: leave early, deliver at 5.0 s, boost, restart; pizza_yard/pizza_top.png).
  - Editor saves now use the `yl-osm-antti-v14*` keys. The old v13 saves came from an editor with a smaller map (2000 px wide;
    the current one is 2227 × 1540), so they didn't line up. They are left in place, just not read. There is a new
    **Palauta oletukset** button: streets, track and objects go back to the repo version.
  - Antti's placement is now in the editor defaults (INITIAL_OBJECTS): the pizzeria at map px (1298, 409), th −6.545, on the
    corner where the route turns off Ylästöntie. Its yard opens onto the track.
    - The way in (12 m in front of the lot) is kept clear (`inPaved`): no tyre stacks or crowd there (`addStack`/`addPerson`
      skip it), no trees, and no garden items from the neighbouring plots (`freeSpot`).
    - t_yard shows onCar 1 (a sandbox at 449,−42) with SEED 1. The previous build gives the same, so it is random and not the
      pizzeria.
  - v9 (after "tulokset ja haamut nettiin … 3 hitainta, sitten 3 seuraavaa … nimi … top 10 alkuruutuun"): an online leaderboard and
    online ghosts on https://suomiralli.netlify.app/. Netlify auto-deploys from this repo's main.
    - Server: `netlify/functions/api.mjs`, a Netlify Function (v2, routes /api/top, /api/ghost, /api/lap) storing data in
      Netlify Blobs (store `suomiralli`).
      - Files: `top/<track id>.json` (the leaderboard, one row per driver) and `ghost/<track id>/<driver>.json` (one file per
        ghost).
      - The track id is an FNV hash of the game's trackSignature(). A changed track starts a new leaderboard; the old one stays.
      - A lap is kept only if it beats that name's best.
      - Sanity checks: the samples cover the whole time at 20/s, end on the time, and never exceed 100 m/s.
      - The root `package.json` pulls in @netlify/blobs (node_modules is ignored).
    - Game (`ONLINE`, `onlineRefresh`): the top 10 appears on the menu and under the result.
      - Ghost ladder: with no time of your own you race the 3 slowest. With one (your local best or your name's best) you race
        the 3 just faster; already first, you race the chasers. Nearest first: the split deltas compare with `ONLINE.opp[0]`.
      - Rivals are drawn orange, green and violet with their name and time floating above (`nameSprite`, always on top).
        Your own best stays as a fainter blue "sinä".
      - At the finish: a name box (prefilled from localStorage `ylasto1988-nimi`). Enter saves; the key guard in the keydown
        handler means typing never drives or restarts. The reply gives the rank, or "ei parannusta".
      - No /api (file://, the editor's ▶ Pelaa rata, an artifact) → offline, exactly as before.
    - Follow-up ("alkuruudussa ei näy muita aikoja … hiiren osoitin ei näy … ei 'sinä'"):
      - Online, every ghost comes from the leaderboard. Alone on the board, the ghost is your own best under your name.
      - The local "sinä" ghost is gone; offline your own best still shows, unlabelled.
      - The menu says what's going on: rivals on track, "ei haamuja vielä", or "tulokset eivät nyt saatavilla" when /api
        doesn't answer.
      - Ghost labels show the name only (no time). The name fades out when your car is within ~8 m and is gone under 2 m.
      - Fix (a friend's lap was refused with "ghost does not cover the lap"): the game samples the ghost on its own frames once
        50 ms have passed, so 30 fps gives one sample per 67 ms and a 144 Hz screen one per 56 ms. The server wanted ≥ 90 % of
        20/s. It now takes anything down to 2/s, but refuses a ghost that starts late (> 1.5 s) or has a gap over 1.5 s. Real
        driven laps at 60 and 37 fps checked.
      - Esc (`toMenu`) drops the race and goes back to the start screen, which refreshes the leaderboard. On the results screen
        it does the same; in the name box it only leaves the box. The menu says "haen ajajia…" while the leaderboard loads.
      - The mouse pointer shows on the menus (`#overlay { cursor: default }`); it is hidden only while driving.
    - Ghost cars are now one baked geometry (`ghostGeometry`/`makeGhost`): 2 draws per ghost instead of ~60.
    - Tests: `test/serve.mjs` serves the repo plus the real function over an in-memory store; `t_online` (run with
      `node real.js http://localhost:8787/ t_online.js`) seeds 5 drivers and checks the ladder, the ghosts on track, the name
      box, the rank, a slower lap not kept and a cheat refused. real.js takes http URLs and has `__pageshot` (the whole page,
      menus included).
  - v10 (after "lisätään sekoilua … lapset tappelee, katolla korjaushommia, pihalla auto savuttaa, metsässä koiran kanssa, kentän
    laidalla katsojia, K-kaupan pihalla jono … meidän perusmalleilla"): `lifeExtrasBuild()`, run in worldBuild after staticBuild.
    Everything below is a Human with a task (knock-over, the ambulance and restart come for free). `clearSpot`/`plotSpot`/
    `spreadPick` pick free places near the route.
    - Kids scrapping (`fightTask` with kid rigs) in 3 yards, each with a ring of 3–5 kids bouncing and waving (`kidCheerTask`).
      Kids now have arms: `makeKid` has a full rig, so fists, handlebar hands and arm swing when running.
    - Roofers on 4 pitched roofs (`rooferTask`): kneeling on the slope near the eaves and hammering in bursts, with a ladder at
      the eaves below them and a stack of roofing on the ground. Sometimes a mate holds the ladder and shouts up
      (`ladderTask`). If the house catches fire the roofer jumps (knock from roof height → ambulance).
    - Smoking cars in 4 yards: an EMITTER riding on the Vehicle (`E.v`, `E.end`), from whichever end has room to stand at. The
      owner is bent over it and straightens up now and then to scratch his head (`fixTask`).
    - 4 dog walkers in the woods (landClassAt === 1): out and back along a 4–10-point path, stopping when the dog finds
      something (`walkerTask`).
      - The dog (`makeDog`, a rig whose "arms" are its back legs) trots round the owner on a red leash (a stretched lbox) —
        `dogTask`.
      - `Human({ animal: true, r })`: a knocked dog lies down but gets no ambulance.
    - Fans along both touchlines of the sports field (`fanTask`, crowd instances): they follow the ball, stand up for a goal
      and jump.
    - The K-shop queue (`EXTRA.queue`, `queueTask`, `queueUpdate`): 6–8 people along the shop front.
      - Every 5–10 s the one at the front goes in (inside) and comes out 6–14 s later.
      - They wander off, then rejoin at the back.
      - `lifeExtrasReset` restores it on a restart.
    - Test: t_mischief (counts, the queue cycling, a knocked dog, a burning roofer, close-ups mis_*.png). The world update is
      now ~0.5–0.9 ms/frame (was 0.4–0.6).
  - Version history on the start screen, bottom right: the last 10 of `CHANGES` in src/game.html, newest first, one line each.
    Every change adds a line (the rule is in CLAUDE.md). Hidden on screens under 1000 × 620.
  - v11 (after "mietitään 10 muuta sekoilua … kaikki muut paitsi 7"): mischief set 2, the "MORE MISCHIEF" module
    (`lifeExtras2Build` / `extras2Update` / `lifeExtras2Reset`; set pieces with props that move on their own register an
    updater in `X2.upd` and a restart hook in `X2.reset`; places are reserved in LIFE_PLAN with `x2: true` and a radius `r`,
    which clearSpot now respects).
    - Hobby horses (`horseTask`): 2 rings of 3–5 girls galloping round with two little jumps, resting to pat the horses.
    - Carpet beating (`beatTask`): 3 racks, a dust puff through the carpet on every whack, a breather now and then.
    - Moped boys (`mopedTask`): 2–3 on each of up to 2 side-street stretches ≥ 16 m off the route (`streetStretches`,
      Chaikin-smoothed `polyLine`), back and forth with U-turns (`laneStep`), blue two-stroke smoke. The rally car roaring past
      within 9 m at > 12 m/s: a wobble, or one goes over on his own and gets back on (no ambulance); hit by it → ambulance.
    - The postman (`postTask`): Posti blue, orange panniers, stops at mailboxes placed by the houses along his street; knocked
      over, 14 letters flutter down (`flyLetters`, `X2.flying`).
    - The ice-cream van (`VSPEC.icecream`, `iceVanAI`): drives between streets with driveAlong (destinations 100–340 m away,
      away from the route, not into dead ends, preferring no turn in the road), stops 24–40 s and plays a tune; 6 kids come
      out of the yards round the stop, queue at the hatch and go off licking cones (`iceKidTask`).
      - Steep 8× relief: accel 8 so it climbs.
      - Blocked: it sells where it is and remembers the spot (`V.blocks`).
      - It never parks on the route (ghosts past instead). Its own bumps don't count as damage, only the rally car's.
    - Laundry (`laundryTask`, `laundryUpdate`): 3 lines. The sheet blows off (every 25–85 s, or when the car passes within
      16 m at > 14 m/s) and she chases it, picks it up and pegs it back.
    - Midsummer (`partyTask`): a kokko (EMITTER kind 'kokko' + glow sprite), a bench, a crate and 6 swaying singers. Every
      40–90 s one staggers into a bush and lies there face down (no ambulance).
    - 2 loose yard dogs (`yardDogTask`): they chase the rally car barking for up to 7 s; the owner runs after them waving
      (`dogOwnerTask`) and kneels by a dog that got hit.
    - Badminton (`badTask`, `badUpdate`): 2 courts. The shuttle flies in arcs; 15 % are missed and fetched and served again.
    - `makeBike` (shared with the kids' bikes), `handProp` (a prop in the right hand), `roadLift` (asphalt is ROAD_Y up).
    - Test: t_mischief2 (counts, the van's stops and queue, mopeds and the postman moving, the dog chase, the faller, a knocked
      postman's letters, reset, close-ups mis2_*.png). World update still ~0.5–0.95 ms/frame.
  - v12 start screen (after a mock-up from Antti): rally stripes + checkered flag, heavy italic Saira title, red stage stamp,
    and a loud "HAETAAN TULOKSIA…" with a spinner and shimmering placeholder rows while the leaderboard loads (a smaller
    "päivitetään tuloksia…" under the old list on a refresh, a red line if the fetch fails). Test: t_menu (page shots).
  - v13 police + road textures (after "jos pelaaja kolaroi 3 kertaa … poliisit alkavat jahdata … tekstuuripäivitys"):
    - POLICE module: `policeIncident` is called when the rally car knocks a person over (boxHitsHumans) or starts a fire
      (a house, or a vehicle it hit). Pile-ups within 4 s count once, and incidents only count while RACING.
      - 1/3 and 2/3 are shown on screen. The 3rd brings 2 cruisers (`makePoliceCar`, VSPEC.police with `drag`) from 90–200 m
        back along the road graph, and every further incident adds one more (max 3).
      - Chase: `policeAI` follows the road graph using one shared Dijkstra from the car, refreshed every second. It goes
        straight for the car when it's within 45 m and the line is clear, slows for bends from their radius, and backs out
        of walls.
      - Bust: a cruiser within 8.5 m of the car stopped (< 2.5 m/s) for 1.2 s. The car is then held for 7 s
        (`POLICE.hold` → updateCar brakes) while an officer walks to the driver's window. After that they drive off and
        the counter resets.
      - Escape: all cruisers > 450 m away for 10 s ("PÄÄSIT KARKUUN"). They also give up at the finish.
      - Siren shared with the responders; HUD badge `#police-hud`.
      - Police and the ice-cream van take no damage from their own scrapes, only from the rally car (vehicleHit), so a
        chase doesn't end in a self-inflicted fire.
      - No time penalty: that would break the online ghost check.
      - Test: t_police.
    - Roads: `roadDetail(mat, gravel)` is an onBeforeCompile pass on both road materials (strips, joint discs, corner
      patches and asphalt decor share it, so the seams match). In world space it adds:
      - a second texture sample at another scale and angle, cross-faded by slow noise, so the tile doesn't visibly repeat
      - broad and mid-size light/dark variation
      - on asphalt: warm/cool stretches and newer darker spots; on gravel: damp patches and pale loose-stone drifts
      - Gravel texture redrawn: a sandy bed with ~14000 small pebbles (sand, granite, quartz), each with its shadow.
    - Kerbs: the edge points are smoothed twice, and each segment is a Catmull-Rom curve, so bends are round instead of
      faceted.
    - Spill: the gravel grit and asphalt crumbs on the tarmac are finer.
    - Tests: t_roadlook / t_roadlook2 (junctions, the sharpest bends' inner kerbs, a gravel mouth).
  - v14 fixes and blocked corners:
    - Cabbage rows and hill tyre stacks blinking: fitInstanceBounds stored the bounds on a geometry that all four cabbage
      patches share, so three of them were frustum-culled. Every fitted InstancedMesh now gets its own geometry wrapper over
      the same buffers. Stack chunks also get their sphere at the lifted height. Test: t_cabbage (every instanced mesh's
      sphere holds its instances).
    - Inside corners (after "sisäkurveihin traktoreita ja renkaita ettei voi oikaista"): in buildTrackTires, for every bend
      with curvature > 0.28, every straight cut from just inside the kerb 3–14 points before the apex to 3–14 after that
      saves ≥ 6 m and has nothing solid across it gets a wall of stacks along it. A street through the corner stays open.
      Sharp bends (> 0.36, ≥ 50 m apart, up to 8) also get a parked tractor (`CORNER_TRACTORS` → Vehicle kind 'tractor',
      no ai, mass 40) on the bisector. Open cuts: 13 of 24 corners before, 3 after. Test: t_cuts (+ t_corners views).
    - Police hold: handbrake only (the brake at a standstill is reverse; the held car used to back away).
- Lesson: from the default high top-down camera (≈55° down, ~50 m up) relief barely reads; plinths, hillshade and the low camera show it.
- Ghost key `ylasto1988-haamu-korkeus-v1`; track signature includes terrain source, so laps on other ground don't mix.

## How to add something to the world (v5 pattern)
- A new kind of person: write a task `(…) => ({ kind, update(h, dt, t, near), knocked?(h), reset?(h) })` and `new Human({ x, z, yaw, rig: makeAdult(…) | inst: outfitIndex, task })` in worldBuild. Collision, knock-down, ambulance and restart come for free.
- A new vehicle: add its VSPEC row and `new Vehicle({ kind, x, z, yaw, hw, hl, view: { kind: 'mesh', g } | { kind: 'inst', c }, axle, ai? })`. Driving physics, shoving, damage, fire and fire engine come for free; an `ai(v, dt)` sets `v.ctrl` (setPath + driveAlong for road routes, steerToward + speedTo for anything else).
- A new solid thing: add a box in staticBuild. A new emergency: a DISPATCH entry + spawnResponder branch + a crew task.

## How heights work ("build flat, lift once")
- World is built with Y()=0, then `buildHeightField()` + `liftWorld()` + `worldBuild()`; afterwards Y()=H() for all runtime users.
- Height grid 2 m (581², world ±580). Raw heights → box blur ×3 (σ≈7 m) → lakes levelled → pads (pitch levelled, kallio plane fit) → road corridors (flat across road + 1.5 m, smoothstep ramp to hw+11, weighted blend) → lot terraces (outside corridors) → light final blur (σ≈1.6 m).
- H() interpolates on the ground mesh's own triangles (2 m grid) → drawn ground == H exactly.
- Lift rules: origin meshes drape per vertex (triangles >3 m subdivided); Merger objects rise rigidly by anchor (begin/end footprint → max ground), vertices y≤0.05 drape; DRAPE_ALL keys shear-drape every vertex; buses stand on 4 wheels; verge tufts tilt; positioned objects +H; flat positioned meshes >1.5 m baked+draped.
- Tests (korkeus/test): t_audit.js, t_cars, t_yard, t_roads, t_houses; v5 world: t_world, t_fire, t_amb2, t_shove, t_knock2, t_rush2, t_grass, t_medic, t_fireshot, t_wshots, t_perf2, t_calls3; full-lap physics, flying start, ghost, phase tests pass. runall.sh runs a list two at a time.

## Real elevation model (pending upload)
- Source: MML Korkeusmalli 2 m, GeoTIFF, EPSG:3067 (tiedostopalvelu or kartat.kapsi.fi).
- Needed area TM35FIN: E 383 500 – 385 550, N 6 683 550 – 6 685 700 (download neighbouring sheet too if split).
- Georef fitted from OSM streets: editor px → TM35 affine [[0.7885, -0.02506, 383660.2], [-0.02494, -0.7926, 6685276.3]], median residual 0.3 m → 1 editor px ≈ 0.79 m real, 1 game unit ≈ 1.75 m real.
- Importer dem/import.py: samples to 4-unit grid (≈7 m real, area-averaged), heights relative to median as Int16 cm → `HEIGHT_RAW`. `--scale` = vertical factor. Antti wants strong relief — pick --scale so relief is comparable to the 8× placeholder (~50 m) unless told otherwise.
