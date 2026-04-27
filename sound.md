# Sound Routing

Current audio placeholders are valid `.wav` files, but they are silent by design until replaced with real content.

Short `SFX` are currently played through `Web Audio API` for lower latency. Longer screen/gameplay music loops still use the streaming music path.

-------------------

## Global UI / Screen Audio

`assets/ui-sound/ui-button-tap.wav`
- UI button press
- Pre-run buttons
- Admin open/close and admin action buttons
- Badge reset notice confirm
- What's New confirm

`assets/ui-sound/ui-page-open.wav`
- Opening a larger UI page or panel
- Pre-run mode details
- Returning to main pre-run selection
- Opening admin

`assets/ui-sound/ui-badges-page.wav`
- Background audio for the pre-run `Badges` page while that page stays open
- Stops immediately when leaving the `Badges` page

`assets/gfx2/crossing_page/crossing-music-loop.mp3`
- Background audio for the GFX2 crossing page / main pre-run select screen
- Also used while the pre-run `Badges`, `Scores`, `Shop`, and `Settings` pages are open

`assets/ui-sound/ui-badge-reveal.wav`
- Badge reward reveal moment after the intro pause, when the new badge pops in

`assets/ui-sound/ui-prerun-loop.wav`
- Pre-run flow background loop
- Difficulty / detail briefing
- Also covers startup overlays shown before the run while pre-run is active

`assets/ui-sound/ui-level-finished-loop.wav`
- Between-level screen loop
- The screen shown after finishing a level and before starting the next level

`assets/ui-sound/ui-game-over-loop.wav`
- Game Over screen loop
- Starts after the end-of-run badge reward flow is finished, or immediately if no new badge was earned

-------------------

## Level 1 Audio

`assets/level1/sound/l1-music-loop.mp3`
- Main gameplay loop for Level 1 while the run is active
- Also stays active during gameplay-tied sequences like Question Coin, teleport finish, death animation, and badge reward flow until a screen loop takes over

`assets/level1/sound/l1-sfx-jump.wav`
- Any jump start

`assets/level1/sound/l1-sfx-coin.wav`
- Platform coin pickup
- Elevator coin pickup
- Coin pickup through magnet attraction

`assets/level1/sound/l1-sfx-bag.wav`
- Money bag pickup

`assets/level1/sound/l1-sfx-question-coin.wav`
- Question Coin pickup / start of the Question Coin animation

`assets/level1/sound/l1-sfx-cracked-coin.wav`
- Cracked Coin pickup

`assets/level1/sound/l1-sfx-curse.wav`
- Curse pickup

`assets/level1/sound/l1-sfx-life.wav`
- Life pickup
- Life pickup through magnet attraction

`assets/level1/sound/l1-sfx-life-loss.wav`
- Losing one life while the run continues

`assets/level1/sound/l1-sfx-shield.wav`
- Shield pickup

`assets/level1/sound/l1-sfx-shield-break.wav`
- Shield gets consumed to save the player from a protectable death cause

`assets/level1/sound/l1-sfx-magnet.wav`
- Magnet pickup

`assets/level1/sound/l1-sfx-slow.wav`
- Slow pickup

`assets/level1/sound/l1-sfx-teleport.wav`
- Teleport finish animation start

`assets/level1/sound/l1-sfx-death.wav`
- Death animation start when the run actually ends

-------------------

## Levels 2-5 Audio

- `assets/level2/sound/`, `assets/level3/sound/`, `assets/level4/sound/`, and `assets/level5/sound/` now mirror the same file structure as `Level 1`.
- Each level now has its own level-specific filenames (`l2-...`, `l3-...`, `l4-...`, `l5-...`, and `lx-...` for `levelx`) for:
  - gameplay loop
  - jump
  - coin
  - bag
  - Question Coin
  - Cracked Coin
  - Curse
  - life
  - life loss
  - shield
  - shield break
  - magnet
  - slow
  - teleport
  - death
- For now, Levels `2-5` use cloned copies of the current Level 1 sound files so routing is ready immediately, with `levelx` using the `lx-...` prefix.
- This is only a structural placeholder step: the files can now be replaced gradually level by level without changing code or tuning paths again.

-------------------

## Current Scope

Implemented now:
- Global audio toggles and volume in admin
- Global screen/UI sound path mapping
- Per-level sound path mapping in admin
- Level 1 gameplay music and core pickup / event SFX
- Prepared separate sound folders and runtime routing for Levels `2-5`
- Pre-run, between-level, and Game Over screen loops

Not routed yet:
- Separate sounds for blockers / projectiles / level-finish stinger / menu-specific edge cases beyond the current core set
- Unique dedicated sound design for Levels `2-5` beyond the current cloned placeholders
