# Treeniapp — Kehityskohteet (TODO)

Tähän tiedostoon on kirjattu tulevia ominaisuuksia ja kehityskohteita joita ei ole vielä toteutettu.
Kun jokin kohta rakennetaan, se siirretään CHANGELOG-tiedostoon valmiina versiona.

**MUISTA jokaisessa versiopäivityksessä:** päivitä versionumero myös index.html:n footeriin (teksti "Treeniapp v3.0.1"). Se ei päivity automaattisesti.

---

## VALMIS ✅ — AI-valmentajan keskustelumuisti (toteutettu v3.0:ssa)

Valmentaja muistaa nyt käynnissä olevan keskustelun ja osaa vastata jatkokysymyksiin. Keskustelu näkyy chatti-tyylisenä. "Aloita uusi" -nappi nollaa keskustelun. Suuret linjat (profiili, historia) säilyvät aina. Katso tarkemmat tiedot CHANGELOG:sta v3.0.

---

## PIPELINE — seuraavat kehityskohteet (käyttäjän priorisoima järjestys)

**0. TREENIOHJELMAN TARKISTUS lääkärien löydösten pohjalta (TERVEYSPRIORITEETTI — käsitellään ennen muita)**

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

**0.4. KIRJAUKSEN MERKINTÖJEN SELKEYTYS — paino & yksiköt (KÄYTETTÄVYYS + DATAN LUOTETTAVUUS)**

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
