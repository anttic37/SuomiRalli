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
