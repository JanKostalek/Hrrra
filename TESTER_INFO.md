# Hrrra - Info Pro Testery

## Co Je Hrrra
Hrrra je 2D arkádová plošinovka postavená jako postup přes více úrovní. Hráč běží, skáče, vyhýbá se nebezpečím, sbírá bonusy a snaží se dohrát co nejdál a s co nejvyšším skóre.

Hra má:
- `Jump Mode`
- `Full Mode`
- obtížnosti `Easy` a `Hard`
- postup přes `5` levelů

První čtyři levely mají cíl v podobě dosažení určitého skóre. Poslední level může fungovat jako nekonečný režim.

## Cíl Hry
Základní cíl je:
- přežít
- získávat skóre
- dokončovat levely
- odemykat nové skiny

Level je dokončen ve chvíli, kdy hráč získá potřebné skóre a projde teleportem.

## Základní Ovládání
### Desktop
- `Space` = skok
- v `Full Mode` také pohyb doleva a doprava

### Mobil
- v `Jump Mode` skok přes dotykovou plochu
- v `Full Mode` dotykové ovládání pohybu a skoku

## Jak Hra Funguje
- Hráč se pohybuje po plošinách a výtazích.
- Během hry se postupně objevují bonusy i nebezpečné prvky.
- Některé mechaniky se odemykají až od určitého skóre.
- Skóre a životy se mezi levely přenášejí.
- Aktivní efekty se v některých případech mohou přenést i do dalšího levelu.

## Co Může Hráč Sbírat
### Coin
- běžný bonusový pickup
- přidává skóre

### Money Bag
- vzácnější bonus
- přidává větší množství skóre než coin

### Life
- doplní ztracený život až do maxima

### Double Jump
- dočasně umožní dvojskok

### Tripple Jump
- dočasně umožní trojskok

### Shield
- ochrání před jedním jinak nebezpečným zásahem
- může zachránit i při pádu do spodní death zóny

### Magnet
- po omezenou dobu přitahuje sbíratelné prvky k hráči

### Slow
- zpomalí tempo hry

### Skin Pickup
- speciální odemykatelný pickup
- může zpřístupnit nový vzhled postavy

## Nebezpečné Prvky
### Blocker
- překážka, které je potřeba se vyhnout

### Projectile
- nebezpečný létající objekt

### Top Death Zone
- horní nebezpečná hranice obrazovky

### Bottom Death Zone
- spodní nebezpečná hranice obrazovky

## Speciální Score Mechaniky
### Cracked Coin
- negativní pickup
- odečte část skóre získaného v aktuálním levelu

### Question Coin
- risk/reward mechanika
- po sebrání se náhodně rozhodne, jestli hráč skóre získá, nebo ztratí

### Curse
- dočasně zastaví běžné přibývání skóre
- hra běží dál, ale normální score gain je po dobu efektu zmrazený

## Levely
- Každý level může mít jiné pozadí a atmosféru.
- Každý level může mít jiné nastavení obtížnosti, spawnů a mechanik.
- V pozdějších levelech se mohou objevovat skiny k odemčení.

## Skóre A Postup
- Skóre roste během pohybu a sbíráním bonusů.
- Některé prvky skóre zvyšují, jiné ho mohou snížit nebo na chvíli zastavit.
- Po dosažení cílového skóre se objeví teleport.
- Po dokončení levelu následuje přehled výsledků a briefing další úrovně.

## Co Testovat
Při testování je užitečné sledovat hlavně:
- jestli je ovládání srozumitelné
- jestli je čitelné, co který pickup dělá
- jestli jsou levely férové
- jestli je dobře vidět HUD a důležité informace
- jestli jsou skoky, kolize a pohyb po plošinách plynulé
- jestli je jasné, kdy a proč hráč získal nebo ztratil skóre
- jestli jsou odměny a tresty pochopitelné

### Admin Během Testování
- Po dobu testování je ve hře otevřená také administrace.
- V administraci je možné upravovat prakticky všechny hlavní atributy hry, včetně nastavení levelů, módů, obtížností a mechanik.
- Administrace slouží pro rychlé ladění a ověřování chování hry bez nutnosti měnit zdrojový kód.
- Je možné používat i `export` a `import` nastavení, takže se dají připravené konfigurace ukládat, sdílet a znovu načítat.

## Krátké Shrnutí Pro První Spuštění
- běž a skákej po plošinách
- vyhýbej se nebezpečím
- sbírej bonusy
- dokonči level dosažením cílového skóre a průchodem teleportem
- v pozdějších levelech hledej nové skiny

## Poznámka Pro Testery
Hra je stále ve vývoji. Některé hodnoty, grafika, vyvážení i pravidla se ještě mohou měnit.
