# Hrrra - Working Changes Log

This file is the project work log for non-mechanic changes, workflow notes, branch context, Android/store preparation, and important implementation decisions.

Rules:
- `MECHANICS.md` remains the source of truth for gameplay mechanics and balancing changes.
- `CHANGES.md` tracks everything else that helps us continue work later.
- Each entry should include a date, short title, what changed, and why it matters.
- Do not paste the full chat transcript here. Write short summaries that are easy to scan later.

## Current Branch Context

### 2026-03-18 - Working branch setup
- Current active branch for ongoing development is `Level`.
- Branch `reklama` was merged into `main`.
- Branch `Level` was then created from the updated `main`.
- Commit shared by `Level`, `main`, and `reklama`: `d21a7e9` - `Add Android ads, privacy options, and store assets`.
- Why: establishes a clean base for continued gameplay and web development while keeping Android advertising/store preparation preserved in history.

### 2026-03-18 - Level architecture expansion baseline
- Added first implementation of 5-level progression on branch `Level`.
- Admin storage moved from `mode + difficulty` to `level + mode + difficulty` with fallback reading of legacy Level 1 storage keys.
- `finishScore` was added as a per-level admin field.
- Level finish flow now uses a dedicated full-height teleport and a separate `Level Finished` overlay before continuing.
- Briefing UI now displays current level and level goal text.
- Global max-score reset was moved out of per-level admin blocks into one global action area.
- `scripts/copy-web-assets.js` now also copies `assets/teleport.png` for Capacitor/Android sync.
- Why: this is the base split that will let us tune and later visually differentiate Levels 1-5 independently.

### 2026-03-18 - Teleport art cleanup and simple frame animation
- Replaced the single raw teleport sprite with cleaned frame variants `teleport01.png`, `teleport02.png`, and `teleport03.png`.
- Original uploaded image was preserved as `assets/teleport-source.png`.
- Removed most of the dark background by converting near-black pixels to transparent alpha during asset generation.
- Teleport render is now clipped between the top and bottom death zones and uses a 3-frame animation in modern visuals.
- Why: makes the finish teleport read as energy/light instead of a dark column and gives it visible motion for later polish.

### 2026-03-18 - Teleport now hard-stops level generation
- Once the finish teleport appears, world generation no longer continues beyond it.
- Platforms, elevators, active hazards and pickups beyond the teleport are trimmed away immediately.
- Regular spawn systems stop creating new content while the teleport is active.
- Why: makes the teleport feel like a real end gate instead of a marker with more level still spawning behind it.

### 2026-03-18 - Android WebView now clears bundled web cache on startup
- Added Android-side WebView cache/history clearing in `MainActivity`.
- WebView cache mode is now forced to `LOAD_NO_CACHE` on app start.
- Why: after `cap:sync`, Android testing should reliably show the current bundled web build instead of stale cached assets.

### 2026-03-18 - Admin level sections now use distinct background colors
- Added per-level background tinting in the admin UI to make long scrolling easier to navigate.
- Level colors are now: Level 1 default light, Level 2 light green, Level 3 light red, Level 4 light yellow, Level 5 light gray.
- The tint now applies not only to the outer level wrapper, but also to the inner mode and section panels inside each level block.
- Why: improves quick visual orientation when editing many stacked level sections.

### 2026-03-18 - Admin difficulty and level groups are now collapsible
- Added collapsible toggles with arrows for `Mechanics Easy Admin` / `Mechanics Hard Admin`.
- Added collapsible toggles with arrows for every `Admin Level 1-5` block inside each difficulty column.
- Added the same collapsible arrow headers for `Global` and `Reset Max Score`.
- Collapse state is persisted in localStorage through the existing global admin storage object.
- Default compact behavior is now fully collapsed on first use for `Global`, `Reset Max Score`, both difficulty blocks, and all level blocks.
- Why: keeps the admin manageable on mobile and during long scrolling sessions.

### 2026-03-18 - Android splash title explosion enlarged again
- Increased the final splash-title explode scale from `12x` to `60x`.
- Why: the title was still not filling the screen enough at the end of the animation, so the finish needed to be much more oversized.

### 2026-03-18 - Android splash title explosion enlarged yet again
- Increased the final splash-title explode scale from `60x` to `600x`.
- Why: even the previous enlarged version still was not filling the screen enough in the final splash moment.

### 2026-03-18 - Added original Level 2 cave parallax background
- Created a new generator script `scripts/generate-level2-cave-parallax.ps1`.
- Generated original cave parallax assets `assets/level2_cave_back_tile.png` and `assets/level2_cave_front_tile.png`.
- Wired `Level 2` to use the new cave back/front layers with slower/faster scroll speeds for a deeper parallax feel.
- Existing non-Level-2 backgrounds remain unchanged.
- Why: prepares a distinct original visual identity for the second level without relying on the uploaded third-party frame extract set.

### 2026-03-18 - Added original Level 3 volcano/lava parallax background
- Created a new generator script `scripts/generate-level3-volcano-parallax.ps1`.
- Generated original arcade-style volcanic assets `assets/level3_volcano_back_tile.png` and `assets/level3_volcano_front_tile.png`.
- Wired `Level 3` to use the new volcano back/front layers with dedicated parallax speeds.
- Existing Level 1 and Level 2 backgrounds remain unchanged.
- Why: gives the third level its own colorful lava/smoke/silhouette identity without reusing external stock footage frames.

### 2026-03-18 - Added 3-layer forest parallax for Level 4
- Created a new generator script `scripts/generate-level4-forest-parallax.ps1` based on `assets/forest/forest-background.png`.
- Generated `assets/forest/level4_forest_back_tile.png`, `assets/forest/level4_forest_mid_tile.png`, and `assets/forest/level4_forest_front_tile.png`.
- Wired `Level 4` to use three forest layers with distinct parallax speeds.
- Existing Level 1-3 backgrounds remain unchanged.
- Why: gives the fourth level its own richer forest depth with a stronger layered parallax effect.

### 2026-03-18 - Rebuilt Level 4 forest layer masks
- Reworked `scripts/generate-level4-forest-parallax.ps1` to build the Level 4 masks from controlled foreground/midground bands instead of broad rectangular cutouts.
- Regenerated `assets/forest/level4_forest_mid_tile.png` and `assets/forest/level4_forest_front_tile.png` so the trunks stay solid and the areas between them read as natural depth when composited over the back layer.
- Why: the previous extraction left unrealistic-looking gaps and fill artifacts between trees during gameplay.

### 2026-03-18 - Swapped Level 4 to a retro-futuristic parallax
- Reworked `scripts/generate-level4-forest-parallax.ps1` to slice `assets/forest/futuristic.png` into three parallax layers for Level 4.
- Regenerated the existing Level 4 background assets in place so Level 4 now uses the futuristic scene instead of the forest artwork.
- Updated the Level 4 background fill colors in `game.js` to a darker green-black palette that matches the new art direction.
- Why: the newly provided artwork is a stronger fit for a distinct fourth-level visual identity than the previous forest scene.

### 2026-03-19 - Switched Level 4 parallax source to `futuristic forest.png`
- Verified that `assets/forest/futuristic forest.png` contains three usable horizontal background slices for parallax scrolling.
- Updated `scripts/generate-level4-forest-parallax.ps1` to use that new 3-in-1 source instead of `assets/forest/futuristic.png`.
- Regenerated the Level 4 back/mid/front tiles in place so Level 4 now reflects the newer user-supplied artwork.
- Why: the new asset is already structured as three clearer parallax layers and should produce a cleaner Level 4 result.

### 2026-03-19 - Tightened finish teleport hitbox
- Narrowed the active collision width of the finish teleport in `game.js` so level completion triggers only after the player moves into the portal beam itself.
- Why: the previous collision felt visually early and completed the level before the sprite appeared to touch the teleport.

### 2026-03-19 - Added frozen teleport finish animation
- Added a dedicated teleport-finish animation state in `game.js` separate from the projectile death animation.
- On finish contact, gameplay now freezes for 2 seconds: the hero shrinks for 1 second, then turns into an expanding spark for 1 second, and only after that the `Level Finished` overlay opens.
- Also blocked restart input during that finish animation so the transition cannot be skipped accidentally.
- Why: makes level completion read more clearly and feel more polished than an immediate overlay swap.

### 2026-03-19 - Tightened teleport finish timing and center alignment
- Shortened the teleport finish animation in `game.js` from 2 seconds to 1 second total.
- Reduced the final spark growth size by 50%.
- Changed teleport completion detection to use the player center against the teleport center with a small tolerance, instead of the wider portal overlap.
- Why: the previous finish still felt slightly slow and triggered too far from the visual center of the portal.

### 2026-03-19 - Prevented hero redraw behind `Level Finished`
- Updated `game.js` so the player is no longer drawn once `levelFinishedActive` is on.
- Why: after the teleport spark fades out, the hero should remain gone instead of reappearing behind the finish overlay.

### 2026-03-19 - Changed teleport spark to fade in and then out
- Updated the spark phase in `game.js` so its alpha now rises first and then falls within the existing spark duration.
- Kept the overall teleport finish timing unchanged.
- Why: the spark transition looks cleaner when it peaks visually before disappearing.

### 2026-03-19 - Added admin unlock fields for Money Bag and Coin
- Added `scoreBagUnlockScore` and `platformCoinUnlockScore` to `config.js` and wired both into the relevant spawners in `game.js`.
- Renamed the admin section title from `Score Bag` to `Money Bag`.
- Added `Unlock score` fields to both the `Money Bag` and `Coin` admin sections for every level/mode/difficulty copy.
- Defaulted both new unlock values to `0` so existing behavior stays unchanged until adjusted.
- Why: these pickups were missing the same progression control that the other mechanics already had.

### 2026-03-19 - Added unlock controls for jump pickup progression and fixed coin gating
- Added `Unlock score` fields to the `Double Jump` and `Tripple Jump` admin sections.
- Added `tripleJumpUnlockScore` to `config.js`.
- Updated `game.js` so the jump pickup unlock threshold is mode-aware: `Full Mode` uses `doubleJumpUnlockScore`, while `Jump Mode` uses `tripleJumpUnlockScore`.
- Fixed coin gating so `platformCoinUnlockScore` now also hides and disables elevator coins until the threshold is reached.
- Why: jump upgrades needed the same admin control as the other mechanics, and the early coin report was caused by elevator coins ignoring the coin unlock threshold.

### 2026-03-19 - Reordered admin section blocks
- Reordered the generated per-level admin sections in `game.js` so the shared block order now starts with `Level Goal`, `Lives`, `Speed`, `Coin`, `Money Bag`, `Blocker`, `Projectile 1`, `Projectile 2`, `Double Jump`, `Tripple Jump`, `Live`, `Slow`, and `Elevator`.
- Renamed the old `Projectile` section label to `Projectile 1` and the old `Elevators` label to `Elevator`.
- Why: the admin needed a more practical and predictable top-to-bottom order across all levels, difficulties, and modes.

### 2026-03-19 - Adjusted Full Mode admin order for movement and single jump
- Moved `Movement` directly under `Level Goal`.
- Moved `Single Jump` to sit just before `Double Jump`.
- Because these two blocks are hidden in `Jump Mode`, this ordering change is effectively visible only in `Full Mode`.
- Why: this matches the preferred Full Mode editing flow more closely.

### 2026-03-19 - Promoted current Firefox admin values into source defaults
- Read the current Hrrra admin localStorage from the Firefox profile for `file:///C:/-_WeB_-/Hrrra/index.html`.
- Added `window.HrrraLevelTuning` to `tuning.js` as a source-backed per-level default layer using the currently stored `Jump Mode / Easy` settings for Levels 1-5.
- Updated `game.js` so both normal config loading and each `Default` button now apply `base -> mode -> difficulty -> level -> localStorage`.
- Also aligned the source global default `fullscreenAutoEnabled` with the current Firefox admin setting.
- Why: `Default` should now return to the currently approved admin values even after clearing browser storage.

### 2026-03-19 - Added admin settings export/import
- Added `Export`, `Copy JSON`, `Import File`, and `Paste JSON` actions to the admin header in `index.html`.
- Added export/import logic in `game.js` for one JSON format containing global settings plus all levels, difficulties, and modes.
- Export now captures the effective current admin state, and import writes it back into localStorage before refreshing the live admin/game config.
- Also included optional export/import of the stored admin collapse UI state.
- Why: this makes it easy to back up settings, transfer them between browsers/devices, and restore them later.

### 2026-03-19 - Added Shield and Magnet mechanics with full admin support
- Added new `Shield` and `Magnet` admin sections in `game.js`, so every level, mode, and difficulty copy now has its own unlock/respawn tuning, plus duration for Magnet.
- Added the corresponding defaults to `config.js`.
- `Shield` is implemented as a held one-charge protection that absorbs the next fatal blocker/projectile/top-death/bottom-death event; bottom death now rescues the player onto the nearest safe support when shielded.
- `Magnet` is implemented as a timed effect that automatically collects all on-screen platform coins, elevator coins, and life pickups.
- Added simple in-game pickup icons plus player/HUD feedback for active shield and magnet states.
- Why: these two mechanics expand progression and recovery options while staying compatible with the existing per-level admin system.

### 2026-03-19 - Made Shield and Magnet pickups visually explicit
- Updated the canvas-drawn pickup art in `game.js` so `Shield` now reads as a glowing bubble and `Magnet` as a clear horseshoe magnet.
- Kept them as direct canvas-rendered icons, so no extra PNG assets were needed for web or Android sync.
- Why: the previous placeholders were too abstract and could be mistaken for missing graphics.

### 2026-03-20 - Lowered the default Slow unlock threshold
- Changed the source default `slowUnlockSpeedPercent` from `200` to `150` in both `config.js` and `tuning.js`.
- Why: `Slow` was still present in the game, but the higher threshold made it appear so late that it could look removed.

### 2026-03-20 - Prepared per-level art folders with automatic fallback loading
- Added `assets/level1/` through `assets/level5/` plus [`LEVEL_ASSETS.md`](c:/-_WeB_-/Hrrra/assets/LEVEL_ASSETS.md) describing the supported filenames for level-specific art.
- Updated `game.js` so `platform`, `elevator`, `blocker`, `coin`, `moneybag`, `heart`, `projectile1`, and `projectile2` can now load from a level folder first and fall back to the current shared asset if no level override exists.
- Updated `scripts/copy-web-assets.js` so files placed into `assets/level1-5/` are copied automatically during `cap:sync` without manually extending the asset list.
- Why: this gives each level a clean place for future visual variants while keeping the current game stable until new graphics are delivered.

### 2026-03-20 - Added Cracked Coin and Question Coin score mechanics
- Added `Cracked Coin` and `Question Coin` as new admin-tuned pickups in `game.js` and `config.js`.
- `Cracked Coin` now removes a percentage of the current level-earned score on pickup, using a per-config `Penalty percent` field.
- `Question Coin` now stores the level-earned score when it spawns, shows that value above the coin, and on pickup freezes the run for a short plus/minus randomizer overlay before applying the result.
- The randomizer currently resolves to either `+ 2x stake` or `- 50% of stake`, applied only against score earned in the current level.
- Added simple canvas-rendered graphics for both coins and blocked restart input during the question-coin freeze.
- Why: this introduces two new score-focused mechanics, one purely punishing and one deliberate risk/reward gamble.

### 2026-03-20 - Lengthened Question Coin result presentation
- Updated the Question Coin freeze in `game.js` so the plus/minus randomizer now runs for `2` seconds and the final result remains visible for another `1` second.
- The result phase now shows `You won XXXX` or `You lost XXXX` using the actual applied score delta.
- Why: the previous reveal ended too quickly and did not clearly spell out the final score swing.

### 2026-03-20 - Preserved Shield across level transitions
- Updated `restartGame(false)` in `game.js` so an active Shield charge now carries into the next level after a teleport finish.
- A fresh new run still clears Shield normally.
- Why: this keeps Shield consistent with the existing carry-over behavior for lives and score.

### 2026-03-21 - Prepared `skin02` as a full frame set
- Added [`scripts/prepare-skin02.ps1`](c:/-_WeB_-/Hrrra/scripts/prepare-skin02.ps1) to slice the provided `skin02` sprite sheets into runtime-ready 160x160 frame files.
- Generated `assets/skins/Skin02/` with `6` walk frames and `9` jump frames:
- Walk: `hero-walk-01.png` to `hero-walk-06.png`
- Jump: `hero-jump-01.png` to `hero-jump-09.png`
- The jump set is expanded from the original 4 source poses using a staged timing/offset plan so it can match the current 9-frame hero pipeline.
- Updated `scripts/copy-web-assets.js` so `assets/skins/` is now copied into `www` and Android sync output too.
- Why: this gives us a prepared alternate skin pack that can later be swapped into the game without first solving frame-count mismatches.

### 2026-03-21 - Added global skin selector and moved hero frames into skin folders
- Added a new global admin dropdown `Skin` in `game.js` with current options `Skin01` and `Skin02`.
- Moved the original hero walk/jump frame set out of `assets/` into `assets/skins/Skin01/`.
- Standardized the prepared alternate set in `assets/skins/Skin02/` to the same `hero-walk-*.png` / `hero-jump-*.png` naming scheme.
- Updated hero loading/rendering in `game.js` so the active skin is selected globally and uses per-skin source rect handling with fallback to `Skin01`.
- Why: this establishes a clean skin system so future characters can be added without rewiring the core hero animation pipeline each time.

### 2026-03-21 - Moved active level backgrounds into `level1-5` folders
- Moved the currently used background assets so each level now stores its active background files inside its own `assets/levelX/` folder.
- Updated `game.js` to load Level 1, Level 2, Level 3, Level 4, and Level 5 backgrounds from those level folders.
- Added explicit Level 5 background loading so it no longer piggybacks on Level 1 paths in code.
- Updated background generator scripts and [`LEVEL_ASSETS.md`](c:/-_WeB_-/Hrrra/assets/LEVEL_ASSETS.md) to match the new level-based background filenames.
- Why: this keeps the asset structure consistent as levels continue getting their own art direction and later asset swaps.

### 2026-03-21 - Added Curse pickup with score-freeze effect
- Added `Curse` admin fields in `game.js` and defaults in `config.js` for `unlock score`, `duration`, and respawn min/max.
- Implemented a dark cursed-coin pickup with its own spawn, collision, and HUD countdown.
- While Curse is active, normal score gain from distance, platform/elevator coins, and money bags is blocked, but special score mechanics still continue to work.
- Implemented distance-freeze bookkeeping in `game.js` so score does not silently catch up after Curse ends.
- Why: this adds a clean score-denial debuff that fits the game's growing score-economy mechanics.

## Recent Non-Mechanic Milestones

### 2026-03-17 - Android ads and store preparation baseline
- Added Android AdMob banner integration with consent flow.
- Added native privacy options bridge and connected the privacy action into the web admin header.
- Added privacy policy page for Play Console / AdMob requirements.
- Added Android splash improvements and store branding assets (`assets/ikon`, `assets/screens`).
- Added Capacitor bridge layout changes for the Android wrapper.
- Why: prepared the Android build for monetization and Google Play open testing requirements.

## Working Notes

### 2026-03-21 - Skin02 jump frame landing prep tweak
- Adjusted `assets/skins/Skin02/hero-jump-07.png` so the legs read a bit straighter and more ready for the landing pose in the next frame.
- Why: smooth the visual transition between the late-air jump frame and the follow-up landing frame for `Skin02`.

### 2026-03-21 - Skin02 jump takeoff tween tweak
- Adjusted `assets/skins/Skin02/hero-jump-02.png` so it reads more like a takeoff transition between `jump-01` and `jump-03`, with a slightly less crouched and more upward-moving pose.
- Why: make the early jump animation progression feel more natural and less like two nearly identical frames.

### 2026-03-21 - Skin02 asset cleanup and transparent export fix
- Normalized the active alternate skin folder to `assets/skins/Skin02`.
- Removed temporary preview/candidate files from the active skin folder.
- Updated `scripts/prepare-skin02.ps1` so exported frames keep transparent background and stay clamped to the intended sprite cell instead of carrying over sheet background.
- Why: keep the alternate skin folder clean and prevent black-background or sheet-cutting artifacts from leaking into exported gameplay frames.

### 2026-03-22 - Skin02 regenerated from hero_full sheet
- Added support in `scripts/prepare-skin02.ps1` to export `Skin02` directly from `assets/skins/Skin02/hero_full.png` when that sheet is present.
- Replaced the active `Skin02` walk and jump frame PNGs with a fresh export from `hero_full.png`.
- Normalized the new frames to transparent background and a gameplay size that swaps naturally against `Skin01`.
- Why: make it easy to drop in a full replacement sheet for `Skin02` and regenerate a clean in-game frame set without manual slicing.

### 2026-03-22 - Skin03 run sheet import and generated jump set
- Added `Skin03` to the in-game skin selector and updated skin loading so each skin can define its own walk/jump frame counts.
- Added `scripts/prepare-skin03.ps1` to slice `assets/skins/Skin03/skin03.png` into a 10-frame run loop with transparent background.
- Generated a matching 9-frame jump set for `Skin03` by transforming selected run poses into takeoff, rise, apex, fall, landing, and recovery frames.
- Why: prepare a usable third skin from a run-only sprite sheet without forcing the project to have the same frame count for every skin.

### 2026-03-22 - Skin03 size increase
- Increased the exported `Skin03` walk and jump frames by roughly 50% in the `prepare-skin03.ps1` generator.
- Why: the first pass of `Skin03` looked too small in-game compared with the gameplay scale of the other skins.

### 2026-03-22 - Skin04 GIF frame extraction
- Added `scripts/extract-skin04-gifs.ps1` to split `assets/skins/Skin04/skin04_run.gif` and `assets/skins/Skin04/skin04_jump.gif` into individual PNG frames.
- Exported the GIFs into `assets/skins/Skin04/run_frames` and `assets/skins/Skin04/jump_frames` for manual frame review and later selection.
- Why: prepare the raw animation frames for `Skin04` without changing the game logic or integrating the skin yet.

### 2026-03-22 - Skin04 integrated from selected 8+8 frame set
- Added `Skin04` to the in-game skin selector.
- Added `scripts/prepare-skin04.ps1` to build a gameplay-ready `Skin04` from the selected `run-01..08.png` and `jump-02/03/05/06/07/08/19/20.png` frames placed in `assets/skins/Skin04`.
- Exported `hero-walk-01..08.png` and `hero-jump-01..08.png` with transparent background and gameplay-sized framing.
- Updated the hero animation loading so `Skin04` can use its own 8-frame run and 8-frame jump set cleanly.
- Adjusted jump animation logic to support skins with shorter jump sets than the original 9-frame baseline.
- Why: turn the user-selected `Skin04` frame set into a usable in-game skin without changing the rest of the game structure.

### 2026-03-23 - Cleaned selected Skin04 source frames
- Added `scripts/cleanup-skin04-selected-frames.ps1` to clean the currently selected `run-*` and `jump-*` PNG source frames in `assets/skins/Skin04`.
- Removed the flat gray background from those selected source frames and cleaned the leftover edge background bands so the chosen PNGs are ready for later gameplay use.
- Did not change the in-game skin wiring as part of this step; this was only a cleanup of the selected source images.
- Why: make the manually selected `Skin04` source frames usable as transparent sprite inputs before any further in-game adjustments.

### 2026-03-23 - Normalized selected Skin04 source frames to Skin01-style layout
- Added `scripts/normalize-skin04-selected-frames.ps1` to normalize the currently selected `Skin04` source frames into a shared `360x360` canvas.
- Scaled and aligned the selected `run-*` and `jump-*` PNGs so the character occupancy and baseline are much closer to the way `Skin01` is framed.
- Jump frames were also repositioned so the jump motion comes from the pose progression rather than random canvas drift.
- Did not change gameplay code as part of this step; this was only an image/layout normalization of the selected source PNGs.
- Why: make the chosen `Skin04` source frames easier to swap against `Skin01` later without needing a different framing logic.
- Follow-up fix: cleaned a leftover turquoise line from `assets/skins/Skin04/run-04.png` and re-normalized that one frame so it matches the other run frames.

### 2026-03-23 - Switched in-game Skin04 to the selected normalized source frames
- Updated `scripts/prepare-skin04.ps1` so `Skin04` now prepares its in-game `hero-walk-*` and `hero-jump-*` files directly from the cleaned root `run-*` and `jump-*` PNGs in `assets/skins/Skin04`.
- Updated `game.js` so `Skin04` now uses the currently approved 8 run frames and 7 jump frames instead of expecting an 8th jump frame that is not in the selected set.
- Why: use the exact curated `Skin04` artwork that was cleaned and normalized, without introducing another export/recrop step.
- Follow-up fix: corrected hero rendering for full-frame skins so `Skin04` now uses the real PNG dimensions at draw time instead of being cropped as if it were a `160x160` sheet frame.
- Follow-up adjustment: changed the generated in-game `Skin04` `hero-*` files back to `160x160` so they match `Skin01` canvas size while keeping the curated `360x360` root `run-*` and `jump-*` source images untouched.
- Follow-up adjustment: regenerated only the `Skin04` `hero-walk-*` frames from the opaque sprite bounds so the character stands much lower in the canvas and no longer looks like it is running above the platform.
- Follow-up adjustment: regenerated the `Skin04` `hero-jump-*` frames from the opaque sprite bounds with per-phase jump heights and bottoms so the jump animation now matches the corrected run baseline much more closely.

### 2026-03-23 - Expanded briefing screen with a second mechanics info column
- Updated `index.html` so the pre-run briefing panel now has a second column called `Special Mechanics`.
- Added player-facing explanations there for `Cracked Coin`, `Question Coin`, `Curse`, and `Shield`.
- Updated `style.css` so the panel renders in two columns on larger screens and stacks back to one column on smaller/mobile layouts.
- Added simple briefing icons for the new mechanics so the new column remains visually scannable.
- Why: the game now includes several newer mechanics that were not explained in the briefing screen, which made the run prep less clear.

### 2026-03-23 - Equalized Skin04 jump size against Skin04 run size
- Verified that `Skin04` jump frames were visibly smaller than the run frames: run frames were around `146 px` tall while jump frames were only about `120-132 px`.
- Re-exported the in-game `Skin04` `hero-jump-*` frames so the visible character height now matches the corrected run height much more closely.
- Kept the PNG canvas size unchanged and only increased the character inside the existing `160x160` frame.
- Why: prevent the character from appearing to shrink during jump animation.

### 2026-03-23 - Enlarged Skin04 frames to the practical maximum inside the fixed PNG canvas
- Increased the visible `Skin04` character inside the existing `160x160` run and jump PNGs so it fills the frame more strongly without changing the PNG dimensions themselves.
- Updated `scripts/prepare-skin04.ps1` so future Skin04 regenerations keep this enlarged final pass instead of falling back to the smaller framing.
- Why: the requested `+33%` visual increase cannot fit literally inside a fixed `160x160` canvas without clipping, so the frames were enlarged to the practical maximum that still preserves a usable in-game silhouette.

### 2026-03-23 - Increased Skin04 in-game render scale by 50 percent without changing PNG size
- Updated `game.js` so `Skin04` now renders at `1.5x` the normal in-game hero size while still using the same `160x160` PNG files.
- Kept `Skin01`, `Skin02`, and `Skin03` unchanged.
- Bottom alignment stays anchored to the platform baseline so the larger `Skin04` still stands correctly on platforms instead of floating upward.
- The teleport shrink effect was also updated to start from the larger rendered `Skin04` size.

### 2026-03-23 - Prepared Skin05 from the new run sheet
- Added `Skin05` to the selectable skin list in `game.js`.
- Created `scripts/prepare-skin05.ps1` to build `Skin05` from the available run source frames in `assets/skins/Skin05`.
- The script also derives a first usable jump set from those run poses so `Skin05` can already be used in-game before dedicated jump art is delivered.
- Generated files in `assets/skins/Skin05` now include:
  - `run-01..06.png`
  - `hero-walk-01..06.png`
  - `jump-01..06.png`
  - `hero-jump-01..06.png`
- Follow-up fix: reduced the derived jump frame height and lowered the clipped poses so `Skin05` jump frames no longer cut off the top of the head.
- Follow-up adjustment: rebuilt `Skin05` after one extra run frame was removed from the source sequence, so the skin now uses the corrected 6-frame run loop and matching 6-frame derived jump set.

### 2026-03-24 - Extracted Skin07 character frames from GIF with motion-aware cropping
- Added a faster Python extractor in `scripts/extract_skin07_gif.py` and installed Pillow locally for image processing.
- Processed `assets/skins/Skin07/RunInstagram-original.gif` into three output sets:
  - `assets/skins/Skin07/all_frames`
  - `assets/skins/Skin07/cutout_frames`
  - `assets/skins/Skin07/normalized_160`
- The extractor does not use a fixed crop rectangle. It tracks the playable character by color markers and then isolates the connected character component, so jump frames still keep the whole body even when the sprite moves upward inside the GIF.
- Generated `54` frames in each output set, with the normalized export already prepared as `160x160` transparent PNGs for later run/jump selection.
- Follow-up rework: rebuilt the Skin07 extraction so the crop actively follows the main player character instead of using a loose scene component search.
- The updated extractor now locks onto the main red-shirt character in the center-right play area, keeps the full body visible during jump ascent/descent, and avoids pulling in the nearby zombie character.

### 2026-03-25 - Cleaned selected Skin07 walk/jump frames for later in-game assembly
- Added `scripts/clean-skin07-selected-frames.py` to process the manually chosen `assets/skins/Skin07/walk` and `assets/skins/Skin07/jump` PNGs in place.
- The cleaner preserves transparent background, normalizes every selected frame to exactly `160x160`, and centers the kept silhouette around the actual player character instead of relying on one static crop area.
- `jump` frames keep only the landing dust effect near the feet; stray scene remnants such as floor/box fragments are filtered out of the final alpha bounds so the frames are ready for later use as `Skin07`.

### 2026-03-25 - Wired Skin07 into the game skin system
- Added `scripts/prepare-skin07.ps1` to assemble the curated `Skin07/Walk` and `Skin07/Jump` source folders into final root-level `hero-walk-*`, `hero-jump-*`, `run-*`, and `jump-*` assets.
- `Skin07` is now available in the global skin dropdown and uses 9 walk frames plus 8 jump frames with the same full-frame sprite loading path as the newer skin sets.
- The selected `Skin07` in-game assets were kept at `160x160` and prepared without changing the source `Walk` / `Jump` subfolders, so we can still tweak the source picks later if needed.
- Follow-up update: after removing the last selected jump source frame, `Skin07` was rebuilt to use 7 jump frames instead of 8, and the in-game skin configuration was reduced to the same 7-frame jump sequence.
- Follow-up update: rewired `prepare-skin07` through Pillow so each selected `Skin07` frame is cropped by real alpha bounds, scaled up inside the same `160x160` canvas, and bottom-aligned; this makes the sprite visibly larger and removes the floating-above-platform look.

### 2026-03-25 - Reduced the active skin roster to Skin01, Skin04, and Skin07
- Removed `Skin02`, `Skin03`, `Skin05`, `skin06`, and the unused loose skin source files from `assets/skins`, leaving only the three approved active skins.
- Removed the old `prepare-skin02.ps1`, `prepare-skin03.ps1`, and `prepare-skin05.ps1` helper scripts so no dead skin-generation tooling remains in the repo.
- Simplified `game.js` skin selection/configuration to expose only `Skin01`, `Skin04`, and `Skin07`, and renamed the shared full-frame source-rect constant so it no longer references a deleted skin slot.
- Follow-up tweak: increased the in-game render scale of `Skin07` by 25% so that skin reads larger against the gameplay world without changing the PNG files themselves.

### Usage going forward
- When we change gameplay, rules, hazards, tuning behavior, scoring, controls, or difficulty behavior, also update `MECHANICS.md`.
- When we change Android packaging, ads, privacy, store assets, workflow, branching, UI structure, visuals, or project organization, update `CHANGES.md`.
- If a task affects both gameplay and implementation workflow/UI, update both files.
- When the user sends a shell command such as `npm.cmd run cap:sync`, execute it directly in the terminal instead of echoing it back as assistant text.
- The shorthand `proved askript` means: run the agreed Android sync/testing shell step directly in terminal, typically `npm.cmd run cap:sync`, unless the current context clearly points to a different Android-related script.
- Default workflow from now on: after project changes, automatically run `askript` (`npm.cmd run cap:sync`) unless the user explicitly says not to.
- Added `bscript` as a dedicated GitHub publishing helper: `npm run bscript` runs `scripts/bscript.ps1` and force-pushes the current checked out branch HEAD to `origin/main` with `--force-with-lease`.
- Safety rule for `bscript`: do not run it automatically after edits; only run it when the user explicitly says `run bscript`.

### 2026-03-25 - Renamed active Skin07 slot to Skin02
- Renamed the active skin folder from `assets/skins/Skin07` to `assets/skins/Skin02` and updated the in-game dropdown/configuration to use `Skin02`.
- Renamed the related helper scripts from `skin07` to `skin02` so future extraction, cleanup, and prepare steps follow the new slot naming consistently.
- Added a compatibility mapping in `game.js` so any older saved `selectedSkin = Skin07` automatically loads as `Skin02`.

### 2026-03-25 - Renamed active Skin04 slot to Skin03
- Renamed the active skin folder from `assets/skins/Skin04` to `assets/skins/Skin03` and updated the in-game dropdown/configuration to use `Skin03`.
- Renamed the related helper scripts from `skin04` to `skin03` so future extraction, cleanup, normalization, and prepare steps follow the new slot naming consistently.
- Added a compatibility mapping in `game.js` so any older saved `selectedSkin = Skin04` automatically loads as `Skin03`.

### 2026-03-25 - Cleaned unused root source files from Skin02
- Removed the unused root-level `run-*`, `jump-*`, and original GIF files from `assets/skins/Skin02`.
- Kept the actively used in-game `hero-*` PNGs and the helper subfolders `Walk`, `Jump`, and `all_frames`.

### 2026-03-25 - Added unlockable skin discovery flow
- Moved live skin selection out of admin and onto the pre-run briefing screen with clickable skin cards for `Skin01`, `Skin02`, and `Skin03`.
- Added separate player-progress localStorage for unlocked skins and chosen skin so cosmetic progression is no longer mixed into admin config/export data.
- Added a once-per-run skin discovery plan: before each new run the game now picks one still-locked skin and one target level (`Level 3` or `Level 4`), then spawns that skin as a collectible coin-style pickup on the next lowest elevator after a random score threshold inside that level.
- Locked skins now render as silhouette-style cards in the briefing UI, unlocked skins render full color, and newly unlocked skins persist between runs.

### 2026-03-25 - Restored admin skin selection as a test override
- Returned the global admin `Skin` dropdown so skins can still be force-selected for testing exactly like before.
- The admin-selected skin now acts only as the active render override; it does not unlock skins and does not change the collectible skin progression logic.
- Unlockable skin discovery in Levels 3 and 4 remains based only on the separate player-progress storage, even if the same skin is temporarily forced from admin.

### 2026-03-25 - Preserved timed jump pickups across level transitions
- Timed `Double Jump` / `Tripple Jump` effects now carry into the next level with `2x` the remaining time.
- The carried timer stays paused on the new level's starting platform and only begins ticking after the first jump made in that level.
- Tripple Jump carry-over also preserves its stored fallback Double Jump time so the full upgrade chain continues correctly after the transition.

### 2026-03-26 - Switched HUD text to white in Levels 2 and 3
- Changed the in-game HUD text color to white for `Level 2` and `Level 3` so score, jump timers, and other top-bar info stay readable over the darker backgrounds.
- Left the other levels unchanged and did not add any outline or shadow treatment.

### 2026-03-26 - Added a reusable tester-facing game overview document
- Added `TESTER_INFO.md` in the project root as a structured summary of the game's purpose, controls, pickups, hazards, score systems, and progression.
- The text is written so it can be reused later for tester onboarding, a form, a web page, or store-facing explanatory copy.
- Follow-up update: added a tester note that admin is intentionally available during testing and supports full tuning plus settings export/import.

### 2026-03-26 - Added per-skin admin control for allowed skin pickup levels
- Added a new global admin row `Skin Pickup Level` under the skin selector.
- The currently selected skin in admin now shows Level `1-5` checkboxes that decide in which levels that skin's unlock pickup is allowed to appear.
- The skin discovery planner now uses those per-skin level checkboxes instead of always assuming only Levels `3` and `4`.

### 2026-03-26 - Added a global factory-reset button to admin
- Added `Default / Reset all` to the admin header.
- The button now clears all Hrrra gameplay/admin local storage, including per-level tuning, global admin settings, highscores, admin UI collapse state, and unlocked skins.
- After reset, the game returns to the same state as first launch, starting again from the default pre-run screen with default settings.
- Follow-up update: replaced the browser confirm with a custom English confirmation screen that warns about resetting settings, scores, and unlocked skins, and suggests exporting settings first.

### 2026-03-26 - Enlarged Skin01 only in the pre-run skin selection preview
- Increased the visible preview size of `Skin01` in the skin selection panel so it better matches `Skin02` and `Skin03`.
- This change affects only that selection screen preview and does not change in-game skin rendering.
- Follow-up fix: corrected the CSS selector specificity so the larger `Skin01` preview size actually overrides the generic preview image rule.
- Follow-up tweak: enlarged the `Skin01` preview by roughly another `33%` so it visually matches the newer skins more closely.

### 2026-03-26 - Added Bottom Death Zone copy to the pre-run rules line
- Extended the pre-run briefing rules row with `Bottom Death Zone: Instant Death (but Shield can save you)`.
- This is only a wording/UI addition to make the bottom death rule clearer before a run starts.
- Follow-up tweak: forced `Bottom Death Zone` onto its own second row in the briefing rules area so the full text stays visible.
- Follow-up layout adjustment: moved the whole rules block next to the Back/Start buttons on desktop so the header uses space more evenly and the content below the skin panel stays visible sooner.
- Follow-up layout adjustment: reorganized the desktop briefing header into three columns so buttons stay left, mode/level info sits in the middle, and the rules block sits on the right; the skin panel now lives below that header row.
- Follow-up tweak: reduced the size of the left `Back` / `Start Run` buttons on desktop so the rules text has more horizontal space and is less likely to overflow.
- Follow-up correction: reduced those desktop briefing buttons by roughly `75%` from the original size, not just down to `75%` of their previous scale.
- Follow-up correction: rebalanced that desktop header again so the left button column is not too tiny, while the middle and right columns still sit further left than before.
- Follow-up tweak: reduced the desktop `Jump Mode` title size by roughly one third and increased the left button heights so the left column fills that header area more evenly.
- Follow-up tweak: increased the text size inside the left briefing buttons so their labels better fill the button height.
- Follow-up responsive polish: moved the desktop briefing rules even closer to the middle mode column and lowered the breakpoint where `Controls` and `Level Goal` stack vertically, so both panels stay side by side until a much smaller window width.
- Follow-up spacing polish: tightened the desktop header columns once more so the rules block sits almost flush with the `Jump Mode` column and has a little more room before overflowing on medium-width windows.
- Follow-up UI polish: changed the `Bottom Death Zone` note so the main rule stays on one line and the reassurance `Shield can ALWAYS save you` appears underneath in smaller text.
- Follow-up UI polish: reduced the whole skin selection panel footprint by about one third by shrinking the panel padding, skin cards, preview boxes, and text sizing.

### 2026-03-26 - Replaced working skin slot names with character names in the UI
- Kept the stable internal skin IDs `Skin01`, `Skin02`, and `Skin03`, but changed all player-facing labels to the real character names `Zyro`, `Vexi`, and `Nemu`.
- Updated the pre-run skin selection, admin skin dropdown, skin pickup level caption, unlock toast, and run discovery hint text to use the new display names.
- Added small marker subfolders `_Zyro`, `_Vexi`, and `_Nemu` inside the existing skin asset folders so the local directory structure stays easy to recognize without renaming the actual `SkinXX` folders.

### 2026-03-26 - Added two future placeholder hero slots to the skin panel
- Extended the pre-run `Skins` panel with two extra non-interactive placeholder cards for future characters.
- These cards use `assets/hero question mark icon.png`, show `????` as the name, and `Soon` as the status while matching the existing skin-card styling.
- Kept them completely outside the unlock/selection mechanics so they are only visual placeholders for now.
- Follow-up visual tweak: made the future `?` icon blend into the preview card with a transparent-looking result instead of keeping its original white square background.

### 2026-03-26 - Added configurable Slow slowdown percentage to admin
- Added `Slow down by %` to the `Slow` admin section for every level/mode/difficulty combination.
- Wired the `Slow` pickup to use that percentage at pickup time instead of always halving the speed.
- Kept the existing acceleration model intact, so score-based speed progression continues while the slowdown multiplier is active.

### 2026-03-26 - Promoted current Firefox admin tuning into source defaults
- Imported the current Firefox local admin snapshot into source tuning defaults so `Reset` / `Default` now returns to the same mechanic values without depending on browser storage.
- Updated the global source defaults to match the Firefox snapshot for shared settings such as fullscreen behavior, while keeping hero progression clean by default.
- Intentionally left the player skin progress default untouched so a fresh reset/build still starts with only `Skin01` unlocked and selected.

### 2026-03-26 - Reworked Magnet to physically pull collectibles
- Replaced the old instant screen-collect behavior with moving attracted pickup entities for platform coins, elevator coins, and lives.
- Magnetized items now travel through space toward the player and only award their effect when they actually touch the hero.
- This fixes the previous visual glitch where new pickups only flashed and disappeared instead of being visibly pulled in.

### 2026-03-26 - Equalized the two mode cards on the start screen
- Changed the pre-run mode-selection grid so the `Jump Mode` and `Full Mode` cards stretch to the same height.
- This removes the uneven look where the left card ended lower than the right one on wide screens.
- Follow-up alignment tweak: vertically centered the `Easy` and `Hard` buttons in the middle column so they sit in the true center between the two mode panels.
- Follow-up art-direction pass: replaced the flat white start screen with layered abstract gradients, softly tinted mode cards, and more expressive difficulty buttons so the menu feels less empty and more intentional.
- Follow-up background pass: cropped the white border from `assets/start_bkg.png` and switched the main start screen backdrop to that image with a soft dark overlay.
- Follow-up top-panel pass: added `assets/start_top_bkg.png` as a decorative background for the upper area inside the white start card so the header region feels less empty without cluttering the lower panels.
- Follow-up mode-card pass: wired `assets/jump_mode_bkg.jpg` and `assets/full_mode_bkg.jpg` directly into the `Jump Mode` and `Full Mode` selection cards with a light overlay to preserve text readability.
- Follow-up asset cleanup: cropped the visible white edge artifacts from `assets/start_top_bkg.png` so the decorative top texture blends cleanly inside the start card.
- Follow-up mode-card tweak: reduced the white overlay on the `Jump Mode` and `Full Mode` cards so the supplied background art reads much more clearly.
- Follow-up Full Mode visual update: replaced the old drawn mobile control diagram with `assets/start_phone.png`, clipped through rounded UI framing so the sharp source corners no longer clash with the rest of the screen.
- Follow-up text cleanup: split the `Mobile` and `Desktop` labels in both mode cards onto their own heading lines, with the actual control text placed underneath for cleaner reading.
- Follow-up wording cleanup: changed the Full Mode desktop jump hint from `Space to jump` to `Space = Jump` so both mode cards use the same phrasing.
- Follow-up difficulty pass: added `assets/easy_bkg.png` and `assets/hard_bkg.png` as the actual backgrounds for the Easy/Hard buttons while keeping their selected state readable.
- Follow-up difficulty emphasis: made the selected `Easy`/`Hard` button much more obvious by giving the active difficulty a dramatically thicker border and stronger outer highlight ring.

### 2026-03-26 - Moved the HUD level label to the top-right stack
- Removed the in-game `Level` label from the left score column so it no longer overlaps the playfield edge.
- The HUD now shows `Level` in the top-right at the larger former `Speed` size, with `Speed` moved directly underneath at the smaller former `Level` size.
- Shifted the right-side `Shield` and `Magnet` timers down to keep that stack readable.
- Follow-up cleanup: removed the leftover old `Level` line from the left HUD column so the label now exists only in the new top-right position.
- Added progression locks for the start screen so a fresh profile begins with only `Jump Mode / Easy`, with `Hard` unlocking at a configurable target level and `Full Mode` unlocking at a configurable `Jump Mode Hard` high score.
- Extended player progress storage with `highestLevelReached` while keeping skin unlocks separate, so admin skin testing does not falsely unlock gameplay progression.
- Added the two new unlock thresholds into Global admin and updated global export/import/loading so these numeric settings persist correctly.
- Locked `Hard` and `Full Mode` now render greyed out with visible lock-condition text in the pre-run UI instead of silently allowing selection.
- Follow-up admin pass: added `Unlock`, `Lock`, and `Use Default` buttons under both new progression thresholds so `Hard` and `Full Mode` can be force-tested without altering the normal unlock conditions.
- Follow-up cleanup: removed the `Use Default` buttons again so the admin now keeps only `Unlock` and `Lock`, with `Default / Reset all` returning both modes to the default locked state.
- Briefing detail panels (`Skins`, `Controls`, `Level Goal`, and the lower mechanics panel) now use `assets/start screen bkg.png` instead of flat white, while keeping a soft light overlay so the text stays readable.
- Follow-up fix: switched that briefing-panel background to a URL-encoded asset path and reduced the white overlay so the texture is actually visible instead of reading as flat white.
- Follow-up rendering tweak: the briefing panel background now scales the whole `start screen bkg` image to the full panel area instead of using a cropped `cover` view.
- Follow-up polish: non-selected skin cards in the `Skins` panel now use the same soft textured background treatment instead of flat white, while the selected card keeps its stronger gold highlight.
- Follow-up button styling: the detail-screen `Start Run` button now uses a green treatment and the `Back` button a red treatment so their purpose is readable at a glance.
- Follow-up seam fix: extended the briefing-panel background image slightly past the panel bounds to remove the thin white strip that was showing at the bottom edge.
- Follow-up background fix: replaced the remaining light base of the main briefing card with the same `start screen bkg` texture so the outer top/bottom/side areas no longer read as flat white.
- Follow-up seam cleanup: removed the inner white highlight layer and inset highlight shadow from the main briefing card so the top and bottom inner edges no longer draw as pale white strips.
- Rewrote `TESTER_INFO.md` so it now reflects the current game state more completely, including progression locks, skins, special mechanics, briefing flow, admin testing tools, and export/import behavior.
- Added a new `Tester Info` button to the pre-run detail screen so testers can open `TESTER_INFO.md` directly from the game UI.
- Prepared Android release signing locally for Play upload by wiring optional `key.properties` support into `android/app/build.gradle`, bumping Android versioning to `versionCode 2` / `versionName 1.0.1`, and generating a fresh signed release bundle for closed testing.
- Added a new testable `Skin04` built from the external `_test/spider walk.gif` source: generated a 16-frame spider run loop, derived a first 7-frame jump animation, added a `hero-icon`, and wired the skin into the selectable skin system without changing the current unlock flow for `Vexi` and `Nemu`.
- Increased `Skin04` run animation speed so the spider leg motion better matches its in-game travel speed.
- Follow-up tuning: increased `Skin04` walk animation speed much more aggressively so the spider leg loop now cycles several times faster than the default hero run.
- Android compatibility pass for Play review: marked the app as resizable game content, removed an old splash translucency flag, replaced the deprecated display-width lookup for banner sizing with `WindowMetrics` on modern Android, and simplified the custom edge-to-edge setup while keeping the game landscape-first.
- Switched the Android banner ad unit back to Google's official test banner unit so AdMob rendering can be verified independently of production no-fill behavior during testing.
- Added a new `Future Release` button to the pre-run detail screen and a standalone `future-release.html` page so testers can see what is already planned for the next version.
- Moved the `Future Release` button out of the left action stack and into the upper-right rules area of the pre-run briefing header so the main navigation column stays cleaner.
- Added a small render-only downward offset for the hero while standing on elevators so the character visually sits on the lift surface without changing any physics or collision logic.
- Doubled the `Skin04` run-loop playback rate again so the spider leg cycle now completes about twice as fast as in the previous tuning pass.
- Fixed `Skin04` walk timing to read the active selected skin from the same source as the rest of the renderer, and pushed the spider loop even faster so its leg animation no longer falls back to the default hero cadence.
- Follow-up tuning: slowed the `Skin04` walk loop back down to half of that aggressive pass so the spider animation stays lively without looking unnaturally hyper-fast.
- Follow-up tuning again: halved `Skin04` walk playback one more time for a calmer, more readable spider leg cadence.
- Made the in-game HUD text in Level 4 white as well, matching the existing Level 2 and Level 3 readability treatment for dark backgrounds.
- Renamed the user-facing `Skin04` hero name everywhere in the UI and support pages to `Krob` while keeping the internal `Skin04` technical ID unchanged.
- Added one more `Soon` placeholder card to the pre-run `Skins` panel so there are now two future hero slots shown for upcoming characters.
- Added `Krob` to the discoverable skin pool, so it can now unlock in runs through the same random skin-pickup system that already reveals `Vexi` and `Nemu`.
- Made the pre-run `Skins` panel use a responsive auto-fit grid, so hero cards stay side by side when there is room and only wrap under each other when the screen is too narrow.
- Added shield bubble burst VFX sourced from `assets/bubbel burst.png`, sliced into transparent animation frames in `assets/Bubble_burst` and played for about half a second when shield is consumed by projectile, blocker, or top death zone. Bottom death zone shield rescue intentionally keeps its existing special handling without the burst effect.
- Replaced the old shield outline with the first `Bubble_burst` frame as the idle shield visual and reduced opacity for both the held shield and the burst animation so the effect stays softer over the character.
- Increased the idle bubble shield size so it fully wraps the character and raised its opacity to a softer semi-transparent look.
- Centered the bubble shield art over the character by compensating for the source frame's internal offset, and applied the same alignment to the burst animation.
- Rebuilt the `Bubble_burst` frames onto a shared center so the animation no longer visibly jumps from frame to frame.
- Increased both the idle shield bubble and the shield burst animation by 20% while keeping their shared center alignment unchanged.
- Switched the held shield visual from the first bubble frame to a cleaner bubble frame so the idle shield no longer shows the extra top glow shape.
- Moved the held shield render above the player sprite instead of behind it, so the bubble reads as one full shield around the character instead of looking like a second bubble shape over the head.
- 2026-03-29: Replaced the idle shield bubble with a dedicated clean static asset generated into `assets/Bubble_burst/shield-idle.png`, leaving the burst animation unchanged so the extra top shape no longer appears over the hero.
- 2026-03-29: Reduced the active shield bubble size by about 20% while keeping its center and burst animation unchanged.
- 2026-03-29: Nudged the active shield bubble slightly upward and increased it a touch so the hero sits fully inside the bubble without changing the burst effect.
- 2026-03-29: Shifted the active shield bubble a touch further upward for a cleaner fit around the hero sprite.
- 2026-03-29: Updated `future-release.html` so the planned-changes list now explicitly mentions frame rate tuning for the individual character animation sets.
- 2026-03-29: Expanded `future-release.html` planned items to include character frame-rate tuning, animation updates, and visual level-art upgrades for platforms, elevators, and future gameplay assets.
- 2026-03-29: Pointed the in-app `Future Release` button to the live Vercel page at `https://hrrra.vercel.app/future-release.html` so Android no longer opens a localhost URL.
- 2026-03-29: Pointed the in-app `Tester Info` button to the live Vercel page at `https://hrrra.vercel.app/TESTER_INFO.md` so Android no longer opens a localhost URL.
- 2026-03-29: Bumped Android release version to `versionCode 3` / `versionName 1.0.2` to prepare a new signed App Bundle for the next Play closed-test upload.
- 2026-03-29: Fixed web asset syncing for copied asset directories so stale files are cleaned before each sync, preventing accidental leftover blobs from inflating future Android App Bundles.
- 2026-03-29: Fixed Android asset mirroring for Skin02/Vexi and future skin placeholders by mirroring copied web assets directly into android public assets after Capacitor sync and switching placeholder icons to a no-space filename for Android-safe loading.
- 2026-03-29: Removed the temporary Android ad debug status overlay so test banners still load, but the in-game `Ad debug: ...` text no longer appears above the banner.
- 2026-03-29: Temporarily disabled Android banner activation while keeping the AdMob code in place, so the banner area is hidden for now but can be re-enabled later with a single flag change.
- 2026-03-30: Added an Android update checker backed by an online `version.json` feed, with an in-game update prompt that can open the Google Play page when a newer build is available.
- 2026-03-30: Added generated `version-info.js` metadata to keep the web/app runtime aware of the current Android version code and name.
- 2026-03-30: Bumped Android release version to `versionCode 6` / `versionName 1.0.5` for the next store upload.
2026-03-30: Bumped Android release version to versionCode 7 / versionName 1.0.6 for a new Android bundle with the latest asset-loading fixes.
- 2026-03-30: Replaced the full pre-run briefing after completing later levels with a compact between-level screen that keeps only `Back`, `Admin`, the current level label, level goal, and a large `Start` area, while leaving the original full briefing intact for the first level.
- 2026-03-30: Simplified the compact between-level screen further so the entire lower area acts as one large `Start` target with the level goal inside it, and raised the admin panel above the overlay so `Admin` opens correctly from that screen.

- Refined the compact between-level screen so Level Goal is shown directly under the level heading, while the full lower area remains a transparent Start target.

- Matched the compact between-level Back button styling to the Admin button so both top buttons now use the same size and font.

- Added an Admin button to the full Level 1 pre-run screen, placed next to Future Release in the right-side briefing actions.

- Updated the Level 1 pre-run Admin button styling so it now matches the other rounded briefing action buttons.

- Matched the Level 1 pre-run `Admin` button size and font to `Future Release`, while keeping the Admin button background white.
- Hard-aligned the Level 1 pre-run `Admin` button with `Future Release` so both now share the same width, height, font sizing, and centered label layout.

- Replaced the magnet pickup art with the new `assets/magnet.png`, removed its blue background to transparency, normalized it to a centered square canvas, and wired the game to render the asset instead of the old procedural magnet icon.

- Increased the magnet pickup icon size by roughly one third and made the `Question Coin` stake label larger and yellow with a dark outline for better readability on mixed backgrounds.
- Increased the `Question Coin` stake text above the coin by about one third again for stronger readability at gameplay scale.
- 2026-03-30: Removed the `Game Over` 3D text-shadow styling from the overlay title and stat lines so the text now renders as clean flat typography on Android WebView instead of looking blurred.
- 2026-03-30: Cleaned and normalized `TESTER_INFO.md` into consistent readable Czech UTF-8 text without changing the documented tester-facing rules.
- 2026-03-30: Adopted a workflow rule that non-mechanic changes continue to be logged in `CHANGES.md`, while any gameplay/mechanic behavior changes must also be logged in `MECHANICS.md`.
- 2026-03-30: Added a first-pass `Badges` screen prototype to the pre-run flow, reachable from the initial mode/difficulty selection via a new `Badges` button, with category-grouped badge cards rendered from proposal data and using `assets/badges/badges.png` as the medal sprite source.
- 2026-03-30: Refined the first `Badges` screen pass by simplifying the top summary to one centered `Total Badges Collected (51/51)` card, removing redundant per-card category pills, and aligning the start-screen `Badges` button higher under the difficulty selector.
- 2026-03-30: Moved the start-screen `Badges` button directly into the central difficulty column under `Easy` / `Hard`, and changed each badge-category header counter from `series / badges` to a direct collected readout such as `18/18 collected`.
- 2026-03-30: Expanded the badge proposal with a new `Lifetime Legends` category for one-off long-term milestones (`Heart Hunter`, `Still Running`, `Teleporter`, `Bubble Saver`, `Cursed`, `Magneto`, `Starter`), and made the top badges summary compute its collected total dynamically from the rendered proposal data.
- 2026-03-30: Fixed badge category counters to use the real number of rendered badge entries per category instead of assuming three tiers per series, and renamed the `Unlocker` final discovery tier from `Platinum` to `Gold`.
- 2026-03-30: Added a new global `Badges` admin section near the top of the mechanics admin, grouped by badge category and series, with editable badge names and tier goal texts stored through the existing global admin persistence and included in settings export/import.
- 2026-03-30: Reworked the `Badges` admin from free-text goal strings into numeric target fields with inline unit labels and live `collected` counters, and refreshed the badge screen counters to read from actual tracked progress instead of fixed mock totals.
- 2026-03-30: Relaxed the background badge-stat autosave cadence from sub-second flushing to `10s`, while keeping immediate saves on `Level Finished`, `Game Over`, and admin open so progression writes stay lighter during active runs.
- 2026-03-30: Added a dedicated `Reset Badges` button to the Badges admin section header so badge progress can be cleared independently without resetting skins, mode unlocks, scores, or the rest of the admin state.
- 2026-03-31: Strengthened the locked-badge presentation on the `Badges` screen so uncollected tiers are now clearly greyed out and visually distinct from unlocked ones.
- 2026-03-31: Added per-tier badge unlock dates in `DD.MM.RR` format on the `Badges` screen, shown next to the tier label once that badge tier is unlocked.
- 2026-03-31: Added a post-death badge reward presentation that can pause before `Game Over`, then reveal newly earned badges from that run one by one with a flash / shake / medal-pop sequence before returning to the normal game-over screen.
- 2026-03-31: Added a new one-off `First Runner` badge to `Lifetime Legends`, awarded for starting the very first run so every player gets an initial collectible milestone on their first real game start.
- 2026-03-31: Cleaned the badge medal sprite sheet to transparent centered icons and refined the end-of-run badge reward reveal so the top/bottom copy is visible immediately while the name, medal, and goal appear progressively.
- 2026-03-31: Fixed the online badge medal sprite loading by aligning the CSS path with the real committed asset location `assets/Badges/badges.png` and including that sprite in the repository.
- 2026-03-31: Unified badge sprite paths to lowercase `assets/badges/badges.png` and made the badge reward overlay shrink responsively for smaller Android emulator screens so the full card stays visible.
- 2026-03-31: Added a first-launch-per-version `What's New` popup that reads its bullet list from `version-info.js` and appears once after installing or updating to a newer app version.
- 2026-03-31: Promoted the current Firefox local Jump-mode level admin tuning to project defaults in `tuning.js` / Android public `tuning.js`, while intentionally leaving badges, skins, and mode unlock progression on a clean locked profile by default.
- 2026-03-31: Rewrote the player-facing `What's New` popup copy into a shorter release-note style message about badges, future tuning, and upcoming sound.
- 2026-03-31: Bumped Android/store versioning to `versionCode 8` / `versionName 1.0.7` for the next Play upload and aligned the in-game `What's New` / update metadata to the same release.
- 2026-03-31: Added a dedicated admin notice after `Reset Badges` so the player gets explicit confirmation that badge progress was cleared and all badges are locked again.
- 2026-04-01: Added a persistent workflow note that every new user prompt should also be appended to `prompts.md`, with each prompt separated by a blank line, `-------------------`, and another blank line.
- 2026-04-01: Started the new audio foundation with global `Sounds` admin controls, per-level sound-path fields, Level 1 default sound mappings, and valid silent `.wav` placeholder assets in `assets/ui-sound/` and `assets/level1/sound/` so audio can be swapped and tested incrementally without changing code.
- 2026-04-01: Expanded the first audio pass with dedicated silent loop placeholders for `pre-run`, `between levels`, and `Game Over`, added a separate `shield break` SFX hook for Level 1, and documented the current sound routing in `sound.md`.
- 2026-04-01: Added a separate Level 1 `life loss` sound route and placeholder so losing one life mid-run can be tuned independently from both `shield break` and full `death`.
- 2026-04-01: Switched gameplay/UI `SFX` playback from cloned `HTMLAudio` elements to low-latency `Web Audio API` buffers with warm-up caching, while keeping longer music loops stream-based.
- 2026-04-01: Changed the death flow so gameplay background music now stops immediately when the last life is lost and the death/RIP sequence starts, instead of continuing underneath the death animation or badge-reward queue.
- 2026-04-01: Added a dedicated `Badges page` UI sound path/placeholder and boosted the `Game Over` loop directly in the WAV asset so it is more audible without forcing global in-game volume higher.
- 2026-04-01: Reworked the `Badges` page audio from a one-shot trigger into page-scoped background audio that now starts only while the `Badges` page is open and stops immediately when leaving it.
- Audio: Badges page background sound now hard-stops the moment you leave the Badges screen, so it can no longer keep playing under pre-run or gameplay music.
- 2026-04-01: Fixed `Reset Badges` so the currently open pre-run/Badges UI refreshes immediately after the reset, and corrected the `ui-badge-reveal.wav` asset filename so badge reveal audio can load again.
- 2026-04-01: Extended `Reset Badges` to also clear the current run's in-memory badge state (`runUnlockedBadgeKeysAtStart`, pending badge reward queue, and run badge stats) so badges like `First Runner` no longer remain falsely unlocked until leaving/re-entering the screen.
- 2026-04-01: On branch `sfx`, changed default `Sounds` volumes to `Master 75 / Music 10 / SFX 85` and hid the sound-path fields from the admin UI so the section now shows only the main audio controls.
- 2026-04-01: Bumped Android/store versioning to `versionCode 9` / `versionName 1.0.8` and updated the in-game `What's New` text for the first experimental sound-testing release.
- 2026-04-01: Reduced the effective maximum in-game music output to about `33%` of the previous ceiling so low admin music values like `5%` are much more usable during sound testing.
- 2026-04-01: Added `WORKFLOW.md` as the dedicated home for standing collaboration rules such as prompt logging, `CHANGES` / `MECHANICS` logging expectations, Android asset mirroring, JS validation, release version consistency checks, and commit discipline.
- 2026-04-01: Improved the mobile admin overlay by stretching it nearly full-height on smaller screens and replacing the small `X` close control with a much more visible green `Back` button on the top-right.
- 2026-04-01: Refined the between-level compact pre-run screen by shrinking the `Back` / `Admin` buttons, keeping them tight beside the level title, and turning the central start prompt into a much larger wide-tracked `S T A R T` label to reduce accidental taps on navigation.
- 2026-04-01: Added app lifecycle audio handling so music and SFX stop when the game is pushed into the background or another app takes focus, instead of continuing to play until the Android task is fully closed.
- 2026-04-01: Boosted the Game Over loop asset by another 100% directly in the WAV file so the end-screen music is much more prominent without touching the global mixer.


- 2026-04-01: Added a shared READY... / RUN! launch transition for both the main start briefing and between-level start screens. Starting a run now keeps only the existing briefing background visible for two seconds, shows a scaling READY... then RUN! callout, and fades the pre-run music to silence during the transition so the handoff into gameplay music is much smoother.
