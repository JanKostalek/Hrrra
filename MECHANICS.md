# Hrrra - Mechanics Documentation

This file is the source of truth for gameplay mechanics.
Every gameplay-related change must be added here with date and short reason.

## Tuning Setup
- Runtime defaults live in `config.js`.
- User-editable mechanic overrides live in `tuning.js` via `window.HrrraTuning`.
- `tuning.js` is loaded before `config.js`, and matching keys override defaults.
- In-game admin panel (bottom-right `Admin` button) allows live edits of selected mechanic values.
- Admin panel edits are persisted in browser `localStorage`.
- Difficulty-specific admin edits are now stored separately for each difficulty (`Easy` / `Hard`) and mode (`Jump` / `Full`).
- Optional mode-specific overrides can be defined in `window.HrrraModeTuning` (`1` and `2`).
- Global admin options can exist outside mode groups and apply to the whole game session across both modes.

## Current Mechanics (Prototype)

### Core Loop
- Side-scrolling endless platform prototype rendered on HTML5 canvas.
- Player progresses to the right while camera keeps the player around 25% of screen width.
- Score is based on traveled distance to the right.
- Distance-based score is multiplied by configurable `distanceScoreMultiplier`.
- Every 1000 score increases world scroll speed by 10% (stacking per threshold).

### Controls
- `Left Arrow` / `A`: move left
- `Right Arrow` / `D`: move right
- `Space`: jump (hold for higher jump, capped)
- `Enter` or `Space` on game over: restart
- On-screen mobile controls:
- left bottom = jump
- right bottom = left/right buttons
- Touch controls are shown only on detected mobile devices.

### Briefing Screen
- Start flow is now two-step.
- Step 1: choose `Jump Mode` or `Full Mode` and select `Easy` / `Hard`.
- Step 2: mode-specific briefing screen shows controls and current runtime values for the selected mode.
- `Easy` and `Hard` are prepared as separate preset layers.
- At the moment, `Hard` uses the same defaults as `Easy`.
- Briefing values are rendered from the actual current config after mode defaults, difficulty defaults, and admin overrides are applied.

### HUD
- Left top: score.
- Under score: session max score (persists across restarts in current tab/session only).
- Top center: double jump status and remaining time.
- Right top: current speed acceleration percentage over base speed (`Speed +X%`).
- Top center-left shows only the currently active mode as a non-interactive label.
- Under the active mode label: life indicators rendered as player-colored squares.
- Blue square = remaining life, red square = lost life.
- If configured lives are `1`, no life squares are shown.

### Lives
- Lives count is configurable separately for `Full Mode` and `Jump Mode`.
- Allowed life count range is `1-5`.
- When lives are greater than `1`, losing an enabled life-protected hazard consumes one life.
- Projectile and blocker life loss do not respawn the player; the hazard is effectively ignored after the hit and the run continues from the current position.
- Top death zone life loss does not respawn the player; the player is stopped against the top boundary and continues falling from there.
- Life protection can be enabled/disabled separately for:
- top death zone
- projectiles (`Projectile 1` and `Projectile 2` together)
- blocker
- Bottom death zone always ends the run immediately, regardless of life count.

### Slow Icon
- Unlock condition: when current speed reaches at least `200%` over base.
- First spawn appears on the nearest platform that appears after unlock.
- Icon position is at 1/4 of platform length from its left edge.
- On pickup, current speed is cut to 50% of its current value.
- After first unlock spawn, icon respawns repeatedly every random 10-20 seconds.
- Every additional pickup again halves current speed.

### Score Bag Icon
- Spawns repeatedly every 5-20 seconds on a platform that is appearing at the right screen edge.
- If right edge is currently not on a platform, spawn waits until a platform appears there.
- On pickup, immediately grants +2000 score.
- Bonus score contributes to total score used by speed scaling.

### Blocker
- Blocker appears only on static platforms (never on elevators).
- Touching blocker either removes one life or ends the run, depending on current life settings.
- Blocker respawn timer starts immediately when a blocker spawns, not after the previous blocker disappears.
- Multiple blockers can therefore be active on screen at the same time if spawn timing is short enough.
- Blocker spawns after configured unlock score, then repeats with random interval between configured min/max seconds.

### Coin Icon
- Platform coin spawning starts after 3 seconds from run start.
- After that, platform coin respawns with random delay 0.5-2 seconds.
- Platform coin appears on newly appearing right-edge platform (not deep inside already visible scene).
- Coins also appear on elevator platforms.
- In each shaft, at least 1 and at most 3 elevators are coin carriers.
- If elevator coin is not collected and elevator resets from top to bottom, coin is active again on next upward cycle.
- Coin pickup grants +200 score bonus.

### Player Movement
- Player is a square.
- Horizontal control is stronger on ground and weaker in air.
- Gravity is always active.
- Jump is variable height:
- short press = lower jump
- longer hold = higher jump
- jump hold has a hard max duration.

### Double Jump Unlock
- At score `2500`, a double-jump icon appears at the right edge only when that edge is on a safe platform.
- If right edge is currently shaft/elevator area, spawn waits until a platform appears there.
- Icon is positioned at the middle of that platform (not at platform edge).
- Icon size is 75% of player size.
- On pickup, player gains double jump for 10 seconds.
- If collected again while active, remaining time increases by another 10 seconds.
- After first spawn, next spawns are scheduled with random delay 5-15 seconds.
- Double jump allows one extra jump while airborne before landing reset.

### Death Zone
- Playable vertical space is between two red horizontal lines:
- top death line (`topDeathLineY`)
- bottom death line (`bottomDeathLineY`)
- Top death line can either remove one life or end the run, depending on current life settings.
- On life loss, top death line behaves like a ceiling hit: player is stopped at the line and continues from current position instead of respawning.
- Bottom death line always ends the run immediately.

### World Generation
- World is generated in repeating procedural pattern:
- safe platform section
- shaft gap
- next safe platform section
- Generation continues ahead of camera and cleans old geometry behind camera.

### Platforms
- Safe platforms are black horizontal bars.
- Platform height is procedurally randomized per segment.
- Platform length min and max are both scaled by +50% (`platformLengthMultiplier = 1.5`).
- Vertical change between consecutive safe platform sections is limited to at most 1/5 of playable area height (`platformVerticalDeltaRatio = 0.2`).
- Platform Y is clamped to a safe range derived from death lines and max jump arc.
- This prevents jump-from-platform trajectories from crossing death zone boundaries.
- Random stacked platforms are generated roughly every 3rd to 6th platform section.
- In stacked pair, upper platform vertical gap has minimum 4x player height and random maximum up to 2x jump height (within safe bounds).
- Upper stacked platform has collision from above and from below (cannot be passed through from underneath).

### Elevators
- Each shaft contains multiple upward-moving elevator platforms (2-4).
- Elevators are narrower than shafts.
- Elevators move only upward and reset to lower position after leaving allowed top area.
- Elevators are valid supports for landing and standing.

### Support and Landing Rule
- Landing/support does not require center point anymore.
- Player is considered supported if horizontal overlap with a platform/elevator is at least 25% of player width.
- Landing (touchdown) is more forgiving: minimum overlap is 10% of player width.
- 10% overlap rule applies on landing from air.
- 25% overlap rule applies while staying supported and when stepping off.

### Collision Robustness
- Elevator landing uses previous and current elevator surface position (continuous-style check between frames).
- Small vertical epsilon tolerance is used to reduce false misses on landing.
- Ceiling collision is enabled for selected platforms (`solidFromBelow = true`) to block upward pass-through.

## Mechanics Change Log

## 2026-03-06

### v0.1.0 - Initial playable prototype
- Created base file structure and first playable implementation.
- Added world generation with safe sections + shafts + elevators.
- Added player movement, variable jump, gravity, collisions, score, game over and restart.

### v0.1.1 - Elevator landing reliability fix
- Fixed issue where player could fall through moving elevators.
- Landing check now accounts for elevator movement during frame (`previousY -> currentY`) plus small tolerance.

### v0.1.2 - Elevator width increase
- Increased `elevatorWidth` by 33% (`66 -> 88`) to improve platforming accessibility.

### v0.1.3 - Support overlap relaxed
- Changed support/landing requirement from center-based support to minimum 25% horizontal overlap of player width.
- Applies both to landing and maintaining support while standing/moving.

### v0.1.4 - Score-based speed scaling
- Added automatic world speed increase: each 1000 score raises scroll speed by 10%.
- Added HUD indicator in the top-right corner showing current acceleration percent.

### v0.1.5 - Randomized platform heights with death-zone-safe bounds
- Added random vertical platform generation for safe sections.
- Added jump-aware vertical bounds so jumping from platforms does not push player outside death zone.
- Added capped per-segment vertical shift to keep transitions readable and playable.

### v0.1.6 - Vertical delta scaled to playable area
- Changed platform vertical step limit from fixed pixels to dynamic ratio of playable area height.
- Maximum Y change per generated platform section is now 20% of playable height.

### v0.1.7 - Double jump unlock icon at 5000 score
- Added score-gated icon spawn at right screen edge on platform-only condition.
- Added icon pickup collision and unlock of airborne second jump.
- Double jump state resets per landing cycle, enabling one extra mid-air jump each jump sequence.

### v0.1.8 - Width expansion and safer shaft generation
- Changed platform and shaft width generation to allow expansion up to +50%.
- Kept elevator minimum width unchanged and added random elevator width up to +50%.
- Icon spawn on unlock platform now appears at platform midpoint.
- Shaft elevator count now scales with shaft width to avoid impossible jumps.

### v0.1.9 - Lowered double jump unlock threshold for testing
- Changed double jump icon unlock score from 5000 to 2500 to speed up gameplay testing.

### v0.1.10 - Timed double jump effect with recurring spawn
- Changed double jump from permanent unlock to timed effect (10s per pickup).
- Added stacking pickup behavior (+10s if picked up while active).
- Added recurring icon spawns after random 5-15s delay following initial unlock spawn.
- Added top-center HUD display with active/off status and remaining double jump time.

### v0.1.11 - Platform lengths increased by 50%
- Increased both minimum and maximum generated safe platform lengths by +50%.
- Left shaft and elevator generation unchanged.

### v0.1.12 - Slow icon with recurring spawn
- Added new slow icon unlock when speed reaches 200%.
- Spawn position is 1/4 of platform from left edge on nearest appearing platform.
- Each pickup halves current speed and speed growth then continues normally from that reduced value.
- Added recurring random respawn interval of 10-20 seconds.

### v0.1.13 - Stacked platforms with underside collision
- Added random stacked platform pairs every 3-6 platform sections.
- Upper platform height offset is random between roughly one-jump and two-jump range while staying in safe bounds.
- Upper stacked platforms now block movement from below (ceiling collision), preventing pass-through on jump/double jump.

### v0.1.14 - Score bag bonus icon
- Added random score bag icon spawns on platforms every 5-20 seconds.
- Pickup grants immediate +2000 score bonus.
- Score bonus is included in total score and therefore also increases game speed through existing score-based scaling.

### v0.1.15 - Score bag spawn moved to right-edge appearing platforms
- Changed score bag spawn from random in-scene platform to platforms that appear on the right edge.
- This makes bag location visible earlier so player can plan route to pickup.

### v0.1.16 - Stacked platform minimum gap increased
- Changed minimum vertical gap for stacked platforms to fixed `4x` player height.

### v0.1.17 - Frequent coin system on platforms and elevators
- Added timed platform coin spawn: first after 3s, then every 0.5-2s on right-edge appearing platforms.
- Added elevator coin carriers per shaft (min 1, max 3).
- Elevator coin reappears after elevator wrap/reset cycle if it was not available.
- Coin pickup now adds +200 score bonus.

### v0.1.18 - More forgiving landing overlap
- Reduced required horizontal overlap for landing to 10% of player width.
- Kept support/step-off requirement unchanged at 25%.

### v0.1.19 - Mobile on-screen controls
- Added touch controls overlay for mobile play.
- Left bottom button controls jump.
- Right bottom buttons control left/right movement.
- Keyboard controls remain unchanged on desktop.

### v0.1.20 - Mobile device detection and responsive viewport fit
- Added runtime detection of mobile device/browser.
- On mobile, game shell now auto-fits to current window size while preserving aspect ratio.
- Mobile layout reapplies on window resize/orientation change.
- On-screen touch controls are hidden on desktop and enabled on mobile.

### v0.1.21 - Touch visibility/opacity and full-screen game-over restart
- Touch controls now bind only on detected mobile devices.
- Increased touch button transparency (about 50% more transparent than previous state).
- Game over overlay is now full-screen and acts as a clickable restart button.

### v0.1.22 - Mobile force-fullscreen attempt
- Added mobile-only fullscreen request logic tied to first user gesture.
- Fullscreen attempt triggers from key/tap interactions (canvas, touch buttons, game-over tap).
- Added fullscreen state sync on `fullscreenchange`.

### v0.1.23 - Session max score in HUD
- Added `Max Score` under current score in HUD.
- Max score tracks highest value across multiple runs in same page session.
- Value is in-memory only and resets after page/tab close.

### v0.1.24 - Double-jump expiry flash warning
- Added visual warning when double jump timer expires.
- All platforms and elevators flash red for 0.5s, then return to default colors.

### v0.1.25 - Dedicated tuning override file
- Added `tuning.js` for mechanic-level overrides without editing core defaults.
- `config.js` now merges defaults with `window.HrrraTuning` values.

### v0.1.26 - In-game mechanics admin panel
- Added bottom-right `Admin` button opening a graphical mechanics editor.
- Added live numeric inputs for key tuning values (speed scaling, jump, slow, score bag, coins, elevator speed).
- Changes apply immediately to runtime config object.

### v0.1.27 - Admin tuning persistence via localStorage
- Admin panel value edits are now saved to browser `localStorage`.
- Saved values are loaded on next page open/reload in the same browser.

### v0.1.28 - Admin default reset button
- Added `Default` button in admin panel.
- Button restores values from configuration defaults (loaded from files) and overwrites localStorage with those values.

### v0.1.29 - Admin panel pauses gameplay
- Opening the admin panel now pauses game updates.
- Closing the admin panel resumes gameplay.

### v0.1.30 - Admin panel grouped by mechanic sections
- Admin controls are now visually separated into mechanic sections (Speed, Double Jump, Slow, Score Bag, Coin, Movement/Physics, Elevators).

### v0.1.31 - Two gameplay control modes
- Added in-game mode switch buttons: `Full Mode` and `Jump Mode`.
- Full Mode keeps existing controls (left/right + jump).
- Jump Mode keeps jump-focused simplified control flow.
- In Jump Mode, on-screen jump button is shown even on desktop for one-button play.

### v0.1.32 - Per-mode configuration loading and persistence
- Added per-mode config loading pipeline: defaults -> mode file overrides -> mode localStorage overrides.
- Admin panel changes are now saved separately for each mode.
- Switching mode now reloads that mode configuration and restarts the run.

### v0.1.33 - Duplicated admin editors for Mode 1 and Mode 2
- Admin panel now renders two full editor blocks: `Full Mode` and `Jump Mode`.
- Each block has its own `Default` button.
- Editing in one block updates storage for that mode only.
- `Default` in one block resets only that mode and does not modify the other mode.

### v0.1.34 - Ground movement changed to speed-relative percent
- Replaced ground movement from absolute value to speed-relative percents (`moveSpeedGroundPercentL` and `moveSpeedGroundPercentR`).
- Example behavior:
- `0%`: left/right does not change world speed.
- `100%`: left cancels world speed to stop; right doubles movement speed.

### v0.1.35 - Mode 2 admin cleanup
- `Move speed ground (% of speed)` is hidden in Mode 2 admin editor because horizontal controls are disabled there.

### v0.1.36 - Mode 2 air movement field hidden
- `Move speed air` is also hidden in Mode 2 admin editor since horizontal movement controls are disabled in that mode.

### v0.1.37 - Separate ground speed tuning for left and right
- Split ground speed percent into two values:
- `moveSpeedGroundPercentL` for left input effect
- `moveSpeedGroundPercentR` for right input effect
- Allows different slowdown/acceleration tuning for left vs right in Mode 1.

### v0.1.38 - Blocker hazard mechanic
- Added new blocker hazard icon spawning on platforms only.
- Collision with blocker now ends the run immediately.
- Added admin tuning keys (for both modes): unlock score and spawn min/max interval.

### v0.1.39 - Blocker spawn placement and mode label swap
- Blocker now spawns only on the platform appearing at the right edge of the screen (never mid-screen random spawn).
- Swapped visible mode labels to match behavior:
- Mode 1 = `Full Mode`
- Mode 2 = `Jump Mode`

### v0.1.40 - Full Mode on-screen control zones
- Updated on-screen controls for Full Mode:
- left half of screen = jump
- right top half = move right
- right bottom half = move left
- Jump Mode keeps one-button jump-only touch area.

### v0.1.41 - Pre-run briefing screen
- Added instruction screen before each run starts.
- Briefing includes desktop controls, mobile controls, money bag reward, coin reward, and blocker warning.
- Run starts after pressing `Start Run` or `Enter`/`Space`.

### v0.1.42 - Hidden touch overlay visuals
- Touch control zones remain functional but are visually hidden during gameplay.
- Control instructions are provided in the pre-run briefing screen instead of visible overlay buttons.

### v0.1.43 - Full Mode control diagram in briefing
- Added visual control diagram to pre-run briefing for Mobile Full Mode (Jump/Right/Left split layout).

### v0.1.44 - Anti-overlap spacing for mechanic icons (2026-03-09)
- Added spawn validation so mechanic icons never overlap and keep a minimum distance of `3x player width`.
- Applied to all major icon spawns: Double Jump, Slow, Score Bag, Blocker, Platform Coin, and also checked against active Elevator Coins.
- Why: prevents impossible pickups and unclear stacked icon situations.

### v0.1.45 - Per-mode Max Score persistence and reset (2026-03-09)
- Max Score is now saved to localStorage separately for `Full Mode` and `Jump Mode`.
- Added `Reset max Score` button next to `Default` in each admin mode block; reset affects only that specific mode and writes value `0`.
- Why: keeps highscores independent per control mode and allows quick per-mode reset.

### v0.1.46 - Game Over run recap (2026-03-09)
- Added Game Over recap lines under final score: `Run Time`, `Coins collected`, and `Bags collected`.
- Run time counts active run duration; coin count includes platform and elevator coins.
- Why: gives immediate run summary feedback without opening admin or logs.

### v0.1.47 - Jump Mode base double jump + timed tripple jump (2026-03-09)
- In `Jump Mode`, double jump is now always active by default.
- Picking a double jump icon while double jump is already active now starts `Tripple Jump` for `tripleJumpEffectSeconds` (default 10s); when it ends, prior double-jump timer resumes from the saved remaining time.
- Added HUD line for `Tripple Jump` remaining time (displayed below double jump) and a new admin section `Tripple Jump` with `Effect seconds`.
- Why: adds a higher-risk timing burst while preserving previously earned double-jump time.

### v0.1.48 - Per-jump tuning sections and Single Jump placement (2026-03-09)
- Renamed the jump-physics admin area into `Single Jump` and moved it above `Double Jump`.
- Added separate jump physics parameters (`gravity`, `initial velocity`, `hold acceleration`, `hold max time`) for `Single Jump`, `Double Jump`, and `Tripple Jump`.
- `Jump Mode` now hides `Single Jump` settings entirely in admin.
- Why: allows independent balancing for each jump stage and cleaner mode-specific admin UX.

### v0.1.49 - Spawn platform stability fix after jump-config split (2026-03-09)
- World jump-rise estimation now uses `singleJump*` config keys, so platform bounds generation stays valid.
- Player spawn Y is now taken from `world.currentPlatformY` instead of static `platformY`.
- Why: prevents immediate run-start fall caused by invalid first platform placement/spawn mismatch.

### v0.1.50 - Three-parameter speed progression (2026-03-10)
- Speed now uses three tunable parameters: start score (`speedStepScore`), speed gain per step (`speedStepMultiplier`), and next-step score multiplier (`speedStepScoreMultiplier`).
- Added `speedStepScoreMultiplier` to admin `Speed` section for both modes.
- Behavior:
- `1x`: linear thresholds (`1000`, `2000`, `3000`, ...)
- `2x`: geometric thresholds (`1000`, `2000`, `4000`, `8000`, ...)
- `3x`: geometric thresholds (`1000`, `3000`, `9000`, ...)
- Why: enables both linear and exponential pacing without changing speed bonus value.

### v0.1.51 - Flash warning on Tripple Jump end (2026-03-10)
- Added the same 0.5s red flash trigger for platforms and elevators when `Tripple Jump` expires.
- Applies in both `Jump Mode` and `Full Mode`.
- Why: keeps expiry feedback consistent with existing double-jump end warning.

### v0.1.52 - Mobile viewport fill for width and height (2026-03-10)
- On mobile detection, game shell now fills full viewport width and full viewport height (`window.innerWidth` / `window.innerHeight`).
- Removed aspect-ratio fit logic for mobile so the game stretches to match display dimensions in both axes.
- Desktop keeps previous centered responsive behavior.
- Why: ensures mobile version uses full available screen area in width and height.

### v0.1.53 - Updated default tuning values for both modes (2026-03-10)
- Set `speedStepScoreMultiplier` default to `2` (next speed threshold growth).
- Set `doubleJumpHoldMaxTime` default to `0.25`.
- Applied in project defaults so both modes inherit these values by default.
- Why: aligns baseline pacing and double-jump hold behavior with requested default tuning.

### v0.1.54 - Default startup mode switched to Jump Mode (2026-03-10)
- Game now starts in `Jump Mode` by default unless player switches mode manually.
- Updated pre-run briefing text for Mobile Jump Mode to explicitly state that Double Jump is enabled by default.
- Why: makes default run behavior match jump-focused onboarding and control expectations.

### v0.1.55 - Player rotation lock while jumping (2026-03-10)
- Added square rotation animation during ground movement, with rotation speed tied to movement speed.
- On jump start, the square now rotates into a base aligned orientation and stays locked in that orientation while airborne.
- After landing, rotation resumes automatically.
- Why: matches requested jump readability behavior (stable in-air pose, rotating on ground).

### v0.1.56 - Forward-only jump alignment (2026-03-10)
- Jump alignment now always snaps forward to the next quarter-turn in current rotation direction (never to nearest/backward step).
- Why: keeps rotation progression visually consistent during jump takeoff.

### v0.1.57 - Clockwise jump alignment rule (2026-03-10)
- On every jump start, player rotation now aligns to the nearest horizontal aligned step strictly in clockwise direction.
- Alignment direction no longer depends on current movement direction.
- Why: enforces one consistent visual rule for takeoff orientation.

### v0.1.58 - Forced clockwise lock approach (2026-03-10)
- Changed in-air alignment interpolation to use clockwise-only angle stepping (no shortest-path fallback).
- Player can no longer finish jump alignment counter-clockwise in edge wrap cases.
- Why: guarantees strict clockwise behavior for every jump alignment.

### v0.1.59 - 360 spin for in-air jump actions (2026-03-10)
- Kept first jump takeoff from platform/elevator as clockwise alignment to horizontal.
- Added 360-degree clockwise spin trigger for every jump action started while already airborne (double/tripple and any in-air jump case).
- Landing still stops spin and resumes normal ground rotation.
- Why: distinguishes takeoff alignment from mid-air jump boosts with clear motion feedback.

### v0.1.60 - In-air jump spin reduced to 180 (2026-03-10)
- Changed airborne jump action spin from 360 degrees to 180 degrees clockwise.
- First takeoff alignment behavior remains unchanged.
- Why: shortens mid-air rotation while keeping visual jump feedback.

### v0.1.61 - Hard minimum stacked-platform vertical gap (2026-03-12)
- Added hard clamp for stacked platform generation so vertical gap is never below `3x` player size.
- Works even if admin/config value is set lower than `3`.
- Why: prevents too-tight stacked gaps where player cannot fit between platforms.

### v0.1.62 - Projectile hazard mechanic with per-mode admin tuning (2026-03-12)
- Added new flying projectile hazard that spawns at random vertical positions and random intervals.
- Spawn timing is controlled by `projectileRespawnMinSeconds`/`projectileRespawnMaxSeconds` and unlocks after `projectileUnlockScore` (default `5000`).
- Projectile movement speed is based on world speed with multiplier `projectileSpeedMultiplier` (default `1.5`, i.e., 50% faster than platform scroll on screen).
- Collision with projectile ends the run (same outcome as other lethal hazards).
- Added full admin controls for projectile parameters for both modes.
- Why: introduces dynamic mid-air threat scaling with speed and score progression.

### v0.1.63 - Projectile death icon transition before Game Over (2026-03-12)
- On projectile hit, player is replaced by a tombstone-style death icon at player position.
- Icon animates to screen center while scaling to 500% of starting size, then stays for 1 second.
- Game Over overlay is shown only after this transition finishes.
- Why: adds clear visual death feedback specific to projectile hits.

### v0.1.64 - RIP death transition also for blocker collision (2026-03-12)
- Blocker collision now triggers the same RIP icon transition flow as projectile collision.
- Game Over is delayed until the shared RIP transition animation completes.
- Why: unifies lethal-hit feedback across blocker and projectile hazards.

### v0.1.65 - Added Projectile 2 hazard variant (2026-03-12)
- Added second projectile hazard using the same behavior as Projectile 1: score unlock, random airborne spawn, lethal collision, and shared death transition.
- Projectile 2 uses its own tuning keys: `projectile2UnlockScore`, `projectile2RespawnMinSeconds`, `projectile2RespawnMaxSeconds`, `projectile2SpeedMultiplier`.
- Default Projectile 2 timing is `3-8s`, and speed is `0.75x` world/platform speed.
- Added admin panel controls for Projectile 2 in both modes.
- Why: adds a second independent aerial threat stream with its own pacing.

### v0.1.66 - Enforced true minimum stacked-platform clear gap (2026-03-12)
- Fixed stacked platform generation so the empty vertical gap between lower and upper platform is never below `3x` player height.
- If the upper platform cannot fit inside safe top bounds while keeping that minimum clear gap, the stacked platform is skipped instead of spawning too tight.
- Why: aligns generation with the required readable/player-passable minimum spacing.

### v0.1.67 - Hazard visuals changed to red (2026-03-12)
- Changed Blocker render color to red.
- Changed Projectile 1 and Projectile 2 render color to red.
- Why: makes lethal hazards visually consistent and easier to recognize.

### v0.1.68 - Configurable lives system by game mode (2026-03-13)
- Added per-mode lives count with allowed range `1-5` and admin controls for both `Full Mode` and `Jump Mode`.
- Added life indicators under the active mode button: remaining lives are blue player squares and lost lives are red squares.
- If configured lives are `1`, no life squares are rendered and supported hazards remain immediately fatal.
- Lives can be configured to apply separately to top death zone, projectiles (`Projectile 1` + `Projectile 2`), and blocker.
- On non-final life loss from an enabled source, the run continues instead of ending immediately.
- Bottom death zone remains always instantly fatal regardless of lives.
- Why: adds adjustable forgiveness without changing the hard-fail floor hazard.

### v0.1.69 - Global admin toggle for mobile auto-fullscreen (2026-03-13)
- Added one global admin checkbox at the top of the admin panel controlling whether the game auto-requests fullscreen on mobile.
- This setting is shared across both game modes and is enabled by default.
- When unchecked, the game no longer auto-switches itself to fullscreen.
- Why: keeps the current fullscreen behavior by default while allowing it to be disabled globally.

### v0.1.70 - Top death zone life loss now bounces in place (2026-03-13)
- Changed top death zone life-protected behavior so it no longer respawns the player to the latest grounded point.
- On top death zone hit with remaining protected lives, the player loses one life, is stopped at the top line like a ceiling collision, and continues from the current position.
- Projectile and blocker life loss behavior remains separate from the top death zone handling.
- Why: keeps top-boundary punishment local to the mistake instead of teleporting the player away.

### v0.1.71 - Orange background flash on non-final life loss (2026-03-13)
- Added a `0.25s` orange background flash whenever the player loses a life but the run continues.
- The flash applies to non-final life loss from top death zone, projectiles, and blocker when life protection is enabled.
- Final death still goes through the normal RIP / Game Over flow without this life-loss flash.
- Why: gives immediate feedback that a life was consumed without confusing it with final death.

### v0.1.72 - Projectile and blocker life loss now continue in place (2026-03-13)
- Changed projectile and blocker life-protected behavior so the player no longer respawns after those hits.
- On non-final hit, the projectile or blocker is cleared and the player continues from the current position as if the hazard were no longer there.
- Top death zone keeps its separate ceiling-style bounce behavior.
- Why: makes non-final hazard hits less disruptive and keeps movement continuity.

### v0.1.73 - Increased default Projectile 2 speed multiplier (2026-03-13)
- Changed default `projectile2SpeedMultiplier` to `2` for both game modes.
- This applies unless a mode-specific or stored admin override replaces it.
- Why: makes Projectile 2 more aggressive by default across the whole game.

### v0.1.74 - Blocker respawn now counts from spawn time (2026-03-13)
- Changed blocker spawning so the next blocker timer starts immediately when the previous blocker spawns.
- Blockers are now tracked as multiple simultaneous active hazards instead of a single shared blocker slot.
- This allows multiple blockers to be visible at once when `blockerRespawnMinSeconds` / `blockerRespawnMaxSeconds` are short enough.
- Why: aligns blocker spawning with the expected interval behavior and supports overlapping blockers on screen.

### v0.1.75 - Jump Mode blocker defaults adjusted (2026-03-13)
- Set Jump Mode default blocker tuning to `blockerUnlockScore = 3000`, `blockerRespawnMinSeconds = 2`, `blockerRespawnMaxSeconds = 5`.
- Full Mode blocker defaults remain unchanged.
- Why: gives Jump Mode its own baseline blocker pacing without affecting Full Mode.

### v0.1.76 - Two-step briefing screen with mode and difficulty selection (2026-03-16)
- Reworked the pre-run screen into a two-step flow: first select `Jump Mode` or `Full Mode` and choose `Easy` / `Hard`, then open a detailed briefing for the selected mode.
- Added prepared difficulty override layer support so future `Hard` defaults can diverge from `Easy`; currently both are identical.
- Mode-specific briefing now shows control instructions and live values read from the actual applied config, including current admin overrides.
- Added projectile warning entry (`do not touch`) alongside blocker, money bag, and coin briefing items.
- Why: makes the game start flow clearer and prepares the UI for separate difficulty presets.

### v0.1.77 - Start flow now closes the admin panel explicitly (2026-03-16)
- Moved admin panel open/close handling into a shared function used outside the admin button bindings.
- Opening the briefing screen and pressing `Start Run` now both force the admin panel closed before gameplay continues.
- Why: prevents gameplay from running behind an accidentally still-open admin overlay.

### v0.1.78 - Briefing screen now hides admin UI completely (2026-03-16)
- While the pre-run / briefing screen is active, the admin button is hidden and the admin panel is forcibly closed.
- This applies both on initial page load and whenever the game returns to the briefing flow.
- Why: prevents admin UI from being visible behind the translucent briefing overlay.

### v0.1.79 - Admin panel hiding hardened with native hidden state (2026-03-16)
- Admin panel now uses both the shared `.hidden` class and the native `hidden` attribute.
- Restart flow also force-closes the admin panel before rebuilding a run.
- Why: prevents stale or cached UI state from leaving the admin panel visible on initial page load.

### v0.1.80 - Simplified second briefing screen and moved hazard icons before labels (2026-03-16)
- Removed the extra `Current Settings` block from the second briefing screen.
- Hazard/bonus rows now render the in-game style icon before the label for `Money Bag`, `Coin`, `Blocker`, and `Projectile`.
- Cleaned the second briefing layout to focus on controls plus the hazard/bonus legend.
- Why: makes the second briefing screen easier to scan and visually clearer.

### v0.1.81 - Briefing subtitle now shows difficulty and lives (2026-03-16)
- Changed the second briefing subtitle from `Easy briefing` / `Hard briefing` to a compact label with difficulty plus current configured lives.
- Example format: `Easy | Lives: 5`.
- Why: surfaces the most important run setup info without needing a separate settings block.

### v0.1.82 - In-game mode switch replaced with active mode indicator (2026-03-16)
- Removed in-game mode switching from the top HUD.
- HUD now shows only the currently active mode as a non-interactive label, while the other mode is hidden completely.
- Life indicators remain displayed only under the active mode label.
- Why: mode selection now belongs to the briefing flow, so the in-game HUD should only report the chosen mode.

### v0.1.83 - Difficulty presets now define default lives (2026-03-16)
- Set default `Easy` lives to `5` for both `Jump Mode` and `Full Mode`.
- Set default `Hard` lives to `1` for both `Jump Mode` and `Full Mode`.
- Left all other difficulty preset values unchanged.
- Why: establishes the first meaningful difference between Easy and Hard without changing the rest of the tuning yet.

### v0.1.84 - Added distance score multiplier tuning (2026-03-16)
- Added configurable `distanceScoreMultiplier` affecting only score gained from traveled horizontal distance.
- Bonus score from `Coin` and `Money Bag` remains unchanged and is still added separately on top.
- Added `distanceScoreMultiplier` field to the admin panel under `Speed`.
- Why: allows score pace to differ across presets such as `Easy x2` or `Hard x0.5` without changing movement speed.

### v0.1.85 - Admin mode order changed to Jump first (2026-03-16)
- Changed admin panel mode section order so `Jump Mode` is rendered before `Full Mode`.
- Mechanics and stored values remain unchanged; only the admin panel order was adjusted.
- Why: matches the preferred workflow where Jump Mode is edited more often.

### v0.1.86 - Admin panel split into Hard and Easy columns (2026-03-16)
- Reworked the mechanics admin into two side-by-side difficulty columns: `Mechanics Hard Admin` and `Mechanics Easy Admin`.
- Each difficulty column now contains its own `Jump Mode` and `Full Mode` settings sections.
- Admin values are now saved and loaded per difficulty plus per mode, instead of only per mode.
- Max score storage and reset behavior now also follow the selected mode and difficulty combination.
- Why: prepares the project for real divergence between Easy and Hard tuning while keeping both editable at the same time.

### v0.1.87 - Game Over now shows all stored mode+difficulty high scores (2026-03-16)
- Added a stored high score summary to the Game Over screen.
- The overlay now shows all four localStorage-backed combinations: `Easy Jump`, `Easy Full`, `Hard Jump`, and `Hard Full`.
- Values are read from the same per-mode, per-difficulty max score storage used during gameplay.
- Why: makes it easy to compare run results against every configured variant without reopening admin.

### v0.1.88 - Enlarged HUD and Game Over typography with depth styling (2026-03-16)
- Increased in-run HUD text size by roughly 100% and added light outline/shadow styling for a more dimensional look.
- Increased Game Over heading and summary text size by roughly 200% and added stronger layered text shadow styling.
- Why: improves readability and gives both live HUD and Game Over feedback more visual presence.

### v0.1.89 - Reverted live HUD typography change, kept Game Over enlargement (2026-03-16)
- Restored in-run HUD text to its previous smaller size and simpler styling.
- Kept the enlarged, more dimensional Game Over typography unchanged.
- Why: limits the stronger text treatment to the Game Over screen only.

### v0.1.90 - Admin difficulty columns reordered to Easy then Hard (2026-03-16)
- Changed admin panel difficulty column order so `Mechanics Easy Admin` is rendered on the left and `Mechanics Hard Admin` on the right.
- Stored values and per-mode settings remain unchanged.
- Why: matches the preferred editing order without changing any existing tuning data.

### v0.1.91 - Local admin tuning promoted to built-in defaults (2026-03-16)
- Copied the currently stored local admin tuning into the built-in difficulty defaults for all four combinations: `Easy Jump`, `Easy Full`, `Hard Jump`, and `Hard Full`.
- This includes the current per-difficulty/per-mode values such as lives, score multipliers, projectile timings, blocker timings, and bonus values where they were customized in admin.
- Unchanged fields still inherit from the shared base defaults.
- Why: preserves the locally tuned admin setup even if browser storage is cleared.

### v0.1.92 - Second briefing now shows what costs one life vs InstaDeath (2026-03-16)
- Added a compact status line under the selected mode / difficulty / lives summary on the second briefing screen.
- The line now shows `Top Death Zone`, `Projectiles`, and `Blocker` as either `Lose 1 Life` or `InstaDeath`, based on the current admin settings for the selected mode and difficulty.
- If the run has only `1` life configured, all three entries show `InstaDeath`.
- Why: makes the active life-loss rules visible before the run starts.

### v0.1.93 - Briefing and Game Over overlays made mobile-responsive (2026-03-16)
- Added viewport-constrained height, internal scrolling, and responsive padding so briefing overlays always fit inside the visible screen.
- Added a smaller mobile typography/layout breakpoint for briefing cards, difficulty buttons, mode cards, and Game Over content.
- Constrained Game Over content widths and made the stored high score box scale down cleanly on narrow screens.
- Why: prevents overlay text and panels from overflowing off-screen on mobile devices.

### v0.1.94 - Added low-height landscape scaling for briefing and Game Over overlays (2026-03-16)
- Added a dedicated responsive breakpoint for mobile landscape screens with low viewport height.
- In that state, headings, body text, buttons, diagrams, paddings, and panel spacing all scale down further to fit within the available height.
- The goal is to reduce or avoid the need for vertical scrolling in mobile landscape orientation.
- Why: landscape mobile layout is constrained primarily by height, so width-only responsiveness was not enough.

### v0.1.95 - Stored High Scores box background made fully opaque (2026-03-16)
- Changed the `Stored High Scores` panel background from translucent white to solid white.
- Text inside the panel now stays readable even when bright or dark gameplay elements remain visible behind the Game Over overlay.
- Why: transparent panel background caused the high score text to blend with the paused game scene.

### v0.1.96 - Removed 3D text effect from Stored High Scores panel (2026-03-16)
- Removed text shadow styling from the `Stored High Scores` heading and score rows.
- The panel now uses plain black text on white background without the inherited Game Over depth effect.
- Why: the shadowed 3D text reduced readability and looked blurred inside the white score panel.

### v0.1.97 - Added Capacitor web asset copy and sync workflow (2026-03-16)
- Added a local Node copy script that mirrors the required game files into the Capacitor `www` directory.
- Added `npm` scripts for `copy:web`, `cap:sync`, `android`, and `android:run` so Android iterations no longer require manual file copying.
- The Android wrapper can now be refreshed from the current web game with a single command sequence.
- Why: prepares the project for repeated Android testing and future Play Store work without manual asset management.

### v0.1.98 - Android wrapper now uses immersive fullscreen with swipe-to-show system bars (2026-03-16)
- Updated the native Android `MainActivity` to hide status and navigation bars using immersive mode.
- System bars are hidden on create, resume, and regained window focus so the game returns to fullscreen reliably.
- Bars can still be temporarily revealed by user swipe, matching standard Android immersive behavior.
- Why: keeps gameplay fullscreen in landscape while preserving expected Android gesture access to system navigation.

### v0.1.99 - Android app locked to landscape orientation (2026-03-16)
- Locked the Android wrapper activity to `sensorLandscape`.
- The app now stays in landscape while still allowing both left-landscape and right-landscape device rotation.
- Why: gameplay and UI are designed around landscape layout on mobile.

### v0.1.100 - Prepared three local splash screen concept artworks (2026-03-16)
- Added three SVG splash concept mockups for review: `runner-scene`, `danger-jump`, and `iconic-minimal`.
- The concepts visually reflect Hrrra's core mechanics such as platforms, the blue player square, blocker, projectile, and score pickups.
- Stored them under `assets/splash-concepts` for selection before creating final Android splash assets.
- Why: gives a concrete visual basis for choosing the Android splash direction before polishing production artwork.

### v0.1.101 - Replaced Android splash screen with final selected artwork (2026-03-16)
- Removed the temporary concept direction and applied the provided `assets/hrrra-splash.png` artwork as the Android splash screen.
- Replaced all current Android `splash.png` drawable variants with that selected image so the same art is used across splash densities/orientations.
- Why: switches the Android wrapper from placeholder concept art to the chosen final splash visual.

### v0.1.102 - Fixed Android launch theme to actually use splash artwork (2026-03-16)
- Corrected the Android launch theme so it uses proper SplashScreen theme attributes instead of only a background entry.
- Added `windowSplashScreenAnimatedIcon`, `windowSplashScreenBackground`, and `postSplashScreenTheme` to the launch theme while keeping the drawable as the window background fallback.
- Why: the previous launch theme configuration did not reliably display the selected splash image during app startup.

### v0.1.103 - Replaced Android system splash with custom 2s fullscreen splash activity (2026-03-16)
- Added a dedicated Android `SplashActivity` that shows the selected splash artwork full-screen for `2` seconds before launching the game activity.
- The splash now uses a full-screen `ImageView` with `centerCrop`, instead of Android's small centered SplashScreen icon behavior.
- Both splash and game activities remain locked to landscape and keep immersive fullscreen behavior.
- Why: the desired startup experience is a true full-screen artwork, not the default Android 12+ circular splash icon presentation.

## Update Rule
- For every mechanic change, append:
- date
- version tag (increment patch: `v0.1.x`)
- what changed
- why (1 sentence max)
