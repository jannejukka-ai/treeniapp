# Ohjeet Claudelle — Treeniapp-kehitys (liitä tämä uuteen keskusteluun)

Hei Claude. Jatkan henkilökohtaisen treenisovellukseni ("Treeniapp") kehitystä. Olen JJ, sovelluksen ainoa käyttäjä. Alla on kaikki mitä tarvitset jatkaaksesi saumattomasti siitä mihin edellinen keskustelu jäi.

---

## MITÄ OLEN LIITTÄNYT TÄHÄN KESKUSTELUUN

Olen liittänyt sovelluksen nykyiset tiedostot GitHubista (github.com/jannejukka-ai/treeniapp):
- **app2.js** — sovelluksen logiikka (HUOM: sovellus käyttää app2.js:ää, EI vanhaa app.js:ää)
- **index.html** — rakenne
- **style.css** — tyylit
- **TODO.md** — kehityssuunnitelma (kaikki suunnitellut muutokset yksityiskohtineen)

**TOIMI NÄIN HETI ALUKSI:** Lue kaikki neljä tiedostoa ennen kuin teet mitään. TODO.md kertoo mitä pitää rakentaa ja missä järjestyksessä. Koodista näet nykytilan.

---

## MITEN TÄMÄ PROSESSI TOIMII (vakiintunut työtapa — noudata tätä)

Olemme kehittäneet toimivan työtavan. Noudata sitä ilman että minun tarvitsee pyytää:

1. **Lue tiedostot ensin.** Katso app2.js, index.html, style.css ja TODO.md. Kerro lyhyesti missä versiossa ollaan ja mitä olen pyytänyt rakennettavaksi.

2. **Kysy suunnittelupäätökset ENNEN rakentamista.** Jos muutoksessa on valintoja (esim. liikevalinnat, toiminnallisuuden yksityiskohdat), kysy ne minulta selkeästi — mieluiten ask_user_input-työkalulla (napit ovat helppoja mobiilissa). Älä oleta, vaan varmista.

3. **Testaa muutokset.** Aja node --check ja muut järkevät tarkistukset. Simuloi logiikka jos mahdollista. Älä jaa tiedostoja joita et ole tarkistanut.

4. **Anna valmiit tiedostot GitHubiin päivitettäväksi.** Käytä present_files. Kerro selkeästi MITKÄ tiedostot muuttuivat ja mitkä pysyivät ennallaan.

5. **Päivitä AINA nämä ilman että pyydän:**
   - **CHANGELOG.md** — lisää uusi versio ylimmäksi, kuvaa muutokset selkeästi
   - **TODO.md** — merkitse valmistuneet kohdat, päivitä pipeline
   - **Word-dokumentti (Treeniapp-Versiohistoria.docx)** — luo se make_changelog_doc.py-skriptillä CHANGELOG:sta. Jos skriptiä ei ole liitteenä, luo se uudelleen (se lukee CHANGELOG.md:n ja tekee siitä muotoillun Word-dokumentin: sininen versio-otsikko, tummat alaotsikot, bulletit).
   - **Footer-versionumero index.html:ssä** — päivitä käsin (esim. "Treeniapp v3.1"). TÄRKEÄÄ: se ei päivity automaattisesti, ja unohtuu helposti.

6. **Muistuta minua lopuksi näistä:**
   - Päivitä kaikki muuttuneet tiedostot GitHubiin (Edit → Ctrl+A → Delete → liitä → Commit)
   - Varmista Netlify-deploy: Deploys-välilehti → odota "Published" (vihreä pallo). Jos ei käynnisty: Trigger deploy → Deploy project without cache. (Minulla on ollut token-katkoksia, joten tämä varmistus on tärkeä.)
   - Lataa sovellus incognitossa / Cmd+Shift+R ja tarkista että footerissa on uusi versionumero
   - Anna testivinkit uudelle versiolle

---

## VERSIONUMEROINNIN LOGIIKKA

- Iso muutos (uusi ominaisuus) → nosta kokonaislukua tai .x (esim. v3.0 → v3.1)
- Pieni korjaus (bugi, kosmeettinen) → nosta viimeistä desimaalia (esim. v3.1 → v3.1.1)

---

## JULKAISUKETJU — miten muutos päätyy koodista puhelimeen

Tämä on koko työnkulku alusta loppuun. Ketju on tärkeä ymmärtää, koska Netlify seuraa GitHubia — siksi deploy-varmistus liittyy GitHub-päivitykseen.

1. **Claude tekee muutokset** ja antaa valmiit tiedostot (present_files)
2. **JJ päivittää tiedostot GitHubiin:** jokaiselle tiedostolle: klikkaa tiedosto → kynäikoni (Edit) → Ctrl+A → Delete → liitä uusi sisältö → Commit changes (Commit directly to main)
3. **Netlify huomaa GitHub-muutoksen ja julkaisee automaattisesti** (ei vaadi JJ:ltä toimia — paitsi varmistuksen)
4. **JJ varmistaa deployn:** Netlify → Deploys-välilehti → uusin deploy pitää näyttää "Published" (vihreä pallo). Jos deploy ei käynnisty itsestään tai epäonnistuu: Trigger deploy → "Deploy project without cache". (HUOM: JJ:llä on ollut token-katkoksia joiden takia deploy on jäänyt kesken — tämä varmistus on siksi tärkeä, ei valinnainen.)
5. **JJ testaa:** avaa sovellus incognitossa TAI Cmd+Shift+R (ohittaa selaimen välimuistin) → tarkistaa että footerissa lukee uusi versionumero → kokeilee uutta ominaisuutta

Nyrkkisääntö: kun footerin versionumero vastaa uusinta, päivitys on oikeasti mennyt läpi. Jos footer näyttää vanhaa, joko GitHub-päivitys tai Netlify-deploy on kesken.

Ympäristö: koodi = GitHub (jannejukka-ai/treeniapp), julkaisu = Netlify (osoite muotoa xxx.netlify.app), AI-valmentaja = Anthropic API. JJ:llä on Netlifyssä maksullinen tili (n. 9€/kk, 3 kk puoleen hintaan).

---

## TÄRKEÄÄ MINUSTA KÄYTTÄJÄNÄ (JJ)

**Terveys / keho — KRIITTISTÄ ohjelman kannalta:**
Minulla on kolme päällekkäistä vaivaa jotka vaikuttavat siihen mitä liikkeitä voin tehdä. Nämä ovat TODO.md:n kohdassa 0 yksityiskohtaisesti, mutta tiivistetysti:
- **Selkäranka:** L4-5 (välilevyongelma, spondyloosi) JA T8-9/T10 (spondyloosinokat). → EI maastavetoa, EI kyykkyä, EI seisten pystypunnerrusta. Hyväksi: rintarankaa avaavat liikkeet, tuettu soutu, edestä tulevat taljaliikkeet, roikkuminen + polvennosto.
- **TOS (hartiapunos) + hermo-oireet kyynärpäissä:** käsien puutumista yläasennossa. Overhead on toistaiseksi ok, MUTTA liikerata/kulma on tärkeä. Lukitut liikevalinnat: Arnold press (ei kiinteä laite/Smith), vasarakääntö tai V-kahva-taljakääntö (ei vaakakämmentä hauiskäännössä).
- **Tavoitteeni (päivitetty):** ENSISIJAINEN = selän ja nivelten terveys ja kunnon ylläpito. SEKUNDAARINEN = pitää penkkipunnerrus samalla tasolla, pysyä yläkropaltaan lihaksikkaana.

**TÄRKEÄ RAJOITE SINULLE (Claude):** Et ole lääkäri etkä fysioterapeutti. Lääkärieni (ortopedi, käsikirurgi) ohjeet menevät AINA sinun pohdintasi edelle. Jos jokin on epäselvää tai ristiriitaista, sano se suoraan ja kehota kysymään ammattilaiselta. Älä keksi lääketieteellisiä suosituksia.

**Kommunikaatio:**
- Kirjoitan suomeksi, vastaa suomeksi.
- Pidän selkeästä rakenteesta: lyhyet kappaleet, tärkeät kohdat esiin, numeroidut askeleet kun ohjeistat tekemään jotain.
- Arvostan rehellisyyttä: jos jokin on huono idea, iso urakka, tai sisältää riskin, sano se suoraan. Älä pelkää olla eri mieltä.
- En osaa koodata. Selitä tekniset asiat maallikolle, ja anna GitHub-päivitykset aina samalla kaavalla (Edit → Ctrl+A → Delete → liitä → Commit).

---

## SOVELLUKSEN NYKYTILA (tarkista tiedostoista, tämä on muistutus)

Treeniapp on PWA (toimii iPhonessa kotinäytöltä), tehty HTML/CSS/JS. Julkaistu Netlifyssä, koodi GitHubissa. AI-valmentaja käyttää Anthropic API:a (malli claude-sonnet-4-6, avain tallennettu vain laitteelle).

Ydintoiminnot: sarjakohtainen kirjaus (paino/toistot/RPE per sarja), AI-valmentaja keskustelumuistilla (chatti-näkymä), muokattava treenijako + liikekirjasto, lepoajastin (kellonaikaan perustuva, Wake Lock), automaattinen välitallennus + "jatka keskeneräistä", valmentajan kommenttihistoria, versiofooteri.

Treenijako: A (Yläkroppa työntö + Etujalat) ja B (Yläkroppa veto + Takajalat), 2× viikossa.

---

## MITÄ HALUAN RAKENTAA NYT

(Kirjoita tähän mitä haluat tehdä, esim: "Rakennetaan TODO:n kohdat 0, 0.4 ja 0.5 yhtenä versiona v3.1 — terveysmuutokset + merkintöjen selkeytys.")

→ ________________________________________________
