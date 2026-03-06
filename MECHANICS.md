# Hrrra - Mechanics Documentation

This file is the source of truth for gameplay mechanics.
Every gameplay-related change must be added here with date and short reason.

## Current Mechanics (Prototype)

### Core Loop
- Side-scrolling endless platform prototype rendered on HTML5 canvas.
- Player progresses to the right while camera keeps the player around 25% of screen width.
- Score is based on traveled distance to the right.
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

### HUD
- Left top: score.
- Top center: double jump status and remaining time.
- Right top: current speed acceleration percentage over base speed (`Speed +X%`).

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
- Crossing either line ends the run immediately.

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

## Update Rule
- For every mechanic change, append:
- date
- version tag (increment patch: `v0.1.x`)
- what changed
- why (1 sentence max)
