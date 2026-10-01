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
  - Car radio (v15): music/playlist.json lists the songs ([{ file, title }], files in music/). They play in turn through the game's
    audio mix (gain 0.5), starting at a random one on the first race and running across restarts. E steps to the next song;
    after the last one the radio goes off, then back to the first.
    - The amber LCD at the top right shows the song number and title (a long title slides to its end and back); an "E radio"
      key hint appears.
    - No playlist, no radio (e.g. inside the editor).
    - Test: t_radio (over test/serve.mjs, with a temporary music/ folder of wav tones).
  - Radio v2: 20 made-up stations (`STATIONS`), each at its own frequency, and a random one for every song. The LCD shows the
    frequency, the station, a volume bar and the song title (playlist entries have `title` and `artist`). 1 / 2 set the
    volume (0–10, remembered in localStorage). Test: t_radio3.
  - Bass boost (B):
    - A kick drum at 118 bpm, and a lowshelf on the radio (+16 dB below 140 Hz).
    - The car is held to 20 % of DRIVE.maxSpeed.
    - Spectators within 75 m run to spots beside and behind the car (not in front of its wheels) and jump on the beat
      (`BASS.pulse`).
    - B again turns it off and they walk back home. A reset turns it off.
    - People knocked over by a crowd rushing the car don't count as police incidents.
    - The keys are listed on the start screen (`#keys`).
    - Test: t_bass.
  - Lesson (bit three times this session): a `//` comment added in the middle of a one-line function swallows the rest of
    the line. Put mid-line comments in `/* */`.
  - v16, set 3 (after "uutta toimintaa 1.–10. … tee nämä kaikki huolella ja käytä olemassaolevia systeemejä"): the "SET 3" module
    in game.html (before lifeExtras2Build). Built by `lifeExtras3Build()` after lifeExtras2Build and before crowdBuild; run by
    `extras3Update(dt)`; reset by `lifeExtras3Reset()`. Everything uses the existing parts (Human tasks, Vehicle + VSPEC, STATIC,
    FIRES, DISPATCH, POLICE).
    - Moose (6, `mooseTask`): big animal Humans (r 0.9, `h.big`: never onto the bonnet) in the woods 25–110 m from the route.
      - They graze and wander; now and then one crosses the route (a point 14 m past it).
      - On a road with a fast car within 34 m, one may freeze and stare.
      - Hitting one tears off two parts and halves the car's speed. No ambulance, no police.
    - Bear (1, `bearTask`): in the woods or on open ground 20–90 m from the route. It moves somewhere else every race.
      - It rears up on its hind legs now and then.
      - Run over by the rally car: `policeSpawn(10, 360)` (policeSpawn takes a max distance now) and POLICE.n = 3.
    - Post van (`postvan` VSPEC row, `postVanAI`): drives between side-street stops using iceRoute.
      - iceRoute now reads V.dMin / dMax / dAim; the van uses 60 / 220 / 120.
      - At each stop the postman walks to the wall of the nearest house facing the van, posts a letter and walks back.
      - Knocked over: the letters fly, and the van carries on without him.
      - Its own scrapes don't wreck it (vehicleHit list). A watchdog stops it getting stuck, and it never parks on the route.
      - t_s3_post: 7 stops and 5 deliveries in 5 minutes, never closer than 30 m to the route.
    - ES at the K-shop (`ES`, `esUpdate`), the pizza pattern:
      - Stand still for 3 s in front of the shop, 2.4–14 m out from the wall, clear of the queue. The shopkeeper brings a can.
      - Then 40 s of double engine pull and top speed (`esK` in updateCar), and the bass kick plus the radio lowshelf.
        bassUpdate runs while `BASS.on || ES.on`; the ES version has no speed cap and no crowd rave. `#es-hud` counts down.
      - Any real hit meanwhile wrecks the car. That is carDamage ≥ 3 m/s (walls, cars, tyres, rock, moose) or knocking a
        person down.
    - WRECK (`wreckCar('es' | 'boom')`): the rally car becomes a pseudo-vehicle RV
      (`{ kind: 'rally', view: { kind: 'mesh', g: carGroup } }`), so the fire code treats it like any vehicle.
      - startFire({ vehicle: RV }) brings the fire engine; the car chars after 12 s.
      - The driver (a temp Human in white overalls) is thrown out of the driver's door and hurt, so the ambulance comes.
      - The car is held (like POLICE.hold) and stops dead, even on a slope. `#es-hud` turns red: "R = uusi lähtö".
      - The reset un-chars it (charVehicle(RV, false)) and repairCar restores the parts.
    - Costume olympics (`buildOlympics`, `olyTask`, `olyUpdate`): 8 friends in costumes on a compact stage.
      - Costumes: viking, king, top hat, bunny, clown, pirate, superhero.
      - The stage is beside the sports field (FIELD_GAMES[0]): along a touchline or beyond a goal end, off houses, the
        pitch and the road.
        - The front wins: every metre beyond 35 m from the route costs a point, and so do the trees on the stage (trunks ×6).
        - Fans standing there make room.
        - On the default track the goal end faces the route with only ~10 m to spare, so the stage goes on a touchline near
          that end, 27–37 m from the route.
      - Events rotate: sprint, javelin (it flies and sticks in the ground, then gets fetched), sack race (hopping).
      - The phases line → go → cheer come with a whistle and an air horn. The rest cheer and jump.
    - Grandstands (`buildGrandstands`, `standTask`): one by the finish line (16 m) and one by the K-shop (12 m).
      - Each has four tiers, a roof and a concrete footing that hides a slope, and faces the route.
      - The site is chosen by `placeGrandstand`: off roads, landmarks, the ES zone, tyres, cars, trees (`treeNear`), and at most
        1.6 m of slope. It scores for the fewest trees. If nothing fits it tries looser rules, then a stand 3 m shorter.
      - The stand is a static box (`addStaticBox`: a solid added after staticBuild). ~90 instanced spectators stand on the
        tiers (`pose.dy`) and jump when the car passes.
    - Cabbage → tractor (`cabbageUpdate`, `tractorChase`): each cabbage patch is remembered in CABBAGE (its instance matrices
      too).
      - Plants the car's box goes over are squashed flat, with bits of leaf. After 4 of them the nearest working tractor
        chases the car.
      - Chasing tractors use TRACTOR_MAD (vmax 15, about 40 km/h). They go straight at the car when it can be seen
        (clearLine) and otherwise follow the police's road-graph tree (`chasePath` + policeFollow). They back off walls.
      - The farmer shakes his fist (seatedTask). The chase ends after 45 s or 200 m back.
      - The reset restores the plants and the tractor.
    - UFOs (`buildUfos`, `ufoUpdate`): two, at the west and the east end of Ylästöntie (`ufoEnds`: the road's
      west-most and east-most points; without that road, the route's own ends).
      - First choice: 20–55 m on past the road's end, ≥ 40 m from the route, no tree within 10 m (then 7.5 m), 16–50 m
        from a street node so the ambulance can come.
      - Woods all round (the east end is dense forest): it comes down on the road's dead end itself, which has no trees.
      - The two aliens are placed off roads and static boxes only. clearSpot never let them spawn, because the UFO's own
        reservation covered their spots.
      - Each has a tilted silver disc, a dome, blinking rim lights, a crater, debris, smoke, and two aliens (animal Humans).
      - The dome charges for 0.9 s, then a green beam fires. The rally car is shot within 46 m (`wreckCar('boom')`: parts fly off).
      - Only after that (`U.woke`) does it turn on responders: ambulances and fire engines within 90 m whose job is within
        110 m of it, police chasing within 70 m, and crews within 46 m. Up to 6 per UFO per race.
        - Before the woke rule, the east UFO (82 m from the route) shot ambulances coming to an ordinary crash on the route,
          and their wrecks blocked the lap (t_lap SEED=3 stuck).
      - It looks for a target 5× a second (a human-grid scan every frame cost 0.1 ms).
      - A shot responder (`ufoWreck`) burns and its crew is thrown out, hurt. Its job phase becomes 'wreck', which DISPATCH
        doesn't count against the two-at-a-time limit. Its patients and its fire are re-sent after 5–6 s.
      - Responders stuck in 'leave' for 75 s are removed, so wrecks can't lock the queue.
      - One still in 'drive' after 60 s with < 90 m to go parks and the crew walks the rest.
    - People in the road (`ROADIES`, `roadieTask`): a pool of 26 instanced Humans, placed each race at 2–4 random corners
      (curvature ≥ 0.45, not near the grid or crossings), 3–7 per corner.
      - A person is only placed where there is a way off the road (`roadieEscape`): a spot 4.5–9 m past the edge, ≥ 4 m
        from every part of the route, reached by a straight run clear of tyre stacks (≥ r + 0.7), walls and cars
        (`runClear`). The shortest run on the nearer side wins. A corner where fewer than 2 people fit is skipped for another.
      - The stacks are checked straight from `tires`: forStaticNear's grid is stale or unbuilt when a race is set up (it
        once let escapes run into the corner tyre walls).
      - They react when the car is closer than speed × 3.6 + 14 m, then run 5.6–7.4 m/s. If held up, they run the other way.
      - Once well off the road they stop. They walk back when the car has gone.
      - t_s3_roadies: 0 of ~80 hit in 6 autopilot laps (SEED 1 and 3), closest pass ≥ 5 m.
    - The rock (task 10): the kallio hill is solid for everything.
      - `rockSolidAt` returns the height, except where it is clamped under streets as the mesh is. `rockOut` gives the way
        out and the depth.
      - The car checks 10 points round its body (`CAR_ROCK_PTS`, bumper height 0.42 m) instead of its centre, and is pushed
        out if a turn swung a corner in.
      - Vehicles check nose, middle and tail (0.5 m); people check at 0.7 m.
      - The loose boulders at the rock's foot are now static boxes (`ROCK_BOULDERS`, kind 'rock').
      - t_s3_rock: 8 directions, never more than 0.42 m into the rock; boulders and a police car stop too.
    - Minimap: off the course the car is held at the map's edge and drawn hollow. It used to vanish past the route's
      bounding box.
    - Tests: t_set3 (smoke), t_s3_animals, t_s3_post, t_s3_es, t_s3_show (olympics, stands, cabbage/tractor), t_s3_ufo,
      t_s3_ufo2 (7-minute chain log), t_s3_roadies, t_s3_rock.
      - Run them with `s3run.sh outdir t_s3_…`, which puts s3_shot.inc (step + camera shot helpers) in front of each test.
- Lesson: from the default high top-down camera (≈55° down, ~50 m up) relief barely reads; plinths, hillshade and the low camera show it.
  - v17, people (after the concept sheets + the 1988 line-up; "tanakat mittasuhteet, vaatteet 1988-kuvasta", Gouraud):
    - BODY (game.html, before makeAdult): one low-poly body per size (adult 1.75 m = 4 heads, kid 1.2 m = 3 heads), ten rigid parts
      posed in the vertex shader (legs, knees, arms + spread, elbows, head nod), smooth normals (body2Normals, crease 50°).
      Per person 8 numbers (`h.look.c`): shirt, pants, hair, skin, shoes, accent (packed RGB), sel = hair + hat·16 + top·256 +
      bottom·4096 + extras bits·65536 (bits 0–7 only: stays exact in a float), shape = width·100·1000 + belly·100.
      Wardrobe pieces are gated in the shader (hidden = folded to a point). Tops: 1 collar 2 tracksuit 3 knit 4 denim 5 cardigan
      6 dress 7 overalls 8 uniform 9 coat 10 firefighter 11 rally 12 tank 13 post bag; hats 1 cap 2 flat cap 3 police 4 helmet 5 post.
    - Looks: `lookCivil(kid, shirt, pants, hair, o)` picks a random 1988 cut (o.sel fixes it: roles), `lookCrowd(geo)` for the old
      crowd outfits (16 = marshal). `makeAdult/makeKid(…, o)` return `bodyRig`: an empty group with four joint pivots at the body's
      joints, for props (`handProp` → forearm end, that elbow kept straight) and `headGroup(rig)` for old-size hats (mapped ×1.5).
    - Drawing: `humanSync` writes `h.bm` (matrix) + `h.bp` (pose); `bodyFill(cam)` (scene.onBeforeRender) packs everyone in the
      camera frustum (+3.5 m for shadows) into 4 InstancedMeshes (adult/kid × near/far LOD, 30 m). Sitting/kneeling poses get
      +0.18 m (kid 0.08) because the old poses were made for longer legs. Moving people walk automatically (pose.walk from speed).
    - LODs (phase 4): body2Geometry(S, lod) 0 full (568 tris shown, < 22 m), 1 square sections, no eyes/stripes/collars (260,
      < 80 m), 2 a dozen boxes (120; hat box gate 600 = any hat, slot 14 = hat colour), 3 the shadow caster (72, 0.9× slim).
      body2Finish welds corners into an index (vertex work ÷2–3). The LOD is picked by on-screen height (BODY.px = [34, 13] px:
      f·height/distance, f from the canvas height and fov), so big screens get LOD0 from the game camera. Colour LODs have castShadow off; the two lod-3 meshes cast
      the shadows and skip their colour draw (count 0 in onBeforeRender, which the shadow pass doesn't call).
      t_gl's kB counts whole arrays on WebGL2 (three passes array + offset/count), so it overstates partial uploads.
    - Grandstands have no roof any more (the crowd shows from the game camera).
    - One set of bump rules for everyone (after "pyöräilevät lapset menevät kaikkien asioiden läpi"): humansUpdate treats a person
      as moving if their velocity is set OR their task moved them (x/z changed since last frame: h.px/h.pz), so teleporting tasks
      bump too. Houses/rocks everywhere; `humanBump` (within 130 m of the car, and the first 2 frames: `settle`, nudges people
      out of what they were put down in) adds tree trunks, YARD_SOLID (woodpiles, posts, swings, bushes, flower beds, flagpoles,
      garden trees, filed in buildScenery), vehicles (boxPush) and other people (the mover gives way). Exempt: task.through
      (roofer, grandstand), task.onRoad() (moped riders, the postman while riding: they move with their vehicle).
      Bike kids are steered by velocity now; the bike follows the kid. t_bump counts overlaps per task kind (should be {}).
    - Human fields are all created in the constructor (one hidden class): humansUpdate 1.5 → 1.1 ms.
    - Animals and aliens keep their own meshes (aliens on `makeKidOld`). The old crowd meshes (personGeos) remain only for tyre-prop people.
- Radio: music/playlist.json also holds 10 spoken programmes (radio-ohjelma-1…10.mp3, `talk: true`, 🎙) and 6 sports broadcasts (11…16, `talk` + `sport: true`, 🏆, on SPORT_STATIONS). radioLoad puts each into its own random gap between songs (never two in a row); they play on TALK_STATIONS (YLE Radio 1 etc.).
- Corner cutting (27.9., after "poista huijari ANDE, katso mistä hän oikaisi"): the game judges it itself. CUT (before updateCheckpoints):
  off the road (> 3 m past the edge) the route gained (arc length by car.prog) and the metres driven are summed; back on the road, a
  gain > 12 m over the driven distance flags the lap: finishRace keeps no best, no ghost, offers nothing to the leaderboard,
  shows 'mutka oikaistu — aika ei kelpaa'. t_cut: honest autopilot laps (also a wild one, 3 seeds) stay valid, a straight cut is flagged.
  t_cuts lists where the route can be cut round the obstacles (biggest ≈ 59 m: route points 220–292 and 180–248 between
  checkpoints 1 and 2, 544–612 after checkpoint 4). API: STRUCK now keeps a struck ghost under struck/<track>/<k>.json
  (GET /api/struck?sig&k). Huijari-Ande 84.834 struck: his ghost cut four corners (17–21 s −72 m, 41–42 s −31 m,
  55–60 s −22 m, 72–75 s −24 m). Ande 85.373 was struck by mistake (a clean lap) and comes back via RESTORE. t_strike.mjs tests it (node).
- Server-side cut check (27.9.): build.py also runs test/export_track.js in the headless page and writes netlify/lib/tracks.mjs
  (per trackId: sig, route x/z, road widths; older tracks kept). api.mjs `routeCut(s, T)` replays the ghost with the game's rule
  (off > 3 m past the edge: route gained vs metres driven; a cut = gain − driven > 15 m having been > 8 m out; the game uses 12 m / 8 m)
  and refuses the lap (400 'cut'). All 19 laps on the board pass (0 m); Huijari-Ande's scores 72 m. A track the build didn't
  export is not checked. The 8 m rule came from slow laps slipping 4–7 m over the inside of sharp corners (10–16 m "gains").
- Start-screen counters: POST /api/start {id} per startRace (browser id in localStorage 'ylasto1988-id', crypto random — not
  Math.random, which would change the seeded world; at most one per 3 s), GET /api/stats → { starts, drivers } shown as
  'ALOITETTUJA AJOJA · KUSKEJA'. stats.json + players/<id>.json markers. No counts existed before: it starts from an estimate
  (STATS_SEED 700 starts / 45 drivers: 19 names on the board, most drivers never save one). t_strike.mjs covers both.
- FREE (GTA) mode (27.9., "lähtö vasemmasta laidasta, suoraan varikkoviivan yli = kisa; oikeasta laidasta rata häviää → GTA"):
  buildGridBox puts the grid box in the LEFT lane (gridLeft/gridLane; resetCar too), paints a dashed pit line down the middle,
  a start line across the left lane 13 m ahead (START_SPLIT) and the words KISA / VAPAA AJO / GTA. startSplit() (before the clock)
  judges the crossing: left of the middle → the race as before; right → freeEnter(): kerbs, checkpoints, grid, finish hidden,
  every tyre stack off (t.freeOff), no phases, no laps; HUD 'VAPAA AJO'. startRace/toMenu → freeExit() puts it all back
  (applyPhases(true)). Every street was already tarmac (roadGrid holds the whole network). t_free: left lane = race,
  right lane = FREE, 900 m street legs on the road graph with nothing of the track in the way, R restores.
  Then: widenStart() makes the route 4 m wider round the grid and the split (6.5 → 10.5 m, tapered; the server's tracks.mjs
  widths follow on the next build); the lane words are canvas text in a heavy sans at true proportions (KISA / GTA + VAPAA AJO);
  grandstands half full; sausageCart(S) in front of each stand (seller + 2–3 buyers, grill smoke); start screen badge
  #news 'UUTUUS: GTA-MOODI' (italic, red star).
  FREE roads (after "korjaa tiet kun koristeet menee pois"): the route's own tarmac (buildCornerPatches: fans/strips/discs under
  route corners, which also carry the widened start; userData.routePatch) is hidden in FREE, and buildFreeFillets() (built flat
  with the network, lifted with it, key 'freeFillet', shown only in FREE) gives every road-graph junction rounded corners
  (radius 1.2·hw + 2.5 ≤ 8 m, smaller at sharp angles) with a shoulder; gravel if either street is gravel. The road materials
  draw front faces only: fan triangles are wound to face up.
- Camera (27.9., "auto alemmas ruudussa ja hiukan ylöspäin, vain hiukan"): high view h 45→43, behind 25→21 m, look-ahead 8→15 m
  (+0.2·v): the car sits at ~76 % of the screen height instead of ~64 %, pitch 54° → 50°. The low (C) view unchanged.
  Then (after "vauhdissa auto menee keskelle ruutua"): the follow lags v·0.527 (position) and v·0.434 (look point) behind, so both
  targets lead by that much; look-ahead 17 + 0.1·v + camAdj, where camAdj slowly steers the car to 78 % of the screen height but
  always ≥ 8 % above the gauge cluster (its top measured once a second), only while the camera has caught up (not after a restart).
  t_camspeed: car height on screen at 0/36/72/108 km/h (1600×1200: 0.78 at all; 1000×700: 0.71, held above the cluster).
- ES promotion (27.9., "ES-markkinointitempaus K-kaupan pihaan, tölkki, kajarit, musaa"): esPromoBuild (from buildEs) puts a draped
  ES STOP box in the zone (park there → the can, as before), a giant turning can, two speaker stacks that pump with the kick, a
  banner 'ES ⚡ ILMAISEKSI!' and two dancing promoters (esDanceTask). esPromoUpdate synthesises a 124 bpm beat (kick, off-beat hat,
  sawtooth bass) through its own gain, louder within 120 m. ES fragility: carDamage wrecks on ES only from 12 m/s into
  something (was 3), and running someone over no longer wrecks it.
- Feature audit (27.9., "feature tarkastuskierros, huolella"): all test groups rerun (race core, online/menu/radio, world and people,
  events, perf, pictures). Fixed: policeFollow steers round vehicles ahead (parked cars stopped the cruisers; bustAt now ~74 s);
  roadGraph: dead ends now join the nearest node of another stretch up to min(8, max(5, hw + 3.5)) m away (OSM stopped two streets
  5.1/5.3 m short, at [374,55] and [-28,-186]: the police took a 936 m detour and got stuck behind the fire engine; 3 → 2 components);
  policeTree seeds Dijkstra from every node within nearest + 30 m of the car (distance × 1.5), so an off-road stop is reached by the
  nearest street, not only the nearest node's; rgDijkstra takes a node or [node, start] pairs.
  mooseTask crosses the road instead of walking along it; walkTo gives up after 4 s without progress (wgx/wgz/wbest/wT in the
  constructor); drawMinimapFree shows every street in GTA mode; onlineGhostsUpdate skips ghosts without a mesh; serve.mjs sends
  content-length (talk programmes had duration Infinity locally). Tests updated to current rules (t_ghost gridLeft, t_mischief2 path
  length, t_batch keeps bodyFill; its last ~10 px are instanced-vs-plain edge rounding). t_audit_shots: pictures of the new things.
- Languages (28.9., "englanti optioksi… JA norjan"): FI · EN · NO buttons top right on the start screen, L cycles in the menu,
  stored in localStorage `ylasto1988-kieli`. Finnish is the source text: T('suomeksi', a, b…) looks it up in I18N (fi → [en, no]),
  fills {0} {1}…, and falls back to the Finnish. Static HTML carries data-t (applyLang keeps the Finnish in data-fi). The start-split
  road paint (KISA / GTA VAPAA AJO) repaints via userData.relang. Street names, shop signs, radio and the change log stay Finnish.
  A NEW player-visible text: write it through T() and add its line to I18N. t_lang: no Finnish left on the menu/HUD in en/no.
- Hay bales (28.9., "paalit pellolla ei ole fysiikalla"): buildScenery only records BALES (was merged scenery); baleInit (after
  liftWorld) makes two InstancedMeshes (14-sided body + darker ends). balesUpdate in the physics step: the car (carBoxPush vs two
  circles on the axis) gives a 400 kg bale an impulse (car keeps ~72 %, carDamage at 0.7× the closing speed, off-centre → spin);
  it rolls across its axis (friction 1.1/s, rolling resistance 0.7 m/s², downhill only when steeper than that) and hardly slides
  along it; stops on trees, STATIC boxes and other bales. worldReset → balesReset. t_bales (109 bales, none drift at rest).
- GTA traffic (28.9., "autot ja bussit ajamaan katuja pitkin", 15 + 3): freeEnter → trafficStart picks 15 kerbside cars (on a
  network street: nearest graph node < 7 m; spread ≥ 20 m, nearer the player first) + the 3 buses and gives them trafficAI; freeExit →
  trafficStop puts them home with no AI (the race never has traffic). trafficRoute: Dijkstra from the nearest node on setting off,
  later always ON from the route's end node (V.ids) and never back along the last edge — the remaining path is kept, so no stops.
  trafficAI on top of driveAlong: follow (v.follow skipped by driveAlong's go-round, v.vCap = gap rule), oncoming (only MOVING ones,
  path-relative lateral clearance → v.swBias keep right + crawl ≥ 1.5 m/s: a hard stop deadlocked two facing cars), junction give-way
  (nearer / already in it goes; ≤ 7 s), bus stops every 280–500 m on wide roads, watchdog (ghostT, then a new route), hoot().
  Found on the way: driveAlong looked only ~20 m ahead for parked cars (fine at 8 m/s, not 13): reach grows with speed; speedTo now
  brakes when rolling backwards (a car backed out of a jam rolled 40 m downhill in reverse). Cost ≈ +1 ms/frame in GTA mode only.
  t_traffic: 80 s, all 18 moving (≈ 500 m each), no long stands, no fires.
- Start-screen radio (28.9., "alkumenuun radio… vuoden 85 autoradio… ei tarte pelaa"): #mradio in #menu-content, 'Ylästö Sound
  CR-85' (CSS only: chrome knobs, amber LCD, rubber keys). Power knob = radioPower (start / pause / resume, wheel = volume), tune knob
  and ▶▶ = radioNext, ◀◀ = radioPrev, − + = radioVol; E / 1 / 2 now work in the menu too. mradioShow is called from radioShow and
  radioLoad (shown only with a playlist, i.e. on the site). The race carries on with the same song. Found: radioShow's local
  `const T` shadowed T() (turning the radio off with E threw), and the cabbage tractor's `const T` too — renamed; t_mradio.
- UFOs rework (28.9., "ufo aina tien päässä… ampui kun kisasin… ampuvat paljon ohi… ihmisiä tulee paikalle… VASTA jos pelaaja menee
  sinne"): placed ≥ 85 m (fallback 70) from the route, 30–100 m past Ylästöntie's ends (now 158 / 247 m). ufoWake only when the car is
  < 60 m AND (FREE or > 25 m off the route) — never from the race line. Awake: up to 16 idle people within 230 m get gawkTask (run
  there, stare, point; flee when a bolt lands near; reset restores their own task). ufoFire: a real plasma bolt (additive sphere +
  green trail, 38 m/s) at the target's predicted spot ± spread (car 11 m, people 7, cars 8; 12–22 % dead on); the first 5 at the car
  always land ≥ 5 m off it. ufoBoom: car < 2.2 m → wreckCar('boom'), < 7 m shoved + dented; vehicles → fire (responders via
  ufoWreck); people < 3 m knocked (→ ambulances → shot at too). Targets weighted: car 3, responders 3, cars 1.2, people 1; fire every
  0.35–1.25 s. t_s3_ufo: never woken from the route; a standing car lasts ~6–7 s with ~10 near misses.
- UFO follow-up (28.9., "osuma ei saa tappaa kerrasta… se KUOPPA… näyttää hyvältä törmäys"): ufoHitCar — a direct hit throws the car
  (9 m/s), spins it, knocks parts off (two carDamage hits), '👽 OSUMA! n/3'; the 3rd wrecks it (UFO_HITS, reset by ufoReset). The crash
  site is makeCrater: a ragged lathe bowl (rim ~1 m, low where the furrow comes in, heaped opposite), a 40-row furrow along the clearest
  of 16 directions (ufoFurrowDir, up to 30 m): dark trough, lumpy fresh-soil berms, torn turf outside, wandering a little; 34 clods;
  a draped radial scorch decal. All vertices laid on Y(); the UFO nose-down into the far wall, the furrow behind it. t_ufo_crater.
- GTA dressing (28.9., "gta tilassa renkaita varastoon talojen pihaan… siivo k kaupan… isompi mainostus"): freeYardTires(true) pushes
  ~100 tyre stacks (yard: true, mostly worn black, some race red/white) in rows of 2–5 along a wall of 30 random houses (off roads,
  trees, cars, other boxes) and rebuilds the prop instances — real, knockable props; false removes them. freeKshop(true): the K-shop
  grandstand's whole build (buildGrandstands records S.built: objs, static boxes, humans, emitters — boxes moved 1e5 away, people
  inside, grill smoke under ground; NEAR_VIS honours userData.hide) goes, and esGta(true) shows ES.promo.gta: an inflatable arch,
  a stage with four more dancers (h.stageDy), eight feather flags, a billboard — each placed by fits() (no road, tree, house, car),
  the can ×2.1; the beat reaches 190 m (120). t_gta_yard.
- ES pad + pizzeria sign (28.9., "es mainos pitää olla maassa musta… pitseria katolla parempi mainos"): the ES STOP plane is a solid
  black MeshStandard pad (canvas filled #121212) — no ground through it. The pizzeria's roof carries a lit steel-framed sign (canvas
  'PIZZERIA / MAMMA MIA · YLÄSTÖ', a drawn pizza, emissive 0.35) and a two-faced 3D pizza that turns (PIZZA_SIGNS, pizzaUpdate); the
  group rides the building with liftAnchor like the painted roof text. t_signs.
- Pause, sticker, GTA map, finish area (28.9., "TULOSTAULU maalin lähelle… pienempiä katsomoita… varikko asfaltilla… minikartta
  kahteen… Pause P… PC PELI 486"): P → setPause (loop only renders; audio ctx suspended; the radio paused/resumed; also on a hidden tab;
  only P/R/Esc work paused; #pause box). #pcnote sticker on the start screen (3 languages). drawMinimapFree: cached at 2× (280 px),
  drawn centred on the car, pizzeria dot too. buildGrandstands: three small (7 m, ~28 % full, no sausage cart) round the finish (the
  K-shop keeps index 1). buildFinishArea: finishLot() (an open level lot facing the route) → the scoreboard (canvas, top 5 from
  ONLINE.list or your ghost, redrawn from renderTop10 when it changes) and the service park 26×13 m (near the finish, else by the grid
  or along the route): draped asphalt, box lines, three teams (canopy, makeRallyCar with its number, spare tyres, toolbox, a mechanic
  on fixTask), the post van painted as the service van. t_pause, t_finish_area. (t_logic 1.35 → ~1.67: the machine, not this — HEAD
  measured the same.)
- Tyres (28.9., "traktorinrenkaita… parantaa mallia kaikissa renkaissa"): tyreLathe(R, W, seg) — rounded tread with staggered block
  ribs, bulging sidewalls, the bead going in to the rim (lathed round Y like a cylinder); ltyre()/ltractorTyre() share them via lgeo.
  All vehicles (the rally car, bus, police, ambulance/fire, post and ice vans, pit cars) use it; tractors get tractorTyreGeo (the tyre
  + chevron lug boxes, N = R·20). carKit keeps the parked cars' wheels out of the 10 cm vertex clustering (it made chevrons of them)
  and uses a 12-segment copy (tireGeoLow/rimGeoLow). Barrier stacks: 4-point rounded tread per tyre, still 10 segments, a block-tread
  texture. buildTractorTyres: 12 white tractor-tyre flower beds in front yards, a pile (2–3 flat + one leaning) by each tractor.
  Vertices 3.44 → ~3.7 M (fewer draw calls). t_tyres.
- Concrete pigs (28.9., "renkaita vähentää… betoniporsaita… estämässä oikaisuja"): the inside-corner short-cut walls and the
  side-street mouth barricades are rows of betoniporsas (kind 'pig' in tires[], PIG_GEO = a bevelled trapezoid extrusion 1.3 m, grey
  speckled PIG_MAT, 5 tones; instanced per 80 m chunk in buildPropInstances; r 0.64, 1.32 m apart end to end). propHitByCar: the car
  is pushed out (not the pig), bounces (1.25 × the closing speed back), carDamage ×1.15; a pig's kick 0.08, friction 10; vehicles
  bounce off them; people are kept off; GTA hides them with the tyres. Outer-corner walls and the phase gates stay tyres.
  Tyres 5989 → 3734 (stacks 1869 → 1181), 991 pigs; vertices ~3.7 M → 3.48 M. t_pigs.
- Pig depots (28.9., "siirrä betoniporsaat varastoon gta moodissa"): freeYardTires(true) → freeDepotPigs(): three council street
  depots (DEPOTS, found once per world, ≥ 140 m apart, 9–14 m off a street, level, clear): a draped gravel pad 14×10, 32 pigs as real
  props (yard: true, removed with the yard tyres), a decorative second layer of 7, a 'VANTAAN KAUPUNKI · KATUVARASTO' sign. t_depots.
- Share QR (28.9., "alkuruutuun qr koodi… nuoli. KERRO KAVERILLE!"): #share top-left of the start screen (in the flow under 820 px):
  a static inline SVG QR (segno, version 3-Q, https://suomiralli.netlify.app/ — checked with OpenCV from page screenshots at 700,
  1280 and 1920 px), a hand-drawn yellow arrow, 'KERRO KAVERILLE! / ota kuva ja jaa peliä' (3 languages).
- Start screen at all window sizes: checked 15 viewports (360×640 … 2560×1440) for overlaps/h-scroll/off-screen with a bounding-box script; the share QR goes static in the flow ≤1100 px (was 820 → hit the title at 1024) and gets 44 px top margin ≤560 px (clear of the absolute FI/EN/NO buttons).
- 28.9. quick check (t_lap, t_start, t_phases, t_ghost, t_traffic, t_gta_extras, t_pause, t_s3_ufo) → start screen gets a green "✔ 28.9. TESTATTU: PELI SKULAA – jos ei, niin voi voi" stamp (#okstamp under #pcnote, FI/EN/NO). Update the date when re-checking.
- Pigs lengthwise (28.9., "betoniporsaat väärinpäin… tien suuntaisesti ei tarttis noin paljoa"): an inside corner with any open cut now
  first gets ONE row of pigs end to end along the inner kerb (w/2 + off1, yaw along the road) over the span of all its open cuts
  (cuts carry k0/k1); only a cut that row leaves open (street mouth) still gets the old across-the-grass wall. 991 → 542 pigs,
  open ≥8 m cuts 23 → 9 (t_pig_walls: counts them, shots of the pig-heaviest corners). Watch: a mid-line // swallowed stackCol.
- UFO sites (28.9., "ufo laskeutunut talon päälle"): ufoRoom(x, z, r) = no BUILDINGS rectangle within r and no static box
  (> 0.8 m) within r; site r 16 → 13 (search widened to 3200 tries / 160 m), the dead-end fallback 13, the furrow path 5.
  The east end (among the yards at ~470,190) used to land 0–10 m from sheds. t_ufo_site (8 seeds, top-down shots).
- UFOs just landed (28.9., "laitetaan vaan että se on laskeutunut… ei mitään viivaa"): makeCrater and ufoFurrowDir are gone
  (with the furrow smoke, debris and the "still smoking" emitter); the saucer stands level at a random yaw on three straight legs
  with feet (leg feet at r 3.0, y −1.78): y = max(highest foot ground + 1.8, highest ground under the disc + 1.0). Bolts leave
  from U.y + 1.2. ufoRoom still keeps 13–16 m from buildings. t_ufo_crater still names it a crater (shots of the site).
- ES STOP pad (28.9., "es kyltti menee maan sisään"): half of it lay on the gravel street in front of the K-shop, whose surface is
  drawn over it. esPromoBuild now fits it (5.6/5.0/4.4 deep, slid toward the shop and sideways up to ±6 m) where no sample is
  onRoad(·, 0.4): ES.padA/padB; esZoneAt's near edge follows padB. Verge tufts/lupins under the pad are zero-scaled. t_es_pad.
- Weather on the radio (28.9., "sääradiot"): music/saatiedotus-1…3.mp3 (2.4 / 3.5 / 2.4 min) in playlist.json with `talk` + `weather: true`;
  shown with 🌦, tuned to WEATHER_STATIONS (94.3 + k·1.4 MHz). Titles are made up (the clips weren't transcribed). 19 talks in 25 gaps.
- Test broadcasts (28.9., "11 koelähetystä, oma kategoria"): music/koelahetys-1…11.mp3 (14–47 s), `talk` + `koe: true`, 📡, KOE_STATIONS
  (106.2 + k·0.6). radioLoad: 30 talks > 25 gaps, so the koes get their own random gaps (one each at most) and play just before any
  programme sharing it; the long talks still never meet. t_radio_saa checks the weather ones and that rule.
- Gig bus (28.9., "bassoboost päälle → metsähevisukkahousunaamameikkibändin keikkabussi… LIIAN kovaa… ei mikään pysäytä"): HEVI.
  B on (heviBass) → heviUpdate spawns it as soon as gameState is RACING (so B in the countdown works; retries every 3 s): a node
  110–230 m off (mostly behind), pointed down its trafficRoute. VSPEC.hevi mass 60, accel 9, vmax 36, lat 11. heviAI: own follow
  (no stopping for anything), corner speed at HEVI.grip 0.95 × tyre grip (it slides), dead end → fresh route (≤ 1/s), stuck 2.2 s →
  back out 1.6 s; 3 jams without 3 s of real speed → respawn out of sight. Unstoppable: vehicleHit ignores it, pigs and small statics
  (hw/hl < 1.6: poles, signs) don't stop it, boxHitsHumans knocks people (no police: not the player). makeHeviBus: black bus,
  HAVUHELVETTI canvas logo (sides + back), red-lit windows, roof speakers, 4 headbangers on the roof (2 pantyhose, 2 corpse paint).
  Audio: 200 bpm blast beat + distorted tremolo power chords + formant screams every 1.6–3.4 s into HEVI.g → StereoPanner; gain
  0.95·(1 − d/140)², Doppler on the pitched parts; the radio ducks up to 92 % while it's near. B off → HEVI.leave: gone at > 170 m or
  > 70 m unseen. Restart: bass off, temp → removed. 5 seeds × 2 min: avg 44–72 km/h, max ~100, off the path 5–15 s. t_hevi,
  t_hevi_tune, t_hevi_audio (real audio: gain ~0.85 alongside, 0 after).
- ES pad back in front of the door (28.9., "missä es juomapiste on? pitäis olla kaupan edessä"): the fit-off-the-street search
  slid it to the shop's corner. Now fixed at a 0, b D/2 + 5.8, full 5.6 deep; draped with + ROAD_Y where onRoad(·, 0.2), so its street
  end is paint on the street surface instead of disappearing under it. (ES.padA/padB kept for esZoneAt.)
- Grass tufts (28.9., "ruohot näyttää mustilta lätkiltä"): two causes. The canvas texture's see-through pixels were black (dark
  fringes when filtered/mipmapped) → a DataTexture whose clear pixels carry the grass colour; and DoubleSide flipped the up-facing
  normals on back faces, so the far side of every blade plane rendered black → each face twice (both windings), FrontSide. t_tufts.
- Havuhelvetti, round 2 (28.9., Antti's logo + "bass boost → auto 75 % nopeudella… joskus gta moodissa muutenkin… auto vois hyppiä"):
  HEVI_LOGO = his logo as a 640×436 grey JPEG data URI (~51 kB → index ~1.0 MB); heviLogoImg() loads it once, the side canvas
  (2048×500: logo 'lighten'-drawn in the middle, spruce skyline, KUOLEMAN KIERTUE -88 / YLÄSTÖ · TIKKURILA · TUONELA either side)
  and the back one repaint on load; emissiveMap 0.3 so it reads at dusk; the side windows are gone (blacked out). Bass speed: the
  existing bass-boost crawl cap (0.2 × DRIVE.maxSpeed) is now 0.68 × — 75 % of the ~148 km/h the car really reaches (t_bass: 112 vs
  148 km/h; I first read "75 %" as +75 % — that would have needed the lap voided; it doesn't now). Hop: BASS.hopV = 3.4 m/s on every
  other kick when on the ground (0.56 m, visual only: carGroup y + BASS.hopY; integrated in bassUpdate even when off, so it lands).
  GTA visits: without the bass, HEVI.freeT (first 90–210 s, then 150–300 s) → heviSpawn, HEVI.visitT 60–110 s, then leave. t_bass.
- Havuhelvetti, round 3 (28.9., 5 mp3s + "levypiste isonmännyn viereen… sen jälkeen radiosta vain havuhelvettiä… jäsenet dokaavat
  metsässä, siinä niiden banderolli"): music/havuhelvetti-1…4.mp3 (his 2 and 3 were the same file), playlist `hevi: true`,
  artist Havuhelvetti, titles made up (Havujen herra, Tuonelan tervaskanto, Kuusikon kutsu, Ylästön yö). radioLoad keeps them off the
  normal radio (RADIO.hevi). The bus: heviSong() plays them through one <audio> → MediaElementSource → HEVI.g (distance gain, pan),
  preservesPitch off + playbackRate = Doppler; paused when out of earshot; the synth is only the fallback (no playlist: editor, file://).
  LP stall (buildLpStall, after buildEs): the 'manty' landmark (one, at ~375,71) → nearest road round it → stall on the verge facing
  the road (table, 5 LP sleeves with the logo, "LEVYJÄ 30 MK" board, static box), the seller (makeHeviMember: headGroup face —
  even k pantyhose with the toe flopping on top, odd k corpse paint; long black hair, black clothes). Stop still within 6 m of the
  road point by it: lpUpdate sends him to the window (pizza pattern), LP.WAIT 3 s → lpDelivered → radioLp(): RADIO.list = the
  Havuhelvetti songs, station 'HAVUHELVETTI – LP' at 33⅓, 🤘. LP.got stays for the session (R keeps it). Behind the pine (8 m, away
  from the road): 3 members drinking round a yellow crate (bottle in the right hand, a swig every few s, horns up now and then,
  swaying), empties in the grass, the banner (logo, 4.4 m, on two poles). heviCanvasMat(w, h, draw) now shared by bus/stall/banner.
  t_lp, t_lp_radio (over serve.mjs: 4 songs, none on the normal radio, all after the LP; the bus plays havuhelvetti-*.mp3).
- LP booth + start screen (28.9., "myyntipiste huomattavasti isommaksi, banderolli siihen; UUTUUS HAVUHELVETTI HEAVY PÄNDI PELISSÄ;
  qr ja kerro kaverille päällekkäin; pienempi ennätyslistan fontti"): the stall is a 5.8 × 3.1 m booth (e + 2.4 back from the road):
  4 posts, black canopy, the logo banner (5.6 × 1.26) across the front at 1.8–3.0 m, a 4.8 m counter with 16 LPs, a 3 × 7 record
  wall, cabinet speakers at both ends, a price board by the road; static 2.95 × 1.45 + the speakers. The seller stands behind the
  counter (b −0.3; he walks round it, ~10 s back). #news: 'UUTUUS: HAVUHELVETTI – HEAVY PÄNDI PELISSÄ' (the GTA hint kept in the
  small line), font clamp(15px, 2.4vw, 28px), max-width 86vw, more margin (the rotated box touched the title); #share static in the
  flow up to 1380 px (the longer news reached it at 1280–1360); .sh-txt margin-bottom 14 px (the QR covered "JAA PELIÄ"); #top10
  font clamp(11px, 1.45vw, 16px), 600 px wide. v.js at 14 sizes: no overlaps, no h-scroll.
- Havuhelvetti, round 4 (28.9., "maassa havuhelvetin logo; käännä myyntipiste rataan päin; paranna isomäntyä; äijät kuin uudet
  ihmiset, nyt laatikkoukkoja"): the booth now faces the RACE ROUTE (roadInfo of the pine → that track point; u = pine → it):
  centre at hw + 1.3 + 4.9 + 1.5 back from the centreline; between it and the kerb the logo painted on the ground (6.8 × 4.6,
  canvas: rgb white, alpha from the logo's luminance, draped, polygonOffset; tyre stacks on it get t.off + t.lpOff, gate tyres
  left alone). Statics are the counter, the back wall and the speakers (moved out to a ±3.75) — the old one box over the whole
  booth had the seller inside it; lpSellerTask walks him round the counter end (a ±2.95) both ways, and delivers only at the
  window (< 2.6 m from the car). The pine: 5 tapering segments (grey furrowed below 8.4 m, orange above), a root flare and 5 roots,
  7 boughs from 9 m (golden-angle azimuths) each with two flat needle tufts, a broad flat top. The gig bus's band: the old box
  figures are gone; 4 Humans (makeHeviMember, 2 with red guitars) sit on the roof via h.seat {v, a, b, y: 3, tilt, yaw} — humanSync
  now honours seat.tilt/seat.yaw/P.dy — and heviRoofTask rocks them to the beat, keeping h.x/z on the bus (else 'far' hid them);
  they are v.crew, so they go with the bus. t_lp (booth facing, props on the logo, the walk), t_hevi (roofBand 4).
- Havuhelvetti ground + heavier pigs (28.9., "logo teille päin, isompi koju, banderolleja joka suuntaan; betoniporsaat 2× painavampia
  kuin renkaat, ettei IHAN stoppaa"): booth 8.4 × 4.4 × 3.6 m (6 posts, canopy, front banner 8.2 × 1.8 + one down each side, 7 m
  counter with 24 LPs, 4 × 10 record wall, 2.3 m speaker stacks at a ±4.95), centre hw + 6 back from the centreline, tyres under
  it cleared (t.lpOff); statics: counter, back wall, speakers; the seller's way round uses LP.stall.lane/front/behind/cw/cf. The
  ground logo is now ON the route at the track point (≤ 8.4 m, ×1.35 of the width), top towards the booth. Banners (LP.banMat,
  poles, DoubleSide): two along the route each way out behind the tyre walls (tried at 8–40 m and 4.6–8.2 m out till free: not on a
  road/building/booth/pine, 7 m apart), one angled out at each side of the booth, one round the pine's trunk; the woods one stays.
  Pigs (propHitByCar): split the push 50/50 with the car, kick 1.05 (it gets going — a 0.55 kick left it in front and the car pushed
  it along the road at 13 km/h: t_lap went 150 → 217 s), a sideways slew to the side it was hit on, back 0.75 of the closing speed
  for a real hit (> 3 m/s; 0.2 for a nudge), friction 6 (tyres 3). t_pig_hit at 15 m/s: tyre stack → 7.4–9.5 m/s kept, pig →
  1.7–4.2 (it moves 1–4 m). t_lap back to 150 s.
- Junctions (28.9., "korjaa radat ja tie risteykset, näkyy gta moodissa, ettei mikään vilku, käytä aikaa"): all in buildRoadNetwork,
  and ONLY for drawing — R.pts0 (the geometry as it stood) is what sideRoads.pts, roadGrid/onRoad/surfaceAt, route snapping, the road
  graph and the houses use, so the course (track id 3e1d147c, 1083 points), grip and ghosts are unchanged; R.pts (drawn) is reshaped:
  2b a paved end still lying ON a gravel road (the "curving target" join ran the tarmac to the gravel's centreline: the slab across the
  gravel ending mid-road in the screenshot) is cut to the gravel's edge like the square-on case; 2c a street ending on another of the
  same surface (a T) is cut to that street's edge, no disc (its own shade/disc no longer shows in the middle of the other road);
  both kinds of cut end then have their last row slid along the street onto the other road's edge (conform: 0.25/0.35 m in), so the
  joint follows that road's line; 2d end-to-end continuations (ends ≤ 2.5 m apart, often overlapping and offset sideways, e.g.
  Hiirivuorentie 6.5 m → Isonmännyntie 8 m) are both pulled back 5 m and rejoined by one Hermite curve through a shared midpoint;
  both strips end there on the same mitre row (a round disc join if the bend is > ~20°), widths eased to the mean over 20 m and
  asphalt shades eased to a common value over 14 m. DRAWN (drawnPut/drawnPaved: the drawn tarmac by segment) keeps asphalt decor and
  the gravel spill off gravel that used to be under a slab. Also found while here: three mid-line // comments that silently disabled
  code (the new mitre — it threw and cut the network build short; a road-distance check in the finish-area lot search; a static check
  in the grandstand lane search) → /* */. Checks: t_junctions (+ t_jn_route2 / t_jn_other: all 32 junctions from GTA height),
  t_flicker + flicker_cmp.py (each chase view rendered twice, camera nudged 2 cm: no road blotches in 16 views — only dithered
  foliage), t_roadlook in race mode, ghost times identical (129.972 / 118.157 / 144.414).
- Menu radio smaller (29.9., "alkuruutu on aika täysi, pienennä radiota"): #mradio 560×137 → 400×86 px — knobs 54 → 32 px, keys in one row
  (◀◀ ▶▶ KANAVA − + ÄÄNI), smaller LCD fonts. (The "76 px" knob measured before was the 54 px tune knob's rotated bounding box.)
- Houses (29.9., "tarkista ja paranna talot"): the curtain panel was centred on walls whose long axis is local z, so those windows read as a
  "T"; windowAt() now draws frame, glass, a glazing-bar cross, a valance, two side curtains and a sill via onWall(t, n, nAlongZ, …).
  Gable ends get 1–2 windows (not behind the rintamamiestalo porch, porchSide). The front door goes on the long side facing the nearest
  side-road sample, in one of six door colours (doorMats), with a narrow door window and a flat canopy. White corner boards on board-clad
  walls. alongX is now w > d (square houses: walls consistent with the roof ridge along z). ≈ +8 % scene vertices.
- SET 4 (29.9., "tehdään actionia lisää"): in src/game.html before lifeExtras3Build.
  - Hot-air balloons (BALLOONS, buildBalloons): two, lathe envelope (16 gores, canvas texture), wicker basket, ropes, burner; 20–130 m
    from the route, drift 0.45–0.75 m/s, 30 ± 9 m over smoothed ground (≥ 16 m), burner bursts (fireFx + roar), pilots are Humans on
    h.seat {v: B.sv} (seat0/task0 so worldReset reseats them), task 'pilot' (one waves at the car). Car within 65 m (re-armed past
    100 m): BALLOON_POP_P = 5 % chance one bursts (once per race): bang, envelope crumples, basket falls (≤ 16 m/s), lands (dust;
    on the car = damage), pilots knocked (hurt → ambulance), envelope reparented flat on the ground; the basket then takes the hay
    bale's collision numbers (imp = −rel·1.25, 0.72/0.28, carDamage −rel·0.7), sliding (exp(−2.2 dt)) instead of rolling.
  - Medi-Heli (buildMediHeli, X3.heli): openSpot 24–70 m from the route; boxy cabin, raked screen, MEDI-HELI decals, 4-blade rotor
    turning over slowly, tail rotor, strobe, skids, whop sound < 70 m; two static boxes. Patient (task 'patient', lying, chest bounces),
    three medics (task 'cpr': compressions ~100/min, bag, drip held up), four onlookers (task 'heligawk'), orange pack + defib.
  - Yard dogs: 4 (buildYardDog ×4, yards 7–16 m from the route, 110 m apart); chase when the car passes < 20 m at > 4 m/s. knocked by
    the rally car → yelp() + dogRunOver(): up to 9 nearest people within 45 m (not animals/temp/seated/responders, MAD_SKIP) get
    h.mad and run after the car shaking fists and shouting (madStep replaces their task for 11–16 s or until > 75 m, then walk back
    to where they were); message '🐕 KOIRA JÄI ALLE! NAAPURIT RAIVOISSAAN'. worldReset clears h.mad.
  - Flames: makeParticleSystem(max, additive, soft, atlas) — atlas mode uses a 4×4 procedural flame-tongue atlas (makeFlameAtlas),
    the rot attribute carries the frame (steps on over life). fireFx and flameFx2 use it (fires, boom, kokko); new emberFx for sparks.
    Fires: bigger tongues, 120/s, fireIgnite() whoomp burst on start, crackle bursts of sparks + pops, ground glow disc (f.floor),
    thicker black smoke. Tests: t_set4 (balloons/heli/dogs), t_heli*, t_fire2 (close-ups).
- Medi-Heli as a Vehicle (29.9., "mediheliä päin pitäisi voida ajaa kuin ambulanssia, samat säännöt"): kind 'heli' (VSPEC mass 2.4,
  always parked), hw 1.0 / hl 4.9, the model built round the box middle (inner group z +2.3); the static boxes are gone. Hits go
  through collideCarWorld → resolvePair/vehicleHit (≥ 11 impulse or 15 damage → fire → fire engine), charVehicle chars it, the rotor
  stops when burning; worldReset puts it back. New model: red belly + blue pinstripe, rounded roof, raked screen, chin windows,
  sliding-door seams, exhausts, tapered boom, end plates, drooping blades, skid toes, cross tubes, landing light, star of life decal.
- On foot (29.9., "testi että hahmo voisi poistua autosta"): WALK { on, h } before updateCar. F (RACING, < 3 m/s, not wrecked or
  pulled over) → walkOut(): a temp Human with the driver's look (h.player: always 'near', no ambulance when knocked — up again after
  2.5 s still), task playerWalkTask (arrows/WASD turn + walk 2.3 m/s, space/shift run 6.2, back 1.3; tethered to 200 m of the car,
  since the village's life/visibility is keyed to the car). updateCar treats WALK.on as held (handbrake, no input). updateCamera →
  walkCamera (6.5 m behind, 3.4 up, own shadow anchor). F within 3.8 m of the car → walkIn(); startRace/toMenu walkIn(true). t_walk.
- Walker stamina + fear (29.9., "kuski väsyy ja pelkää että auto varastetaan"): WALK.stam (run drains in ~6 s; walking +0.07/s,
  standing +0.14/s); at 0 → puff (1.4 m/s, hands on knees, panting, can't run until > 0.35); a bar over the HUD (walkBar). Fear past
  WALK_FEAR 90 m: walking away slows (to 40 % at the limit), sway, message; WALK_MAX 140 m hard limit with "EI USKALLA KAUEMMAS".
- UFO gunner + hijack (29.9., "ufoukko ampuu, yliajo → ufo on sinun, malli 20 m ylös, alla auto"): each UFO has 3 aliens
  (alienTask; k 2 has a ray gun via handProp). Awake UFO + player < 55 m: the gunner turns and fires small bolts (alienShoot: 30 m/s,
  first two wide, spread 3.5 m at the car / 2.6 m at a walker) into the same UFO_BOLTS/ufoBoom path (car hits count toward UFO_HITS;
  walker gets knocked, gets up). playerAt() = the walker when on foot: UFOs wake/target them too (dome less keen on walkers).
  An alien knocked with the rally car within 7 m (not on foot, RACING) → ufoCapture(U): static box removed (staticRemove), rising
  sweep, message; ufoCapUpdate lifts it over 3.5 s to 20 m above the car then follows (exp 5/s, leaning, spinning, bob), nearVis entry
  follows, an additive green beam cone down to the car. The car is still the car (physics, leaderboard unchanged). ufoReset →
  ufoCapReset puts it back on its legs and re-adds the static box. t_ufocap.
- Police station (29.9., "poliisiasema K-kaupan lähelle, poliisiautoja parkissa"): buildPoliceStation (first in lifeExtras3Build):
  a spot 22–140 m from the K-shop facing the nearest side street (≤ 26 m), clearSpot 8.5 + no trees/plots/roads over the 16×18 m
  lot, ≥ 14 m off the route. makePoliceStation: 13×8 m two storeys, ribbon windows, canopy, glass doors, roof sign (polSignTex),
  blue lamp, radio mast, flag, parking lines. Static box kind 'house' (wallTop 6.6: rammed hard it burns like a house, station: true).
  Three Vehicles kind 'policeP' (makePoliceCar, beacons off, parked nose-in); ramming one (impulse > 3) → policeIncident('crash').
  Two officers (task 'copchat': face the car when it's near, a finger raised at a speeder).
- Sauna party (29.9., "saunaporukka sauna-auton kanssa, möly, paksu musta savu"): buildSauna — openSpot 22–110 m (no trees, not in a
  yard), a new place every page load; van + sauna trailer are Vehicles (kind 'car', mass 1.6/1.3); props (crate, bench, bucket,
  ghetto blaster); seven Humans in towels (skin top, towel shorts, barefoot, bottles) with saunaTask: ring round the fire, swigs,
  whoops, hops; one at a time goes in (inside) 7–16 s, comes out steaming (steamPuff) and runs a yelling lap; car < 40 m at speed →
  all cheer and jump. Stove pipe: 16 black puffs/s (lifeFx, 7–11 s, to 9–13 m) while the car is < 420 m. saunaShout(): sawtooth
  "HUUU/JEEE" sweeps and ha-ha-ha bursts, more often the more are up, < 90 m. X3.reset brings anyone inside back out.
- Sauna smoke v2 (29.9., "pitkä ja kapea, eri sävyjä ja valo"): puffs rise 3.2–4.4 m/s, grow only to 2.6–4.4 m and live 9–14 s
  (a tall, thin plume leaning with the wind); each puff its own shade (black → grey, 30 % brownish). Light: a flickering glow sprite
  at the pipe (S.glow), sparks (emberFx) and small flame licks (fireFx); the trailer's windows glow orange (emissive).
- Sauna plume v3: 30 puffs/s (s0 0.9 m, rise 2.9–3.5 m/s, 8–12 s) so the column has no gaps; lifeFx pool 900 → 1300.
- Sauna plume v4 ("paljon kapeampi ja pidempi", with a sketch): its own particle system saunaFx (900, no rise, drag 0.02) so the
  wind carries it: 34 puffs/s, 0.42 → 1.7–2.6 m, up 3.0–3.4 m/s for 16–22 s (≈ 55 m tall), drifting 1.1 ± 0.35 m/s with the wind
  and a slow sideways meander (the ribbon bends and wiggles like the sketch).
- Police station yard (29.9., "asfalttipiha, poliisit tappelee juoppojen kanssa pihassa"): drapePatch() lays a 1 m grid over the
  terrain (Y + 0.05, polygonOffset) round the station, a = −8.5…8.5, b = −8…12, textured by polYardTex (grit, cracks, painted bays,
  yellow street-edge line, POLIISI AJONEUVOT). Two scuffles (buildScuffle: a drunk + 2 or 1 officers, task 'scuffle'): 'grab' —
  circling, the drunk flailing, the police shoving; 'loose' — he tears off staggering 4 m, they run him down; 'pin' — face down,
  officers kneeling on him 4–8 s; then up and again. Shouting (saunaShout) < 60 m. Knock any of them and that scuffle stops.
- THE BOMB (29.9., "kun koe 11 soi → ydinräjähdys, välähdys, 90 % kaikki pois, auto tänästyy, voi jatkaa ajamista"): NUKE in
  src/game.html before lifeExtras3Build. radioPlay() → nukeArm() when koelahetys-11 starts (not in the menu); 7 s later, if it's
  still that song and the radio is on → nukeBoom(): ground zero 520 m from the car, a white screen flash (HTML div, fades 2.2 s),
  rumble, a mushroom (nukeCloud: billowed icosahedra — rolled stem, cauliflower cap, skirt, dust surge, white-hot fireball; cools from
  emissive 2.2 to dirty grey-brown), a ground shock ring at 340 m/s. When it reaches the car → nukeHit(): the car flung 24 m/s away
  + heavy damage (drives on); all merged scenery (treeMeshes) and the verge tufts hidden; ~12 % of houses left as charred shells
  (one InstancedMesh of black boxes) that burn, 8 % of trees within 420 m as black leaning trunks; statics removed except those
  shells/rocks (staticRemove, saved); 90 % of people gone, the rest knocked (DISPATCH blocked while NUKE.on); 90 % of vehicles
  v.nuked (moved 1e5 away, hidden, skipped by AI/physics), the rest charred and burning; 90 % of lifeGroup props hidden (userData.hide);
  balloons burst; ground tinted 0x7a4c3a, roads ×0.55, brown sky/fog, orange light, a brown screen tint, ash falling round the camera.
  R (worldReset → lifeExtras3Reset → nukeReset) restores everything (statics re-added, materials, setTimeOfDay). t_nuke.
- YLÄSTÖN SANOMAT (29.9., "lehti päävalikkoon: pääominaisuus aina aukeama, uusin etusivulle, muut sivu, pienet puolikas"): LEHTI
  (src/game.html, before renderChangelog) = one entry per feature {id, size 'main'|'page'|'half', n (newer = bigger), kick, title,
  lede, body[], img[] (lehti/*.jpg), cap[], box}. lhPlan(): front page (newest main as the lead + the next three mains as teasers +
  a clickable index), the lead's spread (pp. 2–3), the other mains newest first (spreads), pages, halves in pairs, "Näin ajat", and
  CHANGES as "Lyhyesti" (paged by ~5000–5600 chars). Pages are 760×1000 HTML, scaled; viewer #paper: spreads (the front alone),
  one page at a time on narrow/tall screens; ← → / PgUp PgDn / wheel / swipe, Esc/Enter/✕ closes; while open a capture keydown
  handler eats every key (nothing reaches the game); photos load when shown (+ the next spread's). Start screen: #lehti-mini (the
  real front page, scaled by lehtiLayout to fit left of the centre column; if it doesn't fit (s < 0.24) → a "📰 LEHTI" button),
  #share fixed right-middle when body.lh-wide; #news, .subtitle, #pcnote and #changelog removed; the menu radio 320 px.
  Photos: test/lhrun.sh t_lh_a t_lh_b (+ t_lh_d retakes, t_lh_e ghost, t_lh_c menu radio/leaderboard via serve.mjs) → s3_lh_*.png →
  1000 px JPEGs in lehti/ (≈ 2.8 MB, published by Netlify next to index.html; the editor artifact can't show them).
  Adding a feature from now on: add its LEHTI entry (size + n) and its photo(s); a new 'main' with the biggest n becomes the lead.
- Paper as PDF (29.9.): build.py runs test/lehti_pdf.js after the build → lehti/ylaston-sanomat.pdf (39 pages, ~3.8 MB; NOPDF=1 skips it). It loads index.html, stops rAF, lays PAPER.pages one per 760×1000 page, turns data-go into #sN links (the index works inside the PDF), and bakes the photos' CSS sepia into JPEGs through a canvas (a CSS filter printed as raw bitmaps → 35 MB; needs --allow-file-access-from-files). The viewer's ⬇ PDF button links it (the published copy when not on http, e.g. the editor's test game). Story 'pdf' (half) with photo from test/t_lh_pdf.js.
- Paper pointer fix (29.9.): body has cursor:none (driving) and #paper sits outside #overlay, so the pointer vanished while reading → #paper { cursor: default } (t_paper_cursor).
- Paper layout v2 (29.9., after comparing with real tabloids / Harrower's modular layout): margins 50 px, a folio on every page (page no. outside, section, "torstaina 29. syyskuuta 1988"), byline, photo credit, drop caps, column rules, Finnish soft hyphens (lhHy: break before a consonant that starts a syllable) since justified narrow columns opened rivers. Pages are fitted once at lehtiInit (lhFitAll, offscreen .lh-measure): each .lh-frame measures its .lh-in; .fx photos grow/shrink between 0.36 and 0.8 of their width, then `tight`/`tighter` text, then a pull quote (data-q, from the story) ≥80 px, an ad (LH_ADS, not the photo of the story beside it) ≥150 px, and the small rest spread evenly into the gaps (.even). Halves: photo beside a text column whose headline grows as far as its longest word allows, then the text. Odd half → an ad half. Lyhyesti pages are filled by measuring (fixed-height columns until a 4th opens), the last one balanced + ad. Contents moved from the front page to "Näin ajat". t_paper_fit checks no page overflows and lists free/ads/pulls.
- Paper off the start (29.9.): lehtiInit only wires the handlers; lehtiBuild (lhPlan + fit + mini + its 4 photos) runs 1.2 s later on requestIdleCallback (timeout 2.5 s) or on the first paperOpen. It cost ~60–160 ms of blocking layout at init (SwiftShader). The mini fades in (.ready), no CSS filters in it, contain: layout paint. PAPER.t0/tb record init/build times (t_lehti_defer); lehti_pdf.js calls lehtiBuild() itself.
- Paper baked at build (29.9.): test/lehti_pdf.js also writes lehti/lehti.json = {key: lhKey(), pages} (the fitted pages, ~65 kB). The game (lehtiFetch, on idle) fetches it over http and uses it when the key (fnv of LEHTI + CHANGES + LH_ADS) matches; otherwise — file://, the editor's test game, a stale cache, no network — it lays the paper out itself (lehtiBuild). PAPER.src = 'valmis' / 'taitettu'. t_lehti_baked (run over serve.mjs) checks baked == live and the stale-key fallback.
- Rap sheet / "Poliisi tiedottaa" (29.9.): rapCount('f'|'p'|'a') while RACING — a house or vehicle the player sets on fire (the two policeIncident('fire') spots), a person / animal the player knocks down (boxHitsHumans). Lifetime totals in localStorage `ylasto1988-rekisteri`; deltas POSTed to /api/rap every 30 s, on hide (sendBeacon) and when the paper opens (capped per post: f 40, p 150, a 40). Server: rap.json {rows: {browserId: {name, f, p, a, d}}} (name = the lap-saving name, bad names ignored, ≤3000 rows, mildest dropped); GET → top 7 fires / people, 3 animals, totals. The paper page (lhPolice, after the pages, in the contents) is baked with empty rows; lhRapFill fills it on show (wanted = most fires×3 + run-overs; unnamed = "Tuntematon kuski"). The PDF says to look in the game. t_rap (serve.mjs), photo t_lh_rap → lehti/rekisteri.jpg.
- Rap sheet everywhere (29.9.): rapCount counts in every state but MENU (race, GTA, after the finish); rapSend returns a promise and also goes at finishRace and toMenu; paperOpen fetches the list only after the send settles (it used to race it); a name given later is sent on its own (server: a zero-delta post renames an existing row). t_rap_race (serve.mjs).
- Stutter fix (29.9., a friend: "kokoajan tollata mikronytkytystä"): (1) render interpolation — physics is fixed 120 Hz with no blending, so a 144 Hz or jittery 60 Hz screen got 0/1/2/3 steps per frame and the drawn car juddered (t_smooth: drawn-speed change 40 % at 144 Hz, 94 % at jittery 60 Hz → 0.1 %). RI keeps the car before the last step; loop() draws it acc/PHYS_DT of the way (car.x/z/angle swapped to the blend for the world/camera/render, then restored keeping any push the world gave). (2) makeParticleSystem.emit set fields in place (Object.assign({…}) made an object per particle → GC pauses with the sauna/fire smoke), drag exp hoisted. (3) humans LOD: beyond 70 m (not down/riding/mad/dodging/hopping/player) updated every 2nd frame, beyond 150 m every 3rd, beyond 240 m every 6th, with the saved-up dt (≤0.12 s). Logic 1.76 → 1.31 ms/frame, max frame 12.2 → 5.9 ms (t_sysprof: per-system ms/frame).
- Per-frame scans cut (29.9.): (1) Object3D.updateMatrix skips the compose when position/quaternion/scale equal the cached ones (_mc), so an unmoved object doesn't flag its subtree; updateMatrixWorld is three r128's own plus a world version _wv. Recomputed per frame 6622 → ~360 objects; scene.updateMatrixWorld 1.29 → 0.89 ms (the rest is the walk). (2) batchFill skips a mesh sitting in its own slot whose _wv hasn't changed (B.own per slot), 0.35 → ~0.2 ms. (3) batchCanon: BoxGeometry (1×1×1 segs) and plain CylinderGeometry of any size share a unit geometry with the size in the instance matrix (checked vertex by vertex, so a rotated one keeps its own); batch groups 388 → 104, draw calls main 489 → 355, shadow 333 → 217. t_rendercpu, t_samepic (before/after views: only tree sway / people differ).
- Pigs back from the road (29.9., Mantis: "betoniporsaat on vähän liian rajuja, menee heti kisa pieleen"): the inside-kerb anti-cut row and the side-street mouth walls are tyre stacks now, with a row of pigs 8 m further in (mouths: off1 + 8.4; corners: off1 + 8, skipped if nearer any road or a building); chord walls use stacks within hw + off1 + 7.6 of the road, pigs beyond. Pig edge distance 1.7–4 m → 9.5–12 m (t_pigdist), stacks 1154 → 1438. Camera at Mane's 84.804 (27.9 17:30Z) was f1c9ed8's (no speed lead, look-ahead 15 + 0.2 v); 1d418a9 a minute later added the lead + auto look-ahead (t_camcmp: old vs new shots).
- Start screen no jump (29.9.): the QR's right-middle place and the LEHTI button's hiding came from body.lh-wide, set by lehtiLayout only after the village was built — so the QR sat top-left first. Now a CSS media query (min-width 1285px, min-height 380px = lehtiLayout's s ≥ 0.24) decides from the first paint; lehtiLayout uses the same matchMedia. t_menu_nojump compares the layout with and without the class.
- Paper nav fix (29.9.): the PDF change had put a `// (…)` comment in the middle of a line, which commented out the ‹ › buttons' onclick (clicks did nothing since then; keys and wheel still worked). Scanned for the same pattern: none left. t_paper_input drives real mouse/keys. AVAA LEHTI is a sticker on the small paper now (the `contain: paint` clipped it at the edge). The nuke story is "Ydinsota alkoi" (Antti: not a test blast), the in-game message ☢️ YDINSOTA ALKOI!
- Faster start + ghosts (29.9., Antti: "saisko pelin aloitettua heti … ghostit vois hakee kun ajaa … jos on paras aika niin sille näkyisi se nopein aika"): Enter was never gated on the online data; opponents are sampled by raceTime, so ghosts that arrive mid-race appear in place. Now GHOST_CACHE (localStorage `yl-g:<k>:<t>`, the last 8; a ghost for a time never changes), GHOST_PREFETCH (the last pick from `yl-opp-last` is fetched on the first line, during the world build, like TOP_PREFETCH), and your own ghost fetched alongside the rivals' (was after them). The leader's pick: their own record (unless the local ghost is that lap) + the two nearest chasers. Load: buildTrackTires' nearBuilding (linear over every building, ~2.4 s of 12.9 s in SwiftShader) uses a 16 m grid (each building in every cell its rectangle + 6 m reaches; m > 6 falls back to the scan). Load profile tool: the first render compiles 46 shader programs (11.5 s in SwiftShader). The init (generateTrack … requestAnimationFrame(loop)) is boot(), run after the first frame/paint (rAF → setTimeout, and a 120 ms timer for background tabs): a synchronous build held back the early fetches — they only left after it (measured: the ghost requests at 11.7 s → 6.5 s after navigation). Keys are ignored until BOOTED. t_ghost_fast (serve.mjs): leader pick, cache hits (0 ghost requests on the second refresh).
- Camera back to Mane's record one (29.9., Antti): updateCamera is f1c9ed8's again (no speed lead, look-ahead 15 + 0.2 v, no auto look-ahead to keep the car above the gauges), plus the walker's camera. t_camcmp old/new now identical.
- Start-screen "Uusimmat" back (29.9., Antti): #changelog shows the newest five CHANGES with day + time (bottom-right on ≥1560×640, else under the leaderboard), "kaikki lehdessä ›" opens the paper's Lyhyesti. CHANGES entries are ['d.m.', text, 'hh.mm'] now; the 127 old ones got their time from git (the commit that added each line, in Helsinki time).
- Police station fixed spot (29.9., Antti: it could land on the football pitch): policeSpot() — beside the 'kentta' landmark, 12 m in from its end nearest the route, 20 m past the long side the race heads towards, facing the route — computed in buildScenery before the trees, whose yard it keeps clear (placed). buildPoliceStation uses it unless a road, plot, house, car, plan or landmark is there (spectators in the yard step to its road-side edge); the fallback search near the shop now keeps off landmarks. Same spot on seeds 1–7 (t_station). Uusimmat: text only (leading emoji stripped), the whole list scrolling (max-height 104 px). The leftover old #changelog CSS removed.
- Menu centring fix (29.9.): removing the old #changelog CSS also took the wide-screen `#overlay > .deco.bottom { margin-bottom: auto }` — the pair of .deco.top's margin-top: auto — so all the free space went above and the menu sank to the bottom. Now margin-bottom: auto always (the scroll-from-top on short screens is unchanged). The "✔ 28.9. TESTATTU" stamp is gone.
- Leader's own ghost + no countdown (29.9., Mane led and saw no ghost of his own): online the local ghost is never drawn (updateGhost: !ONLINE.ok), and oppPick had skipped the leader's own record when the local ghost was that lap — so nothing showed. Now the leader always gets their record from the board (t_ghost_fast leaderLocal). startRace goes straight to RACING (no 3-2-1-GO; the clock starts at the line as before — ghost times unchanged).
- Paper front + photos + walking camera (29.9., Antti): the front page's lead is LH_POLLEAD "Kylän suurimmat rikolliset" (photo rikolliset.jpg from t_lh_f, the wanted name filled live — also on the small paper, rapFetch on lehtiSet) linking to the police page, which comes right after it (page 2), then one page story (so the spreads start on a left page), the mains (the nuke n 0.5: last), the rest. lhPlan is a running-order list now. All lehti photos retaken: lh_common.inc view() moves the camera LH_FAR.k = 1.9× further and at least 28° up (the boxy look doesn't show from there). On foot the camera is the driving one on the walker (updateCamera follows C = the walker), not the low third-person one.
- Record pace (29.9., Antti): FLOW.on is decided at every split (flowSplit from ghostSplit): within 5 % of the reference split (splitRef's, scaled to the best time if that rival is slower; else best × (ci+1)/(checkpoints+1)) or faster. While on, fire engines, ambulances and police within 75 m ahead of the car get v.dodge (4–6 s: flat out, steerToward a point 90 m to their side, the AI suspended) — straight into the forest; moose within 60 m ahead bolt 70 m sideways (and don't freeze in the lights). "🔥 ENNÄTYSVAUHTI – KYLÄ VÄISTÄÄ!" when it comes on. Story 'vauhti' (page, n 50: page 3 right after the police page), photo t_lh_j. t_flow checks the 5 % line and the swerves.
- Record pace sign (29.9., Antti): no big pizzaMsg — flowFx() shows #flow-hud (small yellow "🔥 ENNÄTYSVAUHTI" at the top) and a small beacon on the roof (a yellow cylinder + an additive glow sprite, flashing ~2/s) while FLOW is on and racing. t_flowfx.
- Walking v2 + punch + ads page (29.9., Antti): on foot the arrows move you in screen directions (WALK.camA: the camera angle when you get out, held while walking; the walker turns to its way), walk 3.6 m/s, Shift runs (stamina), Space punches (walkPunch: the one in front within 1.9 m gets h.dodge 5 m/s away for ~4 s, "👊 PAM!", and at most every 12 s policeSpawn(1) + "🚨 JOKU SOITTI POLIISIT!"). t_walk3. Record pace now within 10 %; the beacon glow had never shown — a mid-line comment had swallowed its g.add(gl) — now a plain yellow sprite over the roof (depthTest off). "Pienet ilmoitukset" page (lhAdsPage, after the halves, in the contents) with absurd ads for the K-shop, the pizzeria, the vegetable farm and classifieds (also in LH_ADS).
- Post to the maker (30.9., Antti: "lähetä postia tekijälle … näytä mistä voi lukea ne"): start-screen button #posti-btn
  (airmail-striped) opens #posti, a lined letter (textarea + optional name, prefilled with the saved driver name). While it's
  open a capture keydown listener swallows every key (Esc closes, Ctrl+Enter or Enter in the name field sends). POST /api/posti
  { id, name, text ≤2000, lang } → posti.json in the blob store (last 3000 kept; 5 per browser per 10 min, then 429).
  Antti reads them at https://suomiralli.netlify.app/posti.html — the page asks for the post key (or ?key=…, then remembered
  in localStorage and dropped from the address bar); GET /api/posti?key=… and POST /api/postidel { key, i }. The repo is
  public, so only the key's SHA-256 is in api.mjs (POSTI_KEY); the key itself was given to Antti in the chat. To change
  it: put a new hash in POSTI_KEY. Test: t_posti.js against serve.mjs, with `const __KEY='…';` prepended. Paper: 'kirje' half (kirje.jpg).
- Bug check + small optimisation (30.9., Antti: "pieni bugitarkistus ja optimointi"): 26 tests run (behaviour, regressions,
  perf) — all green. Fixes: no punch while down/riding; policeUpdate returns early with nobody out (no two filter() arrays a
  frame) and only rebuilds POLICE.cars when one is gone; flowFx touches #flow-hud only on a change; the minimap draws every
  2nd frame (MM_TICK). t_pause no longer needs the removed #pcnote. t_logic 1.45 → 1.34 ms/frame. Note: t_fire2, t_heli,
  t_nuke, t_walk2 need s3run.sh (s3_shot.inc's step()), t_pause / t_police the plain runall.sh.
- Six small pick-me-ups (30.9., Antti picked 1 2 3 7 9 10 of ten ideas), all on existing systems:
  - Radio rumours: radioNewsTick (setInterval 1 s, not per frame) puts RADIO.news on both radio displays for 9 s every 30 s
    (first after 12 s): leaderboard, today's times, stats, rap totals, rapWanted(), RAP.kind (the kindest), this session's
    counts, FLOW.n, or NEWS_GOSSIP. rapWanted(k) is now shared by the paper, the radio and the posters.
  - Wanted posters: buildRoadside collects its power poles → posterBuild: two InstancedMeshes (every other pole), two canvas
    textures drawn by posterDraw(k) from rapWanted(k); posterRefresh() on every rap fetch. POSTERS.at = the poles.
  - Moped boys: on FLOW, a moped within 30 m of the car at > 12 m/s gives chase (S.chase) along TRAIL (the car's own track, a
    crumb every 3 m, ring of 1024; a jump > 40 m bumps TRAIL.gen and chasers give up / go straight home) at ~55–60 km/h; after
    16 s / 130 m / FLOW gone the first to give up (MOPO.ditched) lies in the ditch 4.5 s, then all ride back along the crumbs
    to their lane. h.mS / h.mM on the moped humans (tests). t_mopo.
  - Hitchhiker (HITCH, buildHitch): on the right verge 110–260 route points before the K-shop, cardboard sign (canvas); stop
    within 9 m → walks to the passenger door → h.inside (aboard; hitchUpdate runs it, the task isn't run for someone inside);
    minimap blinks the K-shop; stop within 34 m of the shop → out, waves, rapCount('h'). Speeding past → a fist.
    Rap sheet: new field h (client RAP.h, server RAP_MAX.h 10, GET /api/rap → kind: top 5). #hitch-hud. t_hitch.
  - Letters in the paper: posti.html gets an answer box + "Julkaise lehdessä" per letter → POST /api/postireply
    { key, i, reply, pub }; GET /api/postipub (public, printed ones, newest 8) → MAILPUB, fetched with the rap sheet;
    lhMail = "Lukijoiden kirjeet" page after the ads (kirje.jpg + 3 slots, filled by lhMailFill inside lhRapFill; the
    baked page/PDF shows the invitation box). LH_VER in lhKey: bump it when layout code changes pages. t_mailpub (serve.mjs).
  - Abducting UFO (ABD, buildAbd): from 40–80 s into a race, a moose 50–230 m ahead → a third UFO (makeUfo) comes down
    over it (4 s), beams it up (5.6 s: h.abd holds it in mooseTask, h.hop rises, then h.inside), flies off; next in 70–130 s.
    The car in the beam: ABD.carY (added to the car's drawn height beside BASS.hopY) up to 3.5 m and it slows; out of it, it
    drops. Moose reset clears abd/inside. t_abd.
  - Photos: t_lh_k (liftari, juliste, mopot, ufo_hirvi via lhrun.sh), t_lh_l (menu radio page shot scaled 2.6×, cropped
    1000×625 round the radio → huhu.jpg). Stories liftari/ufo_hirvi (page), mopot/juliste/huhu (half), kirje updated.
- 30.9. morning (Antti): three scoreboards (buildFinishArea: the finish + trackPoints a third and two thirds round from it,
  finishLot, one shared canvas/material; SCOREBOARDS), "PAULIN KAALI" board at every cabbage field (paulinKaali, edge nearest the
  route, P.sign) and the farmer is Pauli in every message/ad/story; the costume games are the HONK-olympialaiset (banner at the
  stage back, O.banner); moped boys chase on FLOW.mopo too (a split within 15 % of the record, or before the first split).
  t_boards (shots of all of it; nearVis objects need the car moved near before view()).
- Six small fixes (30.9., Antti picked 1 4 5 8 9 10 of ten): the hitchhiker's sign (was never on the rig — the mid-line
  comment bug, 4th time: comments ONLY at the end of a line) now 1.0×0.5 m, held up; on foot the police chase and bust YOU
  (policeTree/policeAI/policeUpdate use playerAt(); on foot caught within 13 m below 4.5 m/s — running gets you off; the
  officer walks up face to face, POLICE.walker); the HONK banner goes where the fewest trees hide it (8 spots round the
  stage) facing the route; lhKey also hashes the layout functions + every <style> (LH_VER only for what that can't see);
  runall.sh puts s3_shot.inc (+ lh_common.inc for view/around/TRY scripts) in front by itself; abdPick skips bolting moose.
  t_copwalk.
- Six more (30.9., Antti picked 2 3 4 6 7 10): speed cameras (buildCams: the two straightest verge spots near 28 % / 72 % of the
  lap, roadsideOk(); >80 km/h within 16 m → flash sprite, RAP.v = the fastest, sent as a max; server row v, GET speed: top 5; radio
  line); sausage to the window at any visible grandstand cart (MAKKARA.carts from sausageCart, the pizza-guy pattern, burp +
  exhaust smoke 5 s); yard dog rides along (S.m 'board' → dogRideStart: the dog "inside", a makeDog copy on carGroup behind
  the roof, barking; off at the next stop ≥ 6 s later); grandma + zebra (buildMummo: the village stretch 40–62 % with most houses;
  stripes = own material at Y + roadLift + 0.01 — under the road they vanish; stop within 16 m → she crosses, good deed h; fast
  past → the stick); birds (pool of 14 v-shapes, a flock from woods ≥ 6 trees within 16 m, 45 m ahead, every 9–17 s at > 18 m/s);
  sauna gang (S.road = the route's edge on their side; fast within 75 m → up to 4 run there in a row and shout, 35 s cool).
  t_six, photos t_lh_m. The keys page's contents list shrinks with the story count (13 px − 0.25 px a story over 35, ≥ 9.5).
- Paper re-set after Antti's Savon Sanomat sample (30.9.): near-white newsprint, Georgia headlines (no caps), lhLabel() = the
  section label (tinted box + blue bar on a 3 px rule, emoji stripped) instead of the red kick; datelines ("YLÄSTÖ") on their own
  line (lhBody .dl); captions end "Kuva: Ylästön Sanomat"; grey fact boxes with bullets + source (lhBox), beside the text on
  pages (.lh-prow); a big ” before pull quotes; spreads' right page = photo + text + a LYHYESTI column of three half stories with
  their pages (lhBriefs, LH_WHERE); the front = two light-blue teaser boxes over a condensed masthead (Arial Black scaleX .74)
  + date line on a yellow rule, the lead (headline, deck, a text column + "Sivu N" beside the photo), two photo teasers, an orange
  wide ad. The CSS is an override block at the end of the paper styles. Half text fit bases: h3 34, text 17.
- The dragster (30.9., Antti: "maalialueen lähellä dragsteri … kävelee ja menee siihen niin voi ajaa … ei sillä enkkaa saa"):
  DRAG. Parked on the verge of Malminrajantie 10–90 route points short of the line, nose up the road (buildDragster, called from
  buildFinishArea). On foot, F within 4.2 m of the parked one → dragSwap(): the car teleports to it; the Pökö's carGroup children
  are hidden and a clone of the Pökö (made once) stands where you left it (static box); the dragster copy under carGroup shows;
  DRIVE gets DRAG.SPEC (accel 58, maxSpeed 125, turnRate 1.15 …; the old values back on the swap). Lift off over 45 m/s → the chute
  (dragUpdate, extra drag). DRAG.used during a race → finishRace refuses the time like a cut (no board, no ghost). startRace →
  dragReset(): Pökö back, the dragster home. On foot you can't walk far from the car you left, so park the dragster by the Pökö to
  swap back. t_drag: 0–100 0.57 s, 345 km/h. Photo t_lh_n → dragster.jpg (page story, n 56).
- 30.9. (Antti): a big ▶ AJA button on the start screen (#aja-btn, = Enter). Walking: the arrows had left/right swapped — screen
  right is (−cos A, sin A) (a bigger heading is a left turn); t_walk3's measure had the same mistake, both fixed. The dragster now
  has its own paved lay-by ("levike") on Malminrajantie: 13 × 3.9 m off the road edge, laid on the slope both ways, drives like the
  road (inLayby in updateCar), crowd there removed, verge grass under it scaled to 0; the dragster sits in it, nose up the road.
  Candidates skip clearSpot (the crowd's reservations filled the verge) for roadsideOk + LIFE_PLAN + vehicles. t_ajabtn.
- Dragster, step 1 of Antti's order (30.9.): the new model + its lay-by. LAY (layPlan in buildGridBox, before the scenery):
  a lane on the driver's left of the start straight, t = −44…+10 m from the grid, off the road edge 0.4 m → 4.4 m out and back
  (smoothstep), 3.6 m wide; inPaved() includes it so trees, tyre walls, edge posts and the crowd keep off; built in buildDragster
  as a ribbon on the ground + white edge lines; inLay() drives like the road. The model (makeDragster) is built for its own rigid-
  body physics to come: root on the ground under the CG, a "body" group, a group per wheel at its hub (spin child, steer y), wing /
  driver / chute groups (to come off, be thrown out); DRAG_GEOM has the dimensions, wheel positions and radii, mass, CG. Decided
  for the physics step: stuck on its roof → it catches fire and the driver is thrown out. t_dragmodel (shots). Rally times unchanged.
- Dragster step 2 (30.9., Antti: "levike tiehen kiinni, rengasreunat, nyt fysiikka ja kunnon äänet"):
  - Lay-by: layPlan runs before buildCurbs (in generateTrack) and its inner edge is the road's edge (off = w2 - W/2 + (W - 0.15)*taper);
    buildCurbs skips kerb blocks whose outer point is inLay; the ribbon sits at Y + ROAD_Y (flush with the road); a dashed line where
    it leaves the road; its own red/white kerb strip (curbMat_) on the outer edge; a wall of tyre stacks (tires[], added in
    buildTrackTires after the relax passes) 1.3 m outside it.
  - Physics DP (only while DRAG.on; updateCar returns into dragPhys, the rally code path is untouched): a 3D rigid body (p = centre of
    mass at model (0, 0.42, -0.3), v, q, w; diagonal inertia I = [4640, 4860, 620] in the model frame), 2 substeps per 120 Hz step
    (4 above 40 m/s). Four raycast wheels (DRAG_GEOM hubs, 0.18 m travel, springs 15.5k/31k, dampers, a bump stop) push along the
    body's up; per tyre a friction ellipse (rear slicks mu 3.6 along / 1.9 across, fronts 1.0 / 1.1, x0.7 gravel, x0.55 grass), rear
    drive min(38 kN, 2.6 MW / v) split in two, wheelspin = demand over grip (DP.spin, smoke, 0.85 dynamic grip), brakes, reverse,
    rolling, a standstill hold. Aero: CdA 2.4, the wing's downforce (ClA 1.2, applied at z -2.3), the nose wing (0.6), the chute
    (CdA 4.5 at z -6). Contacts: DP_PTS hull points (tagged by part: wing / wheel ids / 'bar' = the wheelie bars' little wheels) vs the
    ground (Y + its normal) and vs static boxes (boxPush) and rocks (rockOut), plus a spine box vs static boxes (poles between points),
    all as impulses (dpContact: restitution, Coulomb friction, a depth bias) at the point — so off-centre hits spin, kerbs roll it.
    Hard hits tear off the wing / a wheel (dpLose → the rally car's debris list). Vehicles: obbSat + resolvePair on playerBox(), the
    velocity change put back as an impulse at the contact (spin). People: boxHitsHumans(..., noRide) (nobody rides its nose). Tyre
    stacks: updateTires with four circles, their shove comes back through car.* (dragPhys reads any change of car.x/z/vx/vz made by
    other systems since its last step and applies it to the body). car.x/z = the model root on the ground, car.angle = the body's
    heading; playerBox()/carBoxPush() use the dragster's 7.7 x 2.1 m box while DRAG.on. dragView() draws carGroup from the body
    (interpolated between the last two steps, full quaternion), wheel hubs at their suspension height.
    On its roof or side (up.y < 0.35), stopped for 1.2 s: wreckCar('drag') — fire, the driver thrown out (the driver group hides),
    fire engine + ambulance; R resets. A broken dragster is towed home when you swap back to the Pökö. Camera: speed capped at 45 m/s
    for the camera's height/distance in the dragster. DRAG.SPEC / the DRIVE swap are gone.
    Numbers (t_dragphys): 0-100 km/h 0.95 s, 0-200 1.7 s, 323 km/h in 3 s, nose up ~5-6 deg on the bars, chute ~0.75 g, 25 s of
    autopilot along the route with no flip, a 40 m/s house hit spins it (w ~10 rad/s) and takes the wing, on its roof -> wreck.
  - Sound: createDragSynth (audio.dragSynth): sawtooth at the firing rate (rpm/60*4) + a square sub, both through a hard tanh
    saturator, a lumpy-cam AM at half crank, noise gated at the firing rate, the blower's whine, a scrape band (DP.scrape); pops at
    the launch, a burst of cracks off the throttle, open-header crackle at idle. The Pökö's engine synth is off while DRAG.on.
    dragCrashSound (noise thump + clank, rate-limited), dragChuteSound. DP.rpm: the slicks' speed through 5:1, clutch slip >= 5200.
  - Paper: 'dragster' is a main spread now (n 8; police lead stays), photos dragster.jpg (launch off the lay-by) and dragster_b.jpg
    (a tumble) from t_lh_o. Tests: t_dragphys (settle / launch / chute / route autopilot / house crash / roof), t_drag still passes.
- Trees and fences go down + dragster feel (30.9., Antti: "testaa että tuntuma on hyvä; voisiko puut kaatua ja aidat osumista"):
  - KNOCK: every scenery tree (sceneryDebug.trees, ~26 000) and every fence section (fenceRun now builds each post-to-post section as its
    own Merger object: pickets / boards / mesh = 'fence', hedge boxes = 'hedge') is an item { kind, x, z, yaw, hl, hw, h, oid }. The oid
    of draped keys survives subdivideLong through a temporary 'aoid' vertex attribute (added in geometryOf for DRAPE_ALL keys, read back
    and deleted in liftMergedMesh). knockBuild (after worldBuild) finds each item's contiguous vertex runs in treeMeshes (an Int32Array
    oid -> item map, ~120 ms in SwiftShader at boot; ~1.3 M vertices) and its foot height, and grids them (8 m cells); tile bounding
    spheres +9 m. knockUpdate (each physics step, the player's car only, not on foot): a trunk = circle r 0.3 vs playerBox (boxPush),
    a section = obbSat. Into it faster than 3.2 m/s (tree) / 1.5 (fence): knockOver — the car keeps 70 % (tree; Pökö dented via
    carDamage) / 88 % (hedge) / 95 % (fence); the dragster gets that as an impulse at the trunk (spins it). Slower: solid (pushed out).
    The tree falls forward and 35-55 deg to a random side (not onto the car driving on under it); a fence section flat away from the
    car. knockAnim rotates the item's vertices (positions + normals, from copies taken at the knock) about its foot, gravity-like
    (tree ~1.5 s), a small bounce; updateRange limits the upload. A landing tree knocks down anyone along its length (knock(): the
    ambulance), dust, a thud; leaves at the hit; knockSound = a crack. knockReset in startRace restores them all.
    Tests: t_knock (tree and fence fall, slow = solid, R restores), t_knockperf. Photos t_lh_p -> puu.jpg ('puut' page n 57), aita.jpg
    ('aidat' half). Rally records: the route is >= 7 m from any tree and fences are in yards, so on-route laps are unchanged (t_ghost).
  - Dragster feel (t_dragfeel: lane change at 100, full lock at 50 / 10, a tap at 300, braking from 200, power turn, reverse, handbrake,
    grass): brakes capped at mu 1.25 (200 -> 0 in ~78 m with the aero; it was 41 m, ~4 g), reverse a crawl (<= 12 km/h; it reached 60),
    front lateral mu 1.1 -> 1.4 and the steering lock falls off slower (0.45/(1 + v*0.04)): full lock radius ~29 m at 50 km/h, ~13 m at
    10; power + lock swings the tail (30 deg) without spinning; a tap at 300 km/h stays straight.
- Tree felling in the news (30.9., Antti: "eikö puiden kaatuminen päässy uutisiin?"): RAP has a 't' counter (trees felled, rapCount('t')
  in knockOver) sent with the rest; api.mjs keeps r.t (RAP_MAX t 300), GET /rap returns total.t and lumber (top 3). The radio: RADIO.hot
  = a line for what just happened (a tree / a fence), said first by radioNewsLine; the pool gets "Kylästä kaadettu jo N puuta", "Kylän
  pahin metsuri: X", fresh counts. Test t_rapt over serve.mjs. (The paper already had the 'puut' / 'aidat' stories, front-page teasers.)
- Dragster camera in the forest (30.9., Antti: "kamera pyörii hallitsemattomasti jos ajat dragsterilla metsään"): every felled tree gave
  the dragster a yaw blow at the trunk, and the camera followed its nose. Now updateCamera, in the dragster, aims at dragCamAngle() (the
  velocity's heading when going forward > 4 m/s, else the nose; smoothed in DP.camA) and turns at most 1.1 rad/s; the tree's impulse is
  applied a quarter as far off the centre line. t_dragforest: max yaw 5.6 -> 2.1 rad/s, camera <= 1.1 rad/s. (Full throttle on grass
  still swings the tail round — the rear slicks spinning lose their side grip.)
- Radio Ylästö's voices in the news (30.9., Antti gave the four hosts' profiles; the kitchen show's audio did not come with it):
  Aki Korhonen (Naapurivartti: the USSR admirer, 1980s predictions that go wrong), Kari Lehtinen (Urheilukierros: traditional sports,
  lost with floorball / snowboarding / sponsors), Seppo Hämäläinen (Merisää ja Euroopan sää, readiness bulletins — the koelähetys
  line winks at the nuke), Marjatta Väänänen (Marjatan keittiö: microwave, pineapple, jelly, "hamburgeri", the Trabant manual, the DDR
  phone call). Paper: 'keittio' main n 8.5 (keittio.jpg + radiot.jpg, the four together), 'naapurivartti' page n 60, 'urheilukierros'
  and 'merisaa' halves; photos t_lh_q (hosts are staged Humans with fixed looks: LOOK in the script). Six NEWS_GOSSIP lines (fi/en/no).
  Playlist entries may carry show: 'keittio' | 'naapurivartti' | 'urheilukierros' | 'merisaa' → SHOW_STATIONS name on the dial.
- Phone page (30.9., Antti: "mainossivu että hei tää on pc-peli, featuret, radio ja lehti"): mobiili.html at the site root (static,
  like posti.html). The game's <head> starts with a tiny script: a touch-only device (pointer: coarse, no fine pointer, touch points)
  on *.netlify.app / localhost goes to mobiili.html (?pc=1 plays anyway, ?mobiili=1 forces the page). The page: hero (ralli_a.jpg,
  "Hei, tää on PC-peli!", copy / share the address), ten feature cards with the paper's photos, the car radio (music/playlist.json
  songs + talk shows, shuffled, <audio>, play / next / volume, a green display), the four hosts' shows, Ylästön Sanomat (headlines
  parsed from lehti/lehti.json h2s, the PDF), live numbers (/api/stats starts, /api/rap fires + trees, /api/top top 5 with the sig
  build.py writes to mobiili.json). test/mob_check.js (Playwright Pixel 5 + desktop against serve.mjs, which now sends jpg/mp3/pdf
  types). The page title is "YLÄSTÖ 1988 · Suomiralli" (was "korkeuserot").
- Marjatan keittiö audio (30.9.): music/keittio-1..5.mp3 (Antti's uploads Keitti_1..5), playlist entries talk + show 'keittio' (titles
  "Marjatan keittiö, jakso N" — the files carry no tags); the dial reads SHOW_STATIONS.keittio, mobiili.html's radio too.
- Dragster step 3 (30.9., Antti: "levike tekstuuri kuten muualla, kunnon liekit piipuista, voi hajota osiin, oliko vaihteita?"):
  the lay-by ribbon uses the road's asphalt (asphaltMat's map, roadUV world UVs, roadNoise vertex colours, roadDetail). Pipe flames
  in dragUpdate: flameFx2 from the 8 zoomie tips (model (±0.62, 1.12, -1.26 - k*0.2), outward-up), with the car's velocity; tall and
  yellow on throttle (rate and size by rpm), a 0.35 s gout off the throttle above 3500 rpm, small blue licks at idle. Break-up:
  makeDragster groups the body into nose / fwing / cage / engine / pipesL / pipesR (at the body origin); DP_PTS carry those tags;
  DP_LOSE gives each part's tearing speed (ground; +3 against walls); dpLose works on any of DP_PARTS; DP.hit > 26 (one step) →
  everything off + boom + wreckCar('dragboom') ("DRAGSTERI HAJOSI KAPPALEIKSI"). No gearbox (like a real Top Fuel: direct drive and a
  slipper clutch): its own cluster base (drawClusterBaseDrag: 9000 rpm red from 8000, 500 km/h), gear "1", no shift light.
  Photos: t_lh_r → dragster.jpg (flames at the launch), dragster_b.jpg (came apart against a house).
- Dragster step 4 (30.9., Antti: "ei näy varjot kaikista osista, ei jää sladijälkiä, eikä se hajonnut millään"): the rods (beam():
  rails, cage, pipes, wing struts, wheelie bars) now cast shadows — the same shadow map as everything else, they just lacked the flag.
  Skid marks: spawnMarks(WH, hw) takes wheels and a half-width (defaults = the Pökö's); dragUpdate lays DRAG_REAR_MARKS at 0.27 with
  both slicks down on wheelspin, a slide, braking, the handbrake or grass; marks on the lay-by sit at road height (inLay). Breaking:
  DP_LOSE lower (wing 5, fwing 5, wheels 7/8, pipes 7, cage 8, nose/engine 10), dpHitPart adds up smaller blows (DP.dmg; off at
  2.2 × the threshold), dpPartAt(x, z) finds the piece at a spine hit (poles), a tree's blow or a vehicle's; a whole-car break-up at
  a change of speed > 24. t_dragbreak: 43 km/h into a house takes the nose, 65 a wheel and the front wing, 119 km/h takes it apart.
- Dragster pieces as boxes (30.9., Antti: "osat kieppuu ihan oudosti – laatikoita tavallaan; oliko meillä fysiikkamoottoria?"): there
  is no external physics engine (no Box2D/Box3D/Cannon/Ammo) — vehicles are 2D boxes (obbSat/resolvePair), the dragster its own 3D rigid
  body (DP), and now RB: every piece dpLose tears off becomes a rigid box sized from its bounding box in its own frame, re-centred in a
  container (the old debris spun round the car's origin — the 4.6 m nose swung like a blade). rbAdd/rbStep/rbUpdate: gravity, sample
  points on the corners and ≤ 0.6 m along every edge against the ground (terrain normal, + ROAD_Y on roads / the lay-by) and static
  boxes, the same impulse contact as the dragster (restitution 0.25, friction 0.55), spin capped at 18 rad/s, asleep after 0.6 s still;
  mass from the volume, box inertia. rbClear() on R. The nose is two pieces now (noseF front 2.3 m, nose rear 2.3 m). t_rbparts: a
  45 m/s crash, 12 pieces, all resting on the ground after 5 s, none sunk or floating.
- Dragster chassis in short pieces (30.9., Antti: "tosi pitkiä osia, pilko pieniin"): the rails are three 2 m lengths a side (railL0..2 / railR0..2), the
  cockpit tub (with its decals), the engine block and the tail (chute pack + wheelie bars) are groups of their own — DP_CHASSIS, only a
  break-up (DP.hit > 24) takes them; RB.max 28. t_rbparts: 21 pieces, all resting on the ground.
- Smaller pieces, materials, fire, the rumble (30.9., Antti: "vieläkin pitkiä paloja; pienempiä liekkejä jotka yhdessä iso, eivät leikkaa;
  osat eripainoisia, eri kitka; kunnon brrom-pörinä"): groups with userData.split (rails — 5 × 1.2 m a side —, the nose — 4 × 1.15 m —,
  cage, pipes, front wing, wing, tail, engine) come apart into their rods and plates, one box each (dpPiece: the bounding box in the
  object's own frame, its world scale — the rods are scaled cylinders). DP_MAT per part: mass (shared among its bits), friction,
  bounce, air drag; the blow's speed ∝ sqrt(30/mass) (light bits fly further); air drag slows wide light bits; steel (mu < 0.4) sparks
  when it skids on tarmac. RB.max 48. Fire: the atlas particle systems (fireFx, flameFx2; pools 2000/1600) pull each point toward the
  camera by its radius in the vertex shader (mv.z += size*0.5) — no hard cut where a flame meets the ground or a wall; fires emit 2.25×
  as many flames at 0.55× the size (firesUpdate, fireIgnite). The dragster's synth: a deep cross-plane burble (a sawtooth at half the
  crank through a 120–400 Hz lowpass, lumpy AM) plus a 70 Hz body peak, a hungrier idle hunt; levels: idle rms ~0.21 (the Pökö's
  0.05), full ~0.29 (0.24). Burnout: throttle + brake locks the fronts and spins the rears on a small share of their grip (it stays put),
  rpm 7800 — the rev you can hear. t_burn renders both synths offline (OfflineAudioContext) and measures them.
- Every flame from small ones (30.9., Antti: "liekit enemmän pieniä, ei isoja levyjä"; soft particles as in three's webgpu example were
  weighed and left out — r128 WebGL would need a second depth pass): boom() 150×k flames at ~1×k (was 70 at 2.2×k), the nuke's burning
  shells 70/s at ~1.1 (was 30/s at 2.2), the kokko twice the rate at ~0.55× the size; house/vehicle fires were done before.
- 30.9. Exit side: a render with a marker at lloc(+1.8, 0) showed local +x is the car's LEFT (driver's side). walkOut, the wrecked driver (and his knock), the officer at the window now use +x; the hitchhiker's passenger door −x. R while DRAG.on (whole or broken): startRace remembers it and ends with dragSwap(true) + DRAG.used — a fresh dragster at the lay-by, the Pökö parked on the grid (t_dragr).
- 30.9. Paper font + leading: lehti.json is laid out at build time in headless Chromium, which had no Georgia (→ Liberation Serif, narrower), so on Windows (real Georgia) the baked texts overflowed and were cut (Antti's Pauli half). Now the paper's serif is 'YS Serif' = bundled Gelasio (OFL, Georgia metrics) in lehti/fonts/, loaded (lhFonts) before any layout: build, lehtiFetch, t_paper_fit. Body leading 1.42–1.5 → 1.24–1.3. Halves: a short text narrows its column (the photo's flex-grow up to 4.5) instead of blowing the body up; label on top, headline+text at the foot. c2/c3 columns drop a column while under 5.5 lines. The front's lead headline shrinks (≥44px) before the page goes tight. lhEsc keeps ' – ' with the previous word (nbsp).
- 30.9. Dragster sound: DRAG_WORKLET (AudioWorklet from a Blob, 'drag-v8') models a cross-plane V8 per sample — firing 1-8-4-3-6-5-7-2 into two banks (uneven per bank = burble), each pulse a two-exponential blowdown with noise, two header waveguides (0.92/1.07 m, open end −0.64 with damping), radiated as the derivative + some body, DC block, tanh drive by load, blower whine at crank×5.6, 2-pole lowpass opening with load. createDragSynth builds it and disconnects the old oscillator stack's output once it loads (the stack stays as the fallback: file:// pages can't load a worklet — t_dragsnd runs over serve.mjs). Levels (offline): idle rms 0.094 (old 0.255), launch 0.29 (old 0.29). Idle crackle 5/s → 0.6/s, quieter.
- 30.9. Dragster alive (dragAlive, called from dragView with the frame dt; look only, DP untouched, no Math.random): engine/block/pipes roll about the crank (0, 0.62, −1.55) against the torque (−0.05·thr) + idle lope + buzz; body bob/twist; rear wing leans back with v² (≤0.07) and flutters; nose/noseF/fwing pitch about (0, 0.46, −0.4) with the acceleration lag; driver pushed back by accel; rear slicks squat at the launch and grow at speed (w.g scale, bottom kept on the ground). dpRot = rotate a part group about a pivot. Torn-off parts use world matrices, so crashes are unaffected (t_dragalive).
- 30.9. mobiili.html was dead since the SHOW-names edit: a mid-line `//` comment in radioShow() swallowed its closing brace → SyntaxError → no radio, share, stats or top 5 (Antti: 'radio ei toimi mobiilissa'). Fixed; build.py now `node --check`s EVERY inline script of src/game.html, editor.html and mobiili.html, so this 6th mid-line-comment bug can't ship again. Verified in a Pixel 5 context with the default autoplay policy: ▶ plays (currentTime advances), ⏭ skips.
- 30.9. PLANE (quick test, Antti: 'lentone kekan mutkan jälkeen, tilaa rullata Ylästöntielle, kevyt oikea fyssa, potkurikone'; Keka = K-kauppa): buildPlane finds Ylästöntie's longest straight (~202 m, from the end nearer the K-shop) and parks a Cessna-150-ish plane on the flattest free grass beside its start (off roads, clear of statics and KNOCK trees/fences). F on foot near it → planeEnter (the Pökö left as a clone, carGroup hidden, PLANE.used → lap invalid); F on the ground stopped → back in the Pökö; R in the plane → a fresh one. planePhys (in updateCar at PHYS_DT): 6-DOF rigid body, m 650, S 16, b 10; CL = 0.25 + 4.8α, stall at 0.26 rad; CD 0.035 + induced; prop thrust min(2600, 0.8·75 kW/V); stability derivatives (pitch Cmα −0.9, Cmq −10, roll Clβ −0.08, Clp −0.45, yaw Cnβ 0.06, Cnr −0.1), control terms on qd + prop wash. Wheels = springs + tyre friction, nose wheel steered; tail/belly skids grind; wingtip/prop strike or a >6 m/s touchdown or a house/tree box = crash. Airborne: car.vx/vz = 0 so nothing on the ground is 'hit' from the air. t_plane: lift-off 8.5 s / 98 m / 93 km/h, 46 m up after 25 s, 48° bank turn ~15°/s, stall drops the nose, crash + R work. Known gaps: no collision with moving vehicles, no landing aids, the world's edge shows when high.
- 30.9. Radio show Markkinarako (Parko Markkinen, ~38, adman: fast, interrupts himself, wrong in the details, right about the direction): music/parko-1..5.mp3 (transcribed with faster-whisper small, fi) = kuluttajapörssi, Helsinki-brändi, kannettava fax (predicts e-commerce + the smartphone, then settles on a portable fax), hissihaastattelu, hautaamon kanta-asiakkuus; playlist show:'parko' → SHOW_STATIONS 'Radio Ylästö – Markkinarako' (mobiili.html SHOW too); two NEWS_GOSSIP lines (+EN/NO); LEHTI 'parko' page n 62 with lehti/parko.jpg (t_lh_s: Parko by the plane); keittio's show box lists it.
- 30.9. Five new songs (music/paluulippu, kartta-luokan-seinalla, kasi-kadessa-rauhan-puolesta, yhdessa-rakennamme-maailmaa, antakaa-meille-tulevaisuus .mp3; artist Ylen musiikkitoimitus): 34 songs + 40 talk entries in playlist.json.
- 30.9. Plane v2 (Antti: 'siirrä ekaan mutkaan, vähän sivuun ja suoraan Ylästöntielle, kamera ei niin alas, en päässyt lentämään'): buildPlane finds the first bend after the grid (heading change > 0.8 rad over 12 pts), the Ylästöntie straight through it, and the takeoff direction (≥ 80 m, no hill ahead, towards the map centre); the plane parks 11–23 m off the road just before the bend, nose angled at the road 12 m past it (road 6 m ahead), with nothing behind where the camera stands; solid while parked (PLANE.sb static box). Controls: ↑ on the ground = throttle (latched), ↓ brakes < 40 km/h and lifts the nose above; in the air ↑ = nose down only after it was let go once; W/S throttle. Thrust 3300 N / 95 kW (lift-off ~72 m, 6 s, 92 km/h). Camera: 11 m back / 4.5 up on the ground → 22 / 9.5 in the air, looking a little down. Wing leveller when no roll input; within 320 m of the heightfield's edge (and > 35 m up) it banks 45° back towards the centre (t_plane_edge: stays ≥ 172 m inside). A mid-line // comment broke the build once more — build.py's check caught it.
- 30.9. Four more songs (summer-folded-in-my-hands, ankara-helsinki, istanbulin-yosta, if-you-come-back-by-morning .mp3): 38 songs in playlist.json.
- 30.9. Plane v3 (Antti drew an H on a screenshot): the runway is the race road itself past the finish line and its S — the first stretch from fi+16 that stays within 5 m of a chord for ≥ 110 m (fi+24 → 172 m); the plane parks on the grass to its LEFT (right side +0.6 score), nose angled at the road 12 m past the start (road 15 m ahead). t_plane2: lift-off 6.4 s / 78 m / 93 km/h, 91 m up after 20 s. t_plane_top = top-down check shot.
- 30.9. Plane model v2 ('parempi malli, vähä sama ku autolle'): makePlane lofts the fuselage from rounded superellipse sections (every 6 cm, 32 round), the livery and glass as per-QUAD vertex colours (per-triangle gave shark teeth), NACA-ish airfoil wings (inner full chord, outer + aileron), a swept fin + rudder, stabiliser + elevator, V-struts, spring-steel legs, lathed wheel pants over the car's tyres, spinner + twisted blades, nav lights, beacon, OH-YLÄ decals. Ailerons/elevator/rudder/nose wheel follow P.da/de/dr in planeView. Groups fuse/wingL/wingR/tail/prop/gearL/gearR/gearN: planeBreak on a crash turns each into an RB box (PL_BITS mass/grip/bounce/drag) with the plane's velocity + spin. rbUpdate now skips a zero-length frame (dt 0 divided by zero → NaN pieces). Physics points unchanged. Tests: t_plane_model (views), t_plane_crash.
- 30.9. Endless map + korpikentät (OUT, beside H): H() outside the height grid → hOuter: the clamped edge height eases over 260 m into outerBase (value noise, ~50 m relief); airstrips (AF_CELL 2.4 km cells, 42 %, ≥ 1350 m from the centre, the first fixed at (1450, 150) 'Hukanaho') flatten an 820 × 26 m strip + margins to their centre height. Inside the grid H is untouched (race/ghost identical). Drawn: a 2 km ground sheet on the grid's own 20 m lattice round the camera (its edge lies on the village's edge; its inside vertices sink 4 m under the village ground), rebuilt every 100 m; the village's SPRUCE_FOREST + trunk as instanced forest on 60 m tiles (dense at WORLD_EDGE, thinning over 160 m to 0–5 per tile), near 200 m with shadows/trunks, far crowns only; instanceColor buffers made up front (a shader compiled before the first setColorAt never shows them). Strip: textured strip, edge markers, a red hut with the name, a windsock; built within 1.5 km, dropped at 2 km. Trees/huts within 70 m of the car (= plane) become static boxes (re-done every 30 m). Plane: the edge turn-back assist is off; the HUD shows the nearest strip's direction + distance. Edge forest ≤ 60/tile; lanes 9 m either side of where the roads leave the village (ends > 470 m out: Tolkinkyläntie, Ylästöntie), 400 m out; the forest re-lays every ~150 m, the sheet every 160 m (t_logic 1.62 ms, was 1.4). t_outer: seam max step 0.04 m, the car drives out along a lane, a landing on Hukanaho stops on the strip, take-off again.
- 30.9. Plane vs balloon (Antti: 'koneen pitää törmätä ilmapalloon, oikealla fyssalla'): planeVsBalloons() in planePhys tests PL_PTS_B (nose, wingtips, tail, gear) against each flying balloon's envelope ellipsoid (PB_ENV semi-axes 6.4/7.2, centre 11.4 m above the basket) and the basket box (±0.85, 2.3 m). Contact = impulse at the point with the plane's effective mass (1/650 + |r×n|²/1200) against the balloon (envelope side 3500 kg, basket 1500 kg), restitution 0.2 + tangential friction; the plane gets v/w, the balloon B.cv (drift, decays exp(−dt/3)) and a pendulum kick B.sw about the burner (L 9 m, k = g/L, damped, ±1 rad, shows as M.G.rotation x/z). An envelope impulse > PB_TEAR 5000 N·s (≈ 144 km/h square on) caps at 5000, tears it (balloonPop → it sinks and lands) and the plane flies on ~25 km/h slower; the basket at > 7 m/s closing is a crash (planeBreak). Momentum checked in t_balloon_plane (650·7.2 ≈ 3500·1.43). CHANGES re-sorted: the 20.05–00.17 block had been inserted below the 10.04 group, so the start screen still showed 19.50 as newest. staticRemove(b, notListed) removes from b's own cells (full sweep only as fallback); staticCellsAdd for the outer forest's per-chunk solids (not in STATIC_LIST). radioPlay returns if the playlist is empty (file:// or a failed fetch threw).
- 1.10. Streaming check (Ande asked how the physics world streams and whether it scales): nothing outside is stored — ground, trees and airstrips are hashes of their 60 m / 2.4 km cells. Ground: one 2 km sheet round the camera, rebuilt every 160 m; forest: instanced, 840 m round, rebuilt every ~150 m (near 200 m trunks+shadows ≤4000, far crowns ≤20000); airstrips built inside 1.5 km, dropped past 2 km. Physics: STATIC is a 10 m-cell hash (staticNear looks at the neighbouring cells only, < 1 µs, independent of world size); outer pines/huts within 70 m become boxes, redone every 30 m. BUG fixed: outerSolids followed car.x/z, which stays at the parked Pökö while flying → the plane went through outer trees and the hut; now PLANE.p when PLANE.on. outerGround was ~38 ms a rebuild (5 H() a vertex for terrainNormal, new buffers, computeVertexNormals): now a lattice cache of [h, airstrip mask, noise] (Map, cleared at 120k), normals from lattice neighbours, buffers rewritten in place, index once: ~5 ms while travelling, ~20 ms cold (teleport). t_outer_cost measures it and crashes the plane into the hut and a pine.
- 1.10. Countryside (Antti: 'lisätään kaikki'): FEAT — a 1.1 km cell hash like the airstrips: lake 20 %, bog 12 %, farm 32 %, village 13 %, none; never within 480 m of the base or 450 m of a strip. Lakes/bogs: a wobbly circle (featWob, a closed vnoise on the unit circle), level = lowest outerBase on the 1.35R ring − 1 (so the water never stands above its shore), bowl ~4 m (featGround). Farms: flat yard, field 160×104 m on +a; villages: a 320 m street (road 'V'+key) flattened across, 12 slots of houses, the shop (k 6), bus shelter, name signs. Roads: hub to hub between neighbour cells ('E'/'N' edges, p 0.45, 0.85 when a farm/village is at an end), wiggled (roadPath), dropped if they'd cross a lake, strip, farm buildings/field or village houses (roadOk); exit connectors 'X' from OUT.exits (a road running along the edge goes out along the edge normal). Segments in 100 m buckets → roadDist; outerSurface → car: road = 'gravel' grip, bog = drag 0.45/s, water = drag + splash, > 1 m drowns. Plane: waterAt is its ground (floats slow, > 9 m/s digs in = crash). H() outside the base (+40 m) is now hLat — the 20 m lattice of latPt [h, strip, noise, tint rgb, w] (the drawn sheet's own triangles: the car, trees and props sit on what you see). Props: KIT merges boxes/gables/cylinders/cones into one vertex-coloured mesh a place (KIT.gab triangles were listed clockwise → turned round); fields are a lattice-aligned sheet with an alpha-edged furrow texture (no depth fight); roads a 5-wide ribbon +0.14 m with polygonOffset; power lines poles + LineSegments wires. countryUpdate: places within 1.3 km built, dropped past 1.7 km; roads 1.1/1.5 km; one build a frame; re-checked every 25 m of camera. Solids via F.solid / E.solid in outerSolids. Arriving shows the village/lake name. t_country (places, roads, build times, car on street/bog/lake, plane on lake, pictures), t_lh_country (kyla.jpg, jarvi.jpg). Story 'maaseutu' main n 65.
- 1.10. Countryside uses the village's houses (Antti: 'käytetään olemassaolevia'): buildScenery's house body is now houseBuild(M, x, z, w, d, th, bi, { y0, rnd, street, room, chim }) and its materials houseMats() (made once, shared). The village calls it with rnd = Math.random, the same street vector and roadPen porch test — the same draws in the same order (barnMats() is separate and lazy: its surfaceDetail draws would have shifted the village's random sequence; STATIC_LIST count and renders matched the old build within render noise). Countryside: outerHouse (houseBuild on the highest corner, a brick plinth down to the lowest, hash rnd, no smoking chimneys) and outShed (boards + gableGeo tiles: cowshed with windows and a barn door, granary, saunas, grey barns) into one Merger a place, fused (≈10 draws a village) — mergerInto marks the meshes shared so groupDrop keeps the materials. The kit (KIT) is left for props only (bales, poles, reeds, jetty, bog pines, mailboxes, bus shelter). Village build ~13 ms warm on the test box.
- 1.10. Streaming optimised (Antti: 'tehdään kaikki'): (1) places are built by featBuildGen (a house a step, merged meshes one a step via mergerIntoGen), roads by roadCellGen (a cell's edges, a ribbon every 9 rows), road paths worked out ahead a road a frame ('P' jobs) — all through OUT.fjob, ~2.5 ms a frame; sign textures cached by text (SIGN_TEX, tex.keep). (2) outerGround builds in the background into a second set of arrays (an eighth of a lattice row a step, 2 ms budget), swapped in when whole, re-centred every 120 m; at once only when nothing usable is drawn (start/teleport > 700 m). (3) latPt: two generations (90k each) instead of a wholesale clear. (4+6) Forest: per-240 m chunk data (crown/trunk matrices, colours) made by forestDataGen a 60 m tile a step, assembled every ~50 m tree by tree (as the old one: < 200 m crowns + trunks + shadows, < 860 m crowns in four quarters round the camera with bounding spheres → the quarters behind are culled; far crowns don't cast). Chunk meshes of their own were tried and measured worse (+15–30 % tris, +100 calls: they reach past the fog and each is a call in both passes). (5) Roads are owned by cells (RD.cell): one ribbon, one pole mesh, one wire set per cell, shared materials. (7) countryUpdate only looks at the cells round the camera; countryPrune keeps what's built when FEAT > 20k / edges > 6k / strips > 20k. (8) featsNear/afCells (cellsCached): one shared read-only list per block of cells, no arrays per call (they're unfiltered — callers test distance). treeCount() clashed with the game's own (renamed forestCount). Measured (t_stream, 3 min flight, slow test box): frames over 8 ms 11 → 2, over 4 ms 26 → 9, p99.9 8.3 → 3.5 ms; draws/tris equal or lower. Three's generateUUID uses Math.random, so new objects shift the seeded sequence: t_balloon_plane's case A now lifts the plane clear after the tear (a balloon placed elsewhere sent it into the edge forest).
- 1.10. Code review (Antti: 'ettei ole juttuja tehty kahteen kertaan; modulaarinen GTA-suuntaa varten'): five parallel audits (movers, rendering, collision, world queries, loop/state/audio). Round 1 done: dead code out (walkCamera — walking uses the car camera via _camWalker; walkAnim; buildScenery's flagTex — flagMaterial is the live one; mergerInto); carBoxPush was boxPush with the car's box written out → boxPush(playerBox()); the tyre-wall 'person' props are only placeholders (turned into Humans at 'new Human({... t.px0 ...})' when the world is built — 0 at runtime), so their branches in propHitByCar / propPair / updateTires went; centerMsg(t, col, ms) is the one centre-screen message (6 inline copies had no clearTimeout, so an old fade cut a new message short); the airstrip drop now uses groupDrop (its materials and sign texture leaked; _afTex.keep) and its ~28 edge markers are one KIT mesh. The audit's larger findings (one PLAYER.vehicle instead of DRAG.on/PLANE.on/WALK.on flags; one camera rig; path-follow/stuck/pursue controllers shared by police, tractor, vans, gig bus, traffic; mopeds/bikes as Vehicles with seats; one road query over village roads + countryside RD; one SpatialHash; findSpot + one occupancy registry; the rigid-body solver shared by dragster and RB pieces; one local-frame convention; text-texture and material caches) are written up as a plan for Antti.
- 1.10. Code review step 1 — the player's ride (PLAYER, RIDES; Antti: 'tehdään kerrallaan'): PLAYER.ride ('poko' | 'drag' | 'plane') is the one truth; DRAG.on / PLANE.on are getter/setter views of it (Object.defineProperty), so the ~45 older reads still work and can't disagree. Each RIDES entry answers: phys(dt, live) (none = updateCar's own), camera(dt) (whole rig: the plane) or camAngle(dt) + camSpeedCap (the dragster's calm heading), engineSound() / ownSynth, box() (playerBox), wreck(), pos(), near(h) + board() (RIDE_BOARD order: plane, drag), exitHere() (the plane's F), reset() (RIDE_RESET order) and respawn() (R in a ride: a fresh one). updateCar / updateCamera / updateAudio / playerBox / wreckCar / F (PLAYER.use) / startRace (PLAYER.reset → PLAYER.respawn) / outerSolids / countryUpdate go through it. INPUT.thr/brk/steer/hand read the keys in one place (car, dragster, walker, audio, skid marks, HUD). Camera angle wraps use angDiff. Verified old vs new: deterministic tests identical; timing-dependent ones (t_lap, t_police, t_free, t_dragphys route, t_plane2) vary within the same range as the old build run twice. A mid-line '//' comment on the startRace line swallowed rbClear/freeExit for one build — caught by the comparison (rb 48 after R), fixed. Next: a new ride = one RIDES entry.
- 1.10. Code review step 2 — shared NPC movers. (a) Vehicle drivers: bendSpeed (corner speed over a path window, used by driveAlong and fastFollow), fastFollow(v, dt, vmax, o) (pure pursuit at tyre grip, o = FF_POLICE / FF_HEVI: look-ahead, bend window, avoid parked vehicles, off-path cap) replaces policeFollow + hevi's own copy; stuckWatch/backingOut (STUCK_POLICE, STUCK_TRACTOR, STUCK_HEVI: when it counts as stuck, how long to back, brake first) replace three copies; chaseRoute + pursue(v, G, dt, tx, tz, { every, direct }) — straight at it when the line is clear, else by the police road tree — serve policeAI and tractorChase. (b) serviceVanAI(V, S) is the one stop-and-go van shell (damage, fire, stop/turn/drive, watchdog, ghost-near-route); iceVanAI / postVanAI are configs (vmax, atStop, arrive, after, onFire, reset). (c) TWO: one rider component for two-wheelers — TWO.pose(h, K, roll, lift, ph) (K = TWO.moped pegs / TWO.bike pedalling / TWO.kidbike), TWO.ride (rider + machine together on the road), TWO.down (on its side), TWO.smoke (two-stroke); mopeds (lane and chase), the postman and the kids' bikes use it. Mopeds stay kinematic (laneStep / TRAIL), not Vehicles: riders must stay in the human grid to be knocked over. (d) groundAt(x, z) is the one ground question for wheels: village streets + layout + sand pitch inside the base, generated roads/bog/lakes outside → { on, surf, outer }; updateCar and the dragster both use it (the dragster used to read countryside gravel as grass). Fix found while verifying: held cruisers without their own officer drove off while he was still at the car and shoved the rally car into him (an incident); now every held car waits until no officer is out, and leaves round the rally car: nose to its tail (< 7.5 m ahead) it waits for the rally car to drive on (backing and turning out was tried: it only shunted it about), otherwise fastFollow with FF_LEAVE (avoidCar: the rally car is an obstacle too) at ≤ 4 m/s within 12 m (before, parked bumper to bumper, it pushed the rally car down the road or rammed it at full throttle and caught fire — counted as the player's fire incident, t_police n 1). test/cmp_builds.sh runs a test list against HEAD's build and the current one twice each (INDEX env in runall.sh); t_ground checks groundAt. Comparison: t_ghost identical; t_copwalk is seed-dependent (with SEED 1 only the new build reaches and busts you on foot; seeds 2–3 both do); others within run-to-run spread. Note: runall.sh without SEED builds a different world each run — compare builds with cmp_builds.sh (SEED 1).
- 1.10. Code review step 3 — shared lookups and caches. (a) class Grid (spatial hash, cell size, multi: items in every cell they reach with a stamp so near() visits each once; reset/put for movers): HGRID (people, 3 m, put each frame), STATIC (houses/poles/rocks/landmarks, 10 m, add/remove — staticNear/addStaticBox/staticCellsAdd/staticRemove are thin wrappers) and the new VGRID (vehicles, 12 m): forVehiclesNear(x, z, r, fn) rebuilds it once per physics step (VG.dirty, set in vehiclesPhysics and worldReset; also when VEHICLES.length changes), 2 m slack for movement within the step; used by every per-frame vehicle loop (people vs vehicles, the rally car and the dragster vs vehicles, vehicle vs vehicle, driveAlong/fastFollow/traffic avoidance, UFO bolts). t_traffic 2.5 → 2.27 ms/frame; t_logic (lap, little traffic) unchanged. Build-time placement loops stay plain. (b) Placement questions: vehicleWithin(x, z, d), planWithin(x, z, d, reservedOnly) (LIFE_PLAN: own radius + d), staticHit(x, z, reach, r) replace ~30 inline copies. (c) canvasTex(key, w, h, draw(g, w, h, c), opts) — painted once, kept by key (CANVAS_TEX); the eight `let _x = null` singletons (ambulance/fire/police/post/heli lettering, police sign) use it; new painted things should too. Street-name labels: LABEL_TEX caches one texture per name (cleared and redrawn in buildStreetLabels: the real font may load later) and they're drawn at 120 px high (was 240): t_texaudit canvas textures 66.8 → 40.9 MB; t_labels shots (eye height and above) look the same. Not done, on purpose: one rigid-body solver for Pökö/dragster/plane/balloon basket — each has its own feel, the ghost times depend on Pökö's, and the four share little beyond integration.
- 1.10. Sanity check after the code review (Antti: 'paljon muutoksia, sanity check'): every functional test (174, SEED 1) on the pre-review build (e5933f5) and the current one side by side, plus an independent read-only review of the whole diff. 66 identical; the rest differ in numbers only (the world's random sequence shifts when fewer three objects are made — Three.generateUUID uses Math.random); boolean flips were each rerun on SEEDs 2–3 on both builds and are fixture-dependent in both (t_soft/t_knock2 sometimes pick a spectator that can't be hit; t_ramamb's ambulance parked behind something; t_drag's walk-out after the run). No new JS errors; tests that fail in both need network/audio worklets (radio, rap, posti). Review fixes: trafficStop() sets VG.dirty (cars teleported home after free mode stayed in their old grid cells until the next race: people walked through them in the menu background); the vehicle search radii use VG.hl (longest vehicle's half-length, kept by the Vehicle constructor) instead of a hard 5.1. t_outer_cost reads STATIC.m.size (STATIC is a Grid now). real_noraf.js no longer loads the game (the track is built across animation frames) — t_batch's two renders are synchronous anyway, real.js is fine; both builds show the same few-pixel noise.
- 1.10. OUTER_WORLD = false (Antti: a player said the game lags a lot; 'poistetaan maasto kokonaan kunnes selvä'): the whole world beyond the village is off — outerUpdate returns at once (no outer ground sheet, forest, airstrips, countryside or their solids), H() beyond the height grid clamps to the edge as before 9607a6d, groundAt has no outer surface, the plane's edge turn-back is on again (P.edge as before), the HUD has no nearest-airstrip arrow, and LEHTI entries marked outer: true (maaseutu, korpi) are dropped. All the code stays: OUTER_WORLD = true brings it back. t_country / t_outer / t_stream / t_outer_cost test the outer world and are meaningless while it's off. The bin lorry work in progress was stashed for this (git stash 'roska-auto WIP').
- 1.10. (Antti) No plane turn-back assist ever: P.edge = false; with OUTER_WORLD off a plane in the air outside the height grid (inBase(…, 0) false) blows up — '💥 SELITTÄMÄTÖN VIKA – R = uusi kone'. On-screen messages smaller and up under the top HUD rows (police-msg 155 px, pizza-msg 185 px, checkpoint-display 215 px, ghost-delta 245 px; 18/24 px instead of 26/38 px); the countdown stays mid-screen. Walking: runs by default (6.8 m/s, puffing after ~40 s flat out), Shift creeps (1.5 m/s, bent a little); the help box and the walking story say so.
- 1.10. Bin lorry (Antti picked 1/3/5/8 of ten easy ideas: bin lorry + bins, tow truck, traffic yields to sirens, paper boy). BINS: a 240 l wheelie bin (makeBin: body, lid on a hinge, handle, bag shown when full) at each PLOTS frontage (F.n0 - 0.4 m, to one side of the house), not on a road / in a static box / by a vehicle / on a plan; 321 bins (SEED 1); their own Grid(8) for the car check; each knows its nearest street node (ni) and its distance from the route (route, worked out once). binsUpdate (X3.upd): the rally car (playerBox, this or last frame's speed > 2 m/s: a fence behind the bin zeroes the speed in the same frame) sends a bin flying (vy, spin, bounces, lies on its side), the bag gone, rubbish (lifeFx); emptied bins fill again after 5–10 min (checked once a second); R puts them back. Bin parts have matrixAutoUpdate off (the lid updated by hand), no handle: bins + lorry cost ~0.05 ms/frame of logic (1000 static parts otherwise ~0.1). The lorry: VSPEC.garbage, makeGarbageTruck (cab, green body, hopper, a press plate that swings, back step with rails, amber beacon flashing while stopped, JÄTEHUOLTO via canvasTex), garbageAI = serviceVanAI config (vmax 8): at a stop the binman (binmanTask: seat on the back step = h.seat facing back; go → wheel the bin to the back → lift 2.8 s (the bin up and tipped, the press) → back → next, up to 4 bins within 12 m → board) then garbageNext: one Dijkstra from the node just ahead of the lorry (vanNode), the nearest full bin off the route (bins < 20 m from it skipped, path nodes < 9 m from it cost 40 each via nodeRoute — cached per road graph; distRoute per call was 0.4 ms/frame), +150 if it means turning round; vanTo builds the path (rightSide to the bin's side) and runs on hl past the node so the lorry stops with its back at the bin. The binman is in v.crew (fire/UFO handling). t_garbage: bins placed sanely, 8 emptied in 4 min, never on the route, a bin clipped along a street flies and lies down, R resets; t_lh_garbage: the paper's photos. t_logic unchanged (1.38–1.40).
- 1.10. Chase camera (Antti: 'kamera aivan liian ylhäällä, auton taakse fiksummin'; then 'taka-ylä suunnassa seuranta huono', 'enemmän takaa ja ylhäältä', 'mittarit pois, auto alemmas', 'paikallaan ylempänä, 80 km/h:ssa default'): updateCamera is a boom now — CAM_RIGS { chase, high } give length L (+Lv per m/s), elevation el, look point la (+lav) ahead and lu above the pivot (ground + 1, bumps filtered). Only the heading is smoothed (the chase rig turns 3.6/s and leans into a slide); nothing lags along the boom, so the car stays put on screen. R = K·min(1, vs/CAM_FULL): standing still the camera is the high rig, coming down linearly to the chase one (20 m back, 17 m up) by 80 km/h; C (camLow false) = the high rig always. camBlock pulls the boom in for a house/landmark or a crest between; a crest under the camera lifts it (CAM.lift). The gauge cluster is hidden (#cluster display none, not drawn). Wheel zoom by deltaY (a Mac trackpad sent dozens of 12 % steps a swipe), 0.7–2.5, reset by C and startRace. FAR_DETAIL: verge tufts past 220 m and yard cars past 320 m hidden (the chase view sees the horizon: draws 430 → 930 before). Boot: roadInfo walked every cell of the whole square each ring (O(r³) far from the route) → ring edges to 70 m then a full scan; finishLot's tyre test by 4 m cells (results identical). The start screen's 'haetaan aikoja…' is really the world build (~4–5 s, synchronous). test/*.js: executablePath from PW_CHROME if set (macOS).
- 1.10. Tow truck (TOW, towUpdate in X3.upd every 2 s): a vehicle that is towable (charred, or damage ≥ 70 and not driving; not tow/heli/hevi/bus/fire/garbage/tractor; hl ≤ 3.2; not burning; still) for 15 s with no responder still working within 35 m gets spawnTow: VSPEC.tow, makeTowTruck (yellow cab, bed, A-frame and boom, two amber beacons, HINAUS via canvasTex, a winch cable), one at a time, a driver (towManTask). Way in: ambPath(x, z, offRoute) — offRoute scores entry points down by 30 per path node within 9 m of the rally route (the route's tyre walls and pigs narrow corners). towAI: drive → park → hook (the driver at the wreck's nose) → winch (5 s: the wreck slides to the back, yaw to the truck's, nose up: v.towTilt/towLift used by vehicleSync; w.towed = truck, its ai off) → in → shut (exitRoute/backRoute) → leave carrying it; at the end the wreck is hidden (towedAway, nuked, x + 1e5) or removed if temp; X3.reset clears the flags (worldReset puts cars home). A progress watchdog (moved < 1.5 m in 5 s → back off 1.5 s with the wheel the other way; twice → v.pigPush, it shoves concrete pigs like the gig bus; four times → cutPath near the wreck or give up and retry in two minutes). A towing vehicle ignores its own load: vehicleVsWorld skips the pair, driveAlong's lane check and clearAt skip o.towed === v (the wreck's centre sat inside the lane window and stopped it every few seconds). t_tow: the whole job on SEEDs 1/2/4 (drive 28–47 s, hook, winch 5.5 s, leave 43–64 s), R restores. Tests must park the rally car off the map (car.x = 900): pinned in place on the truck's way it's an immovable wall.
- 1.10. Traffic gives way to sirens: sirenOn(o) = an ambulance or fire engine in job phase 'drive', or a police car on a chase (the same set the siren sound uses). In trafficAI, after the oncoming check: a siren within 55 m behind (same heading ±1.2 rad, 3 m ahead to 50 m back) or coming towards (heading > 2 rad off, −3..50 m ahead) → V.sirenT = 2.5 s; while it lasts swBias = 2.4 (driveAlong clamps it inside the road) and the speed cap 3.5 m/s for 1.6 s, then 0. t_siren: a moving car with a chasing police car 25 m behind → 0 km/h, 2.4 m to the right, on the road; siren off → 38 km/h again.
- 1.10. Paper boy (paperTask/buildPaperBoy, X2.paperBoy): kid on TWO.kidbike rides one street, mailStops(L, st, 16) (shared with the postman, which uses gap 22), drop mode = astride the bike, paper in hand, 1.1 s; knocked → flyLetters 10. Tests t_paperboy, photo t_lh_paperboy.
- 1.10. LEHTI 'mantti' (page, n 70): the camera changes credited to "Mantti Anttila", iRacing guy, jargon straight from updateCamera/CAM_RIGS. Close-up photo t_lh_mantti (the bearded mower at the tyre wall, camera 1.9 m off his face).
- 1.10. STRUCK: Mane2 (84.844, 30.9.) off the board, Antti's call (`until` 2026-10-01).
- 1.10. haamu_b.jpg retaken from the live board (test/t_lh_top.js has the rows inlined; real.js at 1400×900, #top10 cropped ×1.42 onto 1000×625 #0a0a0a).
- 1.10. Walk-out camera jump (Antti: 'nykii jos hyppää autosta pois'): the boom's on-foot shortening (×0.6) switched in one frame and the pivot hopped car → walker: the camera jumped 19 m. Now CAM.foot eases it (3/s) and CAM.ox/oz carry the pivot's hop (< 12 m) and decay (3/s). t_walkjit: max frame step 19.1 → 0.95 m out, 0.85 m back in; walking steady at 60/144 Hz.
- 2.10. Stamina out (Antti: 'kuntomittari pois, ei mitään hyötyä'): WALK.stam/puff, walkBar and the PUUSKUTTAA message are gone; on foot you run (6.8) as long as you like, Shift creeps.
- 2.10. Apple thieving (APPLES, after buildBins): the scenery's yard apple trees are recorded in APPLE_TREES ({x, z, cy, r, pl}); buildApples puts 4–6 apples on each (one InstancedMesh, ~1800, red icosahedra 0.13 m just outside the crown). On foot (WALK.on, RACING) within 2.1 m of a tree with apples: one picked every 0.45 s (applePick → APPLES.bag, both hands up). The first pick from a tree sends its owner (appleOwner: a temp Human by the plot's house, pl.B, on the tree's side) after you: 1.0 s shouting, then walkTo the walker (or the car) at 7.3 m/s (you run 6.8). Caught (< 0.95 m on foot, or < 2.9 m from a car slower than 2.5 m/s) → bag 0, they scold 2.2 s, go home and vanish. In the car > 200 m (APPLES.ESC) from them, 120 s of chasing, or knocked down → they give up; when nobody is chasing any more and you're in the car the bag is banked: rapCount('o', n) → the rap sheet (/api/rap accepts o, ≤120 a post; GET returns apples: top 10 and total.o) → #omenat on the menu (omenaRender, after rapFetch; onlineRefresh now also calls rapFetch). R (X3.reset) regrows them. Tests: t_apples (pick, caught, reset, banked by car), t_apples_api.mjs (node), photos t_lh_omena. Story 'omenat' page n 71.
- 2.10. Apple thieves on mobiili.html: a feature card (omenavaras.jpg) and the top 5 from /api/rap apples under the top-5 times (#omenat, shown when any); mob_check posts o: 17 and reads #omenat. LEHTI 'omkanta' (page, n 72): Parko Markkinen and Mantti Anttila on the apple thefts (numbers from APPLES/appleOwnerTask), photo t_lh_omkanta (both staged by a full apple tree).
- Ghost key `ylasto1988-haamu-korkeus-v1`; track signature includes terrain source, so laps on other ground don't mix.

## How to add something to the world (v5 pattern)
- A new kind of person: write a task `(…) => ({ kind, update(h, dt, t, near), knocked?(h), reset?(h) })` and `new Human({ x, z, yaw, rig: makeAdult(…) | inst: outfitIndex, task })` in worldBuild. Collision, knock-down, ambulance and restart come for free.
- A new vehicle: add its VSPEC row and `new Vehicle({ kind, x, z, yaw, hw, hl, view: { kind: 'mesh', g } | { kind: 'inst', c }, axle, ai? })`. Driving physics, shoving, damage, fire and fire engine come for free; an `ai(v, dt)` sets `v.ctrl` (setPath + driveAlong for road routes, steerToward + speedTo for anything else).
- A new solid thing: add a box in staticBuild (or `addStaticBox(b)` for something built after it). Keep big props clear of the scenery's trees with `treeNear(x, z, r)`. A new emergency: a DISPATCH entry + spawnResponder branch + a crew task.

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
- Name filter (26.9.): netlify/lib/badwords.mjs uses the LDNOOBW word lists (CC BY 4.0), Finnish (minus harmless entries) and
  English. `badName(name)`:
  - Normalises case, ä/ö/å, look-alike digits and signs, spaces and punctuation.
  - Matches list words as whole words.
  - Matches a short list of the worst stems anywhere in the name; a letter may be drawn out, but a double letter stays
    double, so Kulikov and Kustaa pass.
  - checkLap refuses such a name ("bad name" → "nimi ei käy — valitse toinen nimi" in the game).
  - strike() also removes any such name already on a board, with its ghost, on the next read.
  - Known false positive: Scunthorpe.
