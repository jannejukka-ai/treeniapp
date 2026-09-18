# Treeniapp — Kehityskohteet (TODO)

Tähän tiedostoon on kirjattu tulevia ominaisuuksia ja kehityskohteita joita ei ole vielä toteutettu.
Kun jokin kohta rakennetaan, se siirretään CHANGELOG-tiedostoon valmiina versiona.

**MUISTA jokaisessa versiopäivityksessä:** päivitä versionumero myös index.html:n footeriin (teksti "Treeniapp v3.1"). Se ei päivity automaattisesti.

**⚠️ PYSYVÄ SÄÄNTÖ — AI-VALMENTAJAN SYNKRONOINTI:** Aina kun muutetaan liikkeitä, treenijakoa, tavoitteita, rajoitteita tai kirjauslogiikkaa, TARKISTA JA PÄIVITÄ SAMASSA YHTEYDESSÄ myös AI-valmentajan tiedot (PROFILE-teksti app2.js:ssä, ja tarvittaessa buildCoachContext / analyzeSession-promptit). Syy: jos valmentajan tiedot jäävät jälkeen, JJ:llä on puutteellisin tiedoin varustettu valmentaja joka voi antaa ohjelman vastaisia tai jopa terveydelle haitallisia neuvoja. Valmentaja ja sovelluksen todellisuus EIVÄT saa erkaantua. Tämä koskee erityisesti: uudet/poistetut liikkeet, muuttuneet rajoitteet, uudet aikaperustaiset tai kehon paino -liikkeet, tavoitemuutokset.

---

## VALMIS ✅ — AI-valmentajan keskustelumuisti (toteutettu v3.0:ssa)

Valmentaja muistaa nyt käynnissä olevan keskustelun ja osaa vastata jatkokysymyksiin. Keskustelu näkyy chatti-tyylisenä. "Aloita uusi" -nappi nollaa keskustelun. Suuret linjat (profiili, historia) säilyvät aina. Katso tarkemmat tiedot CHANGELOG:sta v3.0.

---

## VALMIS ✅ — v3.1: Terveysmuutokset + kirjausmerkinnät (toteutettu 18.9.2026)

Toteutettu TODO:n kohdat **0, 0.4 ja 0.5c** yhtenä versiona. Tiivistetysti:
- 3 liikevaihtoa oletukseen: Kulmasoutu→Tuettu taljasoutu istuen, Hartiaprässi→Arnold press istuen, Hauiskääntö→Vasarakääntö
- Penkin turvatekniikka (45° kyynärpäät, lapatuki, kevyt notko) liikkeen ohjetekstiin JA valmentajan profiiliin
- Valmentajan profiili päivitetty: 3 vaivaa + uudet tavoitteet (terveys ensisijaiseksi) + kiellot/vaihtoehdot
- Liikekirjasto laajennettu: tuettu taljasoutu, roikkuminen+polvennosto, selän ojennus penkissä, Arnold press, V-kahva-taljakääntö
- Paino-merkintä automaattisesti (per käsi / yhteensä / kehon paino) + kehon paino -bugi (0×10) korjattu
- Aikaperustaiset liikkeet tunnistetaan nyt myös nimestä
Katso tarkemmat tiedot CHANGELOG:sta v3.1.

**Jäi tähän versioon TEKEMÄTTÄ (siirretty pipelineen alle):** kohdat 0.4:n täysi per-puoli-toistojen erittely (esim. "10/puoli" erikseen toistoille), 0.5a (kirjauksen korjaus jälkikäteen), 0.5b (joustava liikejärjestys). Kohta 7 (varmista ortopedilta raskas penkki + lantion notko) on käyttäjän itsensä hoidettava, ei koodimuutos.

---

## PIPELINE — seuraavat kehityskohteet (käyttäjän priorisoima järjestys)

---

### 🎯 SEURAAVA VERSIO (v3.2) — sovittu kehitysjono (18.9.2026, JJ + Claude)

Tämä lista koottiin v3.1:n jälkeen. Ehdotettu järjestys: kevyet ja terveysrelevantit ensin.

1. **Toistojen per-puoli-erittely** (JJ:n toive). Sivulankku, lintukoira, dead bug ym. yksipuoliset: mahdollisuus merkitä toistot "per puoli" (repMode = 'per-puoli'). Paino-puoli hoidettu jo v3.1:ssä, tämä on toistojen vastaava lisä. Rajattu, selkeä. **Prioriteetti: korkein — luontevin aloituskohta v3.2:lle.**

2. **Progressioehdotus fiksummaksi per liiketyyppi** (Clauden bongaus). Nyt `suggestNextWeight` ehdottaa +2,5 kg kaikille. HUOM (JJ:n tarkennus 18.9.): JJ:n salin käsipainot nousevat 2,5 kg välein, joten +2,5 kg/käsi on itse asiassa jo OIKEA askel sekä tangolle että käsipainoille → tämä ei ole kiireellinen JJ:lle. Kentät hyväksyvät joka tapauksessa minkä tahansa vapaan arvon (16, 17.5 jne.), joten ehdotuksen epätarkkuudesta ei ole käytännön haittaa. Jää nice-to-have -tasolle. Prioriteetti: laskettu matalaksi.

3. **Historia-seuranta muillekin liikkeille kuin penkki** (Clauden bongaus). Nyt Historia-sivun kehityskaavio on kovakoodattu vain id:hen 'bench'. Laajennus: valittava mitä liikettä seuraa (esim. Arnold press, tuettu soutu). Tukee uutta terveys-ensin-tavoitetta. Keskisuuri. Prioriteetti: keskitaso.

4. **Paino-merkinnän käsivalinta käyttöliittymään** (JJ:n kysymys + Clauden vastaus). Automatiikka riittää nyt; tämä tehdään VAIN jos automatiikka osoittautuu riittämättömäksi. Toteutustapa selvitetty: valinta tulee LIIKKEENVAIHTO-IKKUNAAN (ei kirjausriviin, joka on jo tiivis). Kertaluontoinen valinta per liike: [per käsi] [yhteensä] [kehon paino] → asettaa ex.weightMode. Ruututila EI ole ongelma (iPhone 17 Pro Max iso ruutu). Koodissa on jo valmis pohja (getWeightMode lukee ex.weightMode). Prioriteetti: matala.

5. **Pikakysymykset päivitettävä uuteen tavoitteeseen** (Clauden bongaus, kosmeettinen). Valmentaja-välilehden pikakysymykset ovat yhä vanhoja ("Penkki ei nouse" jne.). Terveys on nyt ykköstavoite → esim. yksi kysymys "Selkä/olkapää-ystävällinen vaihtoehto liikkeelle X". Voi tehdä minkä tahansa version yhteydessä. Prioriteetti: matala.

*(Iso, oma projektinsa — ei vielä v3.2:een):* Pitkän aikavälin muisti + periodisaatio = alla oleva kohta 1. Kytkeytyy kohtaan 3 (historia-seuranta).

---

### 📚 PDF-ANALYYSIN LÖYDÖKSET (Claude kävi projektin PDF:t läpi 18.9.2026)

JJ pyysi käymään projektin ladatut PDF:t läpi ja vertaamaan sovelluksen nykytilaan. Löytyi kaksi merkittävää aukkoa liikekirjastossa. Nämä ovat SISÄLTÖ-lisäyksiä (uusia liikkeitä), eivät koodimuutoksia — helppo toteuttaa lisäämällä EXERCISE_LIBRARY-listaan app2.js:ssä.

**AUKKO 1 (tärkein) — MedBridge TOS-liikkeet puuttuvat kokonaan.**
MedBridge-PDF on lääketieteellinen fysioterapiaohje juuri JJ:n TOS-vaivaan. Sisältää 5 liikettä, joista MIKÄÄN ei ole kirjastossa. Nämä ovat liikkuvuus-/mobilisointiliikkeitä (ei voimaliikkeitä) — vastaavat suoraan TODO:n fokusta (rintarangan liikkuvuus, lapatuki, rintakehän avaus). Suositus: lisää uusi kategoria "Liikkuvuus & TOS (fysioterapia)" kirjastoon:
   - Rintalihaksen venytys oviaukossa (120° abduktio) — Single Arm Doorway Pec Stretch
   - Lapaluiden veto yhteen istuen (Seated Scapular Retraction) — HUOM: tämä on suoraan penkin "lapatuki"-tekniikan harjoitusliike
   - Hartioiden pyöritykset istuen (Shoulder Shrug Circles)
   - Lumienkeli foam rollin päällä (Snow Angels on Foam Roll) — rintarangan avaus
   - Rintakehän mobilisointi pallolla (Chest Mobilization with Small Ball)
   Nämä ovat aikaperustaisia/toistoperustaisia venytyksiä — ei painoa. Merkitään kehon paino / aika.

**AUKKO 2 — Ryhtiä ja lapatukea tukevat vetoliikkeet puuttuvat.**
Projektin selkä/ryhti-ohjelma JA Tsemppi-penkkiopas korostavat molemmat näitä. Profiili mainitsee "1.5-2× vetävää työntävää kohden" ja lapatuen, mutta kirjastosta puuttuu:
   - Face pull / Takaolkapään veto kasvoille (taljassa) — KESKEINEN ryhdille & olkapään terveydelle, Tsemppi-opas suosittaa olkapään ennaltaehkäisyssä. Lisää kategoriaan Olkapäät tai Selkä.
   - Reverse fly / Käänteiset flyes (käsipainoilla tai taljassa) — takaolkapää & yläselkä, ryhti
   - Pallof-punnerrus (anti-rotaatio core, selkäystävällinen) — lisää Vatsa/keskivartalo-kategoriaan
   - (Face pull ja reverse fly tukevat myös TOS:ia: vahvistavat lapaluun vetäjiä, avaavat rintakehää)

**PIENI TARKENNUS 3 — penkkiohje on jo kunnossa, mutta profiiliin voisi lisätä nyansseja.**
Vertasin sovelluksen penkkiohjetta molempiin penkkioppaisiin (NHA/Nuckols + Tsemppi). Ydinasiat (45° kyynärpäät, lapatuki, kevyt notko) ovat oikein ja katettu. Ei-kriittisiä lisäyksiä joita VOISI lisätä valmentajan profiiliin jos halutaan tarkennusta:
   - "Purista tankoa voimakkaasti" (aktivoi kyynärvarren & olkavarren lihakset)
   - Tangon liikerata: laske rintalastan alaosaan/nännien tasolle, nosta viistosti ylös JA hieman taakse (kohti kasvoja) — ei suoraan ylös
   - Laskuvaihe hallittu 2-3 s, kevyt kosketus rintaan (ei pompautusta)
   - Nämä ovat "nice to have" — nykyohje riittää turvallisuuteen. Prioriteetti: matala.

**Ehdotettu prioriteetti näille:** AUKKO 1 (MedBridge TOS-liikkeet) on arvokkain, koska se on suoraan JJ:n vaivaan kohdennettua eikä sitä ole lainkaan. AUKKO 2 toiseksi tärkein (ryhti + lapatuki). Molemmat ovat pientä työtä (liikkeiden lisäys kirjastoon). Sopisivat hyvin v3.2:een yhdessä kohdan 1 (per-puoli-toistot) kanssa.

---

### ✅ SOVITTU v3.2:een — TOS/ryhti-liikkeiden lisäys VAKIO-OHJELMAAN (JJ + Claude 18.9.2026)

JJ päätti että olennaisimmat kuntouttavat liikkeet lisätään vakio-ohjelmaan (ei vain kirjastoon), koska kirjastoon jäävät liikkeet jäävät helposti tekemättä. EHDOTON reunaehto: treeni EI saa venyä paljoa — JJ inhoaa pitkiä salikäyntejä. Ratkaisu: lisätään vain lyhyitä liikkuvuus-/aktivointiliikkeitä (~1-2 min), ei raskaita voimaliikkeitä.

**Fysiologinen perustelu sijoittelulle (Clauden suositus, JJ hyväksyi):**
- ALKUUN kuuluu AKTIVOINTI, ei venyttely. Kevyt lapatuki-aktivointi ennen penkkiä/soutua tekee nostoista turvallisempia ja vahvempia (lavat valmiina tukemaan). HUOM: pitkiä staattisia venytyksiä EI ennen voimaliikkeitä — ne voivat hetkellisesti heikentää voimantuottoa.
- LOPPUUN kuuluu LIIKKUVUUS/HUOLTO (venyttely). Lämpimänä venytys on tehokkainta eikä haittaa suoritusta.

**TOTEUTETTAVA v3.2:ssa — DEFAULT_PLAN app2.js:ssä:**

Treeni A (työntöpäivä):
- ALKUUN (ennen penkkiä): Lapaluiden veto yhteen istuen — aktivointi, ~1-2 min. Herättää lapatuen, tukee penkin lapatuki-tekniikkaa. Aikaperustainen tai toistot, ei painoa.
- LOPPUUN (nykyisen lankun jälkeen tai tilalle harkittava): Rintalihaksen venytys oviaukossa (120° abduktio) — huolto, avaa rinnan penkin jälkeen. Aikaperustainen (esim. 2×30s/puoli).

Treeni B (vetopäivä):
- ALKUUN: Lapaluiden veto yhteen istuen — sama aktivointi kuin A:ssa.
- LOPPUUN: Lumienkeli foam rollilla (Snow Angels) — huolto, rintarangan avaus. Aikaperustainen/toistot.

Nettovaikutus: liikkeitä per treeni 5 → 7, MUTTA kaksi uutta ovat lyhyitä (ei raskaita sarjoja/lepoja) → aikalisä vain ~3-4 min. JJ hyväksyi tämän aikavaikutuksen.

**TÄRKEÄ VARAUS (kirjattava myös kun rakennetaan):** Claude ei ole lääkäri/fysioterapeutti. MedBridge-ohje on yleinen TOS-ohje, ei henkilökohtainen. JJ:n kannattaa vahvistaa fysioterapeutilta/lääkäriltä että juuri nämä liikkeet (erit. face pull ja overhead-tyyppiset) sopivat hänelle, koska TOS-oireet liittyvät käsien yläasentoon. JJ on tietoinen tästä.

**MYÖS v3.2:ssa — lisää uusi kirjastokategoria "Liikkuvuus & TOS (fysioterapia)":** kaikki 5 MedBridge-liikettä + face pull + reverse fly + Pallof-punnerrus (ks. AUKKO 1 ja AUKKO 2 yllä). Näin muutkin kuin vakio-ohjelmaan valitut ovat saatavilla.

**MYÖS v3.2:ssa — PÄIVITÄ AI-VALMENTAJAN TIEDOT (PROFILE app2.js) uusien liikkeiden mukaan.** Kolme asiaa jotka valmentajan pitää oppia:
1. Uudet liikkuvuus-/aktivointiliikkeet (lapaluiden veto, rintalihaksen venytys, lumienkeli) ovat AKTIVOINTIA/HUOLTOA, EIVÄT progressiokohteita. Tavoite = laatu ja liikkuvuus, EI kuorman nousu. Valmentaja ei saa ehdottaa "lisää painoa" näihin eikä analysoida niitä kuin voimaliikkeitä.
2. Ohjelman rakenne-logiikka: aktivointi alkuun (herättää lapatuen ennen penkkiä/soutua), huoltovenytys loppuun (lämpimänä tehokkainta). Jotta valmentaja osaa vastata järkevästi jos JJ kysyy niistä.
3. Nämä TOS-liikkeet ovat SUOJATTUJA — valmentaja EI saa ehdottaa niiden poistamista "ajan säästämiseksi", vaikka profiilissa lukee että JJ inhoaa pitkiä treenejä. Ne ovat siellä terveyssyistä.
(Tämä on osa yllä olevaa pysyvää synkronointisääntöä — kirjattu tähän erikseen ettei unohdu juuri tässä versiossa.)

**Tekninen huomio rakennusvaiheeseen:** uudet aikaperustaiset liikkeet pitää lisätä isTimeBased-tunnistukseen (nimet TIME_BASED_KEYWORDS-listaan: esim. "venytys", "lumienkeli", "lapaluiden veto" jos aikaperustainen) JA getWeightMode tunnistaa ne kehon painoksi/ilman painoa. Muuten ne näyttävät "0×10".

---


**0. ~~TREENIOHJELMAN TARKISTUS~~ ✅ TEHTY v3.1:ssä — säilytetty tässä referenssiksi**

Käyttäjällä on KOLME päällekkäistä vaivaa jotka vaikuttavat ohjelmaan:

*A) Selkäranka (ortopedi):*
- Lanneranka L4-5: alkava välilevyongelma, madaltuneet välilevyt, spondyloosi
- Rintaranka T8-9 (ja mahdollisesti T10): spondyloosinokat, aiheuttavat ylävatsan ja kyljen kipuoiretta. Ärsyyntyvät maastavedosta ja pystypunnerruksesta/kyykystä.
- Ortopedin ohjeet: POIS maastaveto JA kyykky (jo poissa — kunnossa). HYVÄKSI: soutuliike (tarkista kulmasoutu → tuettu soutu), edestä tulevat taljaliikkeet (ylätalja jo mukana), käsillä roikkuminen + polvien nosto rinnalle (lisää), selkäpunnerruspenkki (lisää).

*B) TOS + hermo-oireet (käsikirurgi, viime kesä):*
- Hartiapunos-oireyhtymä (TOS): käsien puutumista kun kädet nostaa yläasentoon
- Kyynärpäissä hermon "saltans"-vaiva: hermo napsuu luun yli, epämukava tunne tietyissä liikkeissä
- KÄYTÄNNÖN HAVAINTO salilla: pystypunnerrus ei ole miellyttävä — kiristää olkavarsia ulkopuolelta (ojentajien puoli). Smith ja kiinteä hartiapunnerruslaite tekevät kipeää olkavarsiin.
- KÄYTTÄJÄN TARKENNUS: overhead itsessään on toistaiseksi OK — ongelma on LIIKERATA/KULMA, ei yläasento sinänsä. Ratkaisu tälle:
  - Hartiaprässi/pystypunnerrus → ARNOLD PRESS (käyttäjällä ollut sopiva; vapaa liikerata + säädettävä kulma ja käden asento). Tämä on valittu ratkaisu.
- SAMA KULMA-ONGELMA HAUISKÄÄNNÖISSÄ: vaikea löytää sopiva tapa. Kämmenet eivät saa joutua täysin vaakasuoraan (kämmenet suoraan kattoa kohti) — se on epämukava. Toimivat vaihtoehdot käyttäjälle:
  - Käsipaino- / hammer- (vasara)kääntö
  - Alataljassa V-muotoinen kahva jossa n. 45° V-kulma sisään/keskelle päin (kämmenet eivät käänny epäluonnollisen vaakasuoriksi)
  - → Harkitse oletusohjelman hauiskäännön vaihtoa vasarakääntöön TAI taljakääntö V-kahvalla, ja merkitse kirjastoon nämä nivelystävällisinä

*C) Päivitetyt tavoitteet (käyttäjä):*
- ENSISIJAINEN tavoite nyt: selän ja nivelten terveys ja kunnon ylläpito
- SEKUNDAARINEN: pitää penkkipunnerrus samalla tasolla, pysyä yläkropaltaan lihaksikkaana
- (Muutos aiempaan: terveys nousi ykköseksi, lihasmassan kasvu ei enää päätavoite)

*Tarvittavat toimet kun rakennetaan:*
1. Kulmasoutu → tuettu soutu (taljasoutu istuen tai tuettu käsipainosoutu)
2. Hartiaprässi → ARNOLD PRESS (käyttäjän valinta; kulma/liikerata-ystävällinen)
3. Hauiskääntö → vasarakääntö tai taljakääntö V-kahvalla (nivelystävällinen kulma)
4. Harkitse lisättäviä: roikkuminen + polvennosto, selkäpunnerruspenkki
5. PÄIVITÄ PROFILE-teksti app2.js:ssä: kaikki kolme vaivaryhmää (selkä T8-9/T10 + L4-5, TOS + hermo-oireet, olkavarsi/kyynärpää-oireet) JA uudet tavoitteet (terveys ensisijaiseksi). Mainitse myös kulma-ongelma (overhead ok, mutta liikerata tärkeä; hauiskäännöissä ei vaakakämmentä).
6. Liikekirjaston päivitys: lisää turvalliset vaihtoehdot (tuettu soutu, Arnold press, vasarakääntö/V-kahva-taljakääntö, roikkuminen+polvennosto, selkäpunnerruspenkki)
7. Varmista ortopedilta: raskas PENKKIPUNNERRUS ok (lantion notko)?

HUOM: Claude ei ole lääkäri/fysioterapeutti — lääkärien ohjeet menevät aina edelle. Kolme päällekkäistä vaivaa tekee tästä monimutkaisen; fysioterapeutin kokonaisarvio olisi arvokas.

- Työmääräarvio: keskitaso (useita liikevaihtoja + profiilin ja kirjaston päivitys + tavoitteiden muutos)

---

**0.4. KIRJAUKSEN MERKINTÖJEN SELKEYTYS — paino & yksiköt (OSITTAIN TEHTY v3.1)**

✅ TEHTY v3.1:ssä: paino-merkintä automaattisesti (per käsi/yhteensä/kehon paino) vihjetekstinä otsikon alla; kehon paino -bugi (0×10) korjattu; aikaperustaiset liikkeet tunnistetaan nimestä.

📌 HUOM automatiikan korjaamisesta (JJ:n valinta v3.1:ssä): käsivalintaa merkinnälle EI rakennettu käyttöliittymään — automatiikka riittää. Jos jokin liike arpoo väärin, korjaus tehdään manuaalisesti koodiin:
   - Automatiikan logiikka on funktiossa `getWeightMode` (app2.js). Sinne lisätään liikkeen nimi oikeaan avainsanalistaan (bodyweightKeywords / perHandKeywords) → korjaantuu heti kaikille.
   - Koodissa on jo valmis pohja liikekohtaiselle ylikirjoitukselle: jos liike-objektille asettaa kentän `weightMode` ('per-kasi' | 'kehon-paino' | 'yhteensa'), se voittaa automatiikan. Tätä varten EI ole vielä UI:ta — se olisi pieni lisätyö jos joskus tarve (nappi/valikko liikkeenvaihto-ikkunaan).
   - Konkreettinen esimerkki korjauksesta: jos "Uusi kummallinen liike X" pitäisi olla per käsi mutta näkyy "yhteensä", lisää sen nimen tunnistava sana perHandKeywords-listaan getWeightMode-funktiossa.

⬜ JÄI TEKEMÄTTÄ: toistojen per-puoli-erittely erikseen (esim. sivulankku/lintukoira "toistot per puoli"). Paino-puoli on hoidettu, mutta toistojen repMode ('per puoli') olisi vielä oma lisänsä jos halutaan täsmällisyyttä.


Käyttäjä nosti esiin tärkeän epäselvyyden: kun kirjaa esim. hauiskäännön alataljalla, tarkoittaako "Paino (kg)" koko painoa vai per puoli? Nykyään sovellus EI määrittele tätä lainkaan — jätetty käyttäjän tulkinnan varaan. Tämä haittaa tulosten vertailua kerrasta toiseen.

Tarvitaan: liikekohtainen merkintä siitä, mitä paino ja toistot tarkoittavat. Toteutustapa mietittävä (esim. liikkeelle metatieto: weightMode = 'yhteensä' | 'per puoli' | 'kehon paino', repMode = 'toistot' | 'sekunnit' | 'per puoli'). Kentän otsikko mukautuu liikkeen mukaan.

Kirjaston läpikäynti (34 liikettä) — nämä tarvitsevat tarkennuksen:

*Aikaperustaiset (Toistot → Sekunnit) — EI vielä merkitty aikaperustaisiksi kirjastossa:*
- Lankku, Sivulankku (kirjastoversiot — vain oletustreenien lankut on nyt merkitty koodissa id:llä plank/splank)
- Lintukoira, Kuollut hyönteinen (dead bug) — usein pidoilla, joskus toistoina; päätä kumpi
- Vuoristokiipeilijä — yleensä aikaperustainen

*Per puoli / yksipuoliset (selvennä paino per käsi/jalka JA/TAI toistot per puoli):*
- Yhden käden käsipainosoutu (per käsi)
- Bulgarialainen split-kyykky (per jalka — toistot jo "/jalka" oletuksessa, ei kirjastossa)
- Askelkyykky (per jalka)
- Sivulankku, Lintukoira, Kuollut hyönteinen (per puoli)

*Kehon paino (paino-kenttä turha tai valinnainen lisäpaino):*
- Punnerrus, Leuanveto, Dippi (merkitty "Kehon paino", mutta paino-kenttä silti aktiivinen)
- KONKREETTINEN HAVAINTO (koodi rivi ~851): tyhjä painokenttä tallentuu nyt arvona 0, eikä sitä tulkita "kehon painoksi". Historiassa näkyy "0×10" mikä on harhaanjohtava.
- RATKAISU: kehon paino -liikkeissä tyhjä/0 näytettäköön "kehon paino", ja lisäpainolla "kehon paino +10 kg". Näin sekä käyttäjä että valmentaja näkevät eron. (Sama logiikka kuin lankun painotettu versio "30s +10kg" jo tekee.)
- HUOM: painokenttä säilytetään KAIKISSA näissä (myös lankku) — painotettu versio on yleinen ja haluttu (esim. levypaino selän päällä lankussa, painoliivi, käsipainot split-kyykyssä).

*Yleishuomio painosta:*
- Talja- ja tankoliikkeet: yleensä kokonaispaino (näkyy suoraan)
- Käsipainot: yleensä per käsi
- → Merkintä pitää tehdä selväksi kummassakin tapauksessa

- Työmääräarvio: keskitaso (metatietojärjestelmä liikkeille + kaikkien liikkeiden läpikäynti + kirjaus-UI:n mukautus). HUOM: liittyy läheisesti kohtaan 0.5c (lankun yksikkö) — kannattaa tehdä samalla.

---

**0.5. TOIMINNALLISUUSPARANNUKSET (käyttäjän keräämä lista — käytettävyys)**

*a) Kirjatun painon/sarjan korjaus jälkikäteen:*
- Ongelma: kun on jo siirtynyt eteenpäin treenissä (yhden liikkeen näkymä), aiemman liikkeen virheellistä kirjausta ei pääse korjaamaan.
- Mahdollinen ratkaisu: "Edellinen"-napilla palaaminen (osin jo mahdollista?), TAI yhteenvetonäkymä ennen tallennusta jossa voi korjata mitä tahansa liikettä/sarjaa.
- Arvio: keskitaso

*b) Joustava liikejärjestys (laite varattu -tilanne):*
- Ongelma: jos salilla ei voi tehdä liikkeitä ohjelman järjestyksessä (esim. laite varattu, haluaa tehdä toisen liikkeen odotellessa), sovellus ei jousta.
- Mahdollinen ratkaisu: mahdollisuus hypätä liikkeisiin vapaassa järjestyksessä, tai merkitä liike "teen myöhemmin".
- Arvio: keskitaso

*c) Lankun yksikkö näyttää yhä väärin (sekunnit):*
- HUOM: korjaus ON jo koodissa (v2.9, rivi ~557: "Sekunnit"-otsikko aikaperustaisille). Jos yhä näkyy väärin → todennäköisesti v2.9-deploy ei mennyt kokonaan läpi (käyttäjällä oli token-ongelmia siihen aikaan).
- Toimi: tarkista näkyykö nykyisessä livessä (footer v3.0.1) lankku oikein "Sekunnit"-otsikolla. Jos ei, tutki miksi korjaus ei ole voimassa vaikka koodissa on.
- Arvio: pieni (todennäköisesti deploy-asia, ei koodivirhe)

*d) Treenitavoitteet uusiksi + liikekirjaston laajennus:*
- Kytkeytyy suoraan kohtaan 0 (tavoitteet C-kohdassa, kirjasto kohdassa 5). Käsitellään yhdessä.

- Kokonaisarvio 0.5: keskitaso

---

**1. Pitkän aikavälin muisti + periodisaatio (YHDISTETTY KOKONAISUUS) — SEURAAVAKSI**

Kaksi toisiinsa liittyvää ominaisuutta jotka rakennetaan yhdessä, koska molemmat vaativat saman perustan: valmentajan pääsyn pidempään historiaan ja kyvyn tunnistaa kuvioita sen yli.

*Osa A — Pitkän aikavälin muisti ja proaktiivinen kuvioiden tunnistus:*
- Nykyinen rajoite (v3.0): valmentaja näkee vain viimeiset 5 treeniä, ja tekee havaintoja vain pyydettäessä — ei seuraa kuvioita oma-aloitteisesti eikä kanna "oivalluksiaan" kerrasta toiseen.
- Tavoite: valmentaja tunnistaa toistuvia kuvioita pidemmältä ajalta ja huomauttaa niistä oma-aloitteisesti. Käyttäjän oma esimerkki: "muistan että liike X tuotti sinulle ongelmia toissa ja sitä edeltävällä kerralla — vaihdetaanpa se parempaan."
- Vaatii: pääsyn koko treenihistoriaan (ei vain 5 viimeiseen), ja tavan jolla valmentaja tunnistaa ja nostaa esiin toistuvat ongelmat (esim. laskeva paino + toistuva kipu-huomio samassa liikkeessä).

*Osa B — Periodisaatio (pidemmän aikavälin ohjelmasuunnittelu):*
- Valmentaja rakentaisi monen viikon etukäteissuunnitelman (esim. nousevaa kuormaa + palautusviikot).
- Avoimia kysymyksiä ratkottavaksi ennen rakennusta:
  - Mistä valmentaja tietää milloin aloittaa kevyemmän viikon?
  - Seuraako sovellus suunnitelmaa automaattisesti vai ehdottaako valmentaja sitä?
  - Mitä tapahtuu jos käyttäjä poikkeaa suunnitelmasta tai jättää treenin väliin?

*Miksi yhdessä:* Periodisaatio (suunnitelma eteenpäin) ja pitkän aikavälin muisti (kuvioiden tunnistus taaksepäin) ovat saman kolikon kaksi puolta — molemmat tarvitsevat että valmentaja "näkee" pidemmän kaaren. Käyttäjän toive: rakennetaan ne yhtenä ominaisuutena.

- Työmääräarvio: iso (kaksi toisiinsa kytkeytyvää ominaisuutta; käsitteellisesti vaativin mitä on tehty)

**2. Liikekirjaston laajennus**
- Käyttäjä on miettinyt tätä useaan otteeseen. Lisää liikkeitä valmiiseen kirjastoon.
- Työmääräarvio: pieni–keskitaso

**3. Monen käyttäjän tuki (VALINNAINEN, ei kiireellinen)**
- Esim. perheenjäsenen oma profiili samassa sovelluksessa
- Vaatisi käyttäjäprofiilit ja mahdollisesti pilvitallennuksen
- Työmääräarvio: iso

## VALMIS ✅ — v2.9 koontipäivitys (toteutettu 2.9.2026)

Kolme bugia korjattu: (A) lankun yksikkö "Toistot" → "Sekunnit", (B) ajastin muutettu kellonaikaan perustuvaksi niin että se toimii taustalla, (C) valmentajan kommentit tallentuvat Valmentaja-välilehden "Aiemmat kommentit" -osioon, otsikoituna lähteen mukaan (Treenianalyysi / Kysymys valmentajalle). Katso tarkemmat tiedot CHANGELOG:sta v2.9.

---

## VALMIS ✅ — Lepoajastin (toteutettu v2.6:ssa)

Lepoajastin sarjojen väliin on nyt rakennettu. Sisältää: "Aloita lepo 1:30" -napin, +15s/−15s säädön, Ohita-napin, Wake Lockin (näyttö pysyy päällä) ja hiljaisen visuaalisen hälytyksen. Katso tarkemmat tiedot CHANGELOG:sta v2.6.

HUOM: Bugi B (yllä) parantaa tätä ajastinta toimimaan myös taustalla.
