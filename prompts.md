# Prompts

-------------------
Bump the release metadata to 1.0.53 / versionCode 53 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.52 release

Add `banger` and `unlocker` trophy slug mappings in `game.js` so `trophy_banger.png` and `trophy_unlocker.png` load automatically in the badges UI and unlock overlays

Nudge the `trophy_xx` artwork 10% of its own height downward in both the badges overview and badge reward overlay, leaving `trophy_clean` untouched

Shift the badge `trophy_xx` artwork 20% right and 20% up and scale it down by another 15% so the tighter source art centers more cleanly over `trophy_clean`

Restore the badge overview `trophy_clean` artwork to its earlier larger display size, re-center the tighter `trophy_xx` art inside the slot, and enlarge the reward overlay medallion back to its previous size

Restore the badge overview `trophy_clean` base art to its original display size while keeping the smaller `trophy_xx` artwork reductions in place

Reduce the rendered trophy artwork again so the badges overview and badge reward overlay use roughly half of the previous display size for the tightened 256x256 trophy PNGs

Reduce the rendered trophy artwork sizes in the badges overview and badge reward overlay so the newer tighter 256x256 trophy PNGs still fit the existing layout cleanly
add one more blank-row worth of vertical space before the GFX2 pre-run Goal section so it sits a bit lower beneath Level

simplify the GFX2 pre-run level board so it only shows Level and Goal, enlarge both texts twofold, and add more spacing between them while keeping the divider line

reduce the level-finished artwork to a centered responsive panel so the fullscreen continue hitbox stays invisible but the gameplay behind the image is still partially visible for debugging

remove the visible button styling from level-finished so only the fullscreen hitbox remains under the per-level finished image

replace the text-based Level Finished screen with responsive per-level finished artwork from level1_finished.jpg through level4_finished.jpg and a fullscreen click target, without separate HUD text

split the shared platform tile into per-level assets so levels 1 through 5 can each load level1_platform.png through level5_platform.png from their own folders, while keeping a shared fallback if needed

restore the level border overlay on branch New for levels 1 through 4 so the border art is visible above gameplay while HUD text stays on top
pridej stejny frame overlay i pro level 2, 3 a 4 podle obrazku v jejich slozkach, stejne jako level 1, a texty/hud nech stejne

-------------------

posun text Double Jump a radky pod nim o 10% jejich sirky doleva

-------------------

posun text Score a Max Score o 50% jejich sirky doprava

-------------------

-------------------
2026-04-18: nic se nezmenilo. zkus jeste jednou, tentokrat vytvoÅ™ tlaÄÃ­tko, kterÃ© bude nad vsemi vrstavami, ktere bude mÃ­t overlay - Äerveny, vzdy viditelnÃ½ a dej to tlaÄÃ­tko pÅ™esne doprostred obrazovky. jeho velikost udelej 512s512 pixelu
2026-04-18: ano, ted jsem to oveÅ™il. opravdu se to ukazuje v gfx1, ale ma to bÃ½t v gfx2. vzdy vsechno dÄ›lÃ¡me v gfx2 (pokud neÅ™eknu jinak - zapis to do pravidel). a nynÃ­ to tlaÄÃ­tko z gfx1 odstran a udÄ›lej ho v gfx2. ale zpÃ¡tky v hornÃ­m rohu. velikost odpovÃ­dajÃ­cÃ­ tlaÄÃ­tku v levÃ© ÄÃ¡sti obrazovky "back"
2026-04-18: uz to otevÃ­rÃ¡ potvrzovacÃ­ stranku. ale samoznÃ© tlaÄÃ­tko v hornÃ­m rohu nemÃ¡ Å¾adnÃ½ text. mÄ›lo by tam byt aspon Change User a nÄ›jakÃ© pozadÃ­. ted je tam jen cervenÃ½ okraj a prohlednÃ© pozadÃ­
2026-04-18: udelej ted comming do main do local i do www. potom se vrat na vetev new
2026-04-20: na webove casti se scores ukazuji dobre, pokud je okno vetsi. kdyz se okno zmensi na velikost, jak je to na mobilu, tak se ramecek zmensi tak, ze se tam nevejdou dva posledni radky. Zvetsi tu "zmensenou verzi" tak, aby byla o 10% vysky okna delsi smerem dolu. tedy nahore zustane na stejnem miste, ale dole se vejdou i ty dva radky, co tam nyni nejsou
2026-04-20: ted se to zmensuje v poradku, ale chybi tam ten dreveny ramecek. je tam zase jen bile okno. Neni to bile okno overlay, ktery prekresluje ten ramecek?
2026-04-20: a) tak jak se v urcitou chvÃ­li to okno s rÃ¡meÄkem zmensÃ­. tak tu zmenÅ¡enou velikost pouÅ¾ij jako standard a at je to okno tak velkÃ© vÅ¾dy b) zvÄ›tÅ¡i okraje textu na pravÃ© stranÄ›, aby ÄÃ­sla netekla do do grafiky dÅ™eva (zvÄ›tÅ¡i odsazenÃ­ o 10% Å¡Ã­Å™ky Å™Ã¡dku s textem) a zmÄ›n aby byly v pÅ™Ã­padnÄ› "online Top scores" a "Onine top players" vycentrovanÃ© ty Å™Ã¡dky.
2026-04-20: zmen na tom top scores velikost pisma. aby byl vzdy tak velke, jaky je nejmensi ted nastavene. kdyz se postupne zvetsuje, tak to pak vypada osklive. pismo at ma velikost jako ma nastavenou minimalni a nezvetsuje se
2026-04-20: skladej crossing animace takto: crossing_background uplne v pozadi, pak crossing_foreground a uplne navrchu sekvenÄnÃ­ PNG obrazky.
2026-04-20: crossing scÃ©na se sklada takto: crossing_background dole, clouds nad nim, crossing_foreground nad mraky, shop_house jako dalsi vrstva a sekvenÄnÃ­ PNG uplne navrchu.
2026-04-20: na crossing page, kdyz se 20 vteÅ™in na nic neklikne, prehraj sekvenci ze slozky crossing_wait a opakuj ji kazdych 15 vterin, dokud se neklikne na neco jineho. Sekvence ma 13 frame a bezi o 33% dele.
2026-04-20: na Android AAB over, ze frame sekvence entrance, classic_back, settings a settings_back pouzivaji spravny casing souboru, aby se nevynechaval frame 08/09/10 na store verzi.
2026-04-20: na game over screenu pouzij continue.png a end_run.png z assets/gfx2/game_over_scr jako grafiku tlacitek, odstran celoplosny click fallback na game over overlay a skryj Jump Classic badge tak, aby lives zustaly na jeho miste.
2026-04-21: tak to tak odted dÄ›lej a zapis to i do pravidel k ostatnim. Tam jak je napsano co treba mÃ¡Å¡ dÄ›lat, kdyz napÃ­Å¡u vycisti local storage nebo priprav aab. pokud sis ty pravidla nenacetl, udelej tak nynÃ­
2026-04-21: uprav game over screen tak, aby misto textu Game Over a nazvu modu/difficulty pouzival jednu responsivni grafiku z assets/gfx2/game_over_scr podle kombinace Classic Easy, Classic Hard, Advanced Easy a Advanced Hard
2026-04-21: udelej ted sync do www i androidu, at se na to mÅ¯Å¾u podÃ­vat na emulatoru
2026-04-21: udelat tu grafiku o 50% mensi, protoze zabira prostor, kam potrebuji, aby se vesly grafiky s topscore
2026-04-21: sync prosÃ­m
2026-04-21: posun ty topscore okna o 10% nahoru. a pak rovnou znovu udelej sync
2026-04-21: zvedni ten blok s textem o score, tlaÄÃ­tky a spodnÃ­m textem o cenÄ› trochu nahoru. PÅ™etÃ©kÃ¡ to pod obrazovku a musÃ­ se posouvat. chci aby to bylo videt najednou. PÅ™Ã­padnÄ› to mÅ¯Å¾eÅ¡ udÄ›la tak, Å¾e tlaÄÃ­tka continue a end run zmenÅ¡Ã­s o 10% ÄÃ­mÅ¾ se zvedne text each life costs..... a bude to vyÅ™eÅ¡enÃ©. rovnou sync
2026-04-21: priprav continue purchase overlay tak, aby po kliknuti na continue pouzival buy_continue_clean.png a mel podobne rozlozeni jako druhy referencni obrazek
2026-04-21: buy_continue_clean.png soubor jsem upravil. nynÃ­ ma opravdu prÅ¯hlednÃ© pozadÃ­. Nezobrazuj text How Many Lives, protoze uz je na pevno na obrazku. TlaÄÃ­tka buy a back, jak jsi je tam dal ty, tam nejsou potÅ™eba, staÄÃ­ overlay na mÃ­sto na obrÃ¡zku, kde je grafika buy a back. - StaÄÃ­ kdyz overlay bude o 20% uÅ¾Å¡Ã­ a 33% vyÅ¡Å¡Ã­. ZÃ¡roven zmenÅ¡Ã­ mezery mezi Å™Ã¡dky textu. CelÃ© okno at je responzivn. ja zmenÅ¡il jeho velikost.
2026-04-21: ten obrÃ¡zek co jsem nahral mÃ¡ strany 256x199 Zachovej ten pomÄ›r stran. ted je to uplnÄ› nesmyslnÃ©
2026-04-21: pre-run GFX2 shop Buy button now uses assets/gfx2/shop_scr/buy.png and the inline label is hidden.
2026-04-21: continue purchase overlay text block pushed lower again by increasing top padding, and the remaining row gaps are halved.
2026-04-21: continue purchase overlay text block moved lower by increasing top padding, the row gaps are tighter, and the invisible Buy/Back hitboxes are taller upward.
2026-04-21: continue purchase overlay text block moved slightly lower, the top and lower text pairs are tighter, and the Buy/Back hitboxes now shift upward instead of downward.
2026-04-21: continue purchase overlay now has tighter text spacing, a lower text block, pixelated panel rendering, and the Buy/Back hitboxes shifted down by one-third of their height.
2026-04-21: continue purchase overlay now matches the updated 433x327 buy_continue_clean.png ratio and can scale larger without distortion.

-------------------
2026-04-21 - Keep the continue purchase overlay at the exact 256:199 aspect ratio of buy_continue_clean.png.
-------------------
2026-04-22: add a new persistent All Runs badge `Jumper` that counts every successful jump event across all runs with bronze/silver/gold goals at 1000 / 5000 / 10000.
-------------------
2026-04-22: double the font sizes on all score tables, including the pre-run Scores page and the game-over top score panels.
-------------------
2026-04-22: restore the game-over top score panel fonts to the original size while keeping the Scores page tables enlarged.
-------------------
2026-04-22: make the game-over background overlay less transparent so the underlying gameplay shows through less.
-------------------
2026-04-22: make the skin unlock overlay use the same fixed centered badge reward positioning so it no longer appears below the game window.
-------------------
2026-04-22: bump Android release metadata to 1.0.48 / version code 48 before preparing the next AAB.
- 2026-04-22: bump release metadata to 1.0.51 / versionCode 51 after confirming the store already has 1.0.50, and keep the Vercel-facing version files in sync for mobile update detection.
zmensi text Score a Max Score o 33%
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
- 2026-04-23: Version bump to 1.0.55 / versionCode 55, with sync to `www` and Android public assets so the current build is detected as newer by the mobile update check.
