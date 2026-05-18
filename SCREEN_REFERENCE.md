# Hrrra Screen Reference

Tento dokument je praktický rozpis toho, co se dá dělat na každé obrazovce a které ovládací prvky tam jsou.

Je psaný jako rychlý orientační seznam pro hraní, testování a support.

## 1. Sign In

### Prvky

- `Player Name`
- `Password`
- `Guest`
- `Continue`

### Co umí

- založit nebo otevřít hráčský profil
- přihlásit se existujícím jménem
- vstoupit jako Guest bez účtu

### Poznámky

- při potvrzení se uloží aktivní hráč
- při `Guest` se použije samostatná lokální session

## 2. Update Notice

### Prvky

- `Later`
- `Update now`

### Co umí

- upozorní na novou verzi
- přesměruje na update odkaz
- dovolí pokračovat bez aktualizace

## 3. What's New

### Prvky

- seznam změn
- `Continue`

### Co umí

- ukáže nové funkce dané verze
- po potvrzení se zavře a pokračuje se dál

## 4. Main Hub

### GFX2 prvky

- `Classic`
- `Advanced`
- `Badges`
- `Scores`
- `Rules`
- `Credits`
- `Shop`
- `Settings`
- `Mine`

### Co umí

- přechod do hlavních částí hry
- navigace přes signposty a cloud hotspoty

### Důležité

- některé položky se mohou zamykat podle progressu
- `Advanced` má vlastní lock logiku

## 5. Jump Classic

### Prvky

- skin sloty `1` až `6`
- `Skin07` pokud je dostupný
- `Difficulty` toggle
- `Level` hodnotu
- `Goal` panel
- `Back`
- `Admin`
- `Start Run`

### Co umí

- vybrat skin
- přepnout Easy / Hard
- zkontrolovat cíl levelu
- otevřít administraci
- spustit běh
- vrátit se zpět

### Skin sloty

- sloty ukazují dostupné skiny
- některé jsou locked nebo future
- `Skin07` je floor visual mode a může být na scéně zvlášť

## 6. Jump Advanced

### Prvky

- stejné jako `Jump Classic`

### Co umí

- stejný výběr skinu a difficulty
- odlišná konfigurace režimu

## 7. Rules

### Prvky

- `Back`
- page label
- `Previous`
- `Next`
- page title
- textový obsah

### Co umí

- listovat pravidla hry
- číst bonusy, hazardy, shop a mine popis
- vrátit se zpět

## 8. Credits

### Prvky

- `Back`
- `Update`
- verze aplikace

### Co umí

- ukázat credits a poděkování
- otevřít stránku s aktualizací

## 9. Scores

### Prvky

- `Back`
- online leaderboard seznam

### Co umí

- zobrazit top hráče
- zobrazit current best rank, pokud je hráč přihlášený

## 10. Settings

### Prvky

- `Back`
- `Change User`
- hudební volume
- SFX volume
- global volume
- music on/off
- sfx on/off

### Co umí

- měnit hlasitosti
- přepínat audio stavy
- měnit aktivního hráče

## 11. Shop

### Prvky

- `Back`
- položky shopu
- `Buy`
- board s wallet a total score
- status text

### Co umí

- směna score za coiny
- nákup skinů
- nákup `New Level`
- nákup rychlejší těžby
- nákup storage upgradů
- opakovaný nákup `Buy 10 coins`

### Statusy

- `Sold`
- `Owned`
- info o ceně nebo nedostatku prostředků

## 12. Mine

### Prvky

- `Back`
- storage counter
- countdown
- wallet value
- transfer button
- message area

### Co umí

- těžit coiny do storage
- přenést storage do wallet
- zobrazit stav plnosti a readiness

## 13. Mechanics Admin

### Prvky

- `Default / Reset all`
- `Export`
- `Copy JSON`
- `Import File`
- `Paste JSON`
- `Back`
- global settings
- badge config
- shop config
- mine config
- sounds config
- level groups

### Co umí

- měnit mechaniky hry
- resetovat nastavení
- exportovat/importovat konfiguraci
- ladit levely po modech a obtížnostech

## 14. Badge Reward Overlay

### Prvky

- badge trophy
- badge name
- tier
- progress
- prompt to continue

### Co umí

- oznámí nově získaný badge
- ukáže konkrétní tier a trofej

## 15. Skin Reward Overlay

### Prvky

- skin name
- tier
- trophy art
- continue prompt

### Co umí

- oznámí nový skin
- potvrzení pokračování

## 16. Badge Reset Notice

### Prvky

- text resetu
- `OK`

### Co umí

- upozornění po resetu badge progressu

## 17. Level Finished

### Prvky

- pokračování
- výsledkové informace

### Co umí

- posun do dalšího levelu
- po Level 5 v případě odemčeného `Level X` posun do endless flow

## 18. Game Over

### Prvky

- finální score
- coins earned
- wallet balance
- continue status
- continue purchase
- watch ad continue
- end run
- top scores
- online highscore

### Co umí

- ukázat výsledky běhu
- nabídnout pokračování
- ukázat leaderboardy

## 19. Touch Controls

### Prvky

- `JUMP`
- `LEFT`
- `RIGHT`

### Co umí

- ovládání hry na dotyku

## 20. Co je kde hledat

### Když chceš změnit konkrétní část

- UI obrazovky: `index.html`
- chování a akce: `game.js`
- vzhled a layout: `style.css`
- výchozí hodnoty: `config.js`
- admin logika: `game.js`
- persistence: `game.js`
- backend: `api/auth.js`, `api/highscore.js`

