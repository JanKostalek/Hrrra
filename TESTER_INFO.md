# Hrrra - Info pro testery

Děkuji, že jste si hru nainstalovali.
V tuto chvíli ověřuji, jak aplikaci vytvořit pomocí AI a dostat ji až do Google Store.

## Co je Hrrra
Hrrra je 2D arkádová plošinová hra postavená na postupu přes více levelů.

-------------------------------------------------

## Administrace během testování
Po dobu testování je ve hře otevřená administrace.

Administrace umožňuje:

Můžete si resetovat cokoliv nastavíte do "default". Lze to jednotlivě i tlačítkem nahoře "ÚPLNĚ vše".

- měnit mechaniky pro všechny levely
- měnit nastavení pro oba módy a obě obtížnosti
- měnit spawn hodnoty, unlocky, score cíle a další parametry
- testovat zamčení a odemčení `Hard` a `Full Mode`
- vybrat skin natvrdo kvůli testování

Důležité:
- admin výběr skinu slouží pro test
- sám o sobě skin trvale neodemkne

## Export a import nastavení
Administrace podporuje:
- `Export`
- `Copy JSON`
- `Import File`
- `Paste JSON`

To znamená, že tester může:
- uložit celé aktuální nastavení do souboru
- znovu ho nahrát
- nebo ho poslat vývojáři

-------------------------------------------------

Hra momentálně obsahuje:
- `Jump Mode`
- `Full Mode` - odemyká se postupně
- obtížnosti `Easy` a `Hard` - odemykají se postupně
- `5` levelů
- odemykatelné skiny postavy

Nicméně `Full Mode` jsem ještě vůbec neladil. Snažil jsem se pouze o `Jump Mode Easy` a `Jump Mode Hard`.

První čtyři levely se dokončují dosažením cílového score a průchodem teleportem. Poslední level může fungovat jako endless část hry.

V prvních 4 levelech hra směřuje k dosažení nastaveného score. Po splnění podmínky se objeví teleport. Průchodem teleportem level končí. V posledním levelu může hra pokračovat endless.

## Postup hrou
Hra nezačíná se všemi možnostmi otevřenými.

Na čistém profilu je dostupné jen:
- `Jump Mode`
- `Easy`
- skin `Zyro`

### Odemknutí Hard
`Jump Mode Hard` se odemyká po dosažení určitého levelu.

Výchozí nastavení:
- `Hard` se odemkne při dosažení `Level 5`

### Odemknutí Full Mode
`Full Mode` se odemyká až po dosažení určitého score v `Jump Mode Hard`.

Výchozí nastavení:
- `Full Mode` se odemkne po dosažení `150 000` score v `Jump Mode Hard`

Tyto podmínky jsou nastavitelné v administraci.

----------------------------------------------------------------

## Levely
Každý level může mít:
- vlastní tuning mechanik
- vlastní obtížnost podle módu a difficulty
- vlastní cílové score

Aktuální flow:
- `Level 1-4` = score target + teleport
- `Level 5` = může být endless

Mezi levely se přenáší:
- score
- životy
- některé dočasné efekty

## Teleport a dokončení levelu
- Po splnění score podmínky se objeví teleport.

## Score
Score roste:
- za ubíhající vzdálenost
- za sbírání bonusů
- za některé speciální výhry

Score může být také:
- zpomaleno
- dočasně zmraženo
- sníženo negativními mechanikami

## Co hráč může sbírat
### Coin
- základní score pickup

### Money Bag
- hodnotnější score pickup

### Life
- vrací ztracený život až do maxima

### Double Jump
- dočasně umožní dvojskok

### Tripple Jump
- dočasně umožní trojskok

### Shield
- ochrání před jedním jinak nebezpečným zásahem
- může zachránit i při pádu do spodní death zóny

### Magnet
- po omezenou dobu přitahuje vybrané pickupy k postavě
- pickup se nesebere okamžitě, ale fyzicky letí k hráči
- sebere se až ve chvíli dotyku s postavou

### Slow
- dočasně zpomalí hru o nastavené procento
- délka efektu je nastavitelná v adminu
- zrychlování hry ale dál na pozadí pokračuje

### Skin Pickup
- speciální pickup pro odemčení nové postavy

## Nebezpečí
### Blocker
- překážka, které je třeba se vyhnout

### Projectile
- nebezpečný letící objekt

### Top Death Zone
- kontakt znamená ztrátu života

### Bottom Death Zone
- bez ochrany znamená smrt
- `Shield` může hráče vždy zachránit

## Speciální mechaniky
### Cracked Coin
- negativní pickup
- odebere část score získaného v aktuálním levelu

### Question Coin
- risk/reward mechanika
- po sebrání se na chvíli zastaví hra
- `+ / -` běží dál, dokud hráč netukne a tím výsledek nezastaví
- pokud hráč netukne, po `5s` se výsledek zastaví automaticky
- velikost výhry i ztráty jde ladit v adminu přes `Win %` a `Lose %`

### Curse
- na krátkou dobu zmrazí běžný score gain
- hra jede dál, ale normální score nepřibývá

### Shield
- funguje i jako ochrana před `Bottom Death Zone`
- při pádu může vrátit hráče na bezpečnou plochu

### Magnet
- přitahuje coin a life pickupy prostorem směrem k hráči
- je dobře vidět, jak k hráči letí

## Jump efekty přes levely
Pokud hráč dokončí level a ještě má aktivní:
- `Double Jump`
- nebo `Tripple Jump`

pak se zbývající čas přenese do dalšího levelu a zdvojnásobí se.

Odpočet ale v nové úrovni nezačne běžet hned:
- na úvodní dlouhé plošině stojí
- rozeběhne se až po prvním skutečném skoku hráče

## Skiny postavy
Aktuální hratelné skiny:
- `Zyro`
- `Vexi`
- `Nemu`
- `Krob`

Na začátku je dostupný jen:
- `Zyro`

`Vexi`, `Nemu` a `Krob` se dají odemykat během hry.

-------------------------------------------------------------

### Jak funguje odemykání skinů
- Před runem hra vybere, jestli se v daném runu může objevit nový skin pickup.
- Nabízí se jen skin, který hráč ještě nemá odemčený.
- Skin pickup se objeví jen jednou za run.
- Pokud se v tom runu už objevil, znovu se neobjeví, i když ho hráč nesebere.
- Skin pickup se objevuje na plošině na pravém kraji obrazovky.
- V briefing obrazovce je vidět, který skin se v tom runu může objevit.

### Skin výběr před runem
V briefing obrazovce je panel `Skins`:
- odemčené postavy jsou klikatelné
- zamčené postavy jsou zobrazené jako locked
- další budoucí sloty jsou označené jako `Soon`

## Co testovat
Při testování je užitečné sledovat hlavně:
- jestli je na první pohled jasné, co je cíl hry
- jestli jsou pickupy čitelné a srozumitelné
- jestli je jasné, proč hráč ztratil život nebo score
- jestli jsou levely férové
- jestli je teleport čitelný a level finish působí dobře
- jestli briefing obrazovka dává dost informací před runem
- jestli odemykání `Hard`, `Full Mode` a skinů působí logicky
- jestli je HUD dobře čitelný na všech pozadích
- jestli animace a pohyb postavy působí plynule
- jestli `Magnet`, `Shield`, `Curse`, `Cracked Coin` a `Question Coin` působí srozumitelně

-----------------------------------------------------------------

## Poznámka pro testery
Hra je stále ve vývoji. Grafika, balans, pravidla i rozmístění některých mechanik se ještě mohou a pravděpodobně budou měnit. Smyslem testování je ověřit:
- srozumitelnost
- čitelnost
- zábavnost
- férovost
- technickou stabilitu

----------------------------------

## Ovládání
### Jump Mode
#### Desktop
- `Space = Jump`

#### Mobil
- celá dotyková plocha = skok

### Full Mode
#### Desktop
- `Left/Right Arrows` nebo `A/D` = pohyb
- `Space = Jump`

#### Mobil
- levá a pravá část displeje = pohyb
- vyhrazená část = skok

Zpětná vazba je cennější než "perfektní run". Zajímají nás i situace, kdy něco působí nejasně, nefér nebo vizuálně matoucím dojmem.
----------------------------------

## Level Goal Score
- Administrace novÄ› pouÅ¾Ã­vÃ¡ `Level Goal Score` jako required score pro konkrÃ©tnÃ­ level.
- Nejde uÅ¾ o absolutnÃ­ total-run target.
- SkuteÄnÃ½ cÃ­l se poÄÃ­tÃ¡ jako `carried score na startu levelu + Level Goal Score`.
- Briefing proto ukazuje `Finish Level with XXXX score.`, kde `XXXX` je aktuÃ¡lnÄ› vypoÄtenÃ½ target pro ten run.
- `Question Coin` na konci levelu se normÃ¡lnÄ› zapoÄÃ­tÃ¡ do score a dalÅ¡Ã­ level pak zaÄÃ­nÃ¡ z tohoto novÃ©ho vÃ½sledku.
- Life protection note: after losing one protected life to top death zone, projectile, or blocker, there is a 2-second grace period before those sources can remove another life again. Bottom death zone is still immediately fatal.
