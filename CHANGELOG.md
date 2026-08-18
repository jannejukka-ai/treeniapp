# Treeniapp — Versiohistoria

Tähän tiedostoon kirjataan jokainen sovelluksen versio ja mitä siinä muuttui.
Uusin versio on aina ylimpänä.

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
