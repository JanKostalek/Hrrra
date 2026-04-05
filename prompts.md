# Prompts

připrav soubor, kam budeš kopírovat všechny moje prompty. Něco jako `prompts.md` - vždy budou odděleny odřádkováním `-------------------` a dalším odřádkováním

-------------------

souhlasím s doporučením na wav

-------------------

souhlasím. dělej to tak, aby to bylo co nejlepší pro budoucí změny a pro testování

-------------------

ještě tuto změnu ulož do `changes`, aby bylo jasné, že toto máš vždy, když něco napíšu, automaticky dělat. Abys to věděl, až ukončíme a znovu začneme relaci

-------------------

Teď chci začít pracovat na zvukové stránce. Budeme mít hudbu na pozadí pro každou úroveň. Bude to opakující se smyčka. Každá úroveň bude mít vlastní hudební linku. V každé úrovni bude několik věcí, kdy se bude ozývat zvuk. Třeba sebrání mince, coin bagu, mystery coin a všeho dalšího. Bude tam zvuk pro Jump, death. Budou zvuky pro jednotlivé stránky. Zvuk pro objevování se informace o získaném badge etc. Bude ideální v administraci udělat sekci sounds, kde se bude vše moct doladovat. Bude klasicky collapsable, jako ostatní sekce. V prvním kroku mi potvrď, že rozumíš co chci, navrhni případně co si o tom myslíš a jak to udělat třeba i jinak než navrhuju, ale nic zatím neimplementuj. To necháme na krok 2

-------------------

souhlasím s tím co říkáš. V administraci bych v budoucnu ale chtěl, aby tam pro každou úroveň byla sekce, kde bude vidět, který zvuk se na kterou akci přehrává. Čili každý level by měl mít svoji složku - něco jako `assets/sound/levelxx` nebo ve složce `levelxx` přidat složku `sound`. A to proto, abych v budoucnu mohl jednoduše ty zvuky zaměňovat. Je to srozumitelné?

-------------------

naprosto se vším souhlasím. Teď ale udělej commit do `main` - local i online a pak vytvoř novou branch `sfx`, ve které pak budeme pokračovat

-------------------

tak a teď můžeš začít s implementací tak, jak jsi ji navrhoval. Pokud máš ještě nějaký dotaz anebo návrh, tak mi ho řekni. Ještě mi navrhni jmennou konvenci pro užívané zvuky. Vytvoř rovnou potřebné složky a ideálně prázdné placeholder zvuky. V jakém budou formátu? `wav`? `mp3`? A já pak ty placeholder / prázdné soubory nahrazovat reálným obsahem. Je to tak v pořádku? Abychom postupovali postupně a neutopili se v tom, navrhuji začít nejdřív pro `Level1` a pak to můžeme multiplikovat pro ostatní

-------------------

a) když nyní pustím hru na lokale, měl bych slyšet nějaké placeholder zvuky nebo jsou zatím jen "prázdné", čili tiché a uslyším až je zaměním? Plus přidej zvuk pro ztrátu štítu. A hudba na screeny před začátkem hry jsou? Potom je potřeba nějaký zvuk mezi úrovněmi. Na obrazovce, která říká, že začne další level. A pak `Game Over` obrazovka by měla mít nějaký vlastní zvuk loop

-------------------

a ještě připrav soubor `sound.md`, kam popíšeš, při které akci / události / menu je přehrávaný který zvuk

-------------------

máme připravený zvuk pro ztrátu jednoho života ve hře?

-------------------

ano, připrav to

-------------------

Můžeš ověřit? Nahrál jsem vlastní jump a coin zvuky a přijde mi, že když zkočím, tak zvuk začne o zlomek později než postavička začne skákat. Stejně tak při sebrání mince. Mince zmizí, ale zvuk se ozve o chlup později. Můžeš ověřit, zda to je v kódu a nebo zda ty zvuky mají prázdné místo na začátku, které to způsobují?

-------------------

proveď to. A nebude lepší to udělat u všeho?

-------------------

dvě věci, když postavička ztratí poslední život - objevuje se `RIP` a přehrává se death zvuk, tak v okamžiku, kdy přijdu o život, musí přestat hrát background. b) Nahrál jsem `badge reveal` zvuk a `game over loop`, ale když jdu do sekce odznaků ani když se objeví `Game Over` screen, tak se loopy nepřehrávají. Nejsem si jistý, zda to není tím, že jsem přejmenoval mp3 soubor na wav

-------------------

přejmenoval jsem soubor zpět na mp3 (`ui-game-over-loop.mp3`). Dokážeš mi jej zkonvertovat na wav?

-------------------

ano, převeď, protože teď mi ještě ve hře nefunguje

-------------------

u `Game Over` jsem zjistil, proč jsem nic neslyšel. Byl neskutečně ztlumený. Je sám o sobě potichu. Když nastavím zvuk, aby byl příjemný, tak tento už není vůbec slyšet. Když dám vše na plno, nedá se standardní zvuky vydržet, ale `Game Over` je slyšet. Můžeš `Game Over` zvednout natvrdo hlasitost? V tom wav souboru? Bez zásahu do kódu? Nebo se to musí dělat přímo ve hře? A `badges` stále neslyším - a není to hlasitostí a už jsem zjistil problém. Já `badge reveal` hledal na stránce, která zobrazuje všechny odznaky. A to je jiná stránka. Můžeš prosím vytvořit ještě placeholder a možnost přehrávat zvuk při otevření stránky `Badges`?

-------------------

`Badges` page zvuk jsem zaměnil a funguje. Ale když ze stránky odejdu, tak hraje pořád dál. Musí skončit ve chvíli, kdy odejdu. Protože jinak pak začnu hrát hru a kromě úrovňové muziky hraje i `Badges` page muzika

-------------------

`Badges` page zvuk jsem zaměnil a funguje. Ale když ze stránky odejdu, tak hraje pořád dál. Musí skončit ve chvíli, kdy odejdu. Protože jinak pak začnu hrát hru a kromě úrovňové muziky hraje i `Badges` page muzika

-------------------

mám dva chyby. a) Když otevřu `Badges`, vidím `First Run` objevený. Jdu do administrace, udělám reset, vypnu administraci a pokračuju ve hře, ale badge zůstane odemčený. Pokud udělám totéž a ze startovací stránky dám `Back`, tam otevřu `Badges`, tak najednou je `First Run` zase zamčený. b) `badge reveal` zvuk se nepřehrává, ač jsem ho tam nahrál

-------------------

ten `Reset Badges` se neuměnil. Pokud mám odemčený `First Run`, hraju, jdu do administrace a resetnu, nezamkne se. Když umřu, stále si myslí, že ho mám. Teprve když začnu novou hru, tak se objeví, že jsem ho získal. Pokud mám badge odemknutý, jdu na start screen do admin, resetnu a začnu hru, je stále odemčený. Když začnu další run, je stále odemčený, když jdu do `Badges` - po tom prvním či druhém runu, je stále odemčený. Když na start screen resetnu badge a jdu zpět a pak na `Badges`, tak se zamkne

-------------------

jak se nazývá tato obrazovka a má přiřazený nějaký zvuk? Ten druhý obrázek je `prerun`, je to tak? Už asi rozumím. Oni jsou obě obrazovky `prerun` a mají ten `prerun` zvuk. Ale při spuštění hry se na té první obrazovce zvuk nepřehrává, dokud nekliknu. Je to tak? Protože když otevřu `Badges` a vrátím se, už hraje. Ono to nejde udělat, aby začala rovnou hrát?

-------------------

jdi na branch `sfx` a tam potom uprav ve hře default hodnoty podle obrázku pro sounds. Zároveň ty cesty ke zvukům můžeš schovat. Není potřeba, aby byly v administraci vidět

-------------------

zvedni natvrdo zvuk v `Game Over` screen o 100%

-------------------

mezi start obrazovkou a začátkem runu, ale i start obrazovkou mezi levely trochu změnime. Když se klikne na start, tak vezmi z této obrazovky jen pozadí, veškeré ostatní věci tam nebudou, objeví se na 1s zvětšující se (z malého na hodně velké) `READY...` a pak na 1s `RUN!`. Když na té start obrazovce klikneme na start, tak po dobu těch dvou sekund, co bude obrazovka `READY / RUN`, tak muzika ze start screen bude `fade to silence`. Nechci, aby při přechodu ze start screen do runu byl ostrý lom mezi hudbami

-------------------

kolik řádků kódu už má náš projekt?

-------------------

teď udělej commit local, online a připrav `aab`

-------------------

určitě. Když řeknu, že mi máš připravit `aab`, tak to proto, že to chci nahrávat, čili VŽDY připrav vše co je potřeba pro nahrání na store a jelikož nechci, aby při každém spuštění hra hlásila, že je nová verze, i když nová verze není, tak zvedej vše co je potřeba. Tohle si zapiš jako pravidlo

-------------------

mi to říká při pokusu nahrát. Vypadá, že jsi nezvedl verzi kódu

-------------------

připrav novou větev `highscore` a přepni do ní. Budu teď chtít připravit možnost, aby se score ukládalo online a bylo sdílené

-------------------

teď bych rád do hry implementoval možnost, aby se highscore ukládal online a každý viděl své umístění v porovnání se zbytkem hráčů

-------------------

já na Vercelu už nějakou DB používám. Používal jsem ji pro projekt `hlídačka` a `hledačka` - jsou to složky ve složce `-_web_-`. Můžeš se tam podívat, jaká a jak používáme

-------------------

ten druhý projekt se jmenuje `menu`

-------------------

ano. Stačí mi jednoduchá. Chtěl bych tam jen `Jméno - Score`. A to podle toho, zda hrál `Jump / Full`, `Easy / Hard`. To jméno ještě bude potřeba asi zaimplementovat do hry. Třeba při prvním spuštění, že se to zeptá na jméno, které se pak uloží do local. A nebo jak bys to navrhoval?

-------------------

začni

-------------------

upravíme vzhled `Game Over` stránky. Lokálně uložené rekordy posuneme do okna do levé části obrazovky. Bude to `Your High Scores`. Bude to ve formátu `Jump Easy`, `Jump Hard`, `Full Easy`, `Full Hard`. Aktuální score posuneš dolů doprostřed obrazovky. A `online high` dáš do okna do pravé části obrazovky. Bude se tam zobrazovat 15 nejlepších v tom modu, který zrovna hráč hrál, a šestnácté jméno bude jeho high score a sedmnácté bude aktuální score, které uhrál. Čili šestnácté a sedmnácté jméno vždy uvidí ten hráč, který hraje - sebe. Své nej score pro ten mode a obtížnost a aktuální score pro mode a obtížnost. Z aktuálního score můžeš odmazat `coins` a `bags collected`. Není to důležité. Nech jen score a time

-------------------

dvě věci. a) `Game Over` screen. Okna přetékají. Udělej stránku víc responzivní, ať se přizpůsobuje velikosti. b) Totéž u start screen. Ať se přizpůsobuje a nepřetéká

-------------------

tohle bylo správné rozmístění, jen to přetékalo tam, jak jsem to označil. Teď to je pod sebou a to není dobře, protože se tam nevejde cost score pod sebou. Udělej to jak to bylo předtím na stranách, jen ty okna udělej, aby nepřetékala

-------------------

a) možná to tam není jen proto, že ještě není napojené online score, ale mělo by tam pak být pořadí před jménem. a b) Napravo to ukazuje top score 70000 a vpravo `Your Best` píše 0. Mělo by to být propojené

-------------------

zítra to zase budeme ladit. Udělej commit do `main` local i online. Tím by se to mělo dostat na Vercel a začít score ukazovat, je to tak?

-------------------

pokračuj

-------------------

takto to nechám?

-------------------

[image-only prompt: Game Over target layout reference]

-------------------

[empty prompt captured in session]

-------------------

dvě věci. Tady je vidět, že moje score se propíše do `Top Players` v pořádku. Je tam jméno a score, ale v `Top Scores` se uloží místo jména jen `Player`. A zároveň v tom okně prohoď `Your Best` a `Current Run`. Srovnej font v `Top Players` a `Top Scores` - to `Jump Easy` je pokaždé jinak. Udělej ho menší a vycentruj na řádek. A nadpisy těch oken `Online Top Scores` a `Online Top Players`. b) `READY / RUN` stránka má nevím proč možnost scrollovat, i když tam nic není. Udělej maximální velikost podle toho pozadí. Tam kde se začne opakovat, tam to zasekni - znázorněno čarou. Pokud bude potřeba menší, tak ať je responzivní, ale ať se nezvětšuje do té míry, že tam budou posuvníky

-------------------

tak implementuj, jak jsme psali. Jen bez rate limit na pokusy a lockout

-------------------

bezpečně

-------------------

ono to bude v souboru s promptama

-------------------

čili můžu zkusit?

-------------------

Jen odpovídej. Funguje, super. Teď mne napadá, když nový hráč spustí hru, zeptá se ho to na jméno, vybere si už nějaké, které je - hra to nijak předpokládám vůči online scores neověřuje, tak dva různí hráči můžou mít stejná jména a budou se plést jejich score? Vidím, že když si v průběhu hry změním jméno, tak se změní jméno i u všech online score a ověřil jsem si to - ale jen na online (web Vercel - nikoliv Android a o ten mi hlavně jde. Protože Vercel nebude veřejný. Ten mám jen na testování). Když si já na svém Google účtu vyberu jméno a jiný tester na svém si vybere stejné, tak se to bude tlouct v online scores, je to tak?

-------------------

jde udělat, aby dva hráči nemohli mít stejné jméno? Nějaké ověření, že už v databázi není?

-------------------

pokud se nepletu, nikdo jiný si ho vzít nemůže, protože ve chvíli kdy už se jednou zapíše do databáze, tak mu ho to nedovolí si vzít. Ale když budu na jiném zařízení, které mne vyzve ke jménu, tak ani já si svoje už vzít nemůžu, protože jsem si ho zabral na jiném zařízení

-------------------

ta varianta `tag` se mi nelíbí. Lidi mají rády svá jména a ten tag je ošklivý. Jak složité je přihlášení přes Google ID jako ověření identity? Pak by si to pamatovalo moje jméno z jiného zařízení a mohl bych si ho i dál měnit

-------------------

myslím že hashovat ano, aby nešly odchytit úplně jednoduše, ale pro Android není HTTPS nutný (tuším), webová verze není třeba úplně řešit - Android bude primár. Rate limit na pokusy taky není třeba řešit. Nemyslím, že to někdo bude hackovat. Lockout není nutný. A k tomu UX: jméno neexistuje -> rovnou vytvořit. Nic nenabízet. Proces bude vždy stejný: vyzve ke jménu, vyzve k heslu. A pak bude to rozdělení. Neexistuje jméno automaticky vytvoří. Ty ostatní varianty jsou jak píšeš. Je to takto ok?

-------------------

ok, tak tedy musíme i HTTPS, je to tak?

-------------------

ok. Vytvoř teď commit do `main`, a pak branch `authtentisation`

-------------------

jen odpověď - dokážeš z databáze vymazat současné score? Abychom začali s čistým listem?

-------------------

bezpečně

-------------------

co k tomu potřebuješ a kde to zjistím? Případně nedokážeš si to nějak zjistit sám?

-------------------

kde? co?

-------------------

[REDACTED_KV_URL] ; [REDACTED_KV_TOKEN] ; případně je někam ulož, někam, co se neposílá do online. Pomocný soubor?

-------------------

ono to bude v souboru s promptama

-------------------

čili můžu zkusit?

-------------------

jen odpovídej. Dokážeš z databáze vymazat současné score? Abychom začali s čistým listem?

-------------------

teď uděláme jednu kosmetickou změnu. Změň barvu písma `HRRRA` na zelenou. Vycentruj `Jump Mode` a `Full Mode` a změň barvu písma, kde oznamuje, že je locked a co musíš dosáhnout, na červené

-------------------

další kosmetika. Z tabulek smaž to `Jump Easy` a dej to bílou barvou pod `Game Over` (vycentrované) a menším (o 50%) písmem. Zároveň udělej, aby obě tabulky byly stejně velké. Vždy se budou zarovnávat podle té větší s tím, že ta prázdnější prostě bude mít prázdné místo ve spodní části. Čili hodnoty budou zarovnávané odshora. Je to srozumitelné co chci s tabulkama online scores?

-------------------

texty stále nejsou červené

-------------------

teď už můžeš provést commit, push a `aab`

-------------------

teď ještě jednou vymaž databázi `Top Scores + Players`

-------------------

když jsem si pustil Android verzi, tak sice mi to píše, že je nová verze, ale to okno o stažení je schované za přihlašovací obrazovkou, která ještě nefunguje. Čili nemůžu se přes toto dostat. Mělo by tedy i na tom přihlašovacím být `Guest`, kde se nebude nic ukládat online, ale jen to pustí dál

-------------------

udělej

-------------------

a) na `Game Over` screen posuň obě okna s online score skoro až nahoru obrazovky. b) Když dohraju hru a dostanu badge, tak se neobjeví stránka `Game Over` a tudíž nevidím online score. A nebo jen tak rychle problikne, že ji nevidím, a nebo tím, že tapnu na badge screen, tak překliknu i `Game Over` screen

-------------------

zkouším to na lokale a obě online score obrazovky jsou stále na stejném místě

-------------------

zarovnej to na horní okraj nápisu `Game Over` viz obrázek

-------------------

commitni to do `main` local i online

-------------------

je to i na online? Vercel?

-------------------

Zatím jen odpovídej - změň mechaniku objevování se unlocků nových postaviček. Jak nyní zní pravidlo, kde se můžou a kdy objevit?

-------------------

změň tedy mechaniku a přepis to i v pravidlech, že se postavička nebude objevovat na nejnižším výtahu, ale vždy se objeví na pravém kraji obrazovky na plošině - rozumíš co chci? Nejdřív odpověď a pak případně budeš implementovat

-------------------

implementuj

-------------------

zapisuješ stále do souboru `prompts` vše co píšu?

-------------------

převeď

-------------------

oprav čitelnost a doplň chybějící prompty z této relace

-------------------

do budoucna - Python tu je, jen si ho musíš najít

-------------------

zapiš si pro budoucnost, kde je Python, do pravidel

-------------------

Změníme nyní tuto stránku. Potřebuji si tam uvolnit místo, abychom mohli přidat tlačítko, které otevře stránku s online top scores, kde budou čtyři tabulky `Jump Easy`, `Jump Hard`, `Full Easy` a `Full Hard` a v každé budou vypsaní online top 15 players (nikoliv scores tabulka)

-------------------

ještě nedělej

-------------------

pošlu to, jak upravit

-------------------

zatím nic nedělej, jen mi řekni, zda to chápeš: na tom obrázku je, jak by to mělo vypadat. Základní stav bude oválné tlačítko, které bude rozděleno - vlevo dvě třetiny, vpravo jedna třetina. V levé části bude napsáno `Easy` a v pravé (menší) `Hard`. `Easy` část bude zelená, `Hard` šedivá. V tom stavu bude nastavený `Easy`. Když na tlačítko klikneme, tak se ideálně nějakým `flip` effectem otočí o 180 stupňů a bude pravá část větší a levá menší. Levá bude zašedlá a pravá (`Hard`) bude zelená. V tu chvíli bude aktivovaný `Hard` level. Pokud nebude ještě `Hard` odemknutý, tak při "přepnutí" na `Hard` tam bude onen nápis přes celé tlačítko, `unlock...`

-------------------

tak implementuj

-------------------

nezapomínej všechny moje prompty zapisovat! Je to na dobré cestě, ale není to úplně ono. Podle mého obrázku se musí vejít celé slovo `Easy` (větším písmem), když je vybrané do těch 2/3 tlačítka, a menší `Hard` se musí v malém písmu vejít celé do té 1/3 tlačítka. Teď tam není vůbec text vidět a čitelný, protože font je neúměrně veliký

-------------------

zapisuješ moje prompty dle pravidla??

-------------------

doplň

-------------------

vyčisti a uprav

-------------------

zapisuj prompty!!!!

-------------------

font je lepsi, ale myslím, ze musí být jeste o 50% mensi. možná bude potreba i vic. potrebuji abys opticky overil, ze se do tech menších a větší části veje celý vetší a mensí text

-------------------

tenpredchozí prompt o 50% zmensení jsi taky nezapsal. zapamatuj si, ze cokoliv napisu, tak ty nejdriv propises do prompts.md a teprve pak budes na to reagovat. tohle zapis jako pravidlo

-------------------

ted je to v poradku. ted mezi badges a name vloz nové tlačítko Scores. otevre stranku, podobne jako badges, kde budou  čtyři sekce. Jump easy, jump hard, full easy a full hard a vzdy vypsaných top 15 players a jejich score. Nikoliv top 15 scores. to znamená, ze kazdý player tam může být jen jednou. cili bude to stejná tabulka, jako je v gameover screen napravo. jen pro vsechny čtyri mody

-------------------

super. jen můžeš odstranit ten text a nadpis změn na "Top Score" a vycentruj to doprostred

-------------------

udelej commit a push a priprav mi aab

-------------------

poslední na store je 1.0.12!

-------------------

dve kosmetické veci. v game over screen není potreba mít dole ten text press space to continue. predpoklad, je, ze hra bezi cela na mobilu. dale vycentruj to score doprostred - doprostred polí pro score. b) start page. taky není potreba uz info o desktop. viz obrazek. zmen tam tedy text Tap To Jump. a obrazek telefonu vycentruj doprostred toho okna
-------------------

ov??, zda v p?edposledn? verzi - a asi i v posledn? co jsme commitnuly, pushnuly a pripravili pro android, zda je stale overen?, zda nen? nova verze na store. mam pocit, ze jsem pustil hru a neoznamila mi novou verzi. ale kdyz jsem sel do store, tak tam byl update
-------------------

zapsi jako pravidlo, abys vzdy udelal vse co je potreba, kdyz napisu "priprav aab". to znamena, (a dopln co je potrea a ja to nenapsal), ud?las commit do main na local i na online, pushnes novou verzi, upravis verzovani aab, pripravis aab a ud?l?s to co jsi delal ted, aby byla nov? verze "videt" pri pusten? hry.
-------------------

pridej ted do administrace - vsude kde jsou parametry question coint (vsechny mode / difficulty / level parametra Win a Loose a procent. to znamena, ze kdyz u Loose dam 50% ubere mi to 50% po?tu bodu o kter? hrajeme kdyz dam 50% u win, dostanu polovinu bod? o kter? hrajeme. je to srozumiteln?? nejdriv odpovedz nez budes pokracovat
-------------------

pokud se nepletu, tak nyn? je loose nastaveny na 50 a win na 200. zatim tak ty hodnoty zachovej pri vytv??en? administrace
-------------------

tak to implementuj
-------------------

Jen odpovez, zda to jde jednoduse udelat a pripadne navrhy jak to udelat jinak. zatim neimplementuj. Ted jeste jeden zasah. asi trochu vetsi. v tuto chvili v admin zadavame, kolik mus?s dosa?hnout celkov? skore, abys pokra?oval do dal??ho levelu. Je tam absolutn? hodnota. ale stane se, ze nekdy na konci levelu ziskame question coin, kter? da tolik bod?, ze mne posle rovnou pres pristi level nebo dokonce pres dva. ladenim question coin win se to da upravit, ale lepsi by bylo, kdybychom v administraci zad?vali, kolik bod? v tom levelu je potreba nasb?rat. viz obrazek - by pak ukazovalo dle modelu "aktu?ln? score + po?adovan? score na postup" = zobrazen? level goal. cili pred prvn?m levelem by to bylo 0+ zadan? hodnota. v dals?ch levelech by to vy?etlo skore kter? hr?? m? a pridalo po?adovanou hodnotu..
-------------------

proved to podle navrhu - toho roz???en?ho. pou?ij text Level Goal Score a v info pouzij Finish Level with xxxx score. question coin na konci se proste zapo??t? to aktu?ln?ho skore at je v?sledek jak?koliv. a dals? level proste bude ten v?sledek + required score. Implementuj a zapis zm?nu do ve?ker? dokumentace
-------------------

jen odpovez. nad question mark je hodnota o kteoru se hraje. jak tato hodnota vznika - je vypo??t?na?
-------------------

p?iprav strukturu zv?k? tak jak je pro level 1 i pro vsechny ostatn? levely. V tuto chv?li tam pou?ij soubory, kter? m?m na disku, cili tam budou uz i ty soubory, kter? jsem ja nahradil. T?m bude sice pro tuto chv?li vsude stejna hudba, ale ja ji budu postupne menit
-------------------

k ?emu slouzi music_loop-other?
-------------------

priprav aab
-------------------

sice je vytvorena struktura pro zvuky na dalsich levelech, ale nehraje tam muzika ani nejsou slyset zvuky. myslim ze level dva a dalsi nemaji zvuky napojene...
-------------------

jen se zamysli a odpovez. nic neimplementuj, dokud ti nereknu. nejsem si jist?, jak? n?zev pou??t pro druh? mod. Jump je asi jasny, ale ten druh? jako full nen? dokonal?. a nebo mozn? zm?nit n?jak oba, aby bylo jasn?js? co se v nich deje. navrhy?
-------------------

jeste si rikam neco jako advanced
-------------------

pouzijeme Jumpa Classic a Jump Advanced. prejmenuj kde je full na advanced. uprav start ovrazovku, jak jsem poslal screen. Odstran i to "mobile". protoze vzdy vse je mobile. 
-------------------

budeme upravoat dal tu stranku. Postupne upravime UI(/UX, ale zacneme tím, ze tam pridamé dve tlačítka a k nim navázané stránky. na levo bude "Rules" - které bude říkat vsechny mechaniky - ty zakladní. ikonky co lze ve hre potkat, udělat, vyhnout se. tedy to c je na obrázku 2. s tím, že naopak pak to z té stranky může byt odebráno. a pak jeste pravé tlačítko, kde bude "settings" Tam budou nektere z mozností nastavení co jsou dneska v admin. pro začátek tam dáme Toggle Sound a Toggle Music. první vypne veškeré zvukové efekty (skok, sebrání micne atd) a druhé vypne hudbu. ve vsech obrazovkách.
-------------------

v rules napriklad chybí "slow"
-------------------

a jeste ikonka pro odemknuti postavicky
-------------------

ikonka v rules neodpovida te, ktera se objevuje ve hre
-------------------

slow
-------------------

ted jeste jeden button - mezi temito dvema novými. bude to "credits". bude tam zatím základní text "Most of everything done by Walhalla. Special thenks to TYNTYNfor provideing some graphics and to kajak for helping adding and tuning game mechanis. And thank you for all the testers for their input: kajak, TYNTYN, Sophia, Eliska, akmoznoh, Týpeček, Mates, Jiko
-------------------

uprav ten text, aby byl anglicky v pordku. co tam vidim za chyby a opravuju je.. ale klidne to dooprav "Most of everything done by Walhalla - even the bad stuff. Special thenks to TYNTYN for provideing some graphics and to kajak for helping adding and tuning game mechanis. And thank you to all the testers for their input: kajak, TYNTYN, Sophia, Eliska, akmoznoh, Týpeček, Mates, Jiko
-------------------

jeste jednou to uprav: Most of everything was done by Walhalla, including - and mostly -  the bad stuff. 

Special thanks to TYNTYN for providing some graphics, and to kajak for helping to add and tune some of the game mechanics. 

And thank you for all the testers for their input: kajak, TYNTYN, Sophia, Eliska, akmoznoh, Týpeček, Mates, Jiko
-------------------

chtěl bych změnit jeste chování v mechanice pri vzatí "slow". nyní je to tak, ze se rychlost sníží o polovinu. Respektive rychlostní navýšení oproti "standardu". jenze kdyz se to opakuje vicekrat hra je pak hodne pomala a zrychlení probíhá pomaleji a pomaleji, jak se pridávají body.  tak bych chtěl, aby se rychlost snížila na 50% ale jen na urcitou dobu. Rekneme 10s. A Chtěl bych pridat do administrace to, na jak dlouho a o kolik se sníží
jeste jednu mechaniku chci změnit. u question coin ted pribáhá náhodny výběr co padne. chtěl bych, aby výběr byl navázaný na tap uživatele. cili aby probíhalo +/- dokud netukneme do obrazovky. měla by tam být na té obrazovce, kde to probíhá nějaká výzva, aby uživatel vedel, ze má tapnout
-------------------
jeste u toho vyberu není informace pro uzivatele, ze ma tapnout a navic se + prekrývá s textem. měl by být trochu níž
-------------------
nevim, zda to bude i v mobilni veri, ale na lokale se zobrazuje "start" spatne.
-------------------
připrav aab
-------------------
vyúis mi sem seznam vsek nazvu badges co ve hre jsou
-------------------
na androidu, kdyz je mistery coin, tak nejde tapnout a zastavit nahodu. a) najdi proc to nejde b) pripadne můzes udelat, ze kdyz do 5s není tap, tak se automaticky zastaví na náhohode
-------------------
obrazovky pretakaji. v settings jsou zbytecne velky okna dej to jako jednoduchy melé dva prepínače. a u badges, který zbárají informace pres vícero rannu, napríklad posíbrat 1 000 000 bodů , tak vzdy do závorky za to číslo napis, kolik je aktuální počet dosazeny. abychom vedeli, jak se blížíme a nebo neblížíme
-------------------
u toho wats new, jak to pretéka, udelej, aby to proste slo posunovat i mimo obrazovku. ted tam posuvník není
-------------------
priprav aab
-------------------
stale se to nevejde na obrazovku. zmensi horni tlačítka o 33%
-------------------
hudba stale ve hre nehraje ve vyssích úrovních nez level 1. ani zvuky se neprehravají. a potom zmen v settings, aby ty okna nebyla pod sebou, ale vedle sebe.
-------------------
priprav aab
-------------------
kdyz si v level 1 vyberu postavu, dohraju level, začne druhý, tak tam je zase zakladní postavička. výběr se neprenáší mezi levely
-------------------
na strance badges shield teleporter nema v závorce počet kolikrat uz jsem teleportem se stitem prosel. ted jsem urcite v jednom runnu (na mobilu) prosel dvakrat a číslo se mi tam neobjevuje
-------------------
udelej ted commit do main a pak priprav novou vetem "nakupy"
-------------------
ted budeme vytvářet uplně novou mechaniku. zatím nic neimplementuj, jen to pojdme probrat. chci vytvořít systém nákupů. jako měna se budou používat mince. ty mince, které ve hře sbíráme. Zároven bude možné nasbírané body za mince jako měnu vyměnit. časem bude i systém reklam, který nám dá mince. Za mince bude možno nakoupit třeba postavičky, které jinak nepůjdou odemknout, nějakou speciální úroven, která se jinak nebude objevovat (něco jako úroven 4,5 - čtyřia půl) a nebo třeba continue, tedy kdyz umřeme, tak abycho mohli ještě dokoupit jeden nebo dva životy a dál hrát.
-------------------
tuto tvoji odpoved co jsi poslal, zapis, abychom se k ní mohli vrátit - udelej treba economy.md a k tomu návrhu jeste bude vzdy na gameover stránce napsáno kolik mincí hráč posíbral  akteré se přictou do penezenky
-------------------
Score za každý run se bude ukládat a načítat do jednoho velkého celku (to uz se deje nyní kvůli badge). a bude jej možno videt v administraci. A tam z tohoto celkového score - které se navysuje po každém runnu, bude možno provést změnu na coins. tím se celkové skore zmensí a navýší počet coins.. dál se ale každým dalším runnem bude score opet navysovat
-------------------
tak mi jeste jednou zopakuj, jak implementaci rozdelsí do jednotlivých kroků pro implementaci
-------------------
zapis tvůj navrh znovu do economy.md Ale myslím si, ze bod 7 lze delat v prvním kroku a směna score -> coins se bude nastavovat, v jakém poměru se bude dělat v administraci, ale samotný převod / koupě bude v shop page
-------------------
tak myslím, ze máme vse preddomluvené a můžeme začít s implementaci.
-------------------
ok, můžeš pokračovat dalším krokem. akorat zatím není připravená uroven, která půjde pridat, tak to tam neimplementuj. mozna udelej jen nejaky textovy placeholder, ze tady se bude kupovat úroven. a k odemknutí postavičky můžeš použít pro vyzkoušení zatím Kroba.
-------------------
tlac�tko na shop je dvakrat. odstran to v sloupci a ponech v horn� c�sti  a potom priprav bod 8 - continue system. bod 9 zat�m nedelej, ten nech�me na pozdeji
-------------------
Continue ale d� jen jeden �ivot nav�c. nikoliv vsech pet (nebo kolik je urceno v administraci pro ten kter� mod). a bude to mo�no jen jednou za run
-------------------
a do administrace pridat - kolik �ivotu prida (v admin to bude moc zmenit na v�c jak jednu). a taky kolik coins bude continue stat
-------------------
na gameover strance nevidim moznost continue kdyz nemam dost coins - pokud jich mam dost, tu moznost tam vidim . chtelo by to zmenit na neco "not enough coins to purchase a continue"... pokud jich nemam dost. a nechat zasedivel� tlac�tko continue a nechat tam aktivn� jen to end run
-------------------
kdyz se klikne na end run, tak se nacte druh� game over str�nka, znovu se nactou score etc. to je zbytecn�. po end run lze uz run definitivne ukoncit. na te predchoz� obrazovce je vse potrebne. shrnut�, top scores etc. nebo se pletu?
-------------------
po dosa�en� skore, kdy se mu�ou objevovat mince (a ostatn� veci), tak se mince objev� klidne uprostred obrazovky na plosine nebo v�tahu. at je to v�dy tak, �e po dosazen� score, kdy se veci mohou zac�t objevovat, at se vzdy objevuj� na prav�m kraji obrazovky. 
-------------------
priprav aab
-------------------
vymy�l�m jeste badge za "continue". 3 tier. a dal�� za utracen� v shopu - a) jednak premena score na coins a jednak coins za postavicku, level, continue. zatim neimplementuj. jen navrh
-------------------
1) nazvy badge "Unkillable Custommer" a bude stejne jako ostant� bronze, silver a gold 2) nazvi badge Banger3) bude "Big Spender". hodnoty nech, jak je navrhujes. pridej je do administrace stejne, jako jsou pridan� ostatn� badges
-------------------
a) je videt, jak se text nevejde na obrazovku mobilu. ani do ��rky, ani na v��ku NEMEN okna se score. zmen jen velikost fontu - at jsou responzivn�, at se dle velikosti okna vejdou - zmensi / zvets�. b) start screen. udelej ty ctyri button nad n�zve hrrra, aby byly vedle sebe v jedn� rade, t�m se opet vse vejde na jednu obrazovku a nebude to pretekat dolu c) ty tri informacn� okna taky udelej men�� vedle sebe. stejne jako to je na lokale v pc. zmen text "score per coin" na "Score to spend" d) nakupn� okna zkus taky responzivne zmensit, aby se vesla vedle sebe 
-------------------
udelej online commit na online vercel, abych to mohl zkusit na webove verzi pres mobil
-------------------
