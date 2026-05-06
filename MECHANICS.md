# Hrrra - Mechanics Log

- 2026-05-06: Added a purchasable `Short Timer` upgrade in the shop that permanently unlocks a shorter mine coin interval, with the active mine cadence driven by the admin-configurable `mineShortTimerMs` value instead of the default `mineCoinTimerMs` rate.
- 2026-05-06: Split the run continue flow into coin continue and rewarded-ad continue; the first continue screen can still buy lives with coins, while rewarded-ad continue grants 3 lives on Easy or 2 lives on Hard and is available twice per run.
- 2026-04-29: Added an in-game pause hitbox in the top-left corner for levels 1 through LevelX; opening it pauses gameplay updates, keeps the current level music playing, and returns from Settings back into the paused run instead of the crossing page.
