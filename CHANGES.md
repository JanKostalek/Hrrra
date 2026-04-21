# Hrrra - Working Changes Log

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
2026-04-21 - release version bump: raised the app/web version from 1.0.47 to 1.0.48 and bumped Android versionCode to 48 so the new AAB is recognized as newer on mobile.
2026-04-21 - pre-run GFX2 shop: replaced the Buy pill button with the dedicated `assets/gfx2/shop_scr/buy.png` artwork and hid the inline label so only the graphic remains.
2026-04-21 - continue purchase overlay: pushed the text block lower again by increasing the top padding, and halved the remaining vertical gaps between the rows.
2026-04-21 - continue purchase overlay: pushed the text block lower by increasing the panel's top padding, tightened the vertical gaps between the text pairs, and made the invisible Buy/Back hitboxes taller toward the top.
2026-04-21 - continue purchase overlay: moved the text block slightly lower, tightened the spacing between the top text pairs and the lower text pairs, and corrected the Buy/Back hitboxes to shift upward instead of downward.
2026-04-21 - continue purchase overlay: tightened the text spacing, moved the content lower to clear the title area, added pixelated rendering for the panel art, and shifted the Buy/Back hitboxes down by one-third of their height.
2026-04-21 - continue purchase overlay: resized the card to match the new 433x327 asset ratio and allowed a larger max width so the updated panel scales up without distortion.
2026-04-21 - continue purchase overlay: constrained the card to the source image ratio (256:199) so the transparent panel no longer stretches vertically on short viewports.
