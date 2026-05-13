# Prompts

-------------------
Ted chci další změnu. na stránce badges se vykreslují trophy_xxx (badge name). Jsou tam bez ohledu na to, zda je už badge získaný. Změn to tak, aby pokud nemám žádny badge (bronze / silver / gold), tak se tam ta trophy obrázek nebude zobrazovat. Teprve po získání badge se objeví tady trophy

-------------------

Přepínač `Badges v2` má platit nejen pro stránku badges, ale i pro badge reward po ukončení runu, a to pro všechny mody i obtížnosti.

V unlock okně je vidět černý rámeček kolem badge/skin trophy. Pokud je to shadowing, odstraň ho ve stylu tak, aby reward art vypadal čistě bez černého okraje.

U nových badge / skin reward overlayů po runu se má vždy používat v1 `assets/gfx2/trophy_pics/trophy_xxx.png` bez `trophy_clean`, i když je zapnuté `Badges v2`. Chci to pro classic i advanced a pro easy i hard tak, aby se nová odměna vždy brala z v1 sady.

Přidal jsem do v2 ještě `trophy_shield_teleporter.png`, tak ho namapuj taky v badges v2 režimu, aby Shield Teleporter nepadal na fallback.

Upřesni v2 mapping badges: `trophy_magneto.png` v `assets/gfx2/trophy_pics/v2/` je potřeba mapovat přímo, ne přes bare `magneto.png`, protože jinak badge padá na fallback.
Ve složce je ještě podskložka `v2` s dalšími trophy badges. Přidej do administrace přepínač `Badges v2` hned pod `Modern visuals`, defaultně vypnutý, a po jeho zapnutí přemapuj badge trophy artwork na soubory z `assets/gfx2/trophy_pics/v2/` stejným systémem jako dosud. Pokud konkrétní v2 trophy chybí, použij jako fallback `trophy_clean` z v2.

Jen jsi nepoužil `trophy_teleporter.png`, která je taky ve složce.

Nyní změň badges tak, aby se v trophy slotu vykresloval jen `trophy_xxx` podle názvu badge. `trophy_clean` tam nedávej, ale nech ho jako fallback, když konkrétní `trophy_xxx` v root `assets/gfx2/trophy_pics/` neexistuje. Projdi root složku `trophy_pics` a namapuj obrázky pro jednotlivé badge, včetně nových souborů.

Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
Bump the release metadata to 1.0.53 / versionCode 53 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.52 release
Change the GFX2 shop `New Level` state so once the bonus Level 5 skin is purchased, the cost field and status copy say `Already purchased - enjoy new level 5 skin` instead of showing a price again
Make the GFX2 shop status row show `You don´t have enough coins to buy it.` when `New Level` is selected but the wallet cannot afford it, instead of falling back to the generic buy prompt
Wire `assets/levelx/levelx_platform.png` into the Level 5 platform resolver so the bonus LevelX skin can swap the endless level platform art the same way it already swaps background and border art
Level 5 now prefers `assets/levelx/levelx_platform.png` before the generic Level 5 platform fallback, so the bonus skin no longer gets masked by the old platform art once it is unlocked
Reduce the top-left `Max Score` HUD label font size by 50% in `game.js` while keeping the `Score` line unchanged

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
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release

posun text Double Jump a radky pod nim o 10% jejich sirky doleva

-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release

posun text Score a Max Score o 50% jejich sirky doprava

-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release

-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
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
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
2026-04-21 - Keep the continue purchase overlay at the exact 256:199 aspect ratio of buy_continue_clean.png.
-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
2026-04-22: add a new persistent All Runs badge `Jumper` that counts every successful jump event across all runs with bronze/silver/gold goals at 1000 / 5000 / 10000.
-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
2026-04-22: double the font sizes on all score tables, including the pre-run Scores page and the game-over top score panels.
-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
2026-04-22: restore the game-over top score panel fonts to the original size while keeping the Scores page tables enlarged.
-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
2026-04-22: make the game-over background overlay less transparent so the underlying gameplay shows through less.
-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
2026-04-22: make the skin unlock overlay use the same fixed centered badge reward positioning so it no longer appears below the game window.
-------------------
Bump the release metadata to 1.0.56 / versionCode 56 so Android and the Vercel-facing update check see a build newer than the deployed 1.0.55 release
2026-04-22: bump Android release metadata to 1.0.48 / version code 48 before preparing the next AAB.
- 2026-04-22: bump release metadata to 1.0.51 / versionCode 51 after confirming the store already has 1.0.50, and keep the Vercel-facing version files in sync for mobile update detection.
zmensi text Score a Max Score o 33%
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
- 2026-04-23: Version bump to 1.0.55 / versionCode 55, with sync to `www` and Android public assets so the current build is detected as newer by the mobile update check.

# 2026-04-26
- Added Android startup intro video flow before the splash artwork/text effect, using `assets/intro/intro_video.mp4` and `assets/intro/hrrra-splash.jpg`.
# 2026-04-26
- Release bump to `1.0.59` with synced intro video splash assets and updated Android/web packaging.
# 2026-04-26
- Android intro splash now uses `TextureView` + `MediaPlayer` for the MP4 video and stretches the splash JPG to full screen.

Switched projectile rocket art loading to per-level filenames (level*_rocket01.png / level*_rocket02.png) and added LevelX rocket overrides so each level can own its own projectile visuals.

Release bump to 1.0.60 / versionCode 60 after syncing the per-level rocket art update and the latest splash assets.
na strance settings je ovládání zvuku, je to tak? jsou tam posuvníky a je tam i tlačítko na ztlumení, které kdyz tapneme, se ztlumí zvuk / muzika, kdyz tapneme znovu, vrátí se do stavu, kde byl původne.\r\n\r\n-------------------\r\n
ale kdyz se klikne ne grafiku kitary nebo zzzap, tak by se mělo ztlumit a po dalsím kliku opet pustit / samostatně zvuk / sfx\r\n\r\n-------------------\r\n
nejdřív přepni na new branch. ve vsech úrovníc jsem upravil _border.png obrázky. Je to v pořádku a zahrn je do přístího commit. přidal jsem level5_border do level5, protoze tam nebyl. asi tam byl fallback. tak pouzivej nyní ten obrázek. potom implementuj. dle toho co jsi psal výše\r\n\r\n-------------------\r\n
a) cervený rámeček vidím. posun ho o výšku toho rámečku dolu a rozšiř ho o šířku toho rámečku do prava. b) kdyz na rámeček kliknu, nic se nestane. respektive postavička vyskočí. to znamená, že na celé obrazovce je touchpoing -> skok a tlačítko pause je asi pod tou vrstvou?\r\n\r\n-------------------\r\n
hra nebere v levelx levelx_border.png. je tam fallback na level1. proc?

-------------------
nyni odstran debug rámeček. uz není potreba

-------------------
na crossing page zůstává ještě jeden debug border u instructions, smaž ho úplně

-------------------
když na androidu tapnu na tlačítko pause ve hře, tak se přepne settings stranka a settings stále reagují na tapnutí z predchozí obrazovky a jelikoz na stejném místě v nové obrazovce je posuvník na muziku, tak se okamzite změní její nastavení. myslím, že by to chtělo, aby při objevení se settings obrazovky hra neregistrovala tapnutí, alespon po dobu 0,5s. udělat tam nějaký delay

-------------------
do tlačítka classic  tu část co jsi vrátil  jsi pridal nějaký šedivý overlay

-------------------
ověř, že muzika a zvuky se berou taky z levelx/sounds a nikoliv level5

-------------------
nyní odstran červený debug rámeček z ingame a naopak jej přidej do crossing page

-------------------
posun tlačítko credits o 20% šířky toho tlačítka do leva

-------------------
dej debu rámeček i nad tlačítko instructions a nad obě tlačtíka classic

-------------------
zmenši velikost levého classic tlačítka (to co je v levém horním rohu) o 50% výšky toho tlačítka - uber horní polovinu a zároven o 50% šířky toho tlačítka z prava. uber jeho pravou polovinu

-------------------
ted posun tlačítko credits jeste jednou o 20% šířky toho tlačítka do leva

-------------------
zviditelni debug rámeček i nad instructions

-------------------
není tam videt

-------------------
udělej to tak, že nad všemi tlačítky na crossing page pust debug rámeček

-------------------
zmenši tlačítko nad settings (pravý horní roh) o 60% z levé strany, potom o 33% zhora

-------------------
ted jeste uber 20% ze spodu

-------------------
u tlačítka instructions uber 30% z leva

-------------------
ubral jsi classic tlačítko (v obrazovce jsou dvě, ty jsi ubral tomu v levém horním rohu). a) vrat to zpátky b) tlačítko instructions je ještě v obrazovce nad ním. uplně v levém rohu. tomu uber 30%jeho šířky z leva

-------------------
ted udelej debug overlay nad obema tlačítky classic
pridal jsi to jen na pravy. pridej to i na ten druhy na levem kraji
nyní zvets o 50% velikost toho levého tlačítka smerem nahoru
nyní opet vypni debul overlay
kdyz se objeví game over screen, tak v pozadí je videt obrazovka ze hry, ale chybí ji _boarder vrstva. vzdy by měla být videt k príslušnému level / game over i v pozadí level boarder
v shopu, kdyz uz je nejaký z predmětů koupen, treba new level (ostatní jsou zatím placeholder), tak bych chtěl, aby se psalo pres nej SOLD
o 20% tu tabulku zmensi
zvetsi trochu uhel naklonení ty tabulky - viz obrázek
zmensi jeste o 20% tabulku a posun jeste o 8 stupnů na -25deg
posun tu cedulku o dvacet pixelů nahoru
posun o deset pixelů dolů
implementuj skin05: shop, admin cena 1000 coins, animace walk/jump, napojení na assets/skins/Skin05 a gfx2 layout skin05
hero-icon.png jsem do slozky skin05 ted pridal

-------------------
pust nad skin05 v shop screeen debug rámecek, abychom videli, kde je tlačítko pro nákup / select skinu

-------------------
zuž/zmenší hitbox o 10% z levé i pravé strany

-------------------
uber jeste jednou 10%

-------------------
pokud zmensujes hitbox, tak by se mel zmensovat i debut rámeček, je to tak? ale ten je stále stejny...

-------------------
muzes odstranit debug ramecek

-------------------
velikosti

-------------------
pridal jsem jeste jeden frame do sekvecne jump. měla by se prehrávat tak, ze kdyz tapnu, tak bude frame1, následně bude frame2 po celou dobu, co postavicka bude stoupat. ve chvíli kdy začne klesat, bude frame3. ve chvíli kdy se dotkne země, prehraje se frame 4 a 5. uprav to tak

-------------------
prejmenuj v administraci skin 05 na Grey

-------------------
ano a vsude kde je to relevantní. jako kdyz se odemkne skin v průběhu rhy, tak aby to napsalo jak banner, tak na konci runu, ze byl odemnut novy skin - Grey - místo skin 05

-------------------
zvy verzi na 70, udělej sync www a android, udelej commit, push, priprav aab, potom se vrat dn new a rovnej main s new, aby obě verze byly shodne

a můžeš v kodu změnit, aby to bralo .mp3 nebo .ogg - podle toho co bude ve slozce? aby to hledalo jeden, případně druhý a teprve pak fallback

a) presto ze tam ten obb soubor je, tak ho to neprehraje a padne to do fallback b) změn ještě, aby fallback byl na muziku z levela1

zvy verzi na 70, udělej sync www a android, udelej commit, push, priprav aab, potom se vrat dn new a rovnej main s new, aby obě verze byly shodne

kdyz se otevírá na konci po odemčení nový skin, tak nyní zobrazujes trophy_clean a trophy_skinname. O new skin odstran zobrazovaní trophy_clean a nech tam jen _skinname

ted je to v pořádku.  zapis to k informaci, kde mazat i to, ze musí být tam zavřčený a tuto informaci mi vzdy říci

kdyz se z jakéhokoliv levelu otevře přes tlačítko pause settings stránka, tak přestane hrát muzika. což je špatně, protože pak při měnění hlasitosti nevím, jak hlasitá muzika / global je. Nefunguje ani sfx. Vzdy by měla pokračovat hrát muzika z té které úrovně. dřív to tak fungovalo

povyš verzi na 71. udělej sync na www a android. udělej commit do main, ověř, že v main jsou všechny předchozí změny a i změny co jsme nyní dělali v něw. připrav aab. pak se vrat na new a ověř, že jsou obě verze shodné.

odstran ten černý rámeček v badge/skin unlock overlayi; nech slot stejně velký, ale ořež okraje artu, aby v card nebyl vidět frame kolem trophy image.

ten čtvereček se objevuje s fade-in efektem; vypni animovaný reveal trophy artu, ať se square/frame neukazuje během načítání.

vrat poslední crop změnu trophy artu v unlock overlayi, protože ořezával horní i spodní část trophy.

reward trophy art se zobrazuje dvakrát (nejdřív bez frame a pak s frame); zruš onload fade-in a nech art viditelný hned po nastavení src.

skrytím clean trophy vrstvy v badge/skin reward overlayích by se mohl odstranit pozdější rostoucí rámeček; clean base nech jen pro mode unlock overlay.

badge/skin trophy art má být v úvodu skrytý a objevit se až spolu s textem ve fázi reveal, ne hned v prázdném rámečku.

na badges stránce se trophy image nemá zobrazovat u série, která nemá žádný získaný bronze/silver/gold tier; slot má zůstat, ale img až po prvním získaném badge.

-------------------
ted jen odpovídej. Chtěl bych udělat novou economy funkcionalitu. Ve hře máme zatím na crossing page "vstup do zlatého důlu". Já připravím obrazovku mine_inside. Chtěl bych, aby to fungovalo následně. v určeném intervalu (například jednou za minutu) přibude do storage jedna (nevo určený počet) coins. Storage ale bude mít jen určitou velikost (například 50 coins). Potom bude potřeba kliknout na "transfer", čímž se ze storage přenesou mince k standardním incím (wallet) a začnou se znovu v pravidelném intervalu těžit. Informace, kdy se vytěží další mince tam taky bude znázorněna. ve chvíli kdy bude storage plna, tak tam místo času bude "full". Jak by to mělo vypadat graficky je videt na druhém obrázku mine_you can.....  Ve spodním okně potom budou připravené "informace", které se budou nějaký způsobem na nějaké trigery (mozná náhodně) objevovat. V dalším kole bych potom chtěl připravit v shop možnost, že si bude možno koupit zvětšení místa ve storage. To se bude dělat přez grafiku truhly v shop screen. Promysli, jak toto nejlépe udělat, jaké jsou rizika, na co si dát pozor, případné návrhy na to, jak to udělat jinak

-------------------
ted to postupně doladíme a) tlačítko exit nemusís vykreslovat. stačí udělat overlay pro zpustení nad existující grafikou Exit (viz obrázek) b) slovo wallet nemusís psát, protoze je taky v grafice. číslo jako takové trochu zmenšíme a posuneme do leva dolů. c) udělej, aby se mine_inside rozšířoval do všech stran aby vyplnil okno (stejně jako se to děje v shop_inside)

-------------------
jeste je posun o polovinu vysky dolů

-------------------
udelej debug overlay nad tlačítko exit

-------------------
debug obdelnik neni videt

-------------------
posun ten hitbox o poloviny výsky hitboxu smerem dolů

-------------------
jeste jednou udelej totez

-------------------
podle obrázku posun čas za kdyz bude dalsí mince podle sipky. text "next coin..." tam je zbytecny, protoze uz je v grafice. stejne tak posun to 0/50 podle obrázku a sipky

-------------------
posun cislo timeru podle sipky na obrazku

-------------------
to 14/50 posun podle siky dolu a doprava. dolní panel s textem uprav. ten panel tam je zbytecny. je tam na to pripravena grafika. takze ponech jenom text. pozici upravime potom. a ted nevidim ten timer, asi se schoval za ten spodní panel?

-------------------
timer posun o dvacet pixelů dolů. počet coins posun o tricet pixellů dolů

-------------------
timer posun o deset pixelů dolů. počet coins posun o dvacet pixellů dolů

-------------------
ted posun počet coins o 40 pixelů do leva a timer o dvacet pixelů do leva

-------------------
ted jsi to zůžil nebo jak. udělej ten text box výrazně šiřší, aby se tam veslo celé číslo b) timer posun o výšku toho textu nahorů a o šířku textu do prava

-------------------
ted je pozice v pořádku. ted zkus znovu ukotvení pozice v rámci obrazovky / background obrazku. Predtim jsi to udělal dobře pro počet mincí ve wallet. tak to udělej stejně

-------------------
císlo u valet je presne ukotvené na jednom místě vzhledem k obrázku pozadí bez ohledu na velikost okna. pocet coins ve storage se poloha meni, kdyz menim velikost okna. neni ukotvené stejným způsobem

-------------------
posun pocet coins o 50 pixelů dolů

-------------------
ted o deset do prava

-------------------
jeste jednou o deset pixelů do prava

-------------------
tak tedy posun o pet procent dolů

-------------------
jeste posun dolů o tri procenta

-------------------
ted o tri procenta do prava

-------------------
ted timer posun o osm procent do prava a o patnact procent dolů

-------------------
posun timer o jedno procento dolů a o jedno procento do leva

-------------------
ten text dole "mined xx coins" posun o pet procent nahoru a o dvacet do prava

-------------------
posun jej o 3 procenta nahoru a o tricet do prava

-------------------
posun ten text o tricent procent do prava

-------------------
ted o deset do leva

-------------------
timer se aktualizuje jen pri reloadu stranky (pri vstupu do mine). můzes udělat, aby se nacetlo pri vstupu do stranky stav jaký má být a pak bezel "zivě"?

-------------------
jeste o deset do leva

-------------------
-------------------
-------------------
změn číslo 8: You can upgrade storage size in the Shop

-------------------
ted udělej bump navysení verze, sync do www a android, commit do main, priprav aab, over, ze jsou verze ve vetvích shodne a vrat se na new

-------------------
ted do administrace pod shop sekci pridej sekci mine. dej tam zatím dve polozky Coin Timer - ted nastaveny na jednu minutu, cili kdy se objevi dalsi mince a Storage - ted nastaveny na padesat. A rovnou i Storage L2 Storage L3 a Storage L4. zatim nastaveny na 60, 70, 80. na ty pak navazeme v shopu prikuování zvetsení storage

-------------------
ted odstran debug ramecek v mine screen i v crossing screen

-------------------
tak jak jsi mi hlasky vypsal v poradí. udělej si někde záznam, / tabulku / kde budou ty hlášky a jejich poradové číslo. tak abychom v budoucnu mohi nějaké pridávat. Zároven na číslo hlášky bude navázaná grafika. bude uložena ve slozce gfx2/mine_scr a vzdy se bude jmenovat mine_face_xx (císlo hlášky) s tím, že _00 je fallback. cili kdyz není k hlášce príslušna grafika, tak se zobrazi _00

-------------------
Zkus navrhnout jeste nějaké 4 hlášky

-------------------
Posun ten text s grafikou o tri procenta dolů a o deset procent do leva

-------------------
ted posun o pet procen zpatky do prava

-------------------
hlaška číslo 6 by se měla objevit, kdyz kliknut na transfer, ale to se nedeje. mela by pak zůstat pet vterin a pak se objevit hlaska 3, která by měla taky zůstat pět vterin. Pokud kliknu na transfer v dobe, kdyz nemám zadné coins pripravene k transfer, mela by se objevit hlaska 5 a taky zůstat pet vterin

-------------------
kdyz je storage 0 / 50 (cili je prázdna) a kliknu na transfer, nezobrazi se zadna hlaska. měla by se na pět vterin objevit hláska číslo 5

-------------------
grafika mine_inside není roztažená na celou obrazovku. dole je kousek prázdny

-------------------
kdyz je v storage 6 / 50 coins a kliknu na transfer, tak se objeví hlaska 3. měla by se objevi hlaska 6 s počtem převedených coins (v tomto případě 6). a zůstat pet vterin a pak by se měla objevit hlaska 3.

-------------------
uprav hlasku číslo 12 z "A bigger storage means fewer trips to the wallet." na A bigger storage means fewer trips to the mine."


-------------------
ted uděláme bod číslo 7 z plánu na mine ekonomiku a to je upgrade storage skrz nakup v shopu. k tomu pouzijeme grafiku truhli v shopu. kdyz na ni klikneme, měl by se objevit text - tam co je ted "placeholder" neco ve smyslu Storage capacity update (Level 2) a cenu. kdyz si koupime tento, objeví se tam Level 3 a pak Level 4. zároven do admin části je potřeba přidat v shop tuto polozku, jednotlivé levely a jejich ceny. V tuto chvili je dej na 1000 coins, 3000 coins a 6000 coins. Kdyz se koupí level 4, tak se objeví pres grafiku truhly sold

-------------------
udelej bump verze, sync do www a android, commit to main a priprav aab. potom se vrat do new a over, ze jsou verze srovnane.

-------------------
udělej bump verze, sync do www i do android, commit to main, připrav aab, vrat se na new - ověř, že verze jsou vyčistene
dorovnej i remote

-------------------

Ted jeste v shopu změn "Total Points" na "Total Score Poins"

-------------------

prejmenuj "Short Timer" na "Faster Coin Mining (xx s)" kde xx bude hodnota z admin. i v admin zmen název na "Faster Maining"

-------------------

Zatim nic nedelej jen odpovez, zda rozumís co chci a jak bys to udelal. chci udělat změnu v shop strance. na obrázku jsem označil grafiku, z které se dá koupit 1 coin. Chci změnit tu mechaniku. chci aby se tady kupoval kratší timer pro mining coins v mine. nyní je timer nastaveny na 60s - nastavuje se to v administraci . po koupi to kratsiho timeru se zkratí čas - nyní trea na 30s. To znamena, ze je potreba do shop v administraci změnit / pridat cenu za "Short Timer" a do mine v administraci pridat short timer a hodnotu, aby sla taky měnit. V shop page je potreba upravit texty, které se objevují pred nákupem, aby načítal čas, který bude po zkráceném timeru - hodnota co bude v administraci.

-------------------
-------------------
Ted pokračuj v predchozím podle návrhů. připrav to tedy jen pro android. pro web / local tam udělej fake sledování reklamy. 5s counter, který kdyz zkončí, tak to bude jako bychom reklamu přehrali. U androidu to napoj tak aby to opravdu fungovalo
-------------------
-------------------
do slozky game_over_scr jsem dal grafiku pro button conitnue: watch_ad.png pouzij ho pro watch ad
kdyz zpusim na android emulatoru, tak se objevi intro page, pak grafika page a pak se to restartuje. jednou se objevila i crossing page a pak se to restartovalo. nevim, zda to je emulatorem nebo kodem. nez ale vytvoříme verzi pro store, zkus zkontrolovat, zda nekde nemůže být něco, co způsobuje ten reset. respektive se nerestuje telefon, ale hra se zavre
-------------------
-------------------
ted udelej verio bumb, sync to www and android, commit to main, pak priprav aab, vrat se na new a over, ze jsou verze shodne
-------------------
které potřebuješ? případně je obě ulož do .key
-------------------
udelej novy version bump, sync to www / android, commit to main, vytvor aab, vrat se do main, over, ze je vse ciste
-------------------
muzes tam tedy pustit testovací reklamu? abychom videli, jak se to bude chovat?
-------------------
ty srdíčka - počet se mění podle počtu životů ve hře. od 1 do 5. Ubývají z levé strany. respektive zustane tam "obrys". aby bylo i videt, kolik srdíček bylo a kolik je
-------------------
pri zmenšeném okne je videt, ze pozice je stále pevná. tedy pokud jsi dělal upravu pro classic easy mode
-------------------
v advaneced easy modu jsou srdíčka zobrazována uplně divně . Je tam navíc ten text jump advanced, který tam nepatří a srdíčka dej na stejné místo se stejnou logikou jako u classic easy modu. Jen je rozdíl v počtu životů tady v tom modu, to je v poradku
-------------------
teckované soubory jsou moje backup, pptx je pomocný soubor, ale ty dva png soubory urcite do commitu zarh. pokud tam tedy nejsou, tak je pridej. stejne tak pokud nejsou v aab, tak jej priprav znovu i s nima
-------------------
Napoj Skin06 do hry, shopu i administrace. V shopu má být v označeném místě, v run select/detail obrazovkách má být jako běžně volitelný skin, v adminu má mít stejné přepínače pro pickup levely jako ostatní skiny a v jump animaci má používat walk frames pro běh, při skoku frame 03 držet po celou dobu výstupu, na vrcholu použít frame 04, při sestupu frame 05 a při dopadu pokračovat ostatními skin frames.
-------------------
Skin06 layout PNG byly ve `www/assets/...` připravené správně, ale root `assets/...` ještě ukazoval placeholdery s otazníkem. Srovnej root mirror podle `www`, aby local file:// běh ukazoval skin06_selected / skin06_unselected i po koupi Skin06.
-------------------
Přejmenuj v administraci Skin06 na Kaja. Interní klíč `Skin06` může zůstat, ale všechny viditelné labely v adminu, shopu a pre-run skin selectu mají ukazovat Kaja místo Skin 06.
-------------------
Skin layout PNG pro classic a advance jsou duplicitní, takže advance má začít používat classic layout cestu a duplicity v `assets/gfx2/advance/layout` se mají odstranit, aby se zmenšil release/AAB.
posun srdce (zivoty) v run screen o 5% a zároveň je zvětši o 50% (tedy na 150% současné velikosti)
-------------------
ted srdce posun o 2% nahoru
-------------------
muzes v mine shop u hlašky č 15 - a jen u této zvětšit zobrazovanou grafiku mine_face_15, aby se zobrazovala o 50% větší?
-------------------
ted je grafika na 150% původní velikosti. udělej, aby byla na 175%
-------------------
Místo PNG skin slotů v classic/advanced pre-run selectu použij JPG soubory z `assets/gfx2/classic/layout` a jen přepni resolver cesty, bez změny logiky výběru.
tak to udelej znovu podle workflow
v mine screen se hlaska č. 15 zobrazuje výš než ostatní hlasky. je to proto, ze tam je zvetsena grafika mine_face_15?
ano udel
u hlasky č. 15 (jen u ní) nech obrázek tak jak ted je, ale posun text o 5% do prava
u skin 06 animace pri hrani dochazi k "trhnuti" mezi posledním a prvním walk framem. jsou napojene vsechny 8 frames? protoze kdyz zkousim obrazky, tak nevidim důvod, proc by mel byt skok. není zadny rozdíl mezi 0+ a 08, které by na sebe meli navazovat
tak to rovnou uprav
uprav stejnym způsobem i jump obrazky, protoze tedka vypada skin jinak ve walk a jump fazi
tak to priprav
-------------------
