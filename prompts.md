# Prompts

-------------------

restore the level border overlay on branch New for levels 1 through 4 so the border art is visible above gameplay while HUD text stays on top

pridej stejny frame overlay i pro level 2, 3 a 4 podle obrazku v jejich slozkach, stejne jako level 1, a texty/hud nech stejne

-------------------

posun text Double Jump a radky pod nim o 10% jejich sirky doleva

-------------------

posun text Score a Max Score o 50% jejich sirky doprava

-------------------

-------------------
2026-04-18: nic se nezmenilo. zkus jeste jednou, tentokrat vytvoř tlačítko, které bude nad vsemi vrstavami, ktere bude mít overlay - červeny, vzdy viditelný a dej to tlačítko přesne doprostred obrazovky. jeho velikost udelej 512s512 pixelu
2026-04-18: ano, ted jsem to oveřil. opravdu se to ukazuje v gfx1, ale ma to být v gfx2. vzdy vsechno děláme v gfx2 (pokud neřeknu jinak - zapis to do pravidel). a nyní to tlačítko z gfx1 odstran a udělej ho v gfx2. ale zpátky v horním rohu. velikost odpovídající tlačítku v levé části obrazovky "back"
2026-04-18: uz to otevírá potvrzovací stranku. ale samozné tlačítko v horním rohu nemá žadný text. mělo by tam byt aspon Change User a nějaké pozadí. ted je tam jen cervený okraj a prohledné pozadí
2026-04-18: udelej ted comming do main do local i do www. potom se vrat na vetev new
2026-04-20: na webove casti se scores ukazuji dobre, pokud je okno vetsi. kdyz se okno zmensi na velikost, jak je to na mobilu, tak se ramecek zmensi tak, ze se tam nevejdou dva posledni radky. Zvetsi tu "zmensenou verzi" tak, aby byla o 10% vysky okna delsi smerem dolu. tedy nahore zustane na stejnem miste, ale dole se vejdou i ty dva radky, co tam nyni nejsou
2026-04-20: ted se to zmensuje v poradku, ale chybi tam ten dreveny ramecek. je tam zase jen bile okno. Neni to bile okno overlay, ktery prekresluje ten ramecek?
2026-04-20: a) tak jak se v urcitou chvíli to okno s rámečkem zmensí. tak tu zmenšenou velikost použij jako standard a at je to okno tak velké vždy b) zvětši okraje textu na pravé straně, aby čísla netekla do do grafiky dřeva (zvětši odsazení o 10% šířky řádku s textem) a změn aby byly v případně "online Top scores" a "Onine top players" vycentrované ty řádky.
2026-04-20: zmen na tom top scores velikost pisma. aby byl vzdy tak velke, jaky je nejmensi ted nastavene. kdyz se postupne zvetsuje, tak to pak vypada osklive. pismo at ma velikost jako ma nastavenou minimalni a nezvetsuje se
2026-04-20: skladej crossing animace takto: crossing_background uplne v pozadi, pak crossing_foreground a uplne navrchu sekvenční PNG obrazky.
2026-04-20: crossing scéna se sklada takto: crossing_background dole, clouds nad nim, crossing_foreground nad mraky, shop_house jako dalsi vrstva a sekvenční PNG uplne navrchu.
2026-04-20: na crossing page, kdyz se 20 vteřin na nic neklikne, prehraj sekvenci ze slozky crossing_wait a opakuj ji kazdych 15 vterin, dokud se neklikne na neco jineho. Sekvence ma 13 frame a bezi o 33% dele.
2026-04-20: na Android AAB over, ze frame sekvence entrance, classic_back, settings a settings_back pouzivaji spravny casing souboru, aby se nevynechaval frame 08/09/10 na store verzi.
2026-04-20: na game over screenu pouzij continue.png a end_run.png z assets/gfx2/game_over_scr jako grafiku tlacitek, odstran celoplosny click fallback na game over overlay a skryj Jump Classic badge tak, aby lives zustaly na jeho miste.
2026-04-21: tak to tak odted dělej a zapis to i do pravidel k ostatnim. Tam jak je napsano co treba máš dělat, kdyz napíšu vycisti local storage nebo priprav aab. pokud sis ty pravidla nenacetl, udelej tak nyní
2026-04-21: uprav game over screen tak, aby misto textu Game Over a nazvu modu/difficulty pouzival jednu responsivni grafiku z assets/gfx2/game_over_scr podle kombinace Classic Easy, Classic Hard, Advanced Easy a Advanced Hard
2026-04-21: udelej ted sync do www i androidu, at se na to můžu podívat na emulatoru
2026-04-21: udelat tu grafiku o 50% mensi, protoze zabira prostor, kam potrebuji, aby se vesly grafiky s topscore
2026-04-21: sync prosím
2026-04-21: posun ty topscore okna o 10% nahoru. a pak rovnou znovu udelej sync
2026-04-21: zvedni ten blok s textem o score, tlačítky a spodním textem o ceně trochu nahoru. Přetéká to pod obrazovku a musí se posouvat. chci aby to bylo videt najednou. Případně to můžeš uděla tak, že tlačítka continue a end run zmenšís o 10% čímž se zvedne text each life costs..... a bude to vyřešené. rovnou sync
2026-04-21: priprav continue purchase overlay tak, aby po kliknuti na continue pouzival buy_continue_clean.png a mel podobne rozlozeni jako druhy referencni obrazek
2026-04-21: buy_continue_clean.png soubor jsem upravil. nyní ma opravdu průhledné pozadí. Nezobrazuj text How Many Lives, protoze uz je na pevno na obrazku. Tlačítka buy a back, jak jsi je tam dal ty, tam nejsou potřeba, stačí overlay na místo na obrázku, kde je grafika buy a back. - Stačí kdyz overlay bude o 20% užší a 33% vyšší. Zároven zmenší mezery mezi řádky textu. Celé okno at je responzivn. ja zmenšil jeho velikost.
2026-04-21: ten obrázek co jsem nahral má strany 256x199 Zachovej ten poměr stran. ted je to uplně nesmyslné
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
