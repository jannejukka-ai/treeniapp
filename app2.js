// ============================================================
// TREENIAPP — Sovelluksen päälogiikka (v2: muokattavat liikkeet)
// ============================================================

// OLETUS-treenijako. Käytetään vain ensimmäisellä kerralla.
// Tämän jälkeen käyttäjän omat muutokset tallentuvat muistiin.
const DEFAULT_PLAN = {
  A: {
    name: 'Treeni A — Yläkroppa (työntö) + Etujalat',
    exercises: [
      { id: 'bench', name: 'Penkkipunnerrus', sets: 3, reps: '5–8', weight: 90, unit: 'kg', note: 'Pääliike voimalle' },
      { id: 'lat', name: 'Ylätalja / Leuanveto', sets: 3, reps: '8–10', weight: 70, unit: 'kg', note: 'Yläselkä vastapainoksi' },
      { id: 'bsq', name: 'Bulgarialainen split-kyykky', sets: 3, reps: '8–10/jalka', weight: 0, unit: 'kg', note: 'Etureidet & tasapaino — selkäystävällinen' },
      { id: 'tri', name: 'Ojentajapunnerrus taljassa', sets: 2, reps: '10–12', weight: 25, unit: 'kg', note: 'Penkin avuksi (dipin sijaan, säästää olkapäitä)' },
      { id: 'plank', name: 'Lankku', sets: 3, reps: '30–45 s', weight: 0, unit: 'kg', note: 'Keskivartalon tuki — selkäystävällinen' },
    ]
  },
  B: {
    name: 'Treeni B — Yläkroppa (veto) + Takajalat',
    exercises: [
      { id: 'hip', name: 'Lantionnosto', sets: 3, reps: '10–12', weight: 40, unit: 'kg', note: 'Pakarat & takareidet — selkäystävällinen (selkä tuettuna)' },
      { id: 'row', name: 'Kulmasoutu', sets: 3, reps: '8–10', weight: 70, unit: 'kg', note: 'Keskiselkä & penkin tukilihakset' },
      { id: 'ohp', name: 'Hartiaprässi istuen (selkätuki)', sets: 2, reps: '10–12', weight: 40, unit: 'kg', note: 'Olkapäät — selkä tuettuna' },
      { id: 'curl', name: 'Hauiskääntö', sets: 2, reps: '10–12', weight: 20, unit: 'kg', note: 'Käsivarren tasapaino' },
      { id: 'splank', name: 'Sivulankku', sets: 2, reps: '20–30 s/puoli', weight: 0, unit: 'kg', note: 'Vinot vatsalihakset — tukee selkää sivusuunnassa' },
    ]
  }
};

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
    { name: 'Ylätalja leveä ote', note: '' },
    { name: 'Kulmasoutu', note: '' },
    { name: 'Taljasoutu istuen', note: 'Selkäystävällinen' },
    { name: 'Yhden käden käsipainosoutu', note: 'Selkäystävällinen' },
    { name: 'Leuanveto', note: 'Kehon paino' },
  ],
  'Jalat (selkäystävällinen)': [
    { name: 'Lantionnosto', note: 'Selkäystävällinen — pakarat & takareidet' },
    { name: 'Bulgarialainen split-kyykky', note: 'Selkäystävällinen' },
    { name: 'Askelkyykky', note: 'Selkäystävällinen' },
    { name: 'Jalkaprässi', note: 'Selkä tuettuna' },
    { name: 'Reiden ojennus (laite)', note: 'Polviystävällinen kevyellä' },
    { name: 'Reiden koukistus (laite)', note: 'Selkäystävällinen — takareidet' },
  ],
  'Jalat (varo selkää)': [
    { name: 'Kyykky', note: 'Varo selkää' },
    { name: 'Pohjenousu', note: '' },
  ],
  'Olkapäät': [
    { name: 'Hartiaprässi istuen (selkätuki)', note: 'Selkäystävällinen' },
    { name: 'Käsipainohartiaprässi istuen', note: 'Selkäystävällinen' },
    { name: 'Vipunosto sivulle', note: 'Kevyt olkakuorma' },
    { name: 'Vipunosto eteen', note: '' },
  ],
  'Kädet': [
    { name: 'Dippi', note: 'Kehon paino' },
    { name: 'Hauiskääntö', note: '' },
    { name: 'Vasarakääntö', note: '' },
    { name: 'Ojentajapunnerrus taljassa', note: '' },
    { name: 'Ranskalainen punnerrus', note: '' },
  ],
  'Vatsa/keskivartalo': [
    { name: 'Lankku', note: 'Selkäystävällinen' },
    { name: 'Sivulankku', note: 'Selkäystävällinen — vinot vatsalihakset' },
    { name: 'Lintukoira', note: 'Selkäystävällinen — fysioterapiassa suositeltu' },
    { name: 'Kuollut hyönteinen (dead bug)', note: 'Selkäystävällinen — syvät vatsalihakset' },
    { name: 'Vatsarutistus', note: '' },
    { name: 'Polvien nosto riipunnasta', note: 'Alavatsa' },
    { name: 'Vuoristokiipeilijä', note: 'Core + syke' },
  ],
};

// Profiilin tiedot AI-valmentajalle
const PROFILE = `
Käyttäjä: JJ
Tavoitteet: lihasmassan kasvu, voiman lisääminen, terveyden ylläpito
Rajoitteet: selkävaurio JA olkapäät säästettävä. ÄLÄ suosittele tavallista maastavetoa, suorin jaloin maastavetoa (RDL) äläkä seisten tehtävää pystypunnerrusta. Turvalliset vaihtoehdot: lantionnosto (selkä tuettuna), Bulgarialainen split-kyykky, hartiaprässi istuen selkätuella.
Treenifrekvenssi: 2 kertaa viikossa (realistinen tavoite)
Treenijako: A (Yläkroppa työntö + Etujalat) ja B (Yläkroppa veto + Takajalat) vuorotellen. Molemmissa on keskivartaloliike (lankku/sivulankku) lopussa — tärkeä selän tuelle.
Huom: lankut ja sivulankut mitataan sekunneissa, ei painossa. Näissä progressio tarkoittaa pidempää kestoaikaa, ei lisäpainoa.
RPE: käyttäjä voi kirjata jokaiselle liikkeelle RPE-arvon (1–10, koettu kuormittavuus). Käytä sitä progression suunnitteluun kun se on annettu.
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
  if (name === 'coach') renderCoachHistory();
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

    if (lastMaxWeight && lastMaxWeight > 0) {
      const suggestion = suggestNextWeight(ex.id, lastEx, lastMaxWeight);
      if (suggestion > lastMaxWeight) {
        detailText = ex.reps + ' @ ' + suggestion + ' kg';
        badgeHtml = '<span class="badge badge-up">+' + (suggestion - lastMaxWeight).toFixed(1) + ' kg</span>';
      } else {
        detailText = ex.reps + ' @ ' + lastMaxWeight + ' kg';
        badgeHtml = '<span class="badge badge-done">Sama</span>';
      }
    } else if (i === 0) {
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
function isTimeBased(exerciseId) {
  return TIME_BASED_EXERCISES.includes(exerciseId);
}

function suggestNextWeight(exerciseId, lastEx, baseWeight) {
  const w = parseFloat(baseWeight) || 0;
  if (w === 0) return 0;
  // Aikaperustaiset core-liikkeet (lankku ym.): ei automaattista painonlisäystä
  if (isTimeBased(exerciseId)) return w;
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

// Muotoile sarjat luettavaan muotoon (esim. "80×5, 90×5" tai lankulle "30s, 30s")
function formatSets(sets, exerciseId) {
  if (!sets || sets.length === 0) return '—';
  const timeBased = exerciseId && isTimeBased(exerciseId);
  return sets.map(s => {
    let str;
    if (timeBased) {
      // Aikaperustainen: näytä sekunnit (reps-kenttä sisältää sekunnit)
      str = (s.reps || 0) + 's';
      if (s.weight > 0) str += ' +' + s.weight + 'kg'; // painotettu lankku
    } else {
      str = (s.weight || 0) + '×' + (s.reps || 0);
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
// Pitää kirjaa siitä mikä liike on näkyvissä
let currentLogStep = 0;
let totalLogSteps = 0;

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
      suggestedWeight = suggestNextWeight(ex.id, lastEx, Math.max(...weights));
    } else if (lastEx && lastEx.actualWeight) {
      suggestedWeight = suggestNextWeight(ex.id, lastEx, lastEx.actualWeight);
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
    div.className = 'log-exercise log-step';
    div.dataset.exId = ex.id;
    div.dataset.exName = ex.name;
    div.dataset.stepIndex = exIndex;
    // Vain ensimmäinen näkyvissä aluksi
    div.style.display = exIndex === 0 ? 'block' : 'none';

    // Edellisen kerran suoritus muistin tueksi
    let lastTimeHtml = '';
    if (lastEx && lastEx.sets && lastEx.sets.length > 0) {
      lastTimeHtml = `<div class="log-last-time">Viime kerralla: ${formatSets(lastEx.sets, ex.id)}</div>`;
    } else if (lastEx && lastEx.actualWeight) {
      lastTimeHtml = `<div class="log-last-time">Viime kerralla: ${lastEx.actualWeight} kg</div>`;
    }

    div.innerHTML = `
      <div class="log-step-header">
        <span class="log-step-counter">Liike ${exIndex + 1}/${totalLogSteps}</span>
      </div>
      <div class="log-ex-name">${ex.name}</div>
      <div class="log-ex-target">Tavoite: ${ex.reps}${(ex.weight > 0 && !isTimeBased(ex.id)) ? ' @ ' + suggestedWeight + ' kg (raskain sarja)' : ''}</div>
      ${lastTimeHtml}
      ${exIndex === 0 ? '<div class="rpe-hint">RPE = kuinka raskas sarja oli (1–10). 10 = maksimi, 8 = 2 toistoa jäi varaan. Vapaaehtoinen.</div>' : ''}
      <div class="sets-header">
        <span class="sets-col-label">Sarja</span>
        <span class="sets-col-label">${isTimeBased(ex.id) ? 'Sekunnit' : 'Toistot'}</span>
        <span class="sets-col-label">Paino (kg)</span>
        <span class="sets-col-label">RPE</span>
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

  // Jos jatketaan keskeneräistä, siirry siihen liikkeeseen mihin jäätiin
  if (draftData && typeof draftData.lastStep === 'number') {
    const step = Math.min(draftData.lastStep, totalLogSteps - 1);
    showLogStep(step);
  } else {
    updateLogNav();
  }
  document.getElementById('log-modal').style.display = 'flex';
}

// Näytä tietty askel (liike)
function showLogStep(stepIndex) {
  const steps = document.querySelectorAll('.log-step');
  if (stepIndex < 0 || stepIndex >= steps.length) return;
  steps.forEach((s, i) => {
    s.style.display = (i === stepIndex) ? 'block' : 'none';
  });
  currentLogStep = stepIndex;
  updateLogNav();
  // Vieritä modaali ylös uuden liikkeen alkuun
  const modal = document.querySelector('#log-modal .modal');
  if (modal) modal.scrollTop = 0;
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
      note: document.getElementById('note-' + exId)?.value || '',
    });
  });

  return {
    date: today,
    workout: nextWorkout,
    exercises: loggedExercises,
    timestamp: Date.now(),
    lastStep: currentLogStep,
  };
}

// Välitallennus keskeneräiselle treenille (erillään valmiista treeneistä)
function saveDraft() {
  try {
    const draft = collectLogData();
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
  delete session.lastStep; // valmiiseen treeniin ei tarvita askelmerkintää

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
        return `${e.name}: ${formatSets(e.sets, e.id)} [${analyzeSetDirection(e.sets)}]${e.note ? ' (' + e.note + ')' : ''}`;
      }
      return `${e.name}: ${e.actualWeight || 0}kg${e.rpe ? ' RPE' + e.rpe : ''}${e.note ? ' (' + e.note + ')' : ''}`;
    }).join('; ');
    return `${s.date} (${s.workout}): ${exText}`;
  }).join('\n');

  const todayText = session.exercises.map(e => {
    if (e.sets && e.sets.length > 0) {
      return `- ${e.name}: ${formatSets(e.sets, e.id)} · sarjojen suunta: ${analyzeSetDirection(e.sets)}${e.note ? ' · huomio: ' + e.note : ''}`;
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

async function askCoach(question) {
  const apiKey = getApiKey();
  if (!apiKey) {
    showCoachAnswer('Lisää API-avain asetuksista ensin.');
    return;
  }

  const sessions = getSessions();
  const plan = getPlan();
  const nextWorkout = getNextWorkout();

  // Kerro valmentajalle nykyinen treenijako, jotta se voi ehdottaa muutoksia
  const currentPlanText = `
Nykyinen ${plan[nextWorkout].name}:
${plan[nextWorkout].exercises.map((e, i) => `${i + 1}. ${e.name} (${e.sets}×${e.reps})`).join('\n')}
`;

  const historyText = sessions.slice(-5).map(s =>
    `${s.date}: ${s.exercises.map(e => {
      if (e.sets && e.sets.length > 0) {
        return `${e.name} ${formatSets(e.sets, e.id)}`;
      }
      return `${e.name} ${e.actualWeight || 0}kg`;
    }).join('; ')}`
  ).join('\n');

  showLoading('Valmentaja miettii...');

  const prompt = `
Olet kokenut personal trainer. Vastaa käyttäjän kysymykseen lyhyesti ja käytännöllisesti suomeksi.

${PROFILE}

${currentPlanText}

Viimeiset treenikertasi:
${historyText || 'Ei vielä treenikertoja kirjattuna.'}

Käyttäjän kysymys: ${question}

Jos ehdotat liikkeen vaihtoa, mainitse selkeästi mikä liike korvataan millä. Muistuta käyttäjää että hän voi tehdä vaihdon "Vaihda"-napista treenilistassa.
Vastaa max 160 sanalla. Ole konkreettinen ja selkeä.
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
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    hideLoading();

    if (data.content && data.content[0]) {
      const answer = data.content[0].text;
      saveCoachComment(answer, 'kysymys', question);
      showCoachAnswer(answer);
    } else {
      showCoachAnswer('Virhe: ' + (data.error?.message || 'tuntematon virhe'));
    }
  } catch (err) {
    hideLoading();
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
        detailStr = formatSets(ex.sets, ex.id);
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
  const savedKey = getApiKey();
  if (savedKey) {
    document.getElementById('api-key-input').value = savedKey;
  }
  renderHome();
});
