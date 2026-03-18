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
