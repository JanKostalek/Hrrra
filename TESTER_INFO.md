# Hrrra - Info Pro Testery

## Co Je Hrrra
Hrrra je 2D arkadova platformova hra postavena na postupu pres vice levelu. Hrac beha, skace, vyhyba se nebezpecim, sbira bonusy, odemyka novy obsah a snazi se dojit co nejdal s co nejvyssim score.

Hra momentalne obsahuje:
- `Jump Mode`
- `Full Mode`
- obtiznosti `Easy` a `Hard`
- `5` levelu
- odemykatelne skiny postavy

Prvni ctyri levely se dokoncuji dosazenim ciloveho score a pruchodem teleportem. Posledni level muze fungovat jako endless cast hry.

## Jak Vypada Aktualni Verze
- Hra ma vyraznejsi startovaci obrazovku s vyberem modu a obtiznosti.
- Jednotlive levely maji rozdilna pozadi a vlastni atmosferu.
- Pred kazdym runem se zobrazuje briefing obrazovka s pravidly, cilem levelu a vyberem skinu.
- Po dokonceni levelu se zobrazi `Level Finished` meziscreen s rekapitulaci runu.

## Zakladni Cil Hry
Cilem hrace je:
- prezit
- ziskavat score
- dokoncovat jednotlive levely
- odemykat dalsi hratelne moznosti
- odemykat nove skiny postavy

V prvnich 4 levelech hra smeruje k dosazeni nastaveneho score. Po splneni podminky se objevi teleport. Pruchodem teleportem level konci. V poslednim levelu muze hra pokracovat endless.

## Ovladaani
### Jump Mode
#### Desktop
- `Space = Jump`

#### Mobil
- cela dotykova plocha = skok

### Full Mode
#### Desktop
- `Left/Right Arrows` nebo `A/D` = pohyb
- `Space = Jump`

#### Mobil
- leve a prave casti displeje = pohyb
- vyhrazena cast = skok

## Postup Hrou
Hra uz nezacina se vsemi moznostmi otevrenymi.

Na cistem profilu je dostupne jen:
- `Jump Mode`
- `Easy`
- skin `Zyro`

### Odemknuti Hard
`Jump Mode Hard` se odemyka po dosazeni urciteho levelu.

Vychozi nastaveni:
- `Hard` se odemkne pri dosazeni `Level 5`

### Odemknuti Full Mode
`Full Mode` se odemyka az po dosazeni urciteho score v `Jump Mode Hard`.

Vychozi nastaveni:
- `Full Mode` se odemkne po dosazeni `150 000` score v `Jump Mode Hard`

Tyto podminky jsou nastavitelne v administraci.

## Levely
Kazdy level muze mit:
- vlastni pozadi
- vlastni tuning mechanik
- vlastni obtiznost podle modu a difficulty
- vlastni cilove score

Aktualni flow:
- `Level 1-4` = score target + teleport
- `Level 5` = muze byt endless

Mezi levely se prenasi:
- score
- zivoty
- nektere docasne efekty

## Teleport A Dokonceni Levelu
- Po splneni score podminky se objevi teleport.
- Teleport se objevuje jako svisla brana.
- Kdyz se postava dotkne aktivniho jadra teleportu, hra se na chvili zastavi.
- Probeha kratka teleportacni animace postavy.
- Potom se zobrazi `Level Finished`.

## Skore
Score roste:
- za ubihajici vzdalenost
- za sbirani bonusu
- za nektere specialni vyhry

Score muze byt take:
- zpomaleno
- docasne zmrazeno
- snizeno negativnimi mechanikami

## Co Hrac Muze Sbirat
### Coin
- zakladni score pickup

### Money Bag
- hodnotnejsi score pickup

### Life
- vraci ztraceny zivot az do maxima

### Double Jump
- docasne umozni dvojskok

### Tripple Jump
- docasne umozni trojskok

### Shield
- ochrani pred jednim jinak nebezpecnym zasahem
- muze zachranit i pri padu do spodní death zony

### Magnet
- po omezenou dobu pritahuje vybrane pickupy k postave
- pickup se nesebere okamzite, ale fyzicky leti k hraci
- sebere se az ve chvili dotyku s postavou

### Slow
- docasne zpomali hru o nastavene procento
- zrychlovani hry ale dal na pozadi pokracuje

### Skin Pickup
- specialni pickup pro odemceni nove postavy

## Nebezpeci
### Blocker
- prekazka, ktere je treba se vyhnout

### Projectile
- nebezpecny letici objekt

### Top Death Zone
- kontakt znamena ztratu zivota

### Bottom Death Zone
- bez ochrany znamena smrt
- `Shield` muze hrace vzdy zachranit

## Specialni Mechaniky
### Cracked Coin
- negativni pickup
- odebere cast score ziskaneho v aktualnim levelu

### Question Coin
- risk/reward mechanika
- po sebrani se na chvili zastavi hra
- nahodne se rozhodne, zda hrac score ziska nebo ztrati

### Curse
- na kratkou dobu zmrazi bezny score gain
- hra jede dal, ale normalni score nepribyva

### Shield
- funguje i jako ochrana pred bottom death zone
- pri padu muze vratit hrace na bezpecnou plochu

### Magnet
- pritahuje coin a life pickupy prostorem smerem k hraci
- je viditelne, jak k hraci leti

## Jump Efekty Pres Levely
Pokud hrac dokonci level a jeste ma aktivni:
- `Double Jump`
- nebo `Tripple Jump`

pak se zbyvajici cas prenese do dalsiho levelu a zdvojnasobi se.

Odpočet ale v nove urovni nezacne bezet hned:
- na uvodni dlouhe plosine stoji
- rozebehne se az po prvnim skutecnem skoku hrace

## Skiny Postavy
Aktualni hratelne skiny:
- `Zyro`
- `Vexi`
- `Nemu`
- `Krob`

Na zacatku je dostupny jen:
- `Zyro`

`Vexi` a `Nemu` se daji odemykat behem hry.

### Jak Funguje Odemykani Skinu
- Pred runem hra vybere, jestli se v danem runu muze objevit novy skin pickup.
- Nabizi se jen skin, ktery hrac jeste nema odemceny.
- Skin pickup se objevi jen jednou za run.
- Pokud se v tom runu uz objevil, znovu se neobjevi, i kdyz ho hrac nesebere.
- Skin pickup se objevuje na nejspodnejsim vytahu.
- V briefing obrazovce je videt, ktery skin se v tom runu muze objevit.

### Skin Vyber Pred Runem
V briefing obrazovce je panel `Skins`:
- odemcene postavy jsou klikatelne
- zamcene postavy jsou zobrazeny jako locked
- dalsi budouci sloty jsou oznacene jako `Soon`

## Co Testovat
Pri testovani je uzitecne sledovat hlavne:
- jestli je na prvni pohled jasne, co je cil hry
- jestli jsou pickupy citelne a srozumitelne
- jestli je jasne, proc hrac ztratil zivot nebo score
- jestli jsou levely ferove
- jestli je teleport citelny a level finish pusobi dobre
- jestli briefing obrazovka dava dost informaci pred runem
- jestli odemykani `Hard`, `Full Mode` a skinu pusobi logicky
- jestli je HUD dobre citelny na vsech pozadich
- jestli animace a pohyb postavy pusobi plynule
- jestli magnet, shield, curse, cracked coin a question coin pusobi srozumitelne

## Administrace Behem Testovani
Po dobu testovani je ve hre otevrena administrace.

Administrace umoznuje:
- menit mechaniky pro vsechny levely
- menit nastaveni pro oba mody a obe obtiznosti
- menit spawn hodnoty, unlocky, score cile a dalsi parametry
- testovat zamceni a odemceni `Hard` a `Full Mode`
- vybrat skin natvrdo kvuli testovani

Dulezite:
- admin vyber skinu slouzi pro test
- sam o sobe skin trvale neodemkne

## Export A Import Nastaveni
Administrace podporuje:
- `Export`
- `Copy JSON`
- `Import File`
- `Paste JSON`

To znamena, ze tester muze:
- ulozit cele aktualni nastaveni do souboru
- znovu ho nahrat
- nebo ho poslat vyvojari

K dispozici je i:
- `Default / Reset all`

Tento reset vraci hru do vychoziho stavu prvniho spusteni, vcetne:
- score
- odemcenych skinu
- odemceni `Hard`
- odemceni `Full Mode`
- admin nastaveni

## Strucne Shrnutie Pro Prvni Spusteni
- Zacinas v `Jump Mode / Easy`.
- Behaj, skakej a sbirej bonusy.
- Vyhybej se prekazkam a projektilum.
- Dokonci level dosazenim ciloveho score a pruchodem teleportem.
- Pozdeji odemknes `Hard`, `Full Mode` a dalsi skiny.
- Pokud chces, muzes si pro testovani pomoct administraci.

## Poznamka Pro Testery
Hra je stale ve vyvoji. Grafika, balans, pravidla i rozmisteni nekterych mechanik se jeste mohou menit. Smyslem testovani je overit:
- srozumitelnost
- citelnost
- zabavnost
- ferovost
- technickou stabilitu

Zpetna vazba je cennejsi nez "perfektni run". Zajimaji nas i situace, kdy neco pusobi nejasne, neferove nebo vizualne matouci.
