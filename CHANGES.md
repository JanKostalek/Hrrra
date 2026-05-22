# Hrrra - Working Changes Log

- 2026-05-22: Bumped the release metadata to 1.0.102 / versionCode 102 and added a root-level `app-ads.txt` publisher declaration so AdMob can verify the site and the Play Console setup.
- 2026-05-22: Added the AdMob `app-ads.txt` publisher declaration to the site root and wired the web sync so Vercel, `www/`, and the Android public mirror all receive the same file.
- 2026-05-21: Bumped the release metadata to 1.0.101 / versionCode 101 for the public release, with the live release note reduced to just `First public version.`
- 2026-05-21: Bumped the release metadata to 1.0.100 / versionCode 100 for the first production Google Play build, updated the release workflow rules to call out the full bump, sync, commit, push, and AAB flow, and switched Android rewarded continue to production IDs while leaving the banner path disabled.
- 2026-05-21: Bumped the release metadata to 1.0.94 / versionCode 94 for the first production Google Play build, and updated the release workflow rules to call out the full bump, sync, commit, push, and AAB flow.
- 2026-05-21: Switched the Android rewarded continue flow from Google test rewarded ads to the production rewarded ad unit from `.key/admob.properties`, while leaving the banner path disabled.
- 2026-05-18: Rebuilt the runtime tuning defaults from the latest local admin export and prepared release 1.0.99 / versionCode 99 for the next AAB build.
- 2026-05-18: Rebuilt the runtime tuning defaults from the current local admin export so the live default values now include the latest global settings and per-level mechanics, then mirrored the result to `www/` and Android public.
- 2026-05-18: Prepared release 1.0.98 by bumping the version metadata to versionCode 98 / 1.0.98 for the next AAB build.
- 2026-05-14: Halved the Rules text side padding again in `style.css` so the content stretches further toward both edges of the framed page.
- 2026-05-14: Halved the side padding of the Rules text frame in `style.css` so the readable area expands further left and right.
- 2026-05-14: Tightened the Rules text framing in `style.css` by making the side padding more stable and reducing the bottom gap so the text sits closer to the image frame.
- 2026-05-14: Expanded the Rules text layout in `style.css` by reducing the frame padding so the readable area grows roughly 20% wider and taller.
- 2026-05-14: Removed the inner beige Rules text card in `style.css` so the page text now sits directly on the framed background artwork.
- 2026-05-14: Embedded the first three Rules/Instructions pages directly into `game.js` and switched the on-screen pager to a 3-page in-memory flow so the viewer no longer depends on external text loading.
- 2026-05-14: Switched the Rules/Instructions page loader in `game.js` from `fetch()` to `XMLHttpRequest` so the `assets/gfx2/rules_scr/page_01.txt` through `page_07.txt` files load reliably in local `file://` runs.
- 2026-05-14: Reworked the Rules/Instructions screen in `index.html`, `game.js`, and `style.css` so the page now loads text from `assets/gfx2/rules_scr/page_01.txt` through `page_07.txt` and switches pages with top-right arrows.
- 2026-05-13: Renamed the advanced scores boards so `full_easy` and `full_hard` now display as `Advanced Easy` and `Advanced Hard` instead of `Full Easy` and `Full Hard`.
- 2026-05-13: Bumped the release metadata to 1.0.91 / versionCode 91 and folded in the latest pre-run briefing and admin password gate changes for the next store build.
- 2026-05-13: Restored the classic pre-run briefing to explicitly say Double Jump is always enabled, while keeping the advanced briefing on the actual dynamic lives-only note.
- 2026-05-13: Added admin-panel controls for enabling/disabling the admin password gate and editing the required password text, while keeping the existing password prompt behavior when the gate is enabled.
- 2026-05-13: Bumped the release metadata to 1.0.89 / versionCode 89 for the account-scoped local profile release and prepared the next store build flow around it.
- 2026-05-13: Split local profile persistence by active user so badges, skins, wallet, mine storage, and max scores now load per account while Guest always starts from a clean, empty profile.
- 2026-05-13: Switched the Android mine reminder scheduler from full-storage tracking to transfer-time scheduling so the reminder delay is now computed from the transferred storage coin count and current harvest interval.
- 2026-05-13: Shifted the pre-run detail level-goal text box 5% lower across the mode screens by nudging the shared `pre-run-level-panel` in `style.css`.
- 2026-05-13: Added an Android-only mine storage reminder bridge and then switched it to transfer-time scheduling so the reminder delay is computed from the transferred storage coin count and the current harvest interval.
- 2026-05-12: Increased only the mine message face for message `15` by 50% in `game.js` and `style.css` so `mine_face_15.png` renders larger without affecting the other mine face graphics.
- 2026-05-12: Nudged the run-screen life hearts 2% upward in the responsive HUD layout so the right-side life row sits slightly higher while keeping the larger 150% sizing.
- 2026-05-12: Moved the run-screen life hearts lower in `game.js` and increased their size to roughly 150% of the previous value by adjusting the responsive `#game-shell`-based HUD layout.
- 2026-05-12: Bumped the release metadata to `1.0.86` / `versionCode 86` so the updated Advanced and Classic hard game-over PNG assets can ship in a fresh Android bundle.
- 2026-05-12: Bumped the release metadata to `1.0.85` / `versionCode 85` and refreshed the live update text in `version-info.js` and `version.json` to match the current HUD release.
- 2026-05-12: Hid the `Jump Advanced` label from the in-game mode switch and forced the top-right lives row to use the same right-side HUD slot as the classic mode so the Advanced HUD matches the Classic layout while still showing its own life count.
- 2026-05-12: Reworked the top-right life HUD in `game.js` and `style.css` so the mode switch positions and heart sizes are recalculated from the current `#game-shell` dimensions instead of staying tied to fixed overlay offsets.
- 2026-05-11: Added an admin password gate (`H3510`) for both admin entry points and made Mine storage transfer require a rewarded ad before moving coins to the wallet.
- 2026-05-06: Renamed the mine timer shop item to `Faster Coin Mining (xx s)` with the duration pulled from the admin-configurable short timer value, and relabeled the mine admin timer field and shop price entry to `Faster Maining`/`Faster Maining Price` in `game.js` and `index.html`.
- 2026-05-06: Reworked the GFX2 shop coin graphic into a `Short Timer` purchase, added admin controls for the short-timer price and mine short-timer duration in `game.js`/`config.js`, and updated the shop text in `index.html` and `game.js` to preview the new mine cadence before buying.
- 2026-05-04: Removed the visible debug styling from the mine exit hotspot and the crossing mine entrance hotspot, leaving both as invisible clickable areas only.
- 2026-05-04: Added a live mine screen refresh in the main frame loop so the storage countdown updates continuously after entering `mine_inside` instead of waiting for a page reload.
- 2026-05-04: Shifted the mine bottom message text another 10 percentage points left, bringing the horizontal offset down to 10% from the original anchor.
- 2026-05-04: Shifted the mine bottom message text 10 percentage points left from the previous 30% right offset, keeping the same vertical placement.
- 2026-05-04: Moved the mine bottom message text 30% to the right relative to its current anchor so the status line can be evaluated against a much stronger horizontal offset.
- 2026-05-04: Moved the mine bottom message text another 3 percentage points up and 30px to the right so the status line sits more naturally in the open lower artwork area.
- 2026-05-04: Moved the mine bottom message text 5 percentage points up and 20px to the right so the "Mined xx coins" line sits closer to the intended artwork area.
- 2026-05-04: Nudged the mine countdown wrapper 1 percentage point left and 1 percentage point down for a finer artwork-relative alignment.
- 2026-05-04: Shifted the mine countdown wrapper 8 percentage points right and 15 percentage points down so the timer anchor follows the current artwork-relative layout.
- 2026-05-04: Shifted the mine storage anchor 3 percentage points to the right while preserving its current vertical placement.
- 2026-05-04: Shifted the mine storage anchor another 3 percentage points lower in the mine scene while keeping the countdown unchanged.
- 2026-05-04: Shifted the mine storage anchor 5 percentage points lower in the mine scene while keeping the countdown unchanged.
- 2026-05-04: Removed the remaining pixel nudges from the mine storage coin total so it now stays anchored with pure percentage positioning like the wallet value.
- 2026-05-04: Nudged the mine storage coin total another 10px to the right, bringing the total horizontal offset to 20px inside the fixed overlay box.
- 2026-05-04: Nudged the mine storage coin total 10px to the right while preserving its 50px downward offset inside the fixed overlay box.
- 2026-05-04: Nudged the mine storage coin total 50px lower inside its fixed overlay box while leaving the countdown anchor untouched.
- 2026-05-04: Reapplied artwork-relative anchoring for the mine storage total and countdown using fixed overlay boxes, matching the wallet-style placement instead of pixel offset tuning.
- 2026-05-04: Reverted the fixed countdown wrapper experiment and restored the earlier mine storage/countdown anchoring so the values sit back in the previous artwork-relative layout.
- 2026-05-04: Re-anchored the mine storage total and countdown into fixed overlay boxes so both sit in stable positions relative to the mine artwork, like the wallet value.
- 2026-05-04: Shifted the mine storage total 40px left and the countdown 20px left while preserving their vertical offsets in the mine artwork.
- 2026-05-04: Nudged the mine storage total 20px lower and the countdown 10px lower to tighten the alignment in the lower mine artwork.
- 2026-05-04: Moved the mine storage total 30px lower and the countdown 20px lower so both labels sit farther down in the mine artwork.
- 2026-05-04: Expanded the mine storage banner so the full `14 / 50` value fits cleanly, and moved the countdown farther up/right into the open lower scene area.
- 2026-05-04: Repositioned the mine storage total deeper into the storage banner and confirmed the countdown sits above the lower text region with its own visible color and stacking.
- 2026-05-04: Gave the mine countdown its own readable color and moved it further down/right into the lower mine area so it stays visible above the bottom text region.
- 2026-05-04: Moved the mine storage value lower and slightly right to follow the arrow-marked placement, and simplified the bottom mine message area to text only without the decorative panel frame.
- 2026-05-04: Moved the mine countdown out of the storage panel and anchored it as a separate plaque in the lower part of the mine scene so it sits in the red-box area beneath the chest.
- 2026-05-04: Moved the mine countdown text lower under the storage total so it sits closer to the arrow-marked placement in the mine artwork.
- 2026-05-04: Simplified the mine storage readout so the screen now shows only the raw `0 / 50` value and countdown time inside the artwork, removing the duplicate `COINS` and `NEXT COIN IN` labels from the mine UI.

- 2026-05-04: Made the post-run badge reward overlay follow the same `Badges v2` trophy source as the badges screen, so unlocked badges use the v2 set in all modes/difficulties when the toggle is enabled.
- 2026-05-04: Removed the shadow filter from the reward trophy image layers so the badge/skin unlock card no longer shows the dark framed outline around the icon.
- 2026-05-04: Forced the post-run badge reward overlay to use the v1 root `assets/gfx2/trophy_pics/trophy_xxx.png` set, independent of the `Badges v2` admin toggle, so new badges no longer inherit the v2 mapping or clean fallback.
- 2026-05-04: Added `trophy_shield_teleporter.png` to the `Badges v2` trophy map in `game.js` so Shield Teleporter uses its dedicated v2 art instead of the clean fallback.
- 2026-05-04: Fixed the `Badges v2` trophy map so `magneto` points to `assets/gfx2/trophy_pics/v2/trophy_magneto.png` instead of the non-prefixed filename fallback.
- 2026-05-04: Fixed the admin `Badges v2` checkbox placement so it renders directly under `Modern visuals` in the Global section instead of only existing in config/state.
- 2026-05-04: Added a `Badges v2` admin toggle under Modern visuals, defaulted it off in `config.js`, and switched the badges trophy renderer in `game.js` to swap between the root trophy art and the new `assets/gfx2/trophy_pics/v2` set with a mode-specific clean fallback.
- 2026-05-04: Added an explicit `teleporter_legends -> trophy_teleporter.png` mapping in `game.js` so the Teleporter badge uses its new root trophy art instead of relying only on slug fallback.
- 2026-05-04: Switched the badges trophy slot to render a single `trophy_xxx` image per badge series with `trophy_clean` as fallback only, mapped the new root `assets/gfx2/trophy_pics` badge art files in `game.js`, and resized the slot art in `style.css` so each badge keeps the previous clean footprint.
- 2026-04-30: Bumped release metadata to `1.0.71` / `versionCode 71` and prepared the latest pause-audio, border, and skin-reward cleanup work for the next build.
- 2026-04-30: Bumped release metadata to `1.0.70` / `versionCode 70` and prepared the current Skin 05 / Grey polish work for the next build.
- 2026-04-30: Added Skin 05 as a purchasable shop skin with a 1000-coin admin price, wired its hero walk/jump frame sets and selection artwork into the GFX2 skin system, and repurposed the classic/advanced slot 5 preview into Skin 05.
- 2026-04-29: Bumped release metadata to `1.0.69` / `versionCode 69` and prepared the current continue shield protection and crossing overlay cleanup work for the next build.
- 2026-04-29: Bumped release metadata to `1.0.68` / `versionCode 68` and prepared the latest gameplay pause and settings polish work for the next build.
- 2026-04-29: Bumped release metadata to `1.0.67` / `versionCode 67` and prepared the current crossing and gameplay debug/layout cleanup work for the next build.
- 2026-04-28: Bumped release metadata to `1.0.66` / `versionCode 66` and prepared the Settings artwork mute hitboxes so tapping the guitar or `Zzzzap` graphic toggles music and SFX directly from the image.
- 2026-04-28: Synced the `1.0.66` release metadata into the web root and Android public assets so the packaged app and update check stay on the same version.
- 2026-04-29: Added an in-game pause hitbox in the top-left corner for all gameplay levels, wired Settings to return back into the paused run, and kept the current level music playing while paused.
- 2026-04-29: Switched Level 5 to its dedicated `assets/level5/level5_border.png` artwork and included the updated border PNGs from the level folders in the next release work.
- 2026-04-24: Bumped the release metadata to `1.0.56` / `versionCode 56` after adding the `levelx` packaging path and the LevelX platform hookup.
- 2026-04-24: Level 5 now prefers `assets/levelx/levelx_platform.png` before the generic Level 5 platform fallback, so the bonus skin no longer gets masked by the old platform art once it is unlocked.

- 2026-04-24: Wired `assets/levelx/levelx_platform.png` into the Level 5 platform resolver so the bonus LevelX skin can swap the endless level platform art the same way it already swaps background and border art.
- 2026-04-24: Reduced the top-left `Max Score` HUD label font size by 50% in `game.js` while keeping the `Score` line unchanged.

- 2026-04-24: Made the GFX2 shop status row show `You don´t have enough coins to buy it.` when `New Level` is selected but the wallet cannot afford it, instead of falling back to the generic buy prompt.
- 2026-04-24: Changed the GFX2 shop `New Level` state so once the bonus Level 5 skin is purchased, the cost field and status copy now say `Already purchased - enjoy new level 5 skin` instead of showing a price again.
- 2026-04-23: Added `banger` and `unlocker` trophy slug mappings in `game.js` so the new `trophy_banger.png` and `trophy_unlocker.png` art files load automatically in the badges UI and unlock overlays.
- 2026-04-23: Nudged the `trophy_xx` artwork 10% of its own height downward in both the badges overview and badge reward overlay while leaving `trophy_clean` untouched.
- 2026-04-23: Shifted the badge `trophy_xx` artwork 20% right and 20% up and scaled it down by another 15% so the tighter source art centers more cleanly over `trophy_clean`.
- 2026-04-23: Restored the badge overview `trophy_clean` artwork to its earlier larger display size and re-centered the new tighter `trophy_xx` art inside the slot, while also enlarging the reward overlay medallion back to its previous size.
- 2026-04-23: Restored the badge overview `trophy_clean` base art to its original display size while keeping the smaller `trophy_xx` artwork reductions in place.
- 2026-04-23: Reduced the rendered trophy artwork again so the badges overview and badge reward overlay now use roughly half of the previous display size for the tightened 256x256 trophy PNGs.
- 2026-04-23: Reduced the rendered trophy artwork sizes in the badges overview and badge reward overlay so the newer tighter 256x256 trophy PNGs still sit inside the existing layout cleanly.
- 2026-04-23: Bumped release metadata to `1.0.53` / `versionCode 53` so the next Android and Vercel-facing build is newer than the deployed store version `1.0.52`.
- 2026-04-23: Added a bit more vertical space before the GFX2 pre-run `Goal` section in `style.css` so the board reads more like `Level` followed by a separated goal block.
- 2026-04-23: Simplified the GFX2 pre-run level board in `index.html` and `style.css` so it now shows only `Level` and `Goal`, with the `Level` and `Goal` text enlarged and extra vertical spacing between them.
- 2026-04-23: Reduced the `level-finished` artwork to a centered responsive panel in `style.css` so the fullscreen continue hitbox remains invisible but the gameplay behind the completion art is still partially visible for debugging.
- 2026-04-23: Removed the visible button styling from `#level-finished-continue` so the Level Finished screen keeps only the fullscreen hitbox and the per-level finished image without an extra cream-colored button graphic.
- 2026-04-23: Replaced the text-based Level Finished screen in `index.html`, `game.js`, and `style.css` with per-level `level1_finished.jpg` through `level4_finished.jpg` overlays plus a fullscreen click target so the completion art now fills the screen responsively without separate HUD text.
- 2026-04-23: Split the shared platform tile into per-level assets in `game.js` so levels 1 through 5 can each load `level1_platform.png` through `level5_platform.png` from their own folders while still falling back to the shared platform art if needed.
- 2026-04-23: Restored the level border canvas overlay in `game.js` on branch `New` so `level1_border.png` through `level4_border.png` render above gameplay again while keeping the HUD text on top.
- 2026-04-22: Bumped release metadata to `1.0.52` / `versionCode 52` so the next Android and Vercel-facing build is newer than the deployed store version `1.0.51`.
- 2026-04-22: Bumped release metadata to `1.0.52` / `versionCode 52` so the next Android and Vercel-facing build is newer than the deployed store version `1.0.51`.
- 2026-04-22: Extended the level border overlay in `game.js` so `level1_border.png`, `level2_border.png`, `level3_border.png`, and `level4_border.png` all render above the gameplay while keeping the HUD text on top.
- 2026-04-22: Shifted the center HUD `Double Jump` block in `game.js` slightly left by 10% of each label's own width, including the `Tripple Jump` and `Curse` lines beneath it.
- 2026-04-22: Shifted the left-side HUD `Score` and `Max Score` labels in `game.js` 50% of their measured width to the right after shrinking them, keeping the smaller font size but restoring more balanced placement.
- 2026-04-22: Reduced the left-side HUD `Score` and `Max Score` text in `game.js` by about 33% while keeping their shifted alignment intact.

- 2026-04-22: Shifted the left-side HUD Score and Max Score labels in game.js left by 33% of their measured text width so the top-left block lines up better with the rest of the HUD.

- 2026-04-22: Shifted the right-side HUD Level and Speed labels in game.js left by half of their own measured text width so they sit more centrally without moving the whole column.

- 2026-04-22: Nudged the mode-switch life hearts in style.css one heart-height back up after the larger downward/rightward offset, keeping the rest of the top bar unchanged.

- 2026-04-22: Moved the mode-switch life hearts in style.css down by one heart-height so the HUD lives row sits lower without changing the rest of the top bar.

- 2026-04-22: Added the `Level1_border.png` canvas overlay in `game.js` so Level 1 can show a framed playfield above the gameplay while keeping the HUD text drawn on top.

- 2026-04-22: Added the persistent `Jumper` All Runs badge in `game.js`, counting every successful jump event across all runs with bronze/silver/gold goals at 1,000 / 5,000 / 10,000 jumps.
- 2026-04-22: Doubled the font sizes on all score boards in `style.css`, including the pre-run Scores page tables and the game-over top score panels.
- 2026-04-22: Restored the game-over top score panel font sizes in `style.css` back to their original scale while keeping the pre-run Scores page tables enlarged.
- 2026-04-22: Increased the `#game-over` overlay opacity in `style.css` so the underlying gameplay is less visible behind the game-over panels.
- 2026-04-22: Added the skin reward overlay to the shared badge reward overlay styles in `style.css` so skin unlock messages appear centered on the same fixed screen position as badge unlocks.
- 2026-04-22: Bumped Android release metadata to `1.0.48` / version code `48` so the next AAB can ship as a newer build.
- 2026-04-21: Reworked the continue purchase overlay in `index.html` and `style.css` to remove the visible title, keep only the score/wallet/heart rows, and turn Buy/Back into invisible hitboxes aligned to the button art in `buy_continue_clean.png`.
- 2026-04-21: Restyled the continue purchase overlay in `style.css` to use `buy_continue_clean.png` as the panel background and tightened the inner typography, hearts, and buttons to match the new framed layout.
- 2026-04-21: Raised and compressed the game over center block in `style.css` by lifting `#final-current-run`, reducing `#final-continue-actions` spacing, and shrinking the Continue/End Run buttons so the score, actions, and cost text fit without vertical scrolling.
- 2026-04-21: Shifted the game over top-score panels upward by 10% in `style.css` on the base layout and the game-over responsive breakpoints so they leave more vertical room beside the smaller banner.
- 2026-04-21: Reduced the game over banner size in `style.css` for `.game-over-banner` and its responsive breakpoints so the top-score columns have more room beside the header art.
- 2026-04-21: Replaced the game over screen's text header and mode label with a responsive PNG banner in `index.html`, wired by `game.js` via `getGameOverBannerAssetPath()` / `renderOnlineHighscoreUi()`, and styled in `style.css` with `.game-over-banner`.
- 2026-04-21: Added a workflow rule in `WORKFLOW.md` to log every implemented change immediately with what changed, why, and where in the code/docs it happened.
- 2026-04-21: Restored the `crossing_page` `cloudfortune` layer after briefly hiding it during overlay debugging, because the visible issue was not the cloud itself.
- 2026-04-21: Hid the locked-state dark overlay on the GFX2 `Advanced` crossing hotspot so the button no longer shows a faint rectangular block above the sign while keeping the hotspot functional.
- 2026-04-15: Fixed the GFX2 Lifetime Legends data so `First Runner` uses the gold medal sprite when unlocked instead of incorrectly showing the bronze medal art.
- 2026-04-15: Nudged the enlarged shared `trophy_clean` base 10% of its own height downward and 10% of its own width leftward to better sit under the restored badge-specific trophy art.
- 2026-04-15: Restored the original GFX2 badge `trophy_xxx` art sizing and instead enlarged the shared `trophy_clean` base by 20% while shifting it 10% of its own width to the right.
- 2026-04-15: Converted additional GFX2 screen-building assets (`settings_inside_off`, `badges_category`, `advanced_iside_blank`, `advanced_iside`, `Classic_inside_blank`, and `Classic_inside`) from PNG to JPG, and updated the active runtime CSS references to use the new JPG versions where those assets are used.
- 2026-04-15: Re-anchored the uncropped `shop_house.png` to the full GFX2 scene stack (same fill behavior as crossing background/foreground and transition frames) so it scales with the window without being cropped.
- 2026-04-15: Restored the uncropped transparent `shop_house.png` canvas and reverted the GFX2 shop house layer to its earlier anchored right-side scene placement after the oversized full-screen experiment.
- 2026-04-15: Cropped `assets/gfx2/shop_house.png` to its actual visible house bounds after making the background transparent, and aligned the GFX2 animation layer to use the same centered 100% x 100% scaling as `crossing_foreground` so transition frames stay anchored during resize.
- 2026-04-14: Converted key static GFX2 screen-building assets (`wood_background`, `shop_inside`, `settings_inside`, `scores_inside`, `badges_total`, `badges_top`, and `badges_single`) from PNG to JPG and updated the runtime CSS references to use the smaller JPG versions.
- 2026-04-14: Removed the white background from `assets/gfx2/shop_house.png` and made it a persistent visible layer above every GFX2 crossing/crossing-sequence screen so the house remains visible during all transitions.
- 2026-04-14: Converted all GFX2 transition frame PNGs in `classic`, `classic_back`, `advance`, `advance_back`, `badges`, `badges_back`, `scores`, `scores_back`, `settings`, `settings_back`, `shop`, and `shop_back` to use transparency instead of white backgrounds, and normalized their runtime filenames to lowercase `frame-xx.png`.
- 2026-04-14: Reworked the GFX2 crossing/transition stack so `crossing_background`, the cloud layer, and `crossing_foreground` stay persistent while the folder-specific `frame-xx` sequences render as a separate animation layer on top.
- 2026-04-14: Removed the white background from all eight `assets/gfx2/entrance/frame-0x.png` files by converting near-white pixels to transparency, and mirrored the updated entrance frames into web and Android runtime assets.
- 2026-04-14: Enlarged the shared GFX2 `trophy_clean` base by 10% while anchoring its left and bottom edges, so it grows only upward and to the right behind each badge-specific trophy art.
- 2026-04-14: Restored the original larger sizing/alignment of each badge-specific `trophy_xxx` art while keeping the new shared `trophy_clean` base underneath in GFX2 badge trophy slots.
- 2026-04-14: GFX2 badges trophy slots now compose `trophy_clean` under every badge-specific `trophy_xxx` art so the reduced standalone trophy images still render as a complete badge trophy inside each card.
- 2026-04-14: Restored the normal GFX2 crossing-page arrow/shop hotspot visibility after the debug cleanup, so Classic/Advanced/Badges/Scores/Settings arrows and the Shop click zone are active again while the cloud overlay buttons continue to work.
- 2026-04-14: Removed the temporary GFX2 crossing-page debug CSS override that was forcing a fixed foreground/background stack and blocking the new PNG transition frame sequences from being displayed during entrance/classic/badges/settings/shop/scores animations.
- 2026-04-13: Converted the GFX2 transition frame sequences in `entrance`, `classic`, `classic_back`, `advance`, `advance_back`, `scores`, `scores_back`, `shop`, `shop_back`, `settings`, `settings_back`, `badges`, and `badges_back` from JPG to transparent PNG using the `crossing_foreground.png` alpha mask, then updated `game.js` to play the new PNG frame stacks during GFX2 transitions.
- 2026-04-13: Rebuilt the GFX2 crossing-page scene to use a layered sky plus `crossing_foreground`, then split the visible cloud art from the interactive cloud hitboxes so the cloud visuals can sit behind the sign and landscape while Rules/Credits click targets stay on top.
- 2026-04-13: Fixed the GFX2 crossing-page cloud visual sizing by giving the new static cloud layer explicit width and height values that match the cloud hitbox placements instead of relying on aspect-ratio sizing.
- 2026-04-13: Switched the GFX2 crossing-page cloud visuals from CSS background layers to explicit PNG `img` elements so the cloud art renders at the same coordinates as the working hotspot overlays above the sky layer.
- 2026-04-13: Reworked the GFX2 crossing-page stack to use `crossing_background.jpg` as the full back layer, the three `crossing_page/cloud0x.png` files as explicit mid-layer cloud art in the upper third, and `crossing_foreground.png` as the front layer above them.
- 2026-04-13: Temporarily hid the GFX2 crossing-page background and foreground layers to isolate the cloud mid-layer for visual debugging.
- 2026-04-13: Restored the GFX2 crossing-page foreground while keeping the background layer hidden so the cloud-plus-foreground stack can be checked in isolation.
- 2026-04-13: Temporarily removed the built-in blue background from the `.pre-run-gfx2-scene` container so the cloud-plus-foreground stack can be inspected without the scene's fallback sky color.
- 2026-04-13: Losslessly optimized every `assets/gfx2/trophy_pics/trophy_*.png` asset with `oxipng`, preserving transparency while reducing the total trophy artwork footprint by roughly 6.7 percent.
- 2026-04-13: Bumped the store/web release to version 1.0.33 (34) and refreshed the update-check message for the latest GFX2 badges trophy polish build.
- Temporarily switched the GFX2 crossing page into a clouds-only debug state by hiding the foreground layer, the shop button, and all GFX2 hotspot/hitbox overlays, leaving only the static cloud PNGs visible for layer verification.
- Scoped the global pre-run wood background away from the active GFX2 crossing-page select screen so that this scene can show its own blue sky background instead of inheriting the shared wood texture.
- Moved the GFX2 crossing-page blue sky onto the scene itself and disabled the global pre-run wood background during this debug pass, so the clouds can be checked against a clean local backdrop instead of inherited parent texture.
- Restored the GFX2 crossing-page foreground layer above the clouds while keeping the shop button and hotspot overlays hidden, so the layered background/cloud/foreground stack can be verified in isolation.
- Added a hard GFX2 crossing-page debug override that forces a white parent background, removes the scene background, hides every scene child, and then re-enables only the three static cloud PNGs, so the user can verify whether the cloud layer alone is rendering.
- Updated the hard GFX2 crossing-page debug override to re-enable `crossing_foreground.png` above the cloud layer as well, while still keeping every other crossing-page element hidden.
- Tightened the GFX2 crossing debug override again by forcing the foreground layer to render without any image and by explicitly hiding shop/hotspot/lock-note elements, so we can prove whether the visible scene still comes from `crossing_foreground.png` or from some other layer.
- Restored the real `crossing_foreground.png` image inside the active GFX2 clouds-only debug override, while still keeping shop, hotspots, and every other crossing-page element hidden so the cloud-plus-foreground stack can be checked cleanly.
- Relaxed the active GFX2 crossing debug override to restore the blue background, shop button, and invisible hotspot overlays while still keeping text popups disabled, so the full layered scene can be checked without cloud-label graphics getting in the way.
- 2026-04-14: Added a solid base background for all pre-run stages and explicit themed backgrounds for Rules/Credits so the frozen game canvas no longer bleeds through behind overlay pages.
- 2026-04-14: Stretched the Rules and Credits screens to full viewport height and let their main panels grow so the game canvas can no longer show below the cards.
- 2026-04-14: Restored the GFX2 wood background on the Rules and Credits screens so they stay visually consistent with the rest of the GFX2 flow while covering the full viewport.
- 2026-04-14: Restyled the GFX2 Rules and Credits screens with white headings, GFX2 Exit button art, and the responsive desk_credits panel artwork for their text areas.
- 2026-04-14: Tightened the GFX2 Rules/Credits art integration by forcing the Exit graphic style, applying the desk_credits panel art on both screens, and adding 10% text padding to keep copy inside the frame.
- 2026-04-14: Switched GFX2 badges medal rendering from the shared sprite sheet to the dedicated medal PNG files so Bronze/Silver/Gold icons also display reliably in Android WebView.
- 2026-04-14: Rebuilt the dedicated GFX2 medal PNGs from the transparent master sprite sheet and gave the badges scene its own wood background so Android no longer shows brown medal boxes or frozen gameplay behind the screen.
- 2026-04-14: Made GFX2 crossing and badges screens full-bleed across the viewport and switched GFX2 badges medals to direct PNG img elements for more reliable Android rendering.
- GFX2 crossing hotspots were switched to rectangular hitboxes aligned to the sign boards.
- GFX2 crossing and badges screens now force full-bleed viewport coverage on mobile/Android so gameplay no longer shows above or below the scene.
- Final mobile overrides now remove residual pre-run card padding and strip the remaining crossing scene frame.
- Adjusted GFX2 crossing hitboxes again: Advanced and Classic now extend further left/down, Settings stretches downward, and Badges shifts slightly lower with extra bottom reach.
- GFX2 shop now tracks a running total of coins bought during the current visit only, resetting when the player leaves the shop.
- Shop chest hitbox was moved higher, the shop helper text was enlarged and moved upward by its own height, and GFX2 shop/classic/advanced/settings/badges screens now force full-height wood-backed scenes on Android.
- This update also migrates players to GFX2 as the default start-screen style once on load.

- Tightened the GFX2 crossing Advanced and Classic hitboxes by trimming 15% from both left and right sides, lowered the GFX2 Badges hitbox top edge by 15% of its own height, and re-enabled native scrolling inside the GFX2 badges scene on web and Android.

- 2026-04-20: Game over score panels now use the smaller wood-backed frame as the default on web and mobile, with the score list pushed farther from the right edge and the panel headings centered.
- 2026-04-20: Standardized the GFX2 crossing transition animations to 10 frames each, including entrance, classic, advance, shop, settings, and their back animations, while keeping playback duration unchanged.
- 2026-04-20: Added a crossing idle wait animation using assets/gfx2/crossing_wait; it now plays after 20 seconds of no input on the GFX2 crossing screen, repeats every 15 seconds until the player clicks or triggers another transition, and now uses 13 frames with playback stretched by 33%.
- 2026-04-20: Made GFX2 frame loading tolerant to png/PNG casing mismatches so Android WebView can load the same transition sequences as the local web build.
- 2026-04-20: Fixed Android-only GFX2 frame casing mismatches in entrance, classic_back, settings, and settings_back so the release build no longer skips frame 08/09/10 on the store AAB.
- 2026-04-20: Removed the full-screen Game Over click fallback so Android now continues only through the actual Continue and End Run buttons, matching the desktop behavior.
- 2026-04-20: Swapped the game over Continue/End Run buttons to the dedicated gfx2 artwork, removed the full-screen game over click fallback, and hid the Jump Classic badge so the lives row sits in its place.
2026-04-21 - game over layout: moved the banner 10% left, pushed both top score panels 20% higher, and reduced the Continue/End Run button size by 10% in both dimensions.
2026-04-21 - release version bump: raised the app/web version from 1.0.47 to 1.0.48 and bumped Android versionCode to 48 so the new AAB is recognized as newer on mobile.
2026-04-21 - pre-run GFX2 shop: replaced the Buy pill button with the dedicated `assets/gfx2/shop_scr/buy.png` artwork and hid the inline label so only the graphic remains.
2026-04-21 - continue purchase overlay: pushed the text block lower again by increasing the top padding, and halved the remaining vertical gaps between the rows.
2026-04-21 - continue purchase overlay: pushed the text block lower by increasing the panel's top padding, tightened the vertical gaps between the text pairs, and made the invisible Buy/Back hitboxes taller toward the top.
2026-04-21 - continue purchase overlay: moved the text block slightly lower, tightened the spacing between the top text pairs and the lower text pairs, and corrected the Buy/Back hitboxes to shift upward instead of downward.
2026-04-21 - continue purchase overlay: tightened the text spacing, moved the content lower to clear the title area, added pixelated rendering for the panel art, and shifted the Buy/Back hitboxes down by one-third of their height.
2026-04-21 - continue purchase overlay: resized the card to match the new 433x327 asset ratio and allowed a larger max width so the updated panel scales up without distortion.
2026-04-21 - continue purchase overlay: constrained the card to the source image ratio (256:199) so the transparent panel no longer stretches vertically on short viewports.
- 2026-04-22: bumped release metadata to 1.0.51 / versionCode 51 so Android and the Vercel-hosted update check can detect a build newer than the deployed 1.0.50.
## 2026-04-21
- Android splash screen now uses `hrrra_splash` with `fitCenter` so the full image stays visible on mobile instead of being cropped by `centerCrop`.
- Android resource file was renamed to `hrrra_splash.jpg` because `res/drawable` filenames cannot contain `-`.
## 2026-04-22
- Android launcher icon now uses `assets/game_icon.jpg` as the source for all `ic_launcher` and `ic_launcher_foreground` density variants.
- Release bumped to `1.0.50` so the new Android icon and splash assets can ship as a new bundle.
- 2026-04-25: Release bump - raised Android/web version metadata to 1.0.58 / versionCode 58 so the next store/web build is seen as newer.
- 2026-04-25: Badge reward overlay - removed the `trophy_clean` base from the post-run badge unlock card so only the unlocked badge art appears there; the trophy screen stays unchanged.
- 2026-04-25: Level blocker art - switched blocker loading to per-level files (`level1_blocker.png` through `levelx_blocker.png`) and made LevelX override Level 5 with its own blocker art.
- 2026-04-25: Skin unlock overlay - added per-skin trophy art for Vexi, Nemu, and Krob so each skin reward now shows `trophy_clean` plus the matching character trophy.
- 2026-04-25: HUD cleanup - removed the always-on shield status label from the in-game top-right HUD so only the useful runtime info remains visible there.
- 2026-04-25: Credits screen - enlarged the version label, switched it to white, and added a direct Update link to the Google Play testing page beside it.
- 2026-04-24: Release bump - raised Android/web version metadata to 1.0.57 / versionCode 57 so the next store/web build is seen as newer.
- 2026-04-24: HUD polish - moved the upper-left Score and Max Score labels 20px back to the left after the previous right shift, keeping them aligned inside the plaque.
- 2026-04-24: HUD polish - shifted the upper-left Score and Max Score labels 50px to the right so both lines sit fully inside the scoreboard plaque.
- 2026-04-24: HUD polish - reduced the upper-left Score and Max Score fonts again and switched both labels to left-aligned placement so the text no longer shifts as the score grows.
- 2026-04-24: HUD polish - made all gameplay top-bar text black again and enlarged Score and Max Score in the upper-left HUD so the values read more clearly.
- 2026-04-23: HUD tuning - aligned Max Score with Score, shifted Level further left, and moved the life hearts row up by one icon height so the mobile top bar reads cleaner.
- 2026-04-23: Pre-run board tweak - restored an intro-only note on the Level 1 setup board: "Starting with 5 lives and Double Jump always enabled" appears under Goal, while between-level boards stay minimal.
- 2026-04-23: Level finished overlay - stretched the level finished artwork edge-to-edge again by removing aspect-ratio preservation, so the finish screen fills the whole viewport responsively.
- 2026-04-23: Release bump - raised Android/web version metadata to 1.0.54 / versionCode 54, synced web + Android public assets, and prepared a new AAB build for release.
- 2026-04-23: Badge reward reveal - kept the trophy base/art hidden until the shake phase so the badge medal only appears during the actual reveal animation.
- 2026-04-23: Removed legacy GFX1 start-screen/settings/shop code path so the app now uses GFX2 only and no longer keeps the admin start-screen switch.
- 2026-04-23: Switched the parallax back-layer assets for Levels 2 to 4 from PNG to JPG in `game.js` so the release bundle can drop the larger duplicate PNG files.
- 2026-04-23: Added the LevelX bonus pack for Level 5 with its own border, parallax layers, copied sound folder, and a persistent shop unlock that defaults to 10,000 coins but remains admin-editable.
- 2026-04-23: Fixed the GFX2 shop layering so the hitboxes sit above the decorative board/status text again, and guarded the shop exit back animation so it falls back cleanly instead of getting stuck when the frames are not ready.
- 2026-04-23: Fixed a leftover `useGfx2StartScreen` check in the GFX2 shop renderer that was throwing at runtime and blanking the shop values / click handling.
- 2026-04-23: Updated the LevelX unlock messaging to say: "Bonus level unlocked. See the new visuals in level 5. Have a nice psilocytime!"
- 2026-04-23: Bumped release metadata to 1.0.55 / versionCode 55 and synced the updated version files into `www` and Android public assets so mobile update checks can see the new build.
# 2026-04-26
- Added Android intro flow: play `assets/intro/intro_video.mp4` before the splash artwork/text effect, and switched the splash image source to `assets/intro/hrrra-splash.jpg`.
- Synced intro assets into web and Android native resources so the startup flow can use the new intro video and splash image.
# 2026-04-26
- Bumped release metadata to `1.0.59` / `versionCode 59` and synced the new intro splash/video assets into web and Android packaging.
# 2026-04-26
- Reworked Android intro splash playback to use a full-screen `TextureView` + `MediaPlayer`, so the intro MP4 and splash JPG can fill the whole screen instead of letterboxing or showing a black placeholder.

- 2026-04-26: Switched projectile rocket art loading to per-level filenames (level*_rocket01.png / level*_rocket02.png) and added LevelX rocket overrides so each level can own its own projectile visuals.

- 2026-04-26: Release bump to 1.0.60 / versionCode 60 after syncing the per-level rocket art update and the latest splash assets.
- 2026-05-04: Removed the animated fade-in/reveal from the badge/skin reward trophy art so the unlock card no longer flashes the square frame during load.
- 2026-05-04: Made the badge/skin reward trophy art stay visible immediately instead of toggling through a separate onload fade-in state.
- 2026-05-04: Hid the unused clean trophy layer in badge/skin reward overlays so only the badge art is rendered there; mode unlocks keep the clean base layer.
- 2026-05-04: Hid the badge/skin reward trophy art during the opening intro state so it now appears together with the reward text during the reveal.
- 2026-05-04: Hid trophy art on the badges screen for series with no collected tiers, so empty badge rows keep their slot but do not show the trophy image until the first badge is earned.
- 2026-05-04: Added the first `mine_inside` screen shell: new mine entrance hotspot on the crossing page, a dedicated mine scene with exit/back navigation, and a wallet total display in the top-right so the economy flow has a landing page to build on.
- 2026-05-04: Moved the mine entrance hotspot to the lower-left crossing area and gave it a visible debug frame so the intended click zone can be verified against the mine entrance art.
- 2026-05-04: Refined the mine screen layout so the exit is only a clickable overlay over the existing EXIT art, the wallet label is removed in favor of the graphic, and the mine scene stretches like the shop interior to fill the available window.
- 2026-05-04: Re-anchored the mine wallet number directly inside the wallet artwork so it scales with the scene instead of drifting with flex layout changes.
- 2026-05-04: Moved the mine wallet number lower by roughly one digit height and reduced its scale by about one third to better fit the wallet graphic.
- 2026-05-04: Nudged the mine wallet number a further half-digit height lower for tighter alignment with the wallet cutout.
- 2026-05-04: Added a visible debug frame to the mine exit hotspot so the clickable overlay can be checked directly against the EXIT artwork.
- 2026-05-04: Made the mine exit debug overlay more aggressive with an explicit block display, very high z-index, and visible outline so it cannot disappear behind scene styling.
- 2026-05-04: Shifted the mine exit hitbox down by half of its own height so the clickable area sits more naturally on the EXIT artwork.
- 2026-05-04: Shifted the mine exit hitbox down by another half of its own height to continue aligning the overlay with the lower EXIT art.
- 2026-05-04: Added mine transfer logic and the mine info panel: storage now accumulates coins on a timestamped cycle, `Transfer` moves the stored coins into the wallet, and the bottom message box shows status/tip text for the mine screen.





















2026-05-04 - Added a new global Mine admin section under Shop with Coin Timer, Storage, and Storage L2-L4 tuning fields, plus mine config defaults and validation for those values.
2026-05-04 - Added the Mine admin tuning section under Shop, bumped the release metadata to 1.0.73 / versionCode 73, and ignored the local gfx2 temp export folder.
2026-05-04 - Updated the mine idle tip text in `getMineIdleTip()` so the storage upgrade hint now says you can upgrade storage size in the Shop.
2026-05-04 - Expanded the mine idle tip rotation in `getMineIdleTip()` with four new Shop/storage-themed hints.
2026-05-04 - Added numbered mine face mapping for the message box, switched the lower mine panel to icon-plus-text layout, and documented the 01-14 face files with `_00` fallback in `mine_todo.md`.
2026-05-04 - Shifted the mine message box with its face graphic 3% lower and 10% left in `style.css` so the icon/text block sits closer to the lower-left placement the user requested.
2026-05-04 - Shifted the mine message box with its face graphic 5% back to the right in `style.css`, keeping the icon/text block aligned as a single unit.
2026-05-04 - Made mine transfer feedback time-based: successful transfer now shows message 06 for 5 seconds, then message 03 for 5 seconds; empty transfer shows message 05 for 5 seconds.
2026-05-04 - Kept the mine transfer button clickable even at 0 / capacity so empty transfers can show the 05 message for 5 seconds instead of being disabled.
2026-05-05 - Expanded the mine_inside scene to fill the viewport height more tightly so the bottom gap disappears and the background reaches the card edge.
2026-05-05 - Switched the mine_inside background panel back to full-height 100% sizing so the bottom white gap disappears inside the full-bleed pre-run card.
2026-05-05 - Reworked mine transfer feedback into an explicit time-locked message phase so 06 shows for 5 seconds, then 03 for 5 seconds, and empty transfer stays on 05 for 5 seconds.
2026-05-05 - Reworded mine idle tip 12 so it now says a bigger storage means fewer trips to the mine, and kept the face map table in sync.
2026-05-05 - Added the Shop admin storage-upgrade pricing fields for mine chest upgrades and tightened mine storage capacity syncing so the active capacity follows the current upgrade level.
2026-05-05 - Bumped the release metadata to 1.0.74 / versionCode 74 and prepared the next web/Android sync plus AAB build around the mine shop storage upgrade work.
2026-05-05 - Bumped the release metadata to 1.0.75 / versionCode 75 and included the full mine face graphic set in the release sync so the mine message box can map all faces with fallback support.
2026-05-06 - Added a continue flow split between coin purchase and rewarded ad watch, with a 5-second fake ad countdown on web/local and a native Android rewarded-ad bridge for real continue rewards.
2026-05-06 - Bumped the release metadata to 1.0.76 / versionCode 76 and synced the release payload into web and Android packaging for the next build.
2026-05-06 - Moved the Android AdMob app ID and rewarded ad unit ID into local `.key/admob.properties` and wired the Android build to read them from that hidden file.
2026-05-06 - Bumped the release metadata to 1.0.77 / versionCode 77 and prepared the current continue/AdMob config snapshot for the next build.
2026-05-06 - Forced the rewarded continue flow to use Google’s test rewarded ad unit in debug builds so Android test devices and emulators can exercise the full ad path.
2026-05-07 - Switched the Android rewarded continue flow to always use Google test rewarded ads so internal testing builds can exercise the full ad path before public release approval.
2026-05-07 - Bumped the release metadata to 1.0.79 / versionCode 79 and kept Android rewarded continue on Google test ads for internal testing.
2026-05-12 - Wired Skin06 into the shop, classic/advanced detail slots, admin skin list, skin pickup configuration, and jump animation so it behaves like the other playable skins while using the new six-frame jump timing.
2026-05-12 - Synced the Skin06 classic/advance layout PNGs from the `www` mirror back into the root asset tree so the local file:// build can show the real selected/unselected artwork instead of the old placeholder question-mark art.
2026-05-12 - Renamed the visible Skin06 UI label to Kaja across the admin, shop, and pre-run skin select surfaces while keeping the internal `Skin06` key unchanged.
2026-05-12 - Switched the advanced skin layout resolver over to the classic layout path and removed the duplicated `assets/gfx2/advance/layout` image copies so the release package no longer ships the same skin artwork twice.
2026-05-12 - Switched the classic/advanced skin slot resolver from PNG to JPG skin assets in `assets/gfx2/classic/layout` so both modes now load the JPG copies the user uploaded.
2026-05-12 - Bumped the release metadata to 1.0.87 / versionCode 87 for the JPG skin-layout release and prepared the next store build flow around it.
2026-05-12 - Kept mine message face 15 enlarged with a transform in `style.css` so the artwork stays bigger without pushing the whole message row upward.
2026-05-12 - Shifted the text part of mine message 15 slightly to the right while leaving the enlarged face art unchanged.
2026-05-13 - Gave Skin06 its own cropped walk source rects in `game.js` so the walk loop uses a stable anchor and no longer jumps between the last and first frame.
2026-05-13 - Added matching cropped jump source rects for Skin06 in `game.js` so walk and jump now share the same frame anchoring behavior.
2026-05-13 - Restored the Easy/Hard difficulty toggle on the gfx2 pre-run classic and advanced detail screens by reintroducing the shared toggle row and attaching it to the active board.
2026-05-13 - Reworked the gfx2 pre-run difficulty control into a plain Easy/Hard text selector with lit/grey states while keeping the hard-lock message flow unchanged.
2026-05-13 - Replaced the gfx2 pre-run difficulty selector with a fixed image button in the board corner that swaps `easy.png`, `hard.png`, and `reachl5tounlock.png`, while moving the level line slightly lower.
2026-05-13 - Shifted the gfx2 pre-run difficulty image button 5% to the right inside the classic and advanced detail boards.
2026-05-13 - Shifted the gfx2 pre-run difficulty image button another 5% to the right, keeping the same fixed board anchor.
2026-05-13 - Allowed the gfx2 pre-run classic/advanced board to overflow visibly so the difficulty image button can sit slightly outside the panel without being clipped.
2026-05-13 - Bumped the release metadata to 1.0.90 / versionCode 90 for the image-button pre-run difficulty release and prepared the next store build flow around it.
[2026-05-14 - Cropped the transparent bottom tail from the LevelX border overlay in `game.js` so the endless Level 5/LevelX screen no longer leaves a thin white seam at the bottom edge.]
[2026-05-14 - Cropped an additional 2 pixels from the LevelX border overlay in `game.js` so the bottom seam is trimmed a bit further without affecting other levels.]
[2026-05-14 - Expanded the Rules pager to five pages and added icon-based Bonus and Hazard pages with real config values for Coin, Money Bag, Extra Live, Double/Tripple Jump, Shield, Blocker, Projectile, Cracked Coin, Question Coin, and Curse.]
[2026-05-14 - Reflowed the Rules Bonus and Hazard pages into a single wide column, removed the extra unlock callouts, and lifted the whole Rules text block closer to the top edge.]
[2026-05-14 - Removed the redundant Bonus/Hazard subheads from the Rules pages, switched the double-jump icon to an inline canvas-style arrow, and lifted the Rules frame further toward the top of the panel.]
[2026-05-14 - Replaced the full Rules frame translation with a smaller top-only offset, kept the bottom spacing stable, and collapsed the Double Jump row to a single-line icon plus short description.]
[2026-05-14 - Expanded the Rules text field by 20px at the top and 20px at the bottom via frame margins so the visible area is 40px taller without shifting the inner text block.]
[2026-05-14 - Extended the Rules text field bottom margin by another 20px so the visible area now hangs 40px lower than before.]
[2026-05-14 - Changed the Rules page counter to beige text for visibility and added Shop and Mine pages to the five-page rules set, bringing the pager to seven pages total.]
[2026-05-14 - Added the Shop and Mine rules pages to the pager and restyled the page counter to beige for better contrast on the top bar.]
[2026-05-14 - Tightened the Rules bonus row layout so icons and text stay on the same line and enlarged the jump icon slightly for closer match with gameplay art.]
[2026-05-14 - Gave the Rules bonus rows a Rules-only icon override and top-aligned row layout so the icon size and baseline no longer collapse inside the page 4/5 text flow.]
[2026-05-14 - Enlarged the Rules projectile icon so it matches the visual weight of the other bonus and hazard icons again.]
[2026-05-14 - Bumped the Android/web release metadata to 1.0.92 / versionCode 92 and regenerated the synced public assets for the new AAB build.]
[2026-05-14 - Forced a visible thin scrollbar style onto the Rules text area so Android users can see that the content continues beyond the visible panel.]
[2026-05-14 - Restored the GFX2 pre-run skin slot resolver so all classic and advanced slots use the shared classic layout skinXX locked/selected/unselected JPGs again.]
[2026-05-14 - Unified the pre-run skin grid preview image size so all skins render at the same size as the smaller slot 6 preview instead of enlarging Skin01.]
[2026-05-14 - Standardized the GFX2 pre-run classic and advanced slot artwork sizes to the slot 6 dimensions so slots 1 through 6 render consistently.]
## 2026-05-14
- Added Skin07 as Cube and wired it to the shop/admin flow.
- Cube now toggles Modern Visuals off when selected and re-enables them on any other skin.
- Pre-run skin preview uses `skin07_unselected.png` / `skin07_selected.png`, with a question mark placeholder while locked.
- Made the pre-run skin grid show the Cube slot in the visible 3-column layout instead of hiding it in an auto-fit overflow.
- Added a red debug outline for the Cube skin card and tightened the skin cards so the Cube slot stays visible in the panel.
- Release 1.0.93: added the Cube floor visual mode in pre-run, hid level borders when Modern Visuals are off, and bundled the updated Rules pages and assets for Android release.
- Removed the Cube debug frame and hid level border art whenever Modern Visuals are disabled, including when Skin07/Cube is selected or forced off in admin.
- Pre-run Cube moved out of the skin grid and onto the floor in the classic/advanced GFX2 scene, with a visible debug outline and selected/unselected Skin07 PNGs.
- 2026-05-18: Started `TECHNICAL_REFERENCE.md` as a project-wide technical map covering runtime layers, persistence, Android sync, online APIs, assets, and pre-run screen structure.
- 2026-05-18: Added `USER_GUIDE.md` as a player-facing walkthrough of what can be done on each game screen, from sign-in through pre-run, shop, mine, admin, game over, and badges.
- 2026-05-18: Added `SCREEN_REFERENCE.md` and `PLAYER_MANUAL.md` to expand the player-facing documentation with a per-screen control map and a practical how-to-play guide.
- 2026-05-18: Expanded `TECHNICAL_REFERENCE.md` with the badge model, shop item model, mine economy, admin renderer, render pipeline, and release/AAB flow.
- 2026-05-18: Expanded `TECHNICAL_REFERENCE.md` again with a screen-by-screen asset atlas, save lifecycle notes, and troubleshooting paths for stale UI or storage issues.
- 2026-05-18: Expanded `TECHNICAL_REFERENCE.md` with a feature locator index that maps core screens, badges, shop, mine, admin, online scores, Android bridge, and release mirrors to the main code entry points.
- 2026-05-18: Expanded `TECHNICAL_REFERENCE.md` with a screen button handler map that traces major UI buttons to their handlers and the storage or overlay flow they affect.
- 2026-05-18: Promoted the current local admin configuration snapshot into a built-in default seed via `default-admin-settings.js`, with startup/reset seeding in `game.js` and mirrored copies in `www/` and Android public assets.
- 2026-05-18: Hid the lower pre-run admin button in the detail and compact run screens via `style.css`, leaving only the pre-run admin entry points that are meant to stay visible.
- 2026-05-18: Changed the global `#admin-toggle` visibility logic in `game.js` so it only shows during pre-run screens and stays hidden during active gameplay.
- 2026-05-18: Refreshed the built-in admin seed in `default-admin-settings.js` from the current local admin storage snapshot and mirrored it into `www/` and Android public assets.
- 2026-05-18: Refreshed the built-in admin seed again from the latest local admin storage snapshot so the source defaults track the newest admin adjustments.
- 2026-05-18: Release 1.0.96 bumped the web, Android, and live version metadata to match the newer online 1.0.95 baseline and bundled the current admin-default seed plus gameplay/admin UI polish.
