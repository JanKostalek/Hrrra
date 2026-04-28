# Hrrra - Working Changes Log

- 2026-04-28: Bumped release metadata to `1.0.66` / `versionCode 66` and prepared the Settings artwork mute hitboxes so tapping the guitar or `Zzzzap` graphic toggles music and SFX directly from the image.
- 2026-04-28: Synced the `1.0.66` release metadata into the web root and Android public assets so the packaged app and update check stay on the same version.
- 2026-04-24: Bumped the release metadata to `1.0.56` / `versionCode 56` after adding the `levelx` packaging path and the LevelX platform hookup.
- 2026-04-24: Level 5 now prefers `assets/levelx/levelx_platform.png` before the generic Level 5 platform fallback, so the bonus skin no longer gets masked by the old platform art once it is unlocked.

- 2026-04-24: Wired `assets/levelx/levelx_platform.png` into the Level 5 platform resolver so the bonus LevelX skin can swap the endless level platform art the same way it already swaps background and border art.
- 2026-04-24: Reduced the top-left `Max Score` HUD label font size by 50% in `game.js` while keeping the `Score` line unchanged.

- 2026-04-24: Made the GFX2 shop status row show `You donÂ´t have enough coins to buy it.` when `New Level` is selected but the wallet cannot afford it, instead of falling back to the generic buy prompt.
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
