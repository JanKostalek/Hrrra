# Prompts

připrav soubor, kam budes kopírovat všechny moje prompty. Neco jako prompts.md - vzdy budou oddeleny odřádkováním ------------------- a dalším odřádkováním

-------------------

souhlasím s doporucením na wav

-------------------

souhlasím. dělej to tak aby to bylo co nejlepsí pro budoucí změny a pro testovaní

-------------------

jeste tuto změnu uloz do changes, aby bylo jasné, ře toto máš vždy když něco napíšu automaticky dělat. abys to věděl, až ukončíme a znovu začneme relaci

-------------------

Ted chci začít pracovat na zvukové strance. Budeme mít hudbu na pozadí pro každou úroven. bude to opakující se smyčka. Každá úroven bude mít vlastní hudební linku. V každé úrovni bude několik věcí, kdy se bude ozývat zvuk. třeba sebrání mince, coin bagu, mystery coin a vseho dalšího. Bude tam zvuk pro Jump, death. budou zvuky pro jednotlivé stranky. zvuk pro objevování se informace o získaném badge etc. Bude ideální v administraci udělat sekci sounds, kde se bude vše moc doladovat. bude klasicky kolapsable, jako ostatní sekce. V prvním kroku mi potvrd, ze rozumíš co chci, navrhni případně co si o tom myslíš a jako to udělat třeba i jinak nez navrhuju, ale nic zatím neimplementuj. to necháme na krok 2

-------------------

souhlasím s tím co říkás. v administraci bych v budoucnu ale chtěl, aby tam pro kazdou úroven byla sekce, kde bude videt, který zvůk se na kterou akci přehrává. čili každý level by měl mít svoji složku - neco jako assets/sound/levelxx nebo ve slozce levelxx pridat slozku sound. A to proto, abych v budoucnu mohl jednoduše ty zvuky zaměnovat. je to srozumitelné?

-------------------

naprosto se vsím souhlasím. ted ale udelej commit do main - local i online a pak vytvoř novou branch sfx ve které pak budeme pokračovat

-------------------

tak a ted můžeš začít s implementací tak jak jsi ji navrhoval. Pokud máš ještě nějaký dotaz a nebo návrh, tak mi ho řekni. Ještě mi navrhni, jmennou konvenci pro užívané zvuky. vytvoř rovnou potřebné složky a ideálně prázdné placeholder zvuky (v jakém budou formatu? wav? mp3) a já pak ty placeholder / prazdné soubory nahrazovat reálným obsahem. je to tak v pořádku? Abychom postupovali postupně a neutopili se v tom, navrhuji začít nejdřív pro Level1 a pak to můžeme multiplicovat pro ostatní

-------------------

a) kdyz nyní pustím hru na lokale, měl bych slyšet nějaké placeholder zvuky nebo jsou zatim jen "prázdné" čili tiché a uslyším az je zaměním. plus přidej zvuk pro ztrátu štítu. a hudba na screeny před začátkem hry jsou? potom je potreba nějaký zvuk mezi úrovněmi. na obrazovce, která říká, že začne další level. a pak gameover obrazovka by měla mít nějaký vlastní zvuk loop

-------------------

a jeste připrav soubor sound.md kam popíšeš, přikteré akci / události / menu je přehranýá který zvuk

-------------------

máme připravený zvuk pro ztrátu jednoho života ve hře?

-------------------

ano,připrav to

-------------------

Mužeš ověřit. nahral jsem vlastní jump a coin zvuky. a prijde mi, ze kdzy zkočím, tak zvuk začne o zlomek pozdeji nez postavička začne skákat. stejne tak při sebrání mince. mince zmizi, ale zvuk se ozve o chlup pozdeji. můžeš ověřit, zda to je v kodu a nebo zda ty zvuky mají prázdné místo na začátku, které to způsobují?

-------------------

proved to. a nebude lepsi to udelat u vseho?

-------------------

dve veci, kdyz postavička ztratí poslední život - objevuje se rip a prehrava se death zvuk, tak v okamzik, kdy prijdu o zivot, musí prestat hrát background b) nahral jsem badge reveal zvuk a game over loop ale kdyz jdu do sekce odznaků ani kdyz se objevi game over screen, tak se loopy neprhravaji. nejsem si jisty, zda tonení tím, ze jsem prejmenoval mp3 soubor na wav

-------------------

prejmenoval jsem soubor zpet na mp3 (ui-game-over-loop.mp3). dokážeš mi jej zkonvertovat na wav?

-------------------

ano, preved. protoze ted mi jeste ve hre nefunguje. 

-------------------

u gameover jsem zjistil, proc jsem nic neslysel. byl neskutečně ztlumeny. je sam o sobe potichu. kdyz nastavim zvuk, aby byl prijemny, tak tento uz není vůbec slyšet. kdyz dam vse na plno, neda se standardní zvuky vydrzet, ale gameover je slyset. můžes gameover zvednout natvrdo hlasitost? v tom wav souboru? bez zasahu do kodu? nebo se tomusí dělat přímo ve hře? a badges stále neslysím - a není to hlasitostí a uz jsem zjistil problem. ja badge reveal hledal na stránce, která zobrazuje vsechny odznaky. a to je jiná stranka. můžeš prosím vytvořit ještě placeholder a možnost prehravat zvuk při otevření stranky badges?

-------------------

badges page zvuk jsem zaměnil a funguje. ale kdyz ze stranky odejdu, tak hraje porad dál. musí zkončit ve chvíli,kdy odejdu. protoze jinak pak začnu hrát hru a krome urovnové muziky hraje i badge page muzika

-------------------

badges page zvuk jsem zaměnil a funguje. ale kdyz ze stranky odejdu, tak hraje porad dál. musí zkončit ve chvíli,kdy odejdu. protoze jinak pak začnu hrát hru a krome urovnové muziky hraje i badge page muzika

-------------------
mam dva chyby a) kdyz otevru badges, vidim first run objeveny. jdu do administrace, udelam reset , vypnu administraci a pokracuju ve hre... ale badge zustane odemcen�. pokud udel�m tot� a ze startovac� stranky dam back, tam otevru badges, tak najednou je first run zase zamceny. b) badge reveal zvuk se neprehrava ac jsem ho tam nahral

-------------------

ten reset badges se neumenil. pokud mam odemceny first run, hraju, jdu do administrace a resetnu, nezamkne se. kdyz umru, stale si mysli, ze ho mam. teprve kdyz zacnu novou hru, tak se objevi, ze jsem ho ziskal. pokud mam badge edemknut�, jdu na start screen do admin, resetnu a zacnu hru, je stale odemceny. kdyz zacnu dal�� run, je stale odemcen�, kdyz jdu do badges - po tom prvn�m ci druh�m runnu, je stale odemceny. kdyz na start screen resetnu badge a jdu zpet  a pak na badges, tak se zamkne

-------------------

jak se na�v� tato obrazovka a m� prirazeny nejak� zvuk? ten druh� obrazek je prerun, je to tak? uz asi rozum�m. oni jsou obe obrazovky prerun a maj� ten prerun zvuk. ale pri zpusten� hry se na te prvn� obrazovce zvuk neprehr�v�, dokud nekliknu... je to tak? protoze kdyz otevru badges a vratim se, uz hraje. ono to nejde udelat, aby zacala rovnou hrat?

-------------------

jdi na branch sfx a tam potom uprav ve hre devault hodnoty podle obr�zku pro sounds z�roven ty cesty ke zvukum  mu�e� schovat. nen� potreba aby byly v administraci videt 

-------------------

zvedni natvrdo zvuk v gameover screen o 100%

-------------------

mezi start obrazovkou a zac�tkem runnu, ale i start obrazovkou mezi levely trochu zmen�me. Kdyz se klikne na start, tak vezmi z t�to obrazovky jen pozad�, ve�kery ostatn� veci tam nebudou, objev� se na 1s zvet�uj�c� se (z mal�ho na hodne velky) "READY..." a pak na 1s "RUN!".Kdyz na t� start obrazovce klikneme na start, tak po dobu tech dvou S co bude obrazovka ready-go, tak muzika z start screen bude fade to silience. nechci aby pri prechodu ze start screen do run byl ostry lom mezi hudbami

-------------------

kolik r�dku kodu uz m� nas projekt?

-------------------

ted udelej commit local, online a priprav aab

-------------------

urcite. kdyz reknu, ze mi mas pripravit aab, tak to proto, ze to chci nahravat, cili VZDY priprav vse co je potreba pro nahrani na store a jelikoz nechci aby pri kazdem zpusteni hra hlasila, ze je nova verze, i kdyz nova verze nen�, tak zvedej vse co je potreba. tohle si zapis jako pravidlo

-------------------

mi to rika pri pokusu nahrat. vypada, ze jsi nezvedl verzi kodu

-------------------

