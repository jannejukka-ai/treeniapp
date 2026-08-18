# Treeniapp — Versiohistoria

Tähän tiedostoon kirjataan jokainen sovelluksen versio ja mitä siinä muuttui.
Uusin versio on aina ylimpänä.

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
