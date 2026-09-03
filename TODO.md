# Treeniapp — Kehityskohteet (TODO)

Tähän tiedostoon on kirjattu tulevia ominaisuuksia ja kehityskohteita joita ei ole vielä toteutettu.
Kun jokin kohta rakennetaan, se siirretään CHANGELOG-tiedostoon valmiina versiona.

**MUISTA jokaisessa versiopäivityksessä:** päivitä versionumero myös index.html:n footeriin (teksti "Treeniapp v3.0.1"). Se ei päivity automaattisesti.

---

## VALMIS ✅ — AI-valmentajan keskustelumuisti (toteutettu v3.0:ssa)

Valmentaja muistaa nyt käynnissä olevan keskustelun ja osaa vastata jatkokysymyksiin. Keskustelu näkyy chatti-tyylisenä. "Aloita uusi" -nappi nollaa keskustelun. Suuret linjat (profiili, historia) säilyvät aina. Katso tarkemmat tiedot CHANGELOG:sta v3.0.

---

## PIPELINE — seuraavat kehityskohteet (käyttäjän priorisoima järjestys)

**0. TREENIOHJELMAN TARKISTUS ortopedin löydösten pohjalta (TERVEYSPRIORITEETTI — käsitellään ennen muita)**

Käyttäjä kävi ortopedilla. Uudet löydökset:
- Lanneranka L4-5: alkava välilevyongelma, madaltuneet välilevyt, spondyloosi
- Rintaranka T8-9 (ja mahdollisesti T10): UUSI löydös — spondyloosinokat, jotka aiheuttavat ylävatsan ja kyljen kipuoiretta. Ärsyyntyvät maastavedosta ja pystypunnerruksesta/kyykystä.

Ortopedin ohjeet:
- POIS kokonaan: maastaveto JA kyykky (perusliikkeistä kaksi). [Nämä eivät jo ole ohjelmassa — kunnossa.]
- HYVÄKSI todetut, rintarankaa avaavat / nikamien takaa keventävät liikkeet:
  - Soutuliike (mutta huom: tarkista onko nykyinen KULMASOUTU liian alaselkää kuormittava etukumarassa — harkitse vaihtoa TUETTUUN soutuun, esim. taljasoutu istuen tai tuettu käsipainosoutu)
  - Edestä tulevat taljaliikkeet (ylätalja on jo ohjelmassa — hyvä)
  - Käsillä roikkuminen + polvien/jalkojen nosto rinnalle (EI vielä ohjelmassa — harkitse lisäystä; dekompressoi rankaa + core)
  - Selkäpunnerruspenkin käyttö (EI vielä ohjelmassa — harkitse lisäystä)

Tarkistuksen johtopäätös (Claude): ohjelma on jo suurelta osin linjassa, EI vaadi isoa remonttia. Kohdennetut hienosäädöt:
1. Kulmasoutu → tuettu soutu (1 liikkeen vaihto, vähentää etukumaraa alaselkäkuormaa)
2. Harkitse 1-2 ortopedin suosittelemaa liikettä lisää (roikkuminen + polvennosto; selkäpunnerruspenkki)
3. PÄIVITÄ PROFILE-teksti app2.js:ssä uusilla löydöksillä (T8-9/T10 rintaranka, L4-5 lanneranka, kiellot: maastaveto/kyykky/pystypunnerrus, suositukset: rintarankaa avaavat liikkeet). Ilman tätä valmentaja ei tiedä uusista rajoitteista.
4. Varmista ortopedilta erikseen: onko raskas PENKKIPUNNERRUS ok (lantion notko voi kuormittaa)? Ei todennäköinen ongelma, mutta hyvä tarkistaa.

Tavoitteet pysyvät samoina kuin projektissa aiemmin (lihasmassa, voima, terveys, 2×/vko).
HUOM: Claude ei ole lääkäri/fysioterapeutti — ortopedin ohjeet menevät aina edelle. Epäselvissä kohdissa kysy ortopedilta/fysioterapeutilta.

- Työmääräarvio: pieni–keskitaso (muutama liikevaihto + profiilin päivitys)

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
