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

## Recent Non-Mechanic Milestones

### 2026-03-17 - Android ads and store preparation baseline
- Added Android AdMob banner integration with consent flow.
- Added native privacy options bridge and connected the privacy action into the web admin header.
- Added privacy policy page for Play Console / AdMob requirements.
- Added Android splash improvements and store branding assets (`assets/ikon`, `assets/screens`).
- Added Capacitor bridge layout changes for the Android wrapper.
- Why: prepared the Android build for monetization and Google Play open testing requirements.

## Working Notes

### Usage going forward
- When we change gameplay, rules, hazards, tuning behavior, scoring, controls, or difficulty behavior, also update `MECHANICS.md`.
- When we change Android packaging, ads, privacy, store assets, workflow, branching, UI structure, visuals, or project organization, update `CHANGES.md`.
- If a task affects both gameplay and implementation workflow/UI, update both files.
- When the user sends a shell command such as `npm.cmd run cap:sync`, execute it directly in the terminal instead of echoing it back as assistant text.
- The shorthand `proved askript` means: run the agreed Android sync/testing shell step directly in terminal, typically `npm.cmd run cap:sync`, unless the current context clearly points to a different Android-related script.
- Default workflow from now on: after project changes, automatically run `askript` (`npm.cmd run cap:sync`) unless the user explicitly says not to.
