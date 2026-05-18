# Hrrra User Guide

Tahle příručka popisuje, co lze dělat na jednotlivých obrazovkách hry a jak se v nich běžně pohybovat.

Neřeší technické detaily zdrojového kódu. Je psaná jako praktický návod pro hraní, testování a rychlou orientaci v UI.

## 1. První spuštění

Při prvním otevření hry se obvykle zobrazí přihlašovací okno.

### Co je na této obrazovce

- zadání hráčského jména
- zadání hesla
- volba `Guest`
- potvrzení pokračování

### Co lze dělat

- zadat nové jméno a heslo
- přihlásit se ke stávajícímu jménu
- vstoupit jako `Guest`

### Co se stane po potvrzení

- hra si zapamatuje vybraného hráče
- uloží se profilové údaje
- otevře se hlavní startovní obrazovka

### Poznámka k Guest režimu

- `Guest` je samostatná lokální session
- nebere progress jiného přihlášeného hráče
- slouží pro rychlé zkoušení bez účtu

## 2. Update Notice

Pokud je k dispozici novější verze hry, může se zobrazit update okno.

### Co lze dělat

- `Later`:
  - zavře upozornění
  - pokračuješ dál ve hře
- `Update now`:
  - otevře stránku s aktualizací

### K čemu slouží

- upozorní na novou verzi
- pomáhá nepřehlédnout release

## 3. What's New

Po nové verzi se může zobrazit okno `What's New`.

### Co lze dělat

- přečíst si seznam změn v dané verzi
- stisknout `Continue`

### Kdy se zobrazuje

- po vydání nové verze
- jen jednou pro danou verzi nebo dokud ji uživatel nepotvrdí

## 4. Hlavní Startovní Obrazovka

Tahle obrazovka je hlavní rozcestník hry. V GFX2 podobě je to crossroads hub.

### Co lze dělat

- otevřít `Jump Classic`
- otevřít `Jump Advanced`
- otevřít `Badges`
- otevřít `Scores`
- otevřít `Rules`
- otevřít `Credits`
- otevřít `Shop`
- otevřít `Settings`
- vstoupit do `Mine`

### Jak je obrazovka rozdělená

- hlavní navigace je řešená značkami a velkými hotspoty
- doplňkové stránky jsou dostupné přes mraky
- některé prvky se mohou zamykat podle postupu nebo admin nastavení

### Co si tu hráč hlídá

- jestli je otevřený `Classic` nebo `Advanced`
- jestli je `Advanced` už odemčený
- jaký je zvolený skin
- zda jsou dostupné badges, shop a mine

## 5. Obrazovka `Jump Classic`

Tahle obrazovka je před startem klasického režimu.

### Co lze dělat

- vybrat skin
- změnit obtížnost `Easy` / `Hard`
- vidět aktuální level
- vidět cíl levelu
- otevřít administraci
- spustit run
- vrátit se zpět

### Co je důležité

- tady se připravuje konkrétní běh
- zobrazuje se, co bude v levelu cílem
- na některých levelech se zobrazují i doplňkové poznámky, například o životech nebo o `Double Jump`

### Skin sloty

- skin sloty jsou klikatelné
- některé jsou vždy otevřené
- některé se odemykají až později
- `Skin07` je zvláštní případ a může měnit vizuální styl celé pre-run scény

### Difficulty switch

- `Easy` a `Hard` se přepínají přímo na této obrazovce
- změna obtížnosti mění zobrazený levelový cíl a pravidla běhu

## 6. Obrazovka `Jump Advanced`

Tahle obrazovka funguje podobně jako `Jump Classic`, ale pro advanced režim.

### Co lze dělat

- vybrat skin
- přepnout obtížnost
- zkontrolovat level a cíl
- otevřít administraci
- spustit run
- vrátit se zpět

### Rozdíl proti Classic

- používá jiný režim hry
- může mít odlišné unlocky a pravidla
- v administraci má vlastní konfiguraci pro levely a obtížnosti

## 7. Obrazovka `Rules`

Na `Rules` se čtou pravidla hry a vysvětlení mechanik.

### Co lze dělat

- listovat stránkami pravidel
- přecházet na předchozí a další stránku
- vrátit se zpět

### Co tam najdeš

- vysvětlení základního hraní
- bonusy a hazardy
- shop
- mine
- další přehledové informace

### Prakticky

- pokud chceš pochopit, co dělá daný pickup nebo hazard, sem se dívá nejdřív

## 8. Obrazovka `Credits`

Na `Credits` jsou informace o autorství, poděkování a verzi aplikace.

### Co lze dělat

- přečíst si credits
- otevřít update stránku přes tlačítko `Update`
- vrátit se zpět

## 9. Obrazovka `Scores`

Na `Scores` jsou online top hráči.

### Co lze dělat

- zobrazit leaderboard
- prohlížet top hráče pro daný režim
- vrátit se zpět

### Co se tu stává

- hra načte online data pro aktuální board
- pokud je přihlášený hráč, ukáže i jeho pozici a nejvyšší score

## 10. Obrazovka `Settings`

V settings se upravuje chování hry a zvuk.

### Co lze dělat

- zapnout nebo vypnout hudbu
- zapnout nebo vypnout zvuky
- měnit hlasitost
- přepnout hráče přes `Change User`

### Change User

- otevře potvrzovací okno
- po potvrzení se vrátí přihlašovací obrazovka

## 11. Obrazovka `Shop`

Shop je místo, kde se kupují upgrady a odemykají některé položky.

### Co lze dělat

- směnit score za coiny
- koupit `Buy 10 coins`
- koupit `Faster Coin Mining`
- koupit `New Level`
- koupit skiny
- koupit storage upgrady v mine systému
- u některých položek sledovat, že už jsou `Sold`

### Jak shop funguje prakticky

- klikneš na položku
- dole se zobrazí její cena a popis
- stiskneš `Buy`
- pokud máš dost prostředků, položka se koupí

### Důležité poznámky

- některé položky jsou jednorázové
- některé se po koupi označí jako `Sold`
- `Buy 10 coins` je opakovatelná položka, ale první nákup se počítá jako splněná podmínka pro badge progress
- `New Level` odemyká Level X flow

## 12. Obrazovka `Mine`

Mine slouží k těžení coinů, které se ukládají do storage.

### Co lze dělat

- sledovat naplnění storage
- vidět countdown do dalšího coinu
- přenést storage coins do wallet
- sledovat statusové hlášky
- vrátit se zpět

### Prakticky

- coins se těží automaticky
- ukládají se do storage
- když je storage plná, těžba se zastaví
- po transferu do wallet se těžba obnoví

### Co znamená transfer

- přesune uložené mince do peněženky
- vyprazdňuje storage
- může spustit reminder logiku v mobilní verzi

## 13. Administrace

Admin slouží k nastavování mechanik, vzhledu a balancu.

### Co lze dělat

- resetovat nastavení na default
- exportovat konfiguraci
- kopírovat JSON
- importovat JSON soubor
- vložit JSON ručně
- nastavit globální volby
- upravovat levely a jejich hodnoty
- měnit shop ceny
- měnit mine parametry
- upravovat badges a progress

### Co admin běžně obsahuje

- `Global`
- `Badges`
- `Shop`
- `Mine`
- `Sounds`
- pod tím jednotlivé levelové sekce

### Přístup do adminu

- z pre-run detail obrazovky přes tlačítko `Admin`
- někdy přes horní admin tlačítko podle obrazovky
- pokud je zapnutá ochrana heslem, je potřeba zadat admin heslo

## 14. Badges Obrazovka

Badges jsou přehled dosažených odznaků.

### Co lze dělat

- prohlížet badge kategorie
- sledovat bronze/silver/gold progress
- vidět, které badge jsou odemčené a které zamčené

### Co si všímat

- badge se počítají podle typu výzvy
- některé badge jsou za single run
- některé za lifetime progress
- některé za skills, discovery nebo speciální mechaniky

### Badge reward

Když hráč badge získá, může se zobrazit odměnové okno s trofejí a tierem.

## 15. Skin reward

Pokud se odemkne nový skin, zobrazí se skin reward overlay.

### Co lze dělat

- podívat se na odemčený skin
- potvrdit pokračování

### Kdy se ukazuje

- po odemčení nového skinu během hry nebo při splnění příslušné podmínky

## 16. Badge Reset hláška

Pokud se badges resetují, zobrazí se potvrzovací informační okno.

### Co lze dělat

- potvrdit hlášku tlačítkem `OK`

## 17. Level Finished

Po dokončení levelu se zobrazí obrazovka s informací o postupu dál.

### Co lze dělat

- pokračovat na další level
- pokud je odemčený `Level X`, pokračovat do endless pokračování po Level 5

### Jak to vypadá v praxi

- po dohrání levelu vidíš výsledek a možnost pokračování
- při splnění podmínky se hra může posunout do dalšího levelu nebo do Level X flow

## 18. Game Over

Po smrti nebo ukončení běhu se zobrazí game over obrazovka.

### Co lze dělat

- vidět finální score
- vidět získané coiny
- vidět stav wallet
- sledovat top scores a online leaderboard
- pokračovat přes continue flow, pokud je dostupný
- ukončit run

### Když je dostupné pokračování

- hráč může zkusit pokračovat za coiny nebo přes reklamu podle dostupnosti

## 19. Touch Controls a běh hry

Na mobilu jsou na obrazovce dotyková tlačítka.

### Co dělají

- `JUMP`
- `LEFT`
- `RIGHT`

### Během běhu lze

- skákat
- pohybovat se vlevo a vpravo
- sbírat bonusy
- vyhýbat se hazardům
- dohazovat score do dalších unlocků a badge progressu

## 20. Kde se co obvykle hledá

Když hledáš konkrétní část hry:

- startovní obrazovky: `index.html` + `game.js`
- vizuální rozložení: `style.css`
- mechanika a akce: `game.js`
- výchozí hodnoty: `config.js`
- Android wrapper: `android/app/src/main/java/cz/hrrra/game/`
- online data: `api/auth.js`, `api/highscore.js`

## 21. Praktický přehled obrazovek

### Co je hlavní navigace

- `Jump Classic`
- `Jump Advanced`
- `Badges`
- `Scores`
- `Rules`
- `Credits`
- `Shop`
- `Settings`
- `Mine`

### Co je jen podpůrné okno

- update notice
- what's new
- sign in / guest
- badge reset
- skin reward
- badge reward
- admin reset confirm
- change user confirm

## 22. Závěrečné pravidlo

Pokud si nejsi jistý, co nějaká obrazovka dělá, hledej nejdřív:

1. název obrazovky v `index.html`
2. odpovídající render funkci v `game.js`
3. konkrétní tlačítko nebo hotspot v `index.html`
4. logiku kliknutí v `game.js`
5. assety v `assets/`

