# Treeniapp — Kehityskohteet (TODO)

Tähän tiedostoon on kirjattu tulevia ominaisuuksia ja kehityskohteita joita ei ole vielä toteutettu.
Kun jokin kohta rakennetaan, se siirretään CHANGELOG-tiedostoon valmiina versiona.

---

## PYSÄKÖITY — Lepoajastin sarjojen väliin

**Status:** Suunniteltu valmiiksi, odottaa toteutusta. Pysäköity [päivä] tärkeämmän korjauksen tieltä.

**Suunniteltu toteutus (kaikki päätökset tehty):**

1. **Iso "Aloita lepo" -nappi** — yksi kosketus käynnistää ajastimen (käynnistetään heti sarjan jälkeen kun painot lasketaan)
2. **Oletusaika 1:30 (90 s)**
3. **Sarjakohtainen säätö lennossa** — "+15 s" ja "−15 s" napit ajastimen ollessa käynnissä (ei etukäteismäärittelyä per liike — se todettiin liian monimutkaiseksi)
4. **Wake Lock** — näyttö pysyy päällä koko lepoajan, jotta ajastin toimii vaikka käyttäjä ei koske puhelimeen (käyttäjän näyttö sammuu muuten 30 s:ssa)
5. **Hiljainen visuaalinen ajastin** — EI äänimerkkiä (käyttäjän toive). Iso numero laskee alaspäin, vilkkuu tai muuttaa väriä kun aika loppuu
6. **"Ohita"-nappi** — lopettaa levon kesken

**Avoin kysymys johon ei vielä vastattu:**
- Riittääkö sarjakohtainen säätö +/- napeilla, vai halutaanko myös oletusajan vaihto asetuksissa? (Käyttäjä oli valitsemassa tätä kun ominaisuus pysäköitiin.)

**Tärkeä tekninen huomio testaukseen:**
- Wake Lock toimii useimmilla iPhoneilla mutta Applen tuki on ollut epävakaa eri iOS-versioissa. Pitää testata käyttäjän omalla puhelimella. Jos ei toimi, varasuunnitelma: käyttää iPhonen omaa Kello-sovelluksen ajastinta.

**Versio johon suunniteltu:** v2.4

---

## Muut ideat myöhemmäksi (ei vielä suunniteltu)

- **AI-valmentajan keskustelumuisti** — valmentaja muistaisi aiemmat kysymykset saman keskustelun aikana (suunniteltu v3.0:aan)
- **Monen käyttäjän tuki** — esim. perheenjäsenen oma profiili samassa sovelluksessa
- **Pidemmän aikavälin ohjelmasuunnittelu (periodisaatio)** — valmentaja rakentaisi monen viikon etukäteissuunnitelman
