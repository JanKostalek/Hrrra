# Hrrra - Mechanics Log

- 2026-05-15: Added the `Shopaholic` skills badge progression rule set: the badge now counts unique shop branches, treats `Buy 10 Coins` as a one-time completion after the first purchase, and only counts multi-level shop items once their final `Sold` state is reached.
- 2026-05-15: Updated the Android mine reminder timing so the app now schedules a first storage-full reminder at `current storage fill time + 30 minutes` and a second reminder 6 hours later, then resets both when storage is upgraded or transferred again.
- 2026-05-13: Switched local progress storage to be account-scoped on device so badges, skins, score, and mine wallet/storage now follow the active user, while Guest always loads an empty profile.
- 2026-05-13: Moved the Android mine reminder to the transfer moment: the reminder delay is now computed from the transferred storage coin count and the current harvest interval, so the reminder can fire even if the game is closed before the mine fills again.
- 2026-05-06: Added a purchasable `Short Timer` upgrade in the shop that permanently unlocks a shorter mine coin interval, with the active mine cadence driven by the admin-configurable `mineShortTimerMs` value instead of the default `mineCoinTimerMs` rate.
- 2026-05-06: Split the run continue flow into coin continue and rewarded-ad continue; the first continue screen can still buy lives with coins, while rewarded-ad continue grants 3 lives on Easy or 2 lives on Hard and is available twice per run.
- 2026-04-29: Added an in-game pause hitbox in the top-left corner for levels 1 through LevelX; opening it pauses gameplay updates, keeps the current level music playing, and returns from Settings back into the paused run instead of the crossing page.
- 2026-05-14: Stopped doubling carried `Double Jump` and `Tripple Jump` timers during level transitions in `prepareLevelContinuation()` so the next level starts with the same remaining time that was active at teleport or level finish.
