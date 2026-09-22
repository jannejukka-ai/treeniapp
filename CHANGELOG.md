# Treeniapp — Versiohistoria

Tähän tiedostoon kirjataan jokainen sovelluksen versio ja mitä siinä muuttui.
Uusin versio on aina ylimpänä.

---

## v3.2 — 22.9.2026

**TOS- ja ryhtiliikkeet vakio-ohjelmaan + kolme käytettävyysparannusta.** Toteutettu TODO:n v3.2-jono kokonaisuudessaan (kohdat A–D).

### A) TOS- ja ryhtiliikkeet vakio-ohjelmaan (version ydin)

Olennaisimmat kuntouttavat liikkeet siirrettiin kirjastosta vakio-ohjelmaan, koska pelkkään kirjastoon jäävät liikkeet jäävät helposti tekemättä. Liikkeet ovat lyhyitä — treeni pitenee vain noin 3–4 minuuttia.

- **Treeni A:** alkuun Lapaluiden veto yhteen istuen (aktivointi, 2×10), loppuun Rintalihaksen venytys oviaukossa (huolto, 2×30 s/puoli)
- **Treeni B:** alkuun Lapaluiden veto yhteen istuen (aktivointi, 2×10), loppuun Lumienkeli foam rollilla (huolto, 2×10)
- Liikkeitä per treeni: 5 → 7

**Fysiologinen perustelu sijoittelulle:** alkuun kuuluu aktivointi, ei venyttely. Kevyt lapatuki-aktivointi ennen penkkiä ja soutua tekee nostoista turvallisempia ja vahvempia. Pitkiä staattisia venytyksiä ei tehdä ennen voimaliikkeitä, koska ne voivat hetkellisesti heikentää voimantuottoa. Huoltovenytys kuuluu loppuun, jolloin keho on lämmin.

**Uusi kirjastokategoria "Liikkuvuus & TOS (fysioterapia)"** — 7 liikettä:
- Lapaluiden veto yhteen istuen, Hartioiden pyöritykset istuen, Rintalihaksen venytys oviaukossa, Lumienkeli foam rollilla, Rintakehän mobilisointi pallolla (kaikki MedBridge TOS -ohjeesta)
- Takaolkapään veto kasvoille (face pull), Käänteiset vipunostot (reverse fly) — ryhti ja lapatuki
- Lisäksi Pallof-punnerrus lisätty Vatsa/keskivartalo-kategoriaan

**AI-valmentajan PROFILE päivitetty samassa versiossa** (pysyvä synkronointisääntö). Valmentaja oppi kolme asiaa:
1. Nämä liikkeet ovat huoltoa ja aktivointia, EIVÄT progressiokohteita — valmentaja ei saa ehdottaa niihin painonlisäystä eikä analysoida niitä voimaliikkeiden tapaan
2. Ohjelman rakenne-logiikka: aktivointi alkuun, huolto loppuun, ja miksi
3. Nämä liikkeet ovat SUOJATTUJA — valmentaja ei saa ehdottaa niiden poistamista ajan säästämiseksi
Lisäksi valmentajalle kerrottiin, että liikkeet perustuvat yleiseen TOS-fysioterapiaohjeeseen, ei henkilökohtaiseen määräykseen.

**Ohjelma päivittyy automaattisesti.** Uusi kertaluontoinen päivitys (migraatio) lisää uudet liikkeet myös aiemmin tallennettuun treenijakoon. Ilman tätä uudet liikkeet eivät olisi näkyneet lainkaan, koska sovellus käyttää selaimeen tallennettua ohjelmaa oletuksen sijaan. Omat muokkaukset säilyvät, eikä liikkeitä lisätä kahteen kertaan.

**Käyttöliittymässä:** huoltoliikkeet on merkitty violetilla "Huolto"-merkillä treenilistassa, ja kirjausnäkymässä niissä lukee ettei tavoite ole paino vaan liikkeen laatu. Näihin ei ehdoteta painonlisäystä.

### B) Toistojen per-puoli-erittely

- Yksipuolisissa liikkeissä kirjauksen toistosarakkeessa lukee nyt pieni vihje **"per puoli"**, ja historiassa näkyy esim. "25s/puoli" tai "20×10/puoli"
- Tunnistetaan automaattisesti: sivulankku, lintukoira, kuollut hyönteinen, Bulgarialainen split-kyykky, askelkyykky, yhden käden käsipainosoutu, oviaukkovenytys, Pallof-punnerrus, rintakehän mobilisointi
- Yksi luku = yhden puolen määrä. Merkintä tallennetaan myös kirjaukseen (repMode), ja valmentajan profiilissa kerrotaan miten se tulkitaan
- Sama turvaverkko kuin painomerkinnässä: liikkeelle voi tarvittaessa asettaa koodissa kentän `repMode`, joka voittaa automatiikan

### C) Joustava liikejärjestys (laite varattu -tilanne)

Aiemmin liikkeet piti tehdä ohjelman järjestyksessä. Nyt:
- Kirjausnäkymän yläreunassa on nappi **"Liike 3/7 · Ojentajapunnerrus ▾"**, joka avaa listan kaikista liikkeistä nimineen — mihin tahansa voi hypätä suoraan
- Listassa näkyy kunkin liikkeen tila: **Nyt** (missä ollaan), **✓ Käyty** (jo tehty) tai **Siirretty** (siirretty myöhemmäksi)
- Nappi **"Teen myöhemmin ↓"** siirtää nykyisen liikkeen jonon loppuun ja tuo heti seuraavan näkyviin. Nappi piilotetaan viimeisessä liikkeessä
- Oma järjestys säilyy keskeytyksen yli: keskeneräisen treenin välitallennus muistaa järjestyksen, siirretyt liikkeet ja sen missä oltiin

### D) Ylätalja eriytetty leuanvedosta (bugikorjaus)

- **Ongelma:** liikkeen nimi oli "Ylätalja / Leuanveto". Koska nimessä luki "leuanveto", sovellus tulkitsi sen kehon paino -liikkeeksi, jolloin esim. 70 kg ylätalja näkyi väärin
- **Korjaus:** perusohjelman liike on nyt pelkkä **"Ylätalja"** (painomerkintä "yhteensä"). Leuanveto on edelleen erikseen kirjastossa omana kehon paino -liikkeenään
- Nimi korjataan automaattisesti myös aiemmin tallennettuun ohjelmaan

### Tekniset muutokset

- Uudet apufunktiot: `getRepMode`, `getRepColumnLabel`, `isMobility`, `migratePlan`, `collectDraftData`, `deferCurrentExercise`, `openJumpModal`, `closeJumpModal`
- Kirjausnäkymän liikejärjestys erotettu ohjelman järjestyksestä (`logOrder`), lisäksi seurataan siirrettyjä ja käytyjä liikkeitä
- `formatSets` lisää /puoli-merkinnän; `suggestNextWeight` ei enää ehdota painoa huoltoliikkeisiin
- `isTimeBased` ja `getWeightMode` tunnistavat uudet liikkuvuusliikkeet
- Kiinteä "Liike X/Y" -laskuri poistettu liikkeen otsikosta — se olisi näyttänyt väärää numeroa kun järjestystä muutetaan. Tieto on nyt hyppynapissa, joka päivittyy oikein
- 120 automaattista yksikkötestiä ajettu läpi (logiikka, järjestyksen muuttaminen, migraatio, valmentajan profiilin synkronointi)
- Muokattu: app2.js, index.html (hyppynappi, siirtymävalikko, treenijaon kuvaus, footer v3.2), style.css (uudet tyylit)

### Muistutus

Claude ei ole lääkäri eikä fysioterapeutti. MedBridge-ohje on yleinen TOS-fysioterapiaohje, ei JJ:lle henkilökohtaisesti määrätty. Kannattaa vahvistaa fysioterapeutilta tai lääkäriltä, että juuri nämä liikkeet sopivat — erityisesti siksi, että TOS-oireet liittyvät käsien yläasentoon.

---

## v3.1 — 18.9.2026

**Iso päivitys: terveysmuutokset + kirjausmerkintöjen selkeytys.** Yhdistetty kaksi kokonaisuutta (TODO-kohdat 0, 0.4, 0.5c), koska molemmat koskevat liikkeitä ja kirjaamista.

**Terveysmuutokset (lääkärien löydösten pohjalta):**
- Kolme liikevaihtoa oletusohjelmaan (Treeni B), TOS- ja selkäystävällisemmiksi:
  - Kulmasoutu → Tuettu taljasoutu istuen (rinta tuettuna, selkäystävällinen)
  - Hartiaprässi istuen → Arnold press istuen (vapaa liikerata & säädettävä kulma, TOS-ystävällinen)
  - Hauiskääntö → Vasarakääntö (neutraali ranne, ei vaakakämmentä, nivelystävällinen)
- Arnold pressin ja vasarakäännön oletuspainot laskettu käsipainoliikkeille sopiviksi (per käsi)
- Penkkipunnerruksen turvatekniikka lisätty sekä liikkeen ohjetekstiin ETTÄ valmentajan profiiliin: kyynärpäät noin 45° kylkiin (ei 90°), lapaluut taakse ja alas ennen nostoa, vain kevyt luonnollinen selän notko (ei voimanostokaarta)

**Valmentajan profiili (AI) päivitetty kokonaan:**
- Kaikki kolme päällekkäistä vaivaa: L4-5 + T8-9/T10 (selkäranka), TOS + hermo-oireet, olkavarsi/kyynärpää
- Uudet tavoitteet: selän ja nivelten terveys ensisijaiseksi, penkki samalla tasolla + lihaksikkuus toissijaisiksi (lihasmassan kasvu ei enää päätavoite)
- Ehdottomat kiellot (maastaveto, kyykky, seisten pystypunnerrus, kiinteä hartialaite/Smith) ja turvalliset vaihtoehdot listattu selkeästi
- Lisätty muistutus: lääkärien ohjeet menevät aina AI:n neuvojen edelle

**Liikekirjasto laajennettu turvallisilla vaihtoehdoilla:**
- Uudet: Tuettu taljasoutu istuen, Käsillä roikkuminen + polvennosto, Selän ojennus penkissä (hyperextension), Arnold press istuen, Taljakääntö V-kahvalla
- Kulmasoutu ja tavallinen hauiskääntö merkitty varoituksin
- Tavoitteet-kortti Valmentaja-välilehdellä päivitetty uuteen tärkeysjärjestykseen

**Kirjausmerkintöjen selkeytys:**
- Paino-merkintä automaattisesti liikkeen mukaan: kirjauksessa paino-otsikon alla pieni harmaa vihje siitä mitä paino tarkoittaa — "per käsi" (käsipainot), "yhteensä" (talja/tanko) tai "lisäpaino, tyhjä = kehon paino"
- Merkintä päätellään automaattisesti liikkeen nimestä. Automatiikka kattaa nykyiset liikkeet oikein (24 yksikkötestiä läpi). Jos jokin liike joskus arpoo väärin, se korjataan manuaalisesti koodiin liike kerrallaan (ei erillistä käsivalintaa sovelluksessa — koodissa on tälle valmis pohja, ex.weightMode)
- Kehon paino -bugi korjattu: kehon paino -liikkeissä (punnerrus, leuanveto, dippi, roikkuminen) tyhjä painokenttä ei enää näytä harhaanjohtavaa "0×10". Nyt näkyy "kehon paino × 10" tai lisäpainolla "kehon paino +10kg × 8" — sekä historiassa että valmentajan analyysissä
- Per käsi -merkintä näkyy historiassa käsipainoliikkeille (esim. "14×10 (/käsi)")
- Aikaperustaiset liikkeet tunnistetaan nyt myös nimestä (lankku, sivulankku, lintukoira, kuollut hyönteinen, vuoristokiipeilijä), ei vain kiinteästä id:stä

**Tekniset muutokset:**
- Uudet apufunktiot: getWeightMode, getWeightModeHint, laajennettu isTimeBased
- formatSets hyväksyy nyt joko liike-objektin tai vanhan pelkän id:n (vanha data ei rikkoudu)
- Kirjattuun treeniin tallennetaan weightMode tulevaisuuden varmuudeksi
- 24 automaattista yksikkötestiä ajettu läpi (paino-merkinnän päättely + formatSets)
- Muokattu: app2.js, index.html (treenijako, tavoitteet, footer v3.1), style.css (paino-vihjeen tyyli)

---

## v3.0.1 — 2.9.2026

**Keskustelun työnkulku korjattu (käytettävyyskorjaus):**
- Ongelma v3.0:ssa: kysymyskenttä oli erillään keskusteluikkunasta, eikä chatissa voinut jatkaa keskustelua suoraan — piti vierittää takaisin ylös erilliseen kenttään
- Korjaus: kirjoituskenttä on nyt keskusteluikkunan sisällä, sen alalaidassa (kuten tavallisessa chat-sovelluksessa)
- Näet keskustelun ja voit vastata jatkokysymyksellä samassa paikassa
- Enter lähettää viestin, Shift+Enter tekee rivinvaihdon
- Pyöreä lähetysnappi (↑) kentän vieressä
- Poistettu erillinen "Kirjoita oma kysymys" -kortti (yhdistetty chattiin)
- Pikakysymys-napit säilyvät aiheen aloitukseen

**Tekniset muutokset:**
- Muokattu: index.html (chat-kenttä keskusteluun, erillinen kortti pois)
- Muokattu: app2.js (Enter-lähetys, päivitetty empty-state-ohje)
- Muokattu: style.css (chat-kentän ja lähetysnapin tyylit)

---

## v3.0 — 2.9.2026

**AI-valmentajan keskustelumuisti (iso uusi ominaisuus):**
- Valmentaja muistaa nyt käynnissä olevan keskustelun ja osaa vastata jatkokysymyksiin
- Ennen: jokainen kysymys oli erillinen — valmentaja ei muistanut edellistä. Esim. "Selkä kipeä" → vastaus → "Entä huomenna?" ei toiminut.
- Nyt: voit esittää jatkokysymyksiä luontevasti, valmentaja pysyy kartalla aiheesta
- Keskustelu näkyy chatti-tyylisenä Valmentaja-välilehdellä (sinun viestit oikealla, valmentajan vasemmalla)

**"Aloita uusi" -nappi:**
- Kun haluat vaihtaa aihetta, paina "Aloita uusi" — keskustelu alkaa puhtaalta pöydältä
- Sinä päätät milloin nollataan

**Tärkeää — mitä säilyy aina:**
- Suuret linjat (tavoitteet, selkä/olkapää-rajoitteet, treenijako, historia) ovat AINA valmentajan tiedossa, myös uuden keskustelun jälkeen — ne eivät nollaudu
- Vanhat vastaukset säilyvät pysyvästi "Aiemmat kommentit" -listassa (v2.9:n järjestelmä)
- Nollaus koskee vain lyhyen aikavälin keskustelulankaa

**Suunnitteluvalinnat:**
- Treenianalyysit (treenin jälkeen) pysyvät erillisinä keskustelusta — ne eivät sekoitu kysymyskeskusteluun
- Valmentaja muistaa enintään ~20 viimeisintä viestiä (kustannus ja koko hallinnassa); koko keskustelu säilyy näytöllä

**Tekninen huomio kustannuksista:**
- Koska koko keskustelu lähetetään joka kysymyksessä, yksittäinen kysymys kuluttaa hieman enemmän API-krediittiä kuin ennen. Määrä on silti pieni.

**Tekniset muutokset:**
- Muokattu: app2.js (viestiketju API:lle, keskustelun tallennus, chatti-näkymä)
- Muokattu: index.html (keskustelunäkymä, "Aloita uusi" -nappi)
- Muokattu: style.css (chatti-kuplien tyylit)

---

## v2.9.1 — 2.9.2026

**Versionumero näkyviin (pieni lisäys):**
- Lisätty pieni harmaa versioteksti sovelluksen alalaitaan (footer), näkyy kaikilla sivuilla
- Hyöty: näet heti mikä versio on live — helpottaa deploy-varmistusta (jos footer näyttää vanhan numeron, deploy ei mennyt läpi tai välimuisti on vanha)
- Muokattu: index.html (footer-elementti), style.css (footer-tyyli)

---

## v2.9 — 2.9.2026

**Koontipäivitys: kolme bugikorjausta kahden treenikerran käyttökokemuksen pohjalta.**

**Bugi A korjattu — Lankun yksikkö:**
- Aikaperustaisilla liikkeillä (lankku, sivulankku) kirjauskentässä luki väärin "Toistot"
- Nyt niiden kohdalla lukee "Sekunnit"
- Historiassa ja valmentajan tiedoissa lankku näkyy nyt muodossa "30s, 30s" eikä "0×30"

**Bugi B korjattu — Ajastin toimii nyt taustalla:**
- Ennen: jos vaihdoit sovelluksesta pois (esim. Spotify), ajastin pysähtyi
- Nyt: ajastin perustuu kellonaikaan, joten se "juoksee" myös taustalla
- Kun palaat sovellukseen, näet oikean jäljellä olevan ajan — tai perustilan jos lepo jo loppui
- Toimii koska laskenta perustuu kellonaikaan, ei sekunti-kerrallaan laskuriin (jonka iOS jäädyttää)

**Bugi C korjattu — Valmentajan kommentit tallentuvat:**
- Ennen: valmentajan analyysi/vastaus katosi kun näkymä suljettiin
- Nyt: kaikki valmentajan vastaukset tallentuvat ja näkyvät Valmentaja-välilehden "Aiemmat kommentit" -osiossa
- Jokainen kommentti on otsikoitu lähteen mukaan:
  - "Treenianalyysi" (vihreä) = treenin jälkeinen analyysi
  - "Kysymys valmentajalle" (sininen) = itse kysymäsi (näyttää myös kysymyksen)
- Uusin ylimpänä, päivämäärän kanssa. Kaikki kommentit säilytetään.

**Sivutuote:**
- Korjattu Valmentaja-välilehden treenijako-teksti, joka näytti vielä vanhoja liikkeitä (Push/Pull). Nyt oikeat liikkeet.

**Tekniset muutokset:**
- Muokattu: app2.js (aikaperustaiset liikkeet, kellonaika-ajastin, kommenttihistoria)
- Muokattu: index.html (kommenttihistoria-osio, korjattu treenijako-teksti)
- Muokattu: style.css (kommenttihistorian tyylit)

---

## v2.8 — 18.8.2026

**"✓ Tallennettu" -välähdys (pieni käytettävyysparannus):**
- Kun painat "Seuraava liike" tai "Edellinen", navigointinappien alle välähtää hetkeksi "✓ Tallennettu"
- Vahvistaa että kirjauksesi on turvassa juuri silloin kun välitallennus tapahtuu
- Häviää automaattisesti 1,5 sekunnin kuluttua — ei jää tielle eikä lisää pysyvää kohinaa näkymään

**Tekniset muutokset:**
- Muokattu: app2.js (välähdysfunktio), index.html (vihje-elementti), style.css (häivytysanimaatio)

---

## v2.7 — 18.8.2026

**Automaattinen välitallennus — treeni ei enää katoa (tärkeä turvaverkko):**
- Ennen: treeni tallentui vasta lopussa "Tallenna ja analysoi" -napilla. Jos kirjaus keskeytyi (vahinko-sulku, selain kaatui, puhelin sulki taustan), koko treeni katosi.
- Nyt: treeni tallentuu automaattisesti joka kerta kun painat "Seuraava liike" tai "Edellinen"
- Jos treeni keskeytyy, siihen asti kirjatut tiedot ovat tallessa

**"Jatka keskeneräistä?" -kysymys:**
- Kun avaat "Kirjaa treeni" ja keskeneräinen treeni löytyy, sovellus kysyy haluatko jatkaa
- "OK" = jatka mihin jäit (myös oikea liike, sarjat, painot ja RPE palautuvat)
- "Peruuta" = aloita uusi treeni alusta
- Tyhjää keskeneräistä ei kysytä turhaan (vain jos oikeasti kirjattua dataa)

**Tekniset yksityiskohdat:**
- Keskeneräinen treeni tallennetaan erilliseen "workoutDraft"-muistiin, erillään valmiista treeneistä
- Kun treeni valmistuu ("Tallenna ja analysoi"), keskeneräinen poistetaan automaattisesti
- X-napista sulkeminen säilyttää keskeneräisen (voit jatkaa myöhemmin)
- Muokattu: app2.js (välitallennuslogiikka, jatka-kysymys, datan palautus)

---

## v2.6 — 18.8.2026

**Lepoajastin sarjojen väliin (uusi ominaisuus):**
- Kirjausnäkymään lisätty lepoajastin sarjarivien ja navigointinappien väliin
- "Aloita lepo 1:30" -nappi käynnistää ajastimen yhdellä kosketuksella
- Iso, selkeä alaspäin juokseva numero (esim. 1:30 → 1:29 → ...)
- Säätö lennossa: "+15 s" ja "−15 s" napit
- "Ohita"-nappi lopettaa levon kesken
- Kun aika loppuu: numero muuttuu vihreäksi ja vilkkuu ("Valmis!") — EI äänimerkkiä (käyttäjän toive)

**Wake Lock — näyttö pysyy päällä:**
- Ajastin pyytää näyttöä pysymään päällä koko lepoajan
- Näin ajastin toimii vaikka et koske puhelimeen (näyttö ei sammu kesken levon)
- Kun lepo loppuu tai painat "Ohita", näyttö saa taas sammua normaalisti
- HUOM: Wake Lock toimii useimmilla iPhoneilla, mutta Applen tuki vaihtelee iOS-versioittain. Jos ei toimi omalla laitteella, varasuunnitelma on iPhonen oma Kello-ajastin.

**Tekniset yksityiskohdat:**
- Oletusaika 1:30 (90 s), ei muutettavissa asetuksissa (pidetty yksinkertaisena)
- Ajastin ja Wake Lock sammuvat automaattisesti kun kirjaus suljetaan tai tallennetaan
- Muokattu: app2.js (ajastinlogiikka, Wake Lock), index.html (ajastimen napit), style.css (ajastimen tyylit)

---

## v2.5 — 18.8.2026

**Kirjausnäkymä uudistettu selkeämmäksi (käytettävyys):**
- Kirjaus näyttää nyt YHDEN liikkeen kerrallaan (aiemmin kaikki liikkeet yhtä aikaa → näkymä oli täysi)
- Etenet napilla "Seuraava liike →" ja voit palata "← Edellinen"
- Yläreunassa edistymispalkki ja laskuri (esim. "Liike 2/5")
- Viimeisessä liikkeessä nappi vaihtuu muotoon "Tallenna ja analysoi"
- Ruudulla on kerralla noin 12 lohkoa aiemman 35+ sijaan — paljon vähemmän vieritystä
- Jokaisen liikkeen kohdalla näkyy "Viime kerralla" -muistutus edellisistä painoista
- RPE-selitys tiivistetty ja näkyy vain ensimmäisessä liikkeessä (ei toistu joka liikkeessä)

**Ei toiminnallisia muutoksia:**
- Sarjakohtainen kirjaus, sarjojen lisäys/poisto ja valmentajan analyysi toimivat kuten ennen
- Vain näkymän rakenne muuttui selkeämmäksi

**Tekniset muutokset:**
- Muokattu: app2.js (kirjausnäkymän vaiheistus ja navigointi)
- Muokattu: index.html (edistymispalkki ja navigointinapit)
- Muokattu: style.css (uuden näkymän tyylit)

---

## v2.4 — 18.8.2026

**Sarjakohtainen kirjaus (iso parannus):**
- Jokaiselle sarjalle voi nyt kirjata OMAN painon, toistot ja RPE:n erikseen
  - Esim. Sarja 1: 80 kg, Sarja 2: 90 kg, Sarja 3: 92.5 kg
- Aiemmin pystyi kirjaamaan vain yhden painon per liike — sarjojen väliset erot katosivat
- Sarjojen määrää voi säätää lennossa: "+ Lisää sarja" ja "− Poista sarja" napit
- Voit siis tehdä jonain päivänä 3 sarjaa, toisena 4 — ilman ohjelman muokkaamista
- Toistot esitäytetään ohjelman mukaan (nopea täyttää), painot voi säätää per sarja

**Valmentaja tulkitsee nyt sarjojen suunnan (fiksumpi analyysi):**
- NOUSEVA suoritus (80→90→92.5): tunnistaa että oli varaa, suosittelee raskaimman sarjan pohjalta
- LASKEVA suoritus (92.5→90→85): tunnistaa väsymisen merkittävänä signaalina, suosittelee maltillisemmin
- TASAINEN suoritus (90→90→90): vakaa pohja progressiiviselle nostolle
- "Seuraava kerta" -suositus perustuu raskaimpaan sarjaan jos suunta on nouseva

**Tekniset muutokset:**
- Tietoformaatti muuttui: paino/toistot/RPE tallennetaan nyt per sarja
- Vanhat kirjaukset säilyvät ja toimivat (taaksepäin-yhteensopivuus)
- Historia-näkymä ja valmentaja päivitetty näyttämään sarjakohtaiset painot
- Muokattu: app2.js (kirjaus, tallennus, analyysi, historia, progressiologiikka)
- Muokattu: style.css (sarjarivien asettelu)

---

## v2.3 — 18.8.2026

**Keskivartalon (core) vahvistus — tärkeä selän tuelle:**
- Lisätty core-liike molempiin oletustreeneihin (aiemmin puuttui kokonaan)
  - Treeni A loppuun: Lankku (3 × 30–45 s)
  - Treeni B loppuun: Sivulankku (2 × 20–30 s/puoli)
- Laajennettu kirjaston vatsa/core-valikoima 3 → 7 liikkeeseen
- Uudet liikkeet: Lintukoira, Kuollut hyönteinen (dead bug), Polvien nosto riipunnasta, Vuoristokiipeilijä
- Lintukoira ja dead bug ovat fysioterapiassa suositeltuja selkäystävällisiä liikkeitä

**Kieliasun parannukset:**
- "Kirjaa treeni tehtyä" → "Kirjaa treeni"
- "Taljaristikkäveto" → "Ristikkäinveto taljassa"

**Tekniset muutokset:**
- Aikaperustaiset liikkeet (lankku, sivulankku) eivät saa automaattista painonlisäysehdotusta — progressio tarkoittaa pidempää kestoa
- Valmentaja tietää nyt core-liikkeet ja niiden aikaperustaisen progression
- Muokattu: app2.js (core-liikkeet, kirjasto, valmentajan profiili, painologiikka)
- Muokattu: index.html (napin teksti)

---

## v2.2 — 18.8.2026

**Korjaus:**
- Korjattu treenien nimet kuvaamaan sisältöä rehellisemmin (jalkaliikkeet mukana):
  - Treeni A: "Yläkroppa (työntö) + Etujalat"
  - Treeni B: "Yläkroppa (veto) + Takajalat"
- Aiemmat nimet antoivat ymmärtää että kyse on puhtaista työntö/veto-treeneistä, vaikka molemmissa on myös jalkaliike (tarpeen 2 kertaa viikossa -tahdissa)

**Tekniset muutokset:**
- Muokattu: app2.js (treenien nimet ja valmentajan profiili)

---

## v2.1 — 18.8.2026

**Treenijaon parannukset (asiantuntija-arvion pohjalta):**
- Uudistettu treenijako tasapainoisemmaksi 2 kertaa viikossa -tahtiin
- Korjattu nimet: A = "Työntävät + Yläselkä", B = "Vetävät + Alavartalo" (aiemmin harhaanjohtavat Push/Pull)
- Lisätty takaketjun liike: Lantionnosto (pakarat & takareidet) — aiemmin puuttui kokonaan
- Vähennetty olkapäiden kuormitusta: Dippi korvattu ojentajapunnerruksella
- Turvamuutokset selkävaivan vuoksi: EI tavallista maastavetoa, EI RDL-maastavetoa, EI seisten tehtävää pystypunnerrusta
- Hartiaprässi vaihdettu istuen tehtäväksi (selkätuki)

**Uusi ominaisuus — RPE-seuranta:**
- Jokaiselle liikkeelle voi kirjata RPE-arvon (1–10, koettu kuormittavuus)
- Kirjauslomakkeessa selitys mikä RPE on
- AI-valmentaja käyttää RPE-arvoja tarkempaan progressioon (kevyt RPE → nosta painoa, korkea RPE → varo ylikuormitusta)

**Valmentajan parannukset:**
- Valmentaja arvioi nyt pidemmän aikavälin kehitystä (10 treenin trendi)
- Huomioi mahdollisen juuttumisen ja palautusviikon tarpeen
- Tietää selkä- ja olkapäärajoitteet tarkemmin

**Liikekirjaston päivitys:**
- Lantionnosto lisätty selkäystävällisiin jalkaliikkeisiin
- Tavallinen maastaveto ja RDL poistettu kirjastosta
- Olkapääliikkeet merkitty selkäystävällisyyden mukaan

**Tekniset muutokset:**
- Muokattu: app2.js (treenijako, RPE-logiikka, valmentajan promptit)
- Muokattu: style.css (RPE-kenttä, kirjauslomakkeen 2×2-asettelu)

---

## v2.0 — 18.8.2026

**Uudet ominaisuudet:**
- Lisätty liikekirjasto: valmis lista liikkeitä ryhmiteltynä (Rinta, Selkä, Jalat, Olkapäät, Kädet, Vatsa)
- Selkä- ja polviystävälliset liikkeet merkitty erikseen
- Lisätty "Vaihda"-nappi jokaiseen liikkeeseen
- Lisätty "Lisää liike"-nappi
- Lisätty "Poista liike"-nappi (✕)
- Voi kirjoittaa myös oman liikkeen jota kirjastossa ei ole
- Lisätty "Palauta alkuperäinen treenijako"-nappi asetuksiin
- AI-valmentaja tietää nyt nykyisen treenijaon ja osaa ehdottaa konkreettisia liikevaihdoksia

**Tekniset muutokset:**
- Treenijako tallentuu nyt laitteen muistiin (localStorage), joten muutokset liikkeisiin säilyvät
- Uusi tiedosto: app2.js (korvaa app.js:n)
- Muokattu: index.html (lisätty liikkeenvaihto-ikkuna ja palautus-nappi)
- Muokattu: style.css (uusien nappien tyylit)

---

## v1.0 — 18.8.2026 (ensimmäinen julkaisu)

**Ensimmäinen toimiva versio.**

**Ominaisuudet:**
- Kolme välilehteä: Treeni, Valmentaja, Historia
- Treenijako A (Push + jalat) ja B (Pull + yläkroppa) vuorotellen
- Kiinteä lista liikkeitä, 4 liikettä per treeni
- Treenin kirjaus: sarjat, toistot, paino, huomiot
- Automaattinen progressioehdotus (esim. penkkipunnerrus +2.5 kg per treeni)
- Viikkonäkymä joka näyttää tehdyt treenit
- AI-valmentaja: analysoi treenin ja ehdottaa seuraavaa kertaa
- Valmiit kysymykset valmentajalle (selkäkipu, tauko, progressio, polvi)
- Oma kysymys valmentajalle vapaana tekstinä
- Historia-sivu: penkkipunnerruksen kehitys ja kaikki treenikerrat
- Asetukset: API-avaimen tallennus, tietojen nollaus
- Tiedot tallentuvat vain omalle laitteelle (localStorage)
- Toimii puhelimessa PWA-sovelluksena (voi lisätä kotinäytölle)

**Tekniset tiedot:**
- Tiedostot: index.html, style.css, app.js, manifest.json
- Julkaistu: Netlify (osoite: helpful-beijinho-d29886.netlify.app)
- Koodi: GitHub (jannejukka-ai/treeniapp)
- AI: Claude API (malli claude-sonnet-4-6)

---

## Ohje: miten kirjaan uuden version?

Kun teet muutoksia sovellukseen tulevaisuudessa:

1. Päätä versionumero:
   - Iso muutos (uusia ominaisuuksia) → nosta kokonaislukua: v2.0 → v3.0
   - Pieni korjaus (bugikorjaus, pieni säätö) → nosta desimaalia: v2.0 → v2.1

2. Lisää uusi osio TÄMÄN tiedoston ylimmäksi (uusin aina ylös)

3. Kirjaa: päivämäärä, mitä muuttui, mitkä tiedostot muuttuivat

4. Tallenna (Commit) GitHubiin
