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
