// ============================================================
// TREENIAPP — Sovelluksen päälogiikka (v2: muokattavat liikkeet)
// ============================================================

// ============================================================
// TOS- JA RYHTILIIKKEET (v3.2) — aktivointi alkuun, huolto loppuun
// ============================================================
// Nämä ovat fysioterapeuttista huoltoa, EIVÄT voimaliikkeitä.
// Ei painoa, ei progressiota. Määritelty omina vakioinaan, koska niitä
// käytetään sekä oletusohjelmassa että vanhan ohjelman päivityksessä.
const TOS_ACTIVATION = {
  id: 'scap', name: 'Lapaluiden veto yhteen istuen',
  sets: 2, reps: '10', weight: 0, unit: 'kg',
  note: 'AKTIVOINTI alkuun — purista lapaluut yhteen ja alas n. 3 s, hartiat eivät nouse. Ei painoa, ei progressiota.'
};
const TOS_PEC_STRETCH = {
  id: 'pecstretch', name: 'Rintalihaksen venytys oviaukossa',
  sets: 2, reps: '30 s/puoli', weight: 0, unit: 'kg',
  note: 'HUOLTO loppuun — kyynärpää n. 120° kulmassa, kevyt venytys, älä kohota hartiaa. Ei painoa.'
};
// Ortopedin suora suositus (JJ kertonut 22.9.2026). TEKNIIKKA ON OLENNAINEN:
// liikkeen tavanomainen suoritustapa (yliojennus yläasennossa) on juuri se,
// jota pitää välttää. Siksi ohje on kirjoitettu auki.
const BACK_EXTENSION = {
  id: 'backext', name: 'Selän ojennus penkissä (hyperextension)',
  sets: 2, reps: '10', weight: 0, unit: 'kg',
  note: 'ORTOPEDIN OHJE — tuki hieman nivusia YLEMMÄS. Kehon painolla, ei lisäpainoa. Nosta selkä pyöristetystä asennosta ylös alhaalta lähtien. EI YLIOJENNUSTA yläasennossa.'
};
const TOS_SNOW_ANGEL = {
  id: 'snowangel', name: 'Lumienkeli foam rollilla',
  sets: 2, reps: '10', weight: 0, unit: 'kg',
  note: 'HUOLTO loppuun — rintarangan avaus. Sormet pysyvät lattiassa, alaselkä ei notkolle. Ei painoa.'
};

// OLETUS-treenijako. Käytetään vain ensimmäisellä kerralla.
// Tämän jälkeen käyttäjän omat muutokset tallentuvat muistiin.
const DEFAULT_PLAN = {
  A: {
    name: 'Treeni A — Yläkroppa (työntö) + Etujalat',
    exercises: [
      { ...TOS_ACTIVATION },
      { id: 'bench', name: 'Penkkipunnerrus', sets: 3, reps: '5–8', weight: 90, unit: 'kg', note: 'Kyynärpäät ~45° kylkiin (ei 90°), lavat taakse+alas, vain kevyt selän notko' },
      { id: 'lat', name: 'Ylätalja', sets: 3, reps: '8–10', weight: 70, unit: 'kg', note: 'Yläselkä vastapainoksi — edestä tuleva veto' },
      { id: 'bsq', name: 'Bulgarialainen split-kyykky', sets: 3, reps: '8–10/jalka', weight: 0, unit: 'kg', note: 'Etureidet & tasapaino — selkäystävällinen' },
      { id: 'tri', name: 'Ojentajapunnerrus taljassa', sets: 2, reps: '10–12', weight: 25, unit: 'kg', note: 'Penkin avuksi (dipin sijaan, säästää olkapäitä)' },
      { id: 'plank', name: 'Lankku', sets: 3, reps: '30–45 s', weight: 0, unit: 'kg', note: 'Keskivartalon tuki — selkäystävällinen' },
      { ...TOS_PEC_STRETCH },
    ]
  },
  B: {
    name: 'Treeni B — Yläkroppa (veto) + Takajalat',
    exercises: [
      { ...TOS_ACTIVATION },
      { id: 'hip', name: 'Lantionnosto', sets: 3, reps: '10–12', weight: 40, unit: 'kg', note: 'Pakarat & takareidet — selkäystävällinen (selkä tuettuna)' },
      { id: 'row', name: 'Rintatuettu soutulaite', sets: 3, reps: '8–10', weight: 70, unit: 'kg', note: 'Keskiselkä — rinta tuettuna laitetta vasten, vartalo ei heilu (ei kulmasoutua)' },
      { id: 'ohp', name: 'Arnold press istuen', sets: 2, reps: '10–12', weight: 20, unit: 'kg', note: 'Olkapäät — vapaa liikerata & säädettävä kulma (TOS-ystävällinen)' },
      { id: 'curl', name: 'Vasarakääntö', sets: 2, reps: '10–12', weight: 14, unit: 'kg', note: 'Käsivarret — neutraali ranne (ei vaakakämmentä, nivelystävällinen)' },
      { id: 'splank', name: 'Sivulankku', sets: 2, reps: '20–30 s/puoli', weight: 0, unit: 'kg', note: 'Vinot vatsalihakset — tukee selkää sivusuunnassa' },
      { ...BACK_EXTENSION },
      { ...TOS_SNOW_ANGEL },
    ]
  }
};

// ============================================================
// OHJELMAN AUTOMAATTINEN PÄIVITYS (migraatio)
// ============================================================
// Käyttäjän oma treenijako on tallennettu selaimen muistiin. Kun oletusohjelmaan
// tulee terveyssyistä uusia liikkeitä, ne pitää lisätä myös tallennettuun
// ohjelmaan — muuten ne eivät koskaan näy käyttäjälle. Tämä ajetaan kerran.
const PLAN_MIGRATION_VERSION = 3; // 3 = v3.2.1 (v3.1:n liikevaihdot + selän ojennuspenkki)

// Vanhentuneet liikenimet → sovittu nimi.
// HUOM: tunnistus tehdään NIMEN perusteella, ei id:n. Syy: liikkeen vaihto
// sovelluksessa arpoo liikkeelle uuden id:n, joten id-pohjainen tunnistus
// ei löytäisi liikkeitä joita käyttäjä on joskus vaihtanut käsin.
const EXERCISE_RENAMES = [
  {
    match: n => /kulmasoutu|alatalja|taljasoutu/.test(n) && !/rintatuettu/.test(n),
    name: 'Rintatuettu soutulaite',
    note: 'Keskiselkä — rinta tuettuna laitetta vasten, vartalo ei heilu (ei kulmasoutua)',
    reason: 'v3.1/v3.2.1: rinta tuettuna, selkäystävällinen'
  },
  {
    match: n => /hartiaprässi|hartiapunnerrus|olkaprässi|pystypunnerrus/.test(n) && !/arnold/.test(n),
    name: 'Arnold press istuen',
    note: 'Olkapäät — vapaa liikerata & säädettävä kulma (TOS-ystävällinen)',
    reason: 'v3.1: kiinteä laite pois, TOS-ystävällinen vapaa liikerata'
  },
  {
    match: n => /hauiskääntö/.test(n) && !/vasara/.test(n),
    name: 'Vasarakääntö',
    note: 'Käsivarret — neutraali ranne (ei vaakakämmentä, nivelystävällinen)',
    reason: 'v3.1: neutraali ranne, nivelystävällinen'
  },
  {
    match: n => /leuanveto/.test(n) && /ylätalja/.test(n),
    name: 'Ylätalja',
    note: 'Yläselkä vastapainoksi — edestä tuleva veto',
    reason: 'v3.2: painomerkintä meni väärin yhdistelmänimellä'
  },
];

function migratePlan() {
  const saved = localStorage.getItem('plan');
  if (!saved) return; // ei omaa tallennettua ohjelmaa → oletus on jo ajan tasalla

  const done = parseInt(localStorage.getItem('planMigration') || '0', 10);
  if (done >= PLAN_MIGRATION_VERSION) return;

  let plan;
  try { plan = JSON.parse(saved); } catch (e) { return; }

  const changes = [];

  // Liikkeet jotka pitää löytyä molemmista treeneistä (alkuun / loppuun)
  const additions = {
    A: { start: [TOS_ACTIVATION], end: [TOS_PEC_STRETCH] },
    B: { start: [TOS_ACTIVATION], end: [TOS_SNOW_ANGEL] },
  };

  ['A', 'B'].forEach(key => {
    const w = plan[key];
    if (!w || !Array.isArray(w.exercises)) return;

    // 1) Nimeä vanhentuneet liikkeet uudelleen (id säilyy → historia ei katkea)
    w.exercises.forEach(ex => {
      const n = (ex.name || '').toLowerCase();
      for (const rule of EXERCISE_RENAMES) {
        if (rule.match(n) && ex.name !== rule.name) {
          changes.push(`${w.name || key}: "${ex.name}" → "${rule.name}" (${rule.reason})`);
          ex.name = rule.name;
          ex.note = rule.note;
          break;
        }
      }
    });

    // 2) Lisää puuttuvat liikkeet. Tarkistus tehdään NIMELLÄ eikä id:llä,
    //    jotta käsin lisättyä liikettä ei tule toiseen kertaan.
    const hasName = name => w.exercises.some(
      ex => (ex.name || '').toLowerCase() === name.toLowerCase()
    );
    const add = additions[key] || { start: [], end: [] };
    add.start.slice().reverse().forEach(t => {
      if (!hasName(t.name)) { w.exercises.unshift({ ...t }); changes.push(`${key}: lisätty alkuun "${t.name}"`); }
    });
    add.end.forEach(t => {
      if (!hasName(t.name)) { w.exercises.push({ ...t }); changes.push(`${key}: lisätty loppuun "${t.name}"`); }
    });
  });

  // 3) Selän ojennuspenkki: ortopedin suositus, kuuluu Treeni B:hen.
  //    Jos se on jo siellä (millä tahansa id:llä), päivitetään vain ohjeteksti.
  const wB = plan.B;
  if (wB && Array.isArray(wB.exercises)) {
    const existing = wB.exercises.find(ex => /selän ojennus|hyperextension|selkäpunnerrus/.test((ex.name || '').toLowerCase()));
    if (existing) {
      if (existing.note !== BACK_EXTENSION.note) {
        existing.name = BACK_EXTENSION.name;
        existing.note = BACK_EXTENSION.note;
        changes.push('B: selän ojennuspenkkiin lisätty ortopedin tekniikkaohje');
      }
    } else {
      const snowIdx = wB.exercises.findIndex(ex => (ex.name || '').toLowerCase().includes('lumienkeli'));
      const at = snowIdx >= 0 ? snowIdx : wB.exercises.length;
      wB.exercises.splice(at, 0, { ...BACK_EXTENSION });
      changes.push('B: lisätty "Selän ojennus penkissä (hyperextension)"');
    }
  }

  localStorage.setItem('plan', JSON.stringify(plan));
  localStorage.setItem('planMigration', String(PLAN_MIGRATION_VERSION));
  if (changes.length) {
    localStorage.setItem('planMigrationLog', JSON.stringify({ version: PLAN_MIGRATION_VERSION, changes }));
    console.log('Treeniapp: ohjelma päivitetty ajan tasalle —', changes);
  }
}

// Palauttaa listan siitä mitä viimeisin automaattinen päivitys muutti
function getPlanMigrationLog() {
  try {
    const raw = localStorage.getItem('planMigrationLog');
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}

// LIIKEKIRJASTO — valmiit vaihtoehdot ryhmiteltynä.
// Selkä- ja polviystävälliset liikkeet on merkitty.
const EXERCISE_LIBRARY = {
  'Rinta': [
    { name: 'Penkkipunnerrus', note: '' },
    { name: 'Vinopenkkipunnerrus', note: '' },
    { name: 'Käsipainopenkki', note: '' },
    { name: 'Ristikkäinveto taljassa', note: '' },
    { name: 'Punnerrus', note: 'Kehon paino' },
  ],
  'Selkä': [
    { name: 'Ylätalja leveä ote', note: 'Selkäystävällinen — edestä tuleva veto' },
    { name: 'Rintatuettu soutulaite', note: 'Selkäystävällinen — rinta tuettuna laitetta vasten' },
    { name: 'Tuettu taljasoutu istuen', note: 'Selkäystävällinen — rinta tuettuna' },
    { name: 'Taljasoutu istuen', note: 'Selkäystävällinen' },
    { name: 'Yhden käden käsipainosoutu', note: 'Selkäystävällinen' },
    { name: 'Käsillä roikkuminen + polvennosto', note: 'Selkäystävällinen — ortopedin suosima' },
    { name: 'Leuanveto', note: 'Kehon paino' },
  ],
  'Jalat (selkäystävällinen)': [
    { name: 'Lantionnosto', note: 'Selkäystävällinen — pakarat & takareidet' },
    { name: 'Bulgarialainen split-kyykky', note: 'Selkäystävällinen' },
    { name: 'Askelkyykky', note: 'Selkäystävällinen' },
    { name: 'Jalkaprässi', note: 'Selkä tuettuna' },
    { name: 'Reiden ojennus (laite)', note: 'Polviystävällinen kevyellä' },
    { name: 'Reiden koukistus (laite)', note: 'Selkäystävällinen — takareidet' },
    { name: 'Selän ojennus penkissä (hyperextension)', note: 'ORTOPEDIN OHJE: tuki nivusia ylemmäs, kehon painolla, pyöristetystä ylös — EI yliojennusta' },
  ],
  'Pohkeet': [
    { name: 'Pohjenousu', note: '' },
  ],
  'Olkapäät': [
    { name: 'Arnold press istuen', note: 'TOS-ystävällinen — vapaa liikerata & säädettävä kulma' },
    { name: 'Käsipainohartiaprässi istuen', note: 'Vapaat käsipainot ok — ei kiinteää laitetta' },
    { name: 'Vipunosto sivulle', note: 'Kevyt olkakuorma' },
    { name: 'Vipunosto eteen', note: '' },
  ],
  'Kädet': [
    { name: 'Vasarakääntö', note: 'Nivelystävällinen — neutraali ranne' },
    { name: 'Taljakääntö V-kahvalla', note: 'Nivelystävällinen — ei vaakakämmentä' },
    { name: 'Hauiskääntö', note: 'Varo: kämmen ei täysin vaakaan' },
    { name: 'Ojentajapunnerrus taljassa', note: '' },
    { name: 'Ranskalainen punnerrus', note: '' },
    { name: 'Dippi', note: 'Kehon paino' },
  ],
  'Vatsa/keskivartalo': [
    { name: 'Lankku', note: 'Selkäystävällinen' },
    { name: 'Sivulankku', note: 'Selkäystävällinen — vinot vatsalihakset' },
    { name: 'Lintukoira', note: 'Selkäystävällinen — fysioterapiassa suositeltu' },
    { name: 'Kuollut hyönteinen (dead bug)', note: 'Selkäystävällinen — syvät vatsalihakset' },
    { name: 'Pallof-punnerrus', note: 'Anti-rotaatio — selkäystävällinen core' },
    { name: 'Vatsarutistus', note: '' },
    { name: 'Polvien nosto riipunnasta', note: 'Alavatsa' },
    { name: 'Vuoristokiipeilijä', note: 'Core + syke' },
  ],
  'Liikkuvuus & TOS (fysioterapia)': [
    { name: 'Lapaluiden veto yhteen istuen', note: 'Aktivointi alkuun — lapatuki (MedBridge TOS)' },
    { name: 'Hartioiden pyöritykset istuen', note: 'Lämmittely — hartiarenkaan liikkuvuus (MedBridge TOS)' },
    { name: 'Rintalihaksen venytys oviaukossa', note: 'Huolto loppuun — avaa rinnan etuosan (MedBridge TOS)' },
    { name: 'Lumienkeli foam rollilla', note: 'Huolto loppuun — rintarangan avaus (MedBridge TOS)' },
    { name: 'Rintakehän mobilisointi pallolla', note: 'Huolto — rintalihaksen pehmytkudos (MedBridge TOS)' },
    { name: 'Takaolkapään veto kasvoille (face pull)', note: 'Ryhti & olkapään terveys — lapatuki' },
    { name: 'Käänteiset vipunostot (reverse fly)', note: 'Takaolkapää & yläselkä — ryhti' },
  ],
};

// Profiilin tiedot AI-valmentajalle
const PROFILE = `
Käyttäjä: JJ, keski-ikäinen mies. Haluaa pysyä vahvana, lihaksikkaana ja ryhdikkäänä.

TAVOITTEET (tärkeysjärjestyksessä):
1. ENSISIJAINEN: selän ja nivelten terveys ja kunnon ylläpito.
2. SEKUNDAARINEN: pitää penkkipunnerrus samalla tasolla ja pysyä yläkropaltaan lihaksikkaana.
(Huom: lihasmassan kasvu ei ole enää päätavoite — terveys menee sen edelle.)

TERVEYSRAJOITTEET (kolme päällekkäistä vaivaa — kriittistä):
A) Selkäranka: Lanneranka L4-5 (alkava välilevyongelma, madaltuneet välilevyt, spondyloosi) JA rintaranka T8-9/T10 (spondyloosinokat, aiheuttavat ylävatsan ja kyljen kipuoiretta). Ärsyyntyvät maastavedosta, kyykystä ja seisten tehtävästä pystypunnerruksesta.
B) TOS (hartiapunos-oireyhtymä) + hermo-oireet: käsien puutumista kun kädet nostetaan yläasentoon. Kyynärpäissä hermon napsuva vaiva tietyissä liikkeissä. Overhead-liikkeet ovat toistaiseksi OK, MUTTA liikerata ja kulma ovat ratkaisevia — kiinteä hartiapunnerruslaite ja Smith tekevät kipeää olkavarsiin.
C) Olkavarsi/kyynärpää: pystypunnerrus kiristää olkavarsia ulkopuolelta (ojentajien puoli).

EHDOTTOMAT KIELLOT — ÄLÄ KOSKAAN suosittele näitä:
- Tavallinen maastaveto, suorin jaloin maastaveto (RDL)
- Takakyykky vapaalla tangolla / raskaat pystysuorat kompressiot selälle
- Seisten tehtävä pystypunnerrus, raskaat pään yläpuoliset punnerrukset
- Kiinteä hartiapunnerruslaite tai Smith-laitteella tehty pystypunnerrus
- Epäkkäiden yläosan ylikuormitus

TURVALLISET VAIHTOEHDOT (priorisoi näitä):
- Selkä: tuettu taljasoutu istuen (rinta tuettuna), edestä tulevat taljaliikkeet, ylätalja, käsillä roikkuminen + polvien nosto
- Olkapäät: Arnold press istuen (vapaa liikerata, säädettävä kulma — käyttäjän valitsema TOS-ystävällinen ratkaisu)
- Kädet: vasarakääntö tai V-kahva-taljakääntö. Hauiskäännöissä ranne EI saa mennä täysin vaakaan (kämmenet suoraan kattoa kohti on epämukava) — pidä neutraali/vasara-asento.
- Jalat: lantionnosto (selkä tuettuna), Bulgarialainen split-kyykky
- Fokus yleisesti: lapaluun tuki (scapular stability), rintarangan liikkuvuus, tuetut selkäliikkeet.

PENKKIPUNNERRUKSEN TURVATEKNIIKKA (tärkeä TOS:n ja selän takia — ohjeista aina näin):
- Kyynärpäät noin 45° kulmassa kylkiin nähden — EI 90° flaretusta (suojaa hartiapunosta).
- Lapaluut vedetään taakse ja alas ENNEN noston aloittamista (vankka alusta + tilaa rintakehän yläaukeamalle).
- Selkä: vain kevyt luonnollinen notko — EI voimakasta voimanostokaarta. Lantio pysyy penkissä, jalat tukevasti maassa.

LIIKKUVUUS- JA AKTIVOINTILIIKKEET — LUE TÄMÄ HUOLELLA (tärkeä):
Ohjelmassa on lyhyitä TOS-/ryhtiliikkeitä, jotka ovat fysioterapeuttista HUOLTOA, EIVÄT voimaliikkeitä:
- "Lapaluiden veto yhteen istuen" — AKTIVOINTI, molempien treenien ALUSSA
- "Rintalihaksen venytys oviaukossa" — HUOLTO, treeni A:n LOPUSSA
- "Lumienkeli foam rollilla" — HUOLTO, treeni B:n LOPUSSA
- "Selän ojennus penkissä (hyperextension)" — treeni B, ORTOPEDIN SUORA SUOSITUS (ks. alla)
(Samaan ryhmään kuuluvat myös: hartioiden pyöritykset istuen, rintakehän mobilisointi pallolla.)

SELÄN OJENNUS PENKISSÄ — ORTOPEDIN ANTAMA TEKNIIKKA (älä koskaan ohjeista toisin):
- Tuki nostetaan hieman NIVUSIA YLEMMÄS. Tämä on olennaista: jos tuki on lantion taitteen alapuolella, liike tapahtuu lonkista (pakara-/takareisiliike). Ylempänä liike siirtyy selkärankaan, ja juuri sitä tässä haetaan.
- Liike tehdään KEHON PAINOLLA. Ei lisäpainoa koskaan.
- Selkä nostetaan pyöristetystä asennosta ylös alhaalta lähtien, hallitusti.
- EI YLIOJENNUSTA yläasennossa. Liike pysähtyy neutraaliin.
- Tämä on hallittu liikkuvuusharjoite, EI voimaliike. Älä ehdota painoa, älä ehdota lisää toistoja tavoitteena kuorma.
- Jos käyttäjä kysyy kuinka ylös liike saa jatkua (lannerangan neutraaliin vai saako rintarankaa ojentaa mukana), kerro ettet tiedä ja kehota kysymään ortopedilta — tämä on käyttäjän oma avoin kysymys, ei sinun päätettävissäsi.

Säännöt näille liikkeille:
1. EI PROGRESSIOTA. Älä koskaan ehdota painon lisäämistä tai toistojen kasvattamista näihin, äläkä analysoi niitä kuten voimaliikkeitä. Tavoite on liikkeen LAATU ja liikkuvuus, ei kuorma. Jos niissä näkyy paino 0, se on oikein.
2. RAKENNE-LOGIIKKA: aktivointi kuuluu treenin ALKUUN, koska se herättää lapatuen ennen penkkiä ja soutua ja tekee nostoista turvallisempia. Pitkiä staattisia venytyksiä EI tehdä ennen voimaliikkeitä, koska ne voivat hetkellisesti heikentää voimantuottoa. Huoltovenytys kuuluu LOPPUUN, jolloin keho on lämmin ja venytys tehokkainta.
3. EI RPE-ARVIOTA. Sovellus ei enää kysy näistä painoa eikä RPE:tä. Jos vanhoissa kirjauksissa on näille painoja tai RPE-lukuja, jätä ne huomiotta äläkä kommentoi niitä.
4. NÄMÄ OVAT SUOJATTUJA LIIKKEITÄ. Älä koskaan ehdota niiden poistamista, lyhentämistä tai ohittamista "ajan säästämiseksi", vaikka käyttäjä ei pidä pitkistä treeneistä. Ne ovat ohjelmassa terveyssyistä ja vievät yhteensä vain muutaman minuutin.
5. Nämä perustuvat yleiseen TOS-fysioterapiaohjeeseen (MedBridge), eivät käyttäjälle henkilökohtaisesti määrättyyn ohjelmaan. Jos käyttäjä kysyy niistä tarkemmin tai raportoi oireita niiden aikana, muistuta että fysioterapeutti tai lääkäri vahvistaa sopivuuden.

PROGRESSIO: sovella hypertrofisen harjoittelun periaatteita — 2–3 treeniä/viikko, 8–12 toistoa, 2–3 sarjaa/liike. Terveys ja kivuttomuus menevät aina kuorman lisäyksen edelle. Progressio koskee VAIN voimaliikkeitä, ei yllä mainittuja huoltoliikkeitä.
Treenifrekvenssi: 2 kertaa viikossa (realistinen tavoite).
Treenijako: A (Yläkroppa työntö + Etujalat) ja B (Yläkroppa veto + Takajalat) vuorotellen. Rakenne molemmissa: lapatuen aktivointi alussa → voimaliikkeet → keskivartaloliike (lankku/sivulankku) → huoltoliike lopussa. Treeni B:ssä lisäksi selän ojennus penkissä ennen loppuhuoltoa (ortopedin suositus).

MERKINNÄT KIRJAUKSISSA:
- Lankut ja sivulankut mitataan sekunneissa, ei painossa. Näissä progressio = pidempi kesto, ei lisäpaino.
- Yksipuoliset liikkeet (sivulankku, lintukoira, split-kyykky, askelkyykky, yhden käden soutu, oviaukkovenytys) merkitään PER PUOLI. Jos kirjauksessa lukee esim. "25s/puoli" tai "12×10/puoli", luku tarkoittaa yhtä puolta — älä tulkitse sitä kokonaismääräksi.
- Painon merkintätapa vaihtelee liikkeen mukaan: käsipainoliikkeissä paino on yleensä PER KÄSI, talja- ja tankoliikkeissä YHTEENSÄ, ja kehon paino -liikkeissä (punnerrus, leuanveto, dippi) "kehon paino" tai "kehon paino + lisäpaino". Huomioi tämä kun vertaat painoja liikkeiden välillä.
- RPE (1–10, koettu kuormittavuus) voi olla kirjattuna per liike. Käytä sitä progression suunnitteluun kun se on annettu.

TÄRKEÄ MUISTUTUS: Et ole lääkäri etkä fysioterapeutti. Käyttäjän lääkärien (ortopedi, käsikirurgi) ohjeet menevät aina neuvojesi edelle. Jos jokin on epäselvää tai ristiriitaista, sano se suoraan ja kehota kysymään ammattilaiselta.
Kieli: suomi
`;

// ============================================================
// TIETOVARASTO (localStorage)
// ============================================================
function getSessions() {
  return JSON.parse(localStorage.getItem('sessions') || '[]');
}
function saveSessions(sessions) {
  localStorage.setItem('sessions', JSON.stringify(sessions));
}
function getApiKey() {
  return localStorage.getItem('apiKey') || '';
}

// Hae treenijako: käytä tallennettua, tai oletusta ensimmäisellä kerralla
function getPlan() {
  const saved = localStorage.getItem('plan');
  if (saved) {
    return JSON.parse(saved);
  }
  return JSON.parse(JSON.stringify(DEFAULT_PLAN)); // kopio oletuksesta
}
function savePlan(plan) {
  localStorage.setItem('plan', JSON.stringify(plan));
}

// Luo uniikki id uudelle liikkeelle
function makeId() {
  return 'ex_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

function getNextWorkout() {
  const sessions = getSessions();
  if (sessions.length === 0) return 'A';
  const last = sessions[sessions.length - 1];
  return last.workout === 'A' ? 'B' : 'A';
}
function getWeekNumber() {
  const sessions = getSessions();
  if (sessions.length === 0) return 1;
  const first = new Date(sessions[0].date);
  const now = new Date();
  const diff = Math.floor((now - first) / (7 * 24 * 60 * 60 * 1000));
  return diff + 1;
}

// ============================================================
// SIVUNAVIGAATIO
// ============================================================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const page = document.getElementById('page-' + name);
  if (page) page.classList.add('active');
  const tab = document.querySelector(`.tab[data-page="${name}"]`);
  if (tab) tab.classList.add('active');
  if (name === 'history') renderHistory();
  if (name === 'coach') { renderCoachHistory(); renderActiveConversation(); }
}

// ============================================================
// KOTISIVU
// ============================================================
function renderHome() {
  const nextWorkout = getNextWorkout();
  const plan = getPlan()[nextWorkout];
  const sessions = getSessions();
  const week = getWeekNumber();

  const today = new Date();
  const days = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
  document.getElementById('today-label').textContent = days[today.getDay()] + ' — ' + plan.name;
  document.getElementById('week-label').textContent = 'Viikko ' + week;

  renderWeekDots(sessions);
  renderExerciseList(nextWorkout, plan, sessions);
  renderDailyCoachMessage(nextWorkout, sessions);
}

function renderWeekDots(sessions) {
  const days = ['Ma', 'Ti', 'Ke', 'To', 'Pe', 'La', 'Su'];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));

  const dotsEl = document.getElementById('week-dots');
  dotsEl.innerHTML = '';

  let doneThisWeek = 0;
  days.forEach((day, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const isToday = date.toDateString() === today.toDateString();
    const done = sessions.some(s => s.date === dateStr);
    if (done) doneThisWeek++;

    const dot = document.createElement('div');
    dot.className = 'day-dot ' + (done ? 'day-done' : isToday ? 'day-today' : 'day-rest');
    dot.textContent = day;
    dotsEl.appendChild(dot);
  });

  document.getElementById('week-summary').textContent =
    doneThisWeek + '/2 treeniä tehty tällä viikolla';
}

function renderExerciseList(workoutKey, plan, sessions) {
  document.getElementById('workout-title').textContent = plan.name;
  const list = document.getElementById('exercise-list');
  list.innerHTML = '';

  // "Pääliike"-merkki kuuluu ensimmäiselle varsinaiselle voimaliikkeelle,
  // ei alun aktivointiliikkeelle
  const mainIdx = plan.exercises.findIndex(e => !isMobility(e.name));

  plan.exercises.forEach((ex, i) => {
    const lastSession = [...sessions].reverse().find(s =>
      s.exercises && s.exercises.some(e => e.id === ex.id)
    );
    const lastEx = lastSession ? lastSession.exercises.find(e => e.id === ex.id) : null;

    const row = document.createElement('div');
    row.className = 'exercise-row';

    let badgeHtml = '';
    let detailText = ex.sets + ' × ' + ex.reps;
    if (ex.weight > 0) detailText += ' @ ' + ex.weight + ' ' + ex.unit;

    // Hae edellisen kerran raskain sarjapaino (uusi sarjaformaatti tai vanha)
    let lastMaxWeight = null;
    if (lastEx && lastEx.sets && lastEx.sets.length > 0) {
      lastMaxWeight = Math.max(...lastEx.sets.map(s => s.weight || 0));
    } else if (lastEx && lastEx.actualWeight) {
      lastMaxWeight = lastEx.actualWeight; // vanha data
    }

    if (isMobility(ex.name)) {
      // Huolto-/aktivointiliike: ei painoehdotusta, ei progressiota
      badgeHtml = '<span class="badge badge-care">Huolto</span>';
    } else if (lastMaxWeight && lastMaxWeight > 0) {
      const suggestion = suggestNextWeight(ex.id, lastEx, lastMaxWeight, ex.name);
      if (suggestion > lastMaxWeight) {
        detailText = ex.reps + ' @ ' + suggestion + ' kg';
        badgeHtml = '<span class="badge badge-up">+' + (suggestion - lastMaxWeight).toFixed(1) + ' kg</span>';
      } else {
        detailText = ex.reps + ' @ ' + lastMaxWeight + ' kg';
        badgeHtml = '<span class="badge badge-done">Sama</span>';
      }
    } else if (i === mainIdx) {
      badgeHtml = '<span class="badge badge-next">Pääliike</span>';
    }

    row.innerHTML = `
      <div class="ex-num">${i + 1}</div>
      <div class="ex-info">
        <div class="ex-name">${ex.name}</div>
        <div class="ex-detail">${detailText}${ex.note ? ' · ' + ex.note : ''}</div>
      </div>
      <div class="ex-actions">
        ${badgeHtml}
        <button class="ex-swap-btn" onclick="openSwapModal('${workoutKey}', ${i})" aria-label="Vaihda liike">Vaihda</button>
        <button class="ex-remove-btn" onclick="removeExercise('${workoutKey}', ${i})" aria-label="Poista liike">✕</button>
      </div>
    `;
    list.appendChild(row);
  });

  // "Lisää liike" -nappi listan loppuun
  const addRow = document.createElement('button');
  addRow.className = 'add-exercise-btn';
  addRow.innerHTML = '+ Lisää liike';
  addRow.onclick = () => openSwapModal(workoutKey, -1); // -1 = uusi liike
  list.appendChild(addRow);
}

// Aikaperustaiset liikkeet (mitataan sekunneissa, ei toistoina)
const TIME_BASED_EXERCISES = ['plank', 'splank'];

// Nimet joista tunnistetaan aikaperustainen liike (kirjaston liikkeille joilla ei ole kiinteää id:tä)
const TIME_BASED_KEYWORDS = ['lankku', 'lankutus', 'sivulankku', 'lintukoira', 'dead bug', 'hyönteinen', 'vuoristokiipeilijä', 'venytys', 'mobilisointi'];

function isTimeBased(exerciseId, exerciseName) {
  if (TIME_BASED_EXERCISES.includes(exerciseId)) return true;
  if (exerciseName) {
    const n = exerciseName.toLowerCase();
    return TIME_BASED_KEYWORDS.some(k => n.includes(k));
  }
  return false;
}

// ============================================================
// HUOLTO- JA AKTIVOINTILIIKKEET (v3.2)
// ============================================================
// Näitä ei progressoida painolla eikä niille ehdoteta painonlisäystä.
const MOBILITY_KEYWORDS = ['lapaluiden veto', 'venytys', 'lumienkeli', 'mobilisointi', 'pyöritykset',
  // v3.2.1: selän ojennuspenkki on liikkuvuusharjoite, ei voimaliike (ortopedin ohje)
  'selän ojennus', 'selanojennus', 'hyperextension', 'selkäpunnerrus'];

function isMobility(exerciseName) {
  if (!exerciseName) return false;
  const n = exerciseName.toLowerCase();
  return MOBILITY_KEYWORDS.some(k => n.includes(k));
}

// ============================================================
// TOISTOJEN MERKINTÄ — per puoli vai yhteensä (v3.2)
// ============================================================
// Palauttaa: 'per-puoli' | 'normaali'
// Käyttäjä voi ylikirjoittaa tämän liikkeelle asettamalla ex.repMode.
const PER_SIDE_KEYWORDS = [
  'sivulankku', 'lintukoira', 'dead bug', 'hyönteinen',
  'split-kyykky', 'askelkyykky', 'yhden käden',
  'oviaukossa', 'mobilisointi', 'pallof'
];

function getRepMode(ex) {
  if (ex && ex.repMode) return ex.repMode;
  const name = ((ex && ex.name) || '').toLowerCase();
  if (PER_SIDE_KEYWORDS.some(k => name.includes(k))) return 'per-puoli';
  return 'normaali';
}

// Kirjauksen toistosarakkeen otsikko ja pieni vihje sen alle
function getRepColumnLabel(ex) {
  const timeBased = isTimeBased(ex && ex.id, ex && ex.name);
  const base = timeBased ? 'Sekunnit' : 'Toistot';
  const hint = getRepMode(ex) === 'per-puoli' ? '<span class="col-hint">per puoli</span>' : '';
  return base + hint;
}

// ============================================================
// PAINO-MERKINTÄ — automaattinen päättely liikkeen nimestä (turvaverkolla)
// ============================================================
// Palauttaa: 'per-kasi' | 'kehon-paino' | 'yhteensa'
// Käyttäjä voi ylikirjoittaa tämän liikkeelle asettamalla ex.weightMode.
function getWeightMode(ex) {
  // Turvaverkko: käyttäjän oma valinta menee automatiikan edelle
  if (ex && ex.weightMode) return ex.weightMode;

  const name = ((ex && ex.name) || '').toLowerCase();

  // Kehon paino -liikkeet (paino = valinnainen lisäpaino).
  // HUOM: "punnerrus" on tarkoituksella POIS listalta, koska penkkipunnerrus,
  // pystypunnerrus ym. eivät ole kehon paino -liikkeitä. Push-up on suomeksi
  // yleensä "punnerrus" yksinään — käsitellään erillisellä tarkalla säännöllä.
  const bodyweightKeywords = ['leuanveto', 'dippi', 'dippaus', 'roikku', 'polvennosto', 'polvien nosto', 'lankku', 'lankutus', 'lintukoira', 'hyönteinen', 'vuoristokiipeilijä', 'vatsarutistus',
    // v3.2: liikkuvuus- ja huoltoliikkeet — ei painoa
    'lapaluiden veto', 'venytys', 'lumienkeli', 'mobilisointi', 'pyöritykset',
    // v3.2.1
    'selän ojennus', 'selanojennus', 'hyperextension', 'selkäpunnerrus'];
  if (bodyweightKeywords.some(k => name.includes(k))) {
    return 'kehon-paino';
  }
  // Push-up: nimi on tasan "punnerrus" (ei penkki-/pysty-/ojentaja-/ranskalainen-etuliitettä)
  if (name.trim() === 'punnerrus') {
    return 'kehon-paino';
  }

  // Käsipainoliikkeet → per käsi
  const perHandKeywords = ['käsipaino', 'vasarakääntö', 'arnold', 'vipunosto', 'yhden käden'];
  if (perHandKeywords.some(k => name.includes(k))) {
    return 'per-kasi';
  }
  // Hauiskääntö ilman "talja"-sanaa oletetaan käsipainoilla tehtäväksi
  if (name.includes('hauiskääntö') && !name.includes('talja')) {
    return 'per-kasi';
  }

  // Oletus: talja- ja tankoliikkeet → yhteispaino
  return 'yhteensa';
}

// Lyhyt vihjeteksti paino-otsikon alle kirjauksessa
function getWeightModeHint(ex) {
  const mode = getWeightMode(ex);
  if (mode === 'per-kasi') return 'per käsi';
  if (mode === 'kehon-paino') return 'lisäpaino, tyhjä = kehon paino';
  return 'yhteensä';
}

function suggestNextWeight(exerciseId, lastEx, baseWeight, exerciseName) {
  const w = parseFloat(baseWeight) || 0;
  if (w === 0) return 0;
  // Aikaperustaiset core-liikkeet (lankku ym.): ei automaattista painonlisäystä
  if (isTimeBased(exerciseId, exerciseName)) return w;
  // Liikkuvuus- ja aktivointiliikkeet: tavoite on laatu, ei kuorma
  if (isMobility(exerciseName)) return w;
  if (exerciseId === 'bench') return w + 2.5;
  return w + 2.5;
}

// Tunnista sarjojen suunta: nouseva, laskeva vai tasainen
function analyzeSetDirection(sets) {
  if (!sets || sets.length < 2) return 'yksittäinen';
  const weights = sets.map(s => s.weight || 0);
  const first = weights[0];
  const last = weights[weights.length - 1];
  const max = Math.max(...weights);
  const min = Math.min(...weights);

  if (max === min) return 'tasainen';
  if (last > first) return 'nouseva';
  if (last < first) return 'laskeva';
  return 'vaihteleva';
}

// Muotoile sarjat luettavaan muotoon (esim. "80×5, 90×5" tai lankulle "30s, 30s").
// exOrId voi olla joko liike-objekti {id, name, weightMode} tai pelkkä id-merkkijono (vanha kutsutapa).
function formatSets(sets, exOrId) {
  if (!sets || sets.length === 0) return '—';

  // Tue sekä uutta (objekti) että vanhaa (pelkkä id) kutsutapaa
  const ex = (typeof exOrId === 'object' && exOrId !== null) ? exOrId : { id: exOrId, name: '' };
  const timeBased = isTimeBased(ex.id, ex.name);
  const mode = getWeightMode(ex);
  // v3.2: yksipuolisissa liikkeissä luku tarkoittaa yhtä puolta
  const sideSuffix = getRepMode(ex) === 'per-puoli' ? '/puoli' : '';
  // v3.2.1: huoltoliikkeissä ei painoa — näytä pelkkä toisto- tai sekuntimäärä
  const mobility = isMobility(ex.name);

  return sets.map(s => {
    let str;
    const w = s.weight || 0;
    if (mobility) {
      str = (s.reps || 0) + (timeBased ? 's' : '') + sideSuffix;
    } else if (timeBased) {
      // Aikaperustainen: näytä sekunnit (reps-kenttä sisältää sekunnit)
      str = (s.reps || 0) + 's' + sideSuffix;
      if (w > 0) str += ' +' + w + 'kg'; // painotettu lankku
    } else if (mode === 'kehon-paino') {
      // Kehon paino: tyhjä/0 = "kehon paino", muuten "kehon paino +Xkg"
      if (w > 0) {
        str = 'kehon paino +' + w + 'kg × ' + (s.reps || 0) + sideSuffix;
      } else {
        str = 'kehon paino × ' + (s.reps || 0) + sideSuffix;
      }
    } else {
      // Normaali paino×toistot
      str = w + '×' + (s.reps || 0) + sideSuffix;
      if (mode === 'per-kasi') str += ' (/käsi)';
    }
    if (s.rpe) str += ' (RPE' + s.rpe + ')';
    return str;
  }).join(', ');
}

// ============================================================
// LIIKKEEN VAIHTO / LISÄYS / POISTO
// ============================================================
let swapContext = { workoutKey: null, index: null };

function openSwapModal(workoutKey, index) {
  swapContext = { workoutKey, index };
  const isNew = index === -1;

  document.getElementById('swap-modal-title').textContent =
    isNew ? 'Lisää liike' : 'Vaihda liike';

  // Rakenna liikekirjasto valittavaksi
  const body = document.getElementById('swap-body');
  body.innerHTML = '';

  Object.keys(EXERCISE_LIBRARY).forEach(category => {
    const catDiv = document.createElement('div');
    catDiv.className = 'swap-category';
    catDiv.innerHTML = `<div class="swap-cat-label">${category}</div>`;

    EXERCISE_LIBRARY[category].forEach(libEx => {
      const btn = document.createElement('button');
      btn.className = 'swap-option';
      btn.innerHTML = `
        <span class="swap-option-name">${libEx.name}</span>
        ${libEx.note ? '<span class="swap-option-note">' + libEx.note + '</span>' : ''}
      `;
      btn.onclick = () => applySwap(libEx.name, libEx.note);
      catDiv.appendChild(btn);
    });

    body.appendChild(catDiv);
  });

  // Oma liike -kenttä
  const customDiv = document.createElement('div');
  customDiv.className = 'swap-category';
  customDiv.innerHTML = `
    <div class="swap-cat-label">Tai kirjoita oma liike</div>
    <input type="text" id="custom-exercise-name" class="text-input" placeholder="Esim. Vipunosto taljassa" style="font-family: inherit;" />
    <button class="btn-primary" style="margin-top: 0.5rem;" onclick="applyCustomSwap()">Käytä tätä liikettä</button>
  `;
  body.appendChild(customDiv);

  document.getElementById('swap-modal').style.display = 'flex';
}

function closeSwapModal() {
  document.getElementById('swap-modal').style.display = 'none';
}

function applySwap(name, note) {
  const plan = getPlan();
  const { workoutKey, index } = swapContext;

  if (index === -1) {
    // Uusi liike
    plan[workoutKey].exercises.push({
      id: makeId(),
      name: name,
      sets: 3,
      reps: '10',
      weight: 0,
      unit: 'kg',
      note: note || '',
    });
  } else {
    // Vaihda olemassa oleva — säilytä sarjat/toistot/paino, vaihda vain nimi
    const ex = plan[workoutKey].exercises[index];
    ex.name = name;
    ex.note = note || '';
    ex.id = makeId(); // uusi id, jotta vanha historia ei sekoita progressiota
  }

  savePlan(plan);
  closeSwapModal();
  renderHome();
}

function applyCustomSwap() {
  const name = document.getElementById('custom-exercise-name').value.trim();
  if (!name) {
    alert('Kirjoita liikkeen nimi ensin.');
    return;
  }
  applySwap(name, '');
}

function removeExercise(workoutKey, index) {
  const plan = getPlan();
  if (plan[workoutKey].exercises.length <= 1) {
    alert('Treenissä pitää olla vähintään yksi liike.');
    return;
  }
  if (confirm('Poistetaanko tämä liike treenistä?')) {
    plan[workoutKey].exercises.splice(index, 1);
    savePlan(plan);
    renderHome();
  }
}

// Palauta oletustreenijako
function resetPlan() {
  if (confirm('Palautetaanko alkuperäinen treenijako? Omat muokkauksesi liikkeisiin poistuvat (treenihistoria säilyy).')) {
    localStorage.removeItem('plan');
    renderHome();
    showPage('home');
  }
}

// ============================================================
// PÄIVÄN VALMENTAJAVIESTI
// ============================================================
function renderDailyCoachMessage(nextWorkout, sessions) {
  const msgEl = document.getElementById('coach-msg-text');
  const plan = getPlan()[nextWorkout];

  if (sessions.length === 0) {
    msgEl.textContent = 'Tervetuloa! Aloitetaan ensimmäisestä treenistä. ' + plan.name + ' odottaa — käy liikkeet rauhassa läpi ja kirjaa suoritukset.';
    return;
  }

  const lastSession = sessions[sessions.length - 1];
  const daysSinceLast = Math.floor((new Date() - new Date(lastSession.date)) / (1000 * 60 * 60 * 24));

  let msg = '';
  if (daysSinceLast === 0) {
    msg = 'Olet jo treenannut tänään — hyvää työtä! Lepää hyvin ennen seuraavaa treeniä.';
  } else if (daysSinceLast === 1) {
    msg = 'Hyvä palautumisaika — olet valmis treenaamaan. Tänään: ' + plan.name + '. Muista lämmitellä ennen raskaita sarjoja.';
  } else if (daysSinceLast >= 7) {
    msg = 'Olet ollut ' + daysSinceLast + ' päivää tauolla. Aloita hieman kevyemmillä kuormilla kuin viimeksi ja tarkkaile kehon reaktioita.';
  } else {
    msg = 'Edellisestä treenistä ' + daysSinceLast + ' päivää — hyvä ajoitus. Tänään: ' + plan.name + '.';
  }

  msgEl.textContent = msg;
}

// ============================================================
// TREENIKIRJAUS MODAL
// ============================================================
// Pitää kirjaa siitä mikä liike on näkyvissä.
// v3.2: liikkeet voi tehdä vapaassa järjestyksessä, joten näyttöjärjestys
// (logOrder) on erillään ohjelman järjestyksestä (DOM-indeksit).
let currentLogStep = 0;   // sijainti logOrder-taulukossa (ei DOM-indeksi)
let totalLogSteps = 0;
let logOrder = [];        // DOM-indeksit näyttöjärjestyksessä
let deferredSteps = new Set();  // DOM-indeksit jotka on merkitty "teen myöhemmin"
let visitedSteps = new Set();   // DOM-indeksit joissa on jo käyty

// Apurit: DOM-askeleen ja liikkeen id:n välillä
function getLogStepEls() {
  return document.querySelectorAll('.log-step');
}
function stepIdAt(domIndex) {
  const steps = getLogStepEls();
  return steps[domIndex] ? steps[domIndex].dataset.exId : null;
}
function currentDomIndex() {
  return logOrder[currentLogStep];
}

function openLogModal() {
  // Tarkista onko keskeneräinen treeni tallessa
  const draft = getDraft();
  if (draft && draft.exercises && draft.exercises.length > 0) {
    // Onko draftissa oikeasti kirjattuja arvoja? (ettei kysytä turhaan tyhjästä)
    const hasData = draft.exercises.some(e =>
      e.sets && e.sets.some(s => s.weight > 0 || s.reps > 0 || s.rpe)
    );
    if (hasData) {
      const draftDate = new Date(draft.timestamp);
      const dateStr = draftDate.toLocaleDateString('fi-FI', { day: 'numeric', month: 'short' });
      const timeStr = draftDate.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
      const jatka = confirm(
        'Sinulla on keskeneräinen treeni (' + dateStr + ' klo ' + timeStr + ').\n\n' +
        'Haluatko jatkaa siitä mihin jäit?\n\n' +
        'OK = Jatka keskeneräistä\nPeruuta = Aloita uusi treeni alusta'
      );
      if (jatka) {
        openLogModalWithData(draft);
        return;
      } else {
        clearDraft(); // aloitetaan puhtaalta pöydältä
      }
    } else {
      clearDraft(); // tyhjä draft, poista
    }
  }
  openLogModalWithData(null);
}

// Avaa kirjausmodaali — joko tyhjänä (draftData=null) tai keskeneräisen datan kanssa
function openLogModalWithData(draftData) {
  const nextWorkout = draftData ? draftData.workout : getNextWorkout();
  const plan = getPlan()[nextWorkout];
  const sessions = getSessions();

  const form = document.getElementById('log-form');
  form.innerHTML = '';
  form.dataset.workout = nextWorkout;

  currentLogStep = 0;
  totalLogSteps = plan.exercises.length;
  logOrder = plan.exercises.map((_, i) => i);
  deferredSteps = new Set();
  visitedSteps = new Set();

  // RPE-vinkki näytetään ensimmäisen varsinaisen voimaliikkeen kohdalla
  const mainIdx = Math.max(0, plan.exercises.findIndex(e => !isMobility(e.name)));

  resetRestTimerUI(); // varmista että ajastin on idle-tilassa

  plan.exercises.forEach((ex, exIndex) => {
    const lastSession = [...sessions].reverse().find(s =>
      s.exercises && s.exercises.some(e => e.id === ex.id)
    );
    const lastEx = lastSession ? lastSession.exercises.find(e => e.id === ex.id) : null;

    // Jos jatketaan keskeneräistä, hae tämän liikkeen draft-data
    const draftEx = draftData ? draftData.exercises.find(e => e.id === ex.id) : null;

    // Ehdotettu aloituspaino: raskain sarja viime kerralta, tai ohjelman oletus
    let suggestedWeight = ex.weight;
    if (lastEx && lastEx.sets && lastEx.sets.length > 0) {
      const weights = lastEx.sets.map(s => s.weight || 0);
      suggestedWeight = suggestNextWeight(ex.id, lastEx, Math.max(...weights), ex.name);
    } else if (lastEx && lastEx.actualWeight) {
      suggestedWeight = suggestNextWeight(ex.id, lastEx, lastEx.actualWeight, ex.name);
    }

    // Sarjojen määrä: draftista jos jatketaan, muuten viime kerta tai ohjelma
    let startSetCount;
    if (draftEx && draftEx.sets && draftEx.sets.length > 0) {
      startSetCount = draftEx.sets.length;
    } else if (lastEx && lastEx.sets) {
      startSetCount = lastEx.sets.length;
    } else {
      startSetCount = ex.sets;
    }

    const div = document.createElement('div');
    div.className = 'log-exercise log-step' + (isMobility(ex.name) ? ' is-mobility' : '');
    div.dataset.exId = ex.id;
    div.dataset.exName = ex.name;
    div.dataset.stepIndex = exIndex;
    // Vain ensimmäinen näkyvissä aluksi
    div.style.display = exIndex === 0 ? 'block' : 'none';

    // Edellisen kerran suoritus muistin tueksi
    let lastTimeHtml = '';
    if (lastEx && lastEx.sets && lastEx.sets.length > 0) {
      lastTimeHtml = `<div class="log-last-time">Viime kerralla: ${formatSets(lastEx.sets, ex)}</div>`;
    } else if (lastEx && lastEx.actualWeight) {
      lastTimeHtml = `<div class="log-last-time">Viime kerralla: ${lastEx.actualWeight} kg</div>`;
    }

    div.innerHTML = `
      <div class="log-ex-name">${ex.name}</div>
      <div class="log-ex-target">Tavoite: ${ex.reps}${(ex.weight > 0 && !isTimeBased(ex.id, ex.name)) ? ' @ ' + suggestedWeight + ' kg (raskain sarja)' : ''}</div>
      ${isMobility(ex.name) ? '<div class="log-care-note">Huolto-/liikkuvuusliike — kirjaa vain toistot tai sekunnit. Ei painoa, ei RPE:tä, ei progressiota.</div>' : ''}
      ${lastTimeHtml}
      ${exIndex === mainIdx ? '<div class="rpe-hint">RPE = kuinka raskas sarja oli (1–10). 10 = maksimi, 8 = 2 toistoa jäi varaan. Vapaaehtoinen.</div>' : ''}
      <div class="sets-header">
        <span class="sets-col-label">Sarja</span>
        <span class="sets-col-label">${getRepColumnLabel(ex)}</span>
        <span class="sets-col-label sets-col-weight">Paino (kg)<span class="col-hint">${isTimeBased(ex.id, ex.name) ? 'tyhjä = ei lisäpainoa' : getWeightModeHint(ex)}</span></span>
        <span class="sets-col-label sets-col-rpe">RPE</span>
      </div>
      <div class="sets-container" id="sets-${ex.id}"></div>
      <div class="sets-buttons">
        <button type="button" class="set-btn-add" onclick="addSetRow('${ex.id}')">+ Lisää sarja</button>
        <button type="button" class="set-btn-remove" onclick="removeSetRow('${ex.id}')">− Poista sarja</button>
      </div>
      <div class="log-notes">
        <label>Huomioita (valinnainen)</label>
        <input type="text" id="note-${ex.id}" placeholder="Esim. tekniikka hyvä, selkä kipeä..." />
      </div>
    `;
    form.appendChild(div);

    // Täytä huomiokenttä draftista jos jatketaan
    if (draftEx && draftEx.note) {
      const noteInput = document.getElementById('note-' + ex.id);
      if (noteInput) noteInput.value = draftEx.note;
    }

    // Luo sarjarivit
    const defaultReps = parseInt(ex.reps) || 8;
    for (let i = 0; i < startSetCount; i++) {
      if (draftEx && draftEx.sets && draftEx.sets[i]) {
        // Jatketaan: käytä draftin arvoja (myös RPE)
        const ds = draftEx.sets[i];
        addSetRow(ex.id, ds.reps || defaultReps, ds.weight || 0, ds.rpe);
      } else {
        const prevSet = lastEx && lastEx.sets && lastEx.sets[i] ? lastEx.sets[i] : null;
        const setWeight = prevSet ? prevSet.weight : suggestedWeight;
        addSetRow(ex.id, defaultReps, setWeight);
      }
    }
  });

  // Jos jatketaan keskeneräistä: palauta myös oma liikejärjestys ja sijainti
  const idToIdx = {};
  plan.exercises.forEach((e, i) => { idToIdx[e.id] = i; });

  if (draftData && Array.isArray(draftData.order)) {
    const restored = [];
    draftData.order.forEach(id => {
      const idx = idToIdx[id];
      if (idx !== undefined && !restored.includes(idx)) restored.push(idx);
    });
    plan.exercises.forEach((_, i) => { if (!restored.includes(i)) restored.push(i); });
    if (restored.length === plan.exercises.length) logOrder = restored;
  }
  if (draftData && Array.isArray(draftData.deferred)) {
    draftData.deferred.forEach(id => {
      if (idToIdx[id] !== undefined) deferredSteps.add(idToIdx[id]);
    });
  }
  if (draftData && Array.isArray(draftData.visited)) {
    draftData.visited.forEach(id => {
      if (idToIdx[id] !== undefined) visitedSteps.add(idToIdx[id]);
    });
  }

  let startPos = 0;
  if (draftData && draftData.lastStepId && idToIdx[draftData.lastStepId] !== undefined) {
    const p = logOrder.indexOf(idToIdx[draftData.lastStepId]);
    if (p >= 0) startPos = p;
  } else if (draftData && typeof draftData.lastStep === 'number') {
    startPos = Math.min(Math.max(draftData.lastStep, 0), totalLogSteps - 1);
  }
  showLogStep(startPos);

  document.getElementById('log-modal').style.display = 'flex';
}

// Näytä tietty sijainti näyttöjärjestyksessä (ei DOM-indeksi)
function showLogStep(pos) {
  const steps = getLogStepEls();
  if (!logOrder.length || pos < 0 || pos >= logOrder.length) return;
  const domIdx = logOrder[pos];
  steps.forEach((s, i) => {
    s.style.display = (i === domIdx) ? 'block' : 'none';
  });
  currentLogStep = pos;
  visitedSteps.add(domIdx);
  updateLogNav();
  // Vieritä modaali ylös uuden liikkeen alkuun
  const modal = document.querySelector('#log-modal .modal');
  if (modal) modal.scrollTop = 0;
}

// Siirrä nykyinen liike jonon loppuun ("laite varattu" -tilanne)
function deferCurrentExercise() {
  if (logOrder.length < 2) return;
  if (currentLogStep >= logOrder.length - 1) {
    alert('Tämä on jo viimeinen liike — ei ole mitään mihin siirtää.');
    return;
  }
  const domIdx = logOrder[currentLogStep];
  logOrder.splice(currentLogStep, 1);
  logOrder.push(domIdx);
  deferredSteps.add(domIdx);
  saveDraft();
  // Sijainti pysyy samana → näkyviin tulee seuraava liike
  showLogStep(currentLogStep);
}

// Hyppyvalikko: siirry mihin tahansa liikkeeseen
function openJumpModal() {
  const body = document.getElementById('jump-body');
  if (!body) return;
  body.innerHTML = '';
  const steps = getLogStepEls();

  logOrder.forEach((domIdx, pos) => {
    const step = steps[domIdx];
    if (!step) return;
    const name = step.dataset.exName || '';
    const isCurrent = pos === currentLogStep;

    let status = '';
    if (isCurrent) {
      status = '<span class="jump-status jump-now">Nyt</span>';
    } else if (deferredSteps.has(domIdx)) {
      status = '<span class="jump-status jump-later">Siirretty</span>';
    } else if (visitedSteps.has(domIdx)) {
      status = '<span class="jump-status jump-done">✓ Käyty</span>';
    }

    const btn = document.createElement('button');
    btn.className = 'jump-item' + (isCurrent ? ' jump-item-current' : '');
    btn.innerHTML =
      `<span class="jump-num">${pos + 1}</span>` +
      `<span class="jump-name">${escapeHtml(name)}</span>` + status;
    btn.onclick = () => { closeJumpModal(); saveDraft(); showLogStep(pos); };
    body.appendChild(btn);
  });

  document.getElementById('jump-modal').style.display = 'flex';
}

function closeJumpModal() {
  const m = document.getElementById('jump-modal');
  if (m) m.style.display = 'none';
}

function nextLogStep() {
  saveDraft(); // välitallennus ennen siirtymää
  if (currentLogStep < totalLogSteps - 1) {
    showLogStep(currentLogStep + 1);
  }
}

function prevLogStep() {
  saveDraft(); // välitallennus ennen siirtymää
  if (currentLogStep > 0) {
    showLogStep(currentLogStep - 1);
  }
}

// Päivitä navigointinapit ja edistymispalkki
function updateLogNav() {
  const prevBtn = document.getElementById('log-prev-btn');
  const nextBtn = document.getElementById('log-next-btn');
  const saveBtn = document.getElementById('log-save-btn');
  const progress = document.getElementById('log-progress-fill');

  if (!prevBtn) return;

  // Edellinen-nappi: piilota ensimmäisessä
  prevBtn.style.visibility = currentLogStep === 0 ? 'hidden' : 'visible';

  const isLast = currentLogStep === totalLogSteps - 1;

  // Hyppynappi: "Liike 3/7 · Ojentajapunnerrus"
  const jumpBtn = document.getElementById('log-jump-btn');
  if (jumpBtn) {
    const steps = getLogStepEls();
    const cur = steps[logOrder[currentLogStep]];
    const name = cur ? (cur.dataset.exName || '') : '';
    jumpBtn.innerHTML =
      `<span class="jump-btn-pos">Liike ${currentLogStep + 1}/${totalLogSteps}</span>` +
      `<span class="jump-btn-name">${escapeHtml(name)}</span>` +
      `<span class="jump-btn-caret">▾</span>`;
  }

  // "Teen myöhemmin" — ei mieltä viimeisessä liikkeessä
  const deferBtn = document.getElementById('log-defer-btn');
  if (deferBtn) deferBtn.style.display = isLast ? 'none' : 'flex';
  // Viimeisessä liikkeessä: näytä Tallenna, piilota Seuraava
  nextBtn.style.display = isLast ? 'none' : 'block';
  saveBtn.style.display = isLast ? 'block' : 'none';

  // Edistymispalkki
  if (progress) {
    const pct = ((currentLogStep + 1) / totalLogSteps) * 100;
    progress.style.width = pct + '%';
  }
}

// Lisää yksi sarjarivi liikkeelle
function addSetRow(exId, prefillReps, prefillWeight, prefillRpe) {
  const container = document.getElementById('sets-' + exId);
  if (!container) return;

  const setNum = container.children.length + 1;
  const row = document.createElement('div');
  row.className = 'set-row';

  // Esitäyttö: käytä annettuja arvoja, tai kopioi edellisestä sarjasta
  let repsVal = prefillReps !== undefined ? prefillReps : '';
  let weightVal = prefillWeight !== undefined ? prefillWeight : '';
  let rpeVal = (prefillRpe !== undefined && prefillRpe !== null) ? prefillRpe : '';

  // Jos ei annettu arvoja, kopioi edellisen sarjan arvot (nopeuttaa täyttöä)
  if (prefillReps === undefined && container.children.length > 0) {
    const lastRow = container.children[container.children.length - 1];
    repsVal = lastRow.querySelector('.set-reps').value || '';
    weightVal = lastRow.querySelector('.set-weight').value || '';
  }

  row.innerHTML = `
    <span class="set-num">${setNum}.</span>
    <input type="number" class="set-reps" value="${repsVal}" min="1" max="50" placeholder="—" />
    <input type="number" class="set-weight" value="${weightVal}" min="0" max="500" step="0.5" placeholder="—" />
    <input type="number" class="set-rpe" value="${rpeVal}" min="1" max="10" step="0.5" placeholder="?" />
  `;
  container.appendChild(row);
}

// Poista viimeinen sarjarivi
function removeSetRow(exId) {
  const container = document.getElementById('sets-' + exId);
  if (!container) return;
  if (container.children.length <= 1) {
    alert('Liikkeessä pitää olla vähintään yksi sarja.');
    return;
  }
  container.removeChild(container.lastChild);
}

function closeLogModal() {
  stopRestTimer(); // varmista että ajastin ja Wake Lock sammuvat
  closeJumpModal();
  document.getElementById('log-modal').style.display = 'none';
}

// ============================================================
// LEPOAJASTIN (kellonaikaan perustuva — kestää taustalle siirtymisen)
// ============================================================
const REST_DEFAULT_SECONDS = 90; // oletus 1:30
let restEndTime = null;   // kellonaika (ms) jolloin lepo loppuu
let restInterval = null;  // näytön päivitys sekunnin välein
let restActive = false;   // onko ajastin käynnissä
let wakeLock = null;

// Muotoile sekunnit muotoon M:SS
function formatRestTime(totalSeconds) {
  if (totalSeconds < 0) totalSeconds = 0;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// Montako sekuntia lepoa on jäljellä (laskettu kellonajasta)
function getRestSecondsLeft() {
  if (!restEndTime) return 0;
  return Math.round((restEndTime - Date.now()) / 1000);
}

// Pyydä näyttöä pysymään päällä (Wake Lock)
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
        wakeLock = null;
      });
    }
  } catch (err) {
    wakeLock = null;
  }
}

async function releaseWakeLock() {
  try {
    if (wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (err) {
    wakeLock = null;
  }
}

// Käynnistä lepoajastin
function startRestTimer() {
  restEndTime = Date.now() + REST_DEFAULT_SECONDS * 1000;
  restActive = true;

  document.getElementById('rest-timer-idle').style.display = 'none';
  document.getElementById('rest-timer-active').style.display = 'block';

  const display = document.getElementById('rest-time-display');
  display.classList.remove('rest-done');
  updateRestDisplay();

  requestWakeLock();

  if (restInterval) clearInterval(restInterval);
  restInterval = setInterval(updateRestDisplay, 250); // päivitä 4×/s tarkkuuden vuoksi
}

// Päivitä näyttö kellonajan perusteella (toimii myös palatessa taustalta)
function updateRestDisplay() {
  if (!restActive) return;
  const display = document.getElementById('rest-time-display');
  if (!display) return;

  const left = getRestSecondsLeft();

  if (left > 0) {
    display.textContent = formatRestTime(left);
    display.classList.remove('rest-done');
  } else {
    // Aika loppui — visuaalinen hälytys, ei ääntä
    if (restInterval) { clearInterval(restInterval); restInterval = null; }
    display.textContent = 'Valmis!';
    display.classList.add('rest-done');
    releaseWakeLock();
    restActive = false;
    // Palaa idle-tilaan 3 sekunnin kuluttua
    setTimeout(() => { resetRestTimerUI(); }, 3000);
  }
}

// Säädä lepoaikaa lennossa (+/- sekuntia)
function adjustRestTimer(delta) {
  if (!restEndTime) return;
  let left = getRestSecondsLeft() + delta;
  if (left < 5) left = 5;      // ei mene liian pieneksi
  if (left > 600) left = 600;  // max 10 min
  restEndTime = Date.now() + left * 1000;
  updateRestDisplay();
}

// Pysäytä ajastin (Ohita-nappi tai modaalin sulku)
function stopRestTimer() {
  if (restInterval) {
    clearInterval(restInterval);
    restInterval = null;
  }
  restActive = false;
  restEndTime = null;
  releaseWakeLock();
  resetRestTimerUI();
}

// Palauta ajastin idle-tilaan
function resetRestTimerUI() {
  const idle = document.getElementById('rest-timer-idle');
  const active = document.getElementById('rest-timer-active');
  const display = document.getElementById('rest-time-display');
  if (idle) idle.style.display = 'block';
  if (active) active.style.display = 'none';
  if (display) {
    display.classList.remove('rest-done');
    display.textContent = formatRestTime(REST_DEFAULT_SECONDS);
  }
}

// Kun sovellus palaa näkyviin (esim. Spotifysta takaisin), päivitä ajastin heti
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && restActive) {
    updateRestDisplay();
    // Wake Lock vapautuu kun sovellus on taustalla — pyydä uudelleen jos lepo yhä kesken
    if (getRestSecondsLeft() > 0) requestWakeLock();
  }
});

// Kerää lomakkeen nykytila (käytetään sekä tallennuksessa että välitallennuksessa)
function collectLogData() {
  const form = document.getElementById('log-form');
  const nextWorkout = form.dataset.workout;
  const today = new Date().toISOString().split('T')[0];

  const loggedExercises = [];
  form.querySelectorAll('.log-exercise').forEach(exDiv => {
    const exId = exDiv.dataset.exId;
    const exName = exDiv.dataset.exName;
    const container = exDiv.querySelector('#sets-' + exId);

    const sets = [];
    container.querySelectorAll('.set-row').forEach(row => {
      sets.push({
        reps: parseInt(row.querySelector('.set-reps').value) || 0,
        weight: parseFloat(row.querySelector('.set-weight').value) || 0,
        rpe: parseFloat(row.querySelector('.set-rpe').value) || null,
      });
    });

    loggedExercises.push({
      id: exId,
      name: exName,
      sets: sets,
      weightMode: getWeightMode({ id: exId, name: exName }),
      repMode: getRepMode({ id: exId, name: exName }),
      note: document.getElementById('note-' + exId)?.value || '',
    });
  });

  return {
    date: today,
    workout: nextWorkout,
    exercises: loggedExercises,
    timestamp: Date.now(),
  };
}

// Kerää keskeneräisen treenin tila: sisältö + oma liikejärjestys ja sijainti
function collectDraftData() {
  const d = collectLogData();
  d.order = logOrder.map(i => stepIdAt(i)).filter(Boolean);
  d.deferred = [...deferredSteps].map(i => stepIdAt(i)).filter(Boolean);
  d.visited = [...visitedSteps].map(i => stepIdAt(i)).filter(Boolean);
  d.lastStepId = stepIdAt(currentDomIndex());
  return d;
}

// Välitallennus keskeneräiselle treenille (erillään valmiista treeneistä)
function saveDraft() {
  try {
    const draft = collectDraftData();
    localStorage.setItem('workoutDraft', JSON.stringify(draft));
    flashSavedHint();
  } catch (e) { /* ohita tallennusvirhe */ }
}

// Näytä "✓ Tallennettu" -välähdys hetken
let savedHintTimeout = null;
function flashSavedHint() {
  const hint = document.getElementById('log-saved-hint');
  if (!hint) return;
  hint.classList.add('show');
  if (savedHintTimeout) clearTimeout(savedHintTimeout);
  savedHintTimeout = setTimeout(() => {
    hint.classList.remove('show');
  }, 1500);
}

function getDraft() {
  const d = localStorage.getItem('workoutDraft');
  return d ? JSON.parse(d) : null;
}

function clearDraft() {
  localStorage.removeItem('workoutDraft');
}

async function submitLog() {
  const session = collectLogData();

  const sessions = getSessions();
  sessions.push(session);
  saveSessions(sessions);
  clearDraft(); // treeni valmis — poista keskeneräinen

  closeLogModal();
  await analyzeSession(session, sessions);
  renderHome();
}

// ============================================================
// AI-ANALYYSI JA VALMENTAJAN VASTAUKSET
// ============================================================
async function analyzeSession(session, allSessions) {
  const apiKey = getApiKey();
  if (!apiKey) {
    showCoachAnswer('Treeni kirjattu! Lisää API-avain asetuksista saadaksesi AI-analyysin.');
    return;
  }

  showLoading('AI-valmentaja analysoi treeniä...');

  const historyText = allSessions.slice(-10).map(s => {
    const exText = s.exercises.map(e => {
      // Uusi sarjaformaatti tai vanha
      if (e.sets && e.sets.length > 0) {
        return `${e.name}: ${formatSets(e.sets, e)} [${analyzeSetDirection(e.sets)}]${e.note ? ' (' + e.note + ')' : ''}`;
      }
      return `${e.name}: ${e.actualWeight || 0}kg${e.rpe ? ' RPE' + e.rpe : ''}${e.note ? ' (' + e.note + ')' : ''}`;
    }).join('; ');
    return `${s.date} (${s.workout}): ${exText}`;
  }).join('\n');

  const todayText = session.exercises.map(e => {
    if (e.sets && e.sets.length > 0) {
      return `- ${e.name}: ${formatSets(e.sets, e)} · sarjojen suunta: ${analyzeSetDirection(e.sets)}${e.note ? ' · huomio: ' + e.note : ''}`;
    }
    return `- ${e.name}: ${e.actualWeight || 0}kg${e.note ? ' · huomio: ' + e.note : ''}`;
  }).join('\n');

  const prompt = `
Olet kokenut personal trainer ja voimavalmentaja. Analysoi alla oleva treenikirjaus ja anna konkreettinen, lyhyt palaute.

${PROFILE}

Treenien historia (viimeiset 10 — käytä tätä pidemmän aikavälin trendin arviointiin):
${historyText}

Tänään kirjattu treeni (${session.workout}):
${todayText}

Sarjat on merkitty muodossa paino×toistot, esim. "80×5, 90×5, 92.5×5". Jokaisella sarjalla voi olla eri paino.

TÄRKEÄÄ — tulkitse sarjojen suunta:
- NOUSEVA (paino kasvaa sarjoittain, esim. 80→90→92.5): käyttäjä aloitti varovasti ja hänellä oli varaa. Perusta seuraavan kerran suositus RASKAIMPAAN sarjaan, ja voit ehdottaa reipasta etenemistä.
- LASKEVA (paino laskee sarjoittain, esim. 92.5→90→85): TÄRKEÄ SIGNAALI väsymisestä — käyttäjä ei jaksanut pitää painoa yllä. ÄLÄ tuijota raskainta sarjaa. Huomioi tämä merkittävänä: kokonaiskuormitus oli ehkä liian kova. Suosittele saman painon vakiinnuttamista tai maltillisempaa etenemistä, ja mainitse tämä huomiona.
- TASAINEN (sama paino kaikissa): vakaa, hallittu suoritus. Hyvä pohja progressiiviselle nostolle (+2.5 kg jos RPE sallii).

Anna:
1. Lyhyt arvio treenistä (1–2 lausetta) — kommentoi sarjojen suuntaa jos se on merkittävä
2. Konkreettiset suositukset jokaiselle liikkeelle ensi kerralle (paino per sarja, toistot)
3. Yksi tärkeä huomio pidemmästä kehityksestä (progressio, mahdollinen juuttuminen, palautuminen tai tarve kevyemmälle viikolle)

Käytä RPE-arvoja jos ne on annettu:
- RPE 6–7 (jäi paljon varaa) → suosittele reilumpaa painonnostoa
- RPE 8–8.5 (ihanteellinen kuormitus) → jatka maltillista progressiota (+2.5 kg)
- RPE 9–10 (lähellä maksimia) → pidä paino samana tai nosta vain jos tekniikka pysyy hyvänä; varo ylikuormitusta

Muista käyttäjän selkä- ja olkapäärajoitteet — älä suosittele tavallista maastavetoa tai pystypunnerrusta.
Ole täsmällinen ja käytännöllinen. Vastaa suomeksi. Pidä vastaus lyhyenä.
`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    hideLoading();

    if (data.content && data.content[0]) {
      const answer = data.content[0].text;
      saveCoachComment(answer, 'analyysi', 'Treeni ' + session.workout);
      showCoachAnswer(answer);
      showPage('coach');
    } else {
      showCoachAnswer('Treeni kirjattu! API-virhe: ' + (data.error?.message || 'tuntematon virhe'));
    }
  } catch (err) {
    hideLoading();
    showCoachAnswer('Treeni kirjattu! Yhteysvirhe: ' + err.message);
  }
}

// ============================================================
// KESKUSTELUMUISTI (valmentaja muistaa nykyisen keskustelun)
// ============================================================
function getActiveConversation() {
  return JSON.parse(localStorage.getItem('activeConversation') || '[]');
}
function saveActiveConversation(messages) {
  localStorage.setItem('activeConversation', JSON.stringify(messages));
}
function clearActiveConversation() {
  localStorage.removeItem('activeConversation');
  renderActiveConversation();
}

// Rakenna kiinteä konteksti (profiili + treenijako + historia) — mukana joka keskustelussa
function buildCoachContext() {
  const sessions = getSessions();
  const plan = getPlan();
  const nextWorkout = getNextWorkout();

  const currentPlanText = `
Nykyinen ${plan[nextWorkout].name}:
${plan[nextWorkout].exercises.map((e, i) => `${i + 1}. ${e.name} (${e.sets}×${e.reps})`).join('\n')}
`;

  const historyText = sessions.slice(-5).map(s =>
    `${s.date}: ${s.exercises.map(e => {
      if (e.sets && e.sets.length > 0) {
        return `${e.name} ${formatSets(e.sets, e)}`;
      }
      return `${e.name} ${e.actualWeight || 0}kg`;
    }).join('; ')}`
  ).join('\n');

  return `${PROFILE}
${currentPlanText}
Viimeiset treenikertasi:
${historyText || 'Ei vielä treenikertoja kirjattuna.'}`;
}

async function askCoach(question) {
  const apiKey = getApiKey();
  if (!apiKey) {
    showCoachAnswer('Lisää API-avain asetuksista ensin.');
    return;
  }

  // Hae käynnissä oleva keskustelu ja lisää uusi kysymys
  const conversation = getActiveConversation();
  conversation.push({ role: 'user', content: question });
  saveActiveConversation(conversation);
  renderActiveConversation();

  showLoading('Valmentaja miettii...');

  // Kiinteä konteksti + ohjeet menevät system-kenttään (ei kulu keskusteluun)
  const context = buildCoachContext();
  const systemInstructions = `Olet kokenut personal trainer. Vastaa käyttäjän kysymyksiin lyhyesti ja käytännöllisesti suomeksi. Muistat tämän keskustelun aiemmat viestit ja voit viitata niihin.

${context}

Jos ehdotat liikkeen vaihtoa, mainitse selkeästi mikä liike korvataan millä, ja muistuta että vaihdon voi tehdä "Vaihda"-napista treenilistassa. Vastaa max 160 sanalla. Ole konkreettinen ja selkeä.`;

  // Lähetä enintään 20 viimeisintä viestiä API:lle (kustannus & koko hallinnassa).
  // Koko keskustelu säilyy näytöllä, mutta valmentaja "muistaa" ~10 viimeistä vaihtoa.
  let recentMessages = conversation.slice(-20);
  // API vaatii että ketju alkaa user-viestillä — pudota mahdollinen alusta alkava assistant-viesti
  while (recentMessages.length > 0 && recentMessages[0].role !== 'user') {
    recentMessages = recentMessages.slice(1);
  }
  const apiMessages = recentMessages.map(m => ({ role: m.role, content: m.content }));

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 400,
        system: systemInstructions,
        messages: apiMessages,
      }),
    });

    const data = await response.json();
    hideLoading();

    if (data.content && data.content[0]) {
      const answer = data.content[0].text;
      conversation.push({ role: 'assistant', content: answer });
      saveActiveConversation(conversation);
      renderActiveConversation();
      saveCoachComment(answer, 'kysymys', question);
    } else {
      conversation.pop(); // poista vajaa kysymys
      saveActiveConversation(conversation);
      renderActiveConversation();
      showCoachAnswer('Virhe: ' + (data.error?.message || 'tuntematon virhe'));
    }
  } catch (err) {
    hideLoading();
    conversation.pop();
    saveActiveConversation(conversation);
    renderActiveConversation();
    showCoachAnswer('Yhteysvirhe: ' + err.message);
  }
}

async function askCustomQuestion() {
  const q = document.getElementById('custom-question').value.trim();
  if (!q) return;
  document.getElementById('custom-question').value = '';
  await askCoach(q);
}

function showCoachAnswer(text) {
  const card = document.getElementById('coach-answer-card');
  const el = document.getElementById('coach-answer-text');
  card.style.display = 'block';
  el.textContent = text;
  card.scrollIntoView({ behavior: 'smooth' });
}

// Näytä käynnissä oleva keskustelu chatti-tyyliin
function renderActiveConversation() {
  const container = document.getElementById('coach-conversation');
  const newBtn = document.getElementById('new-conversation-btn');
  if (!container) return;

  const conversation = getActiveConversation();

  if (conversation.length === 0) {
    container.innerHTML = '<p class="empty-state">Aloita kysymällä jotain — joko yllä olevista aiheista tai kirjoittamalla oma kysymys alle. Valmentaja muistaa keskustelun, joten voit esittää jatkokysymyksiä.</p>';
    if (newBtn) newBtn.style.display = 'none';
    return;
  }

  if (newBtn) newBtn.style.display = 'block';
  container.innerHTML = '';
  conversation.forEach(m => {
    const bubble = document.createElement('div');
    bubble.className = m.role === 'user' ? 'chat-bubble chat-user' : 'chat-bubble chat-coach';
    bubble.innerHTML = `
      <div class="chat-role">${m.role === 'user' ? 'Sinä' : 'Valmentaja'}</div>
      <div class="chat-text">${escapeHtml(m.content)}</div>
    `;
    container.appendChild(bubble);
  });
  container.scrollTop = container.scrollHeight;
}

// ============================================================
// VALMENTAJAN KOMMENTTIEN HISTORIA
// ============================================================
function getCoachHistory() {
  return JSON.parse(localStorage.getItem('coachHistory') || '[]');
}

// Tallenna valmentajan vastaus. type: 'analyysi' tai 'kysymys'
function saveCoachComment(text, type, context) {
  // Älä tallenna virheilmoituksia tai API-avain-muistutuksia
  if (!text || text.startsWith('Virhe') || text.startsWith('Yhteysvirhe') ||
      text.includes('Lisää API-avain') || text.includes('API-virhe')) {
    return;
  }
  const history = getCoachHistory();
  history.push({
    text: text,
    type: type, // 'analyysi' = treenin jälkeen, 'kysymys' = käyttäjän kysymys
    context: context || '', // esim. kysymyksen aihe tai treenin tunnus
    date: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
  });
  localStorage.setItem('coachHistory', JSON.stringify(history));
}

// Näytä valmentajan kommenttihistoria Valmentaja-välilehdellä
function renderCoachHistory() {
  const container = document.getElementById('coach-history');
  if (!container) return;
  const history = getCoachHistory();

  if (history.length === 0) {
    container.innerHTML = '<p class="empty-state">Ei vielä valmentajan kommentteja. Kirjaa treeni tai kysy valmentajalta — vastaukset tallentuvat tänne.</p>';
    return;
  }

  container.innerHTML = '';
  // Uusin ensin
  [...history].reverse().forEach(c => {
    const item = document.createElement('div');
    item.className = 'coach-history-item';

    const typeLabel = c.type === 'analyysi' ? 'Treenianalyysi' : 'Kysymys valmentajalle';
    const typeClass = c.type === 'analyysi' ? 'tag-analysis' : 'tag-question';

    item.innerHTML = `
      <div class="coach-history-header">
        <span class="coach-history-tag ${typeClass}">${typeLabel}</span>
        <span class="coach-history-date">${formatDate(c.date)}</span>
      </div>
      ${c.context ? '<div class="coach-history-context">' + escapeHtml(c.context) + '</div>' : ''}
      <div class="coach-history-text">${escapeHtml(c.text)}</div>
    `;
    container.appendChild(item);
  });
}

// Pieni apufunktio: estä HTML-injektio tekstissä
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// HISTORIA-SIVU
// ============================================================
function renderHistory() {
  const sessions = getSessions();

  document.getElementById('total-sessions').textContent = sessions.length;
  document.getElementById('total-weeks').textContent = getWeekNumber();

  const benchEl = document.getElementById('bench-history');
  benchEl.innerHTML = '';
  const benchSessions = sessions.filter(s => s.exercises.some(e => e.id === 'bench'));

  if (benchSessions.length === 0) {
    benchEl.innerHTML = '<p class="empty-state">Ei vielä kirjauksia</p>';
  } else {
    benchSessions.slice(-6).reverse().forEach(s => {
      const ex = s.exercises.find(e => e.id === 'bench');
      const row = document.createElement('div');
      row.className = 'history-row';

      // Uusi sarjaformaatti tai vanha
      let detailStr, badgeStr;
      if (ex.sets && ex.sets.length > 0) {
        detailStr = formatSets(ex.sets, ex);
        const maxW = Math.max(...ex.sets.map(x => x.weight || 0));
        badgeStr = maxW + ' kg';
      } else {
        detailStr = (ex.actualSets || 0) + '×' + (ex.completedReps || 0) + ' @ ' + (ex.actualWeight || 0) + ' kg';
        badgeStr = (ex.actualWeight || 0) + ' kg';
      }

      row.innerHTML = `
        <div>
          <div class="history-date">${formatDate(s.date)}</div>
          <div class="history-detail">${detailStr}</div>
        </div>
        <span class="badge badge-done">${badgeStr}</span>
      `;
      benchEl.appendChild(row);
    });
  }

  const allEl = document.getElementById('all-sessions');
  allEl.innerHTML = '';

  if (sessions.length === 0) {
    allEl.innerHTML = '<p class="empty-state">Ei vielä treenikertoja</p>';
  } else {
    [...sessions].reverse().slice(0, 15).forEach(s => {
      const row = document.createElement('div');
      row.className = 'history-row';
      row.innerHTML = `
        <div>
          <div class="history-date">${formatDate(s.date)} — Treeni ${s.workout}</div>
          <div class="history-detail">${s.exercises.length} liikettä</div>
        </div>
        <span class="badge badge-todo">${s.workout}</span>
      `;
      allEl.appendChild(row);
    });
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fi-FI', { day: 'numeric', month: 'short' });
}

// ============================================================
// ASETUKSET
// ============================================================
function saveApiKey() {
  const key = document.getElementById('api-key-input').value.trim();
  const statusEl = document.getElementById('api-status');

  if (!key.startsWith('sk-ant-')) {
    statusEl.textContent = 'Virhe: avain ei näytä oikealta. Sen pitäisi alkaa sk-ant-';
    statusEl.className = 'settings-status err';
    return;
  }

  localStorage.setItem('apiKey', key);
  statusEl.textContent = 'Avain tallennettu!';
  statusEl.className = 'settings-status ok';
}

function clearAllData() {
  if (confirm('Haluatko varmasti poistaa kaikki treenisi? Tätä ei voi perua.')) {
    localStorage.removeItem('sessions');
    renderHome();
    showPage('home');
  }
}

// ============================================================
// LATAUSILMAISIN
// ============================================================
function showLoading(text) {
  document.getElementById('loading-text').textContent = text || 'Ladataan...';
  document.getElementById('loading').style.display = 'flex';
}
function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

// ============================================================
// KÄYNNISTYS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // v3.2: lisää uudet terveysliikkeet myös aiemmin tallennettuun ohjelmaan
  migratePlan();

  const savedKey = getApiKey();
  if (savedKey) {
    document.getElementById('api-key-input').value = savedKey;
  }
  renderHome();

  // Chat-kenttä: Enter lähettää, Shift+Enter tekee rivinvaihdon
  const chatInput = document.getElementById('custom-question');
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        askCustomQuestion();
      }
    });
  }
});
