// ============================================================
// TREENIAPP — Sovelluksen päälogiikka
// ============================================================

// Treenijako: A ja B vuorottelevat
const WORKOUT_PLAN = {
  A: {
    name: 'Treeni A — Push + jalat',
    exercises: [
      { id: 'bench', name: 'Penkkipunnerrus', sets: 5, reps: '5', weight: 90, unit: 'kg', note: 'Pääliike — tärkein' },
      { id: 'lat', name: 'Ylätalja leveä ote', sets: 4, reps: '8–10', weight: 70, unit: 'kg', note: '' },
      { id: 'bsq', name: 'Bulgarian split-kyykky', sets: 3, reps: '10', weight: 0, unit: 'kg', note: 'Selkäystävällinen vaihtoehto kyykylle' },
      { id: 'dip', name: 'Dippi', sets: 3, reps: 'maks', weight: 0, unit: 'kg', note: 'Kehon paino' },
    ]
  },
  B: {
    name: 'Treeni B — Pull + yläkroppa',
    exercises: [
      { id: 'row', name: 'Kulmasoutu', sets: 4, reps: '8', weight: 70, unit: 'kg', note: '' },
      { id: 'rdl', name: 'Rumanian maastaveto', sets: 3, reps: '10', weight: 60, unit: 'kg', note: 'Pidä selkä suorana koko ajan' },
      { id: 'ohp', name: 'Hartiaprässi', sets: 4, reps: '8', weight: 50, unit: 'kg', note: '' },
      { id: 'curl', name: 'Hauiskääntö', sets: 3, reps: '10–12', weight: 20, unit: 'kg', note: 'Käsipainot' },
    ]
  }
};

// Profiilin tiedot AI-valmentajalle
const PROFILE = `
Käyttäjä: JJ
Tavoitteet: lihasmassan kasvu, voiman lisääminen, terveyden ylläpito
Rajoitteet: selkävaurio — kyykky ja maastaveto vain sovellettuina vaihtoehtoliikkeinä (esim. Bulgarian split-kyykky, Rumanian maastaveto kevyellä kuormalla)
Treenifrekvenssi: 2–3 kertaa viikossa
Treenijako: A (Push + jalat sovellettu) ja B (Pull + yläkroppa) vuorotellen
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
}

// ============================================================
// KOTISIVU
// ============================================================
function renderHome() {
  const nextWorkout = getNextWorkout();
  const plan = WORKOUT_PLAN[nextWorkout];
  const sessions = getSessions();
  const week = getWeekNumber();

  // Otsikko
  const today = new Date();
  const days = ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'];
  document.getElementById('today-label').textContent = days[today.getDay()] + ' — ' + plan.name;
  document.getElementById('week-label').textContent = 'Viikko ' + week;

  // Viikkopisteet
  renderWeekDots(sessions);

  // Liikkeet
  renderExerciseList(plan, sessions);

  // Valmentajan viesti
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

function renderExerciseList(plan, sessions) {
  document.getElementById('workout-title').textContent = plan.name;
  const list = document.getElementById('exercise-list');
  list.innerHTML = '';

  plan.exercises.forEach((ex, i) => {
    // Hae viimeisin suoritus tälle liikkeelle
    const lastSession = [...sessions].reverse().find(s =>
      s.exercises && s.exercises.some(e => e.id === ex.id)
    );
    const lastEx = lastSession ? lastSession.exercises.find(e => e.id === ex.id) : null;

    const row = document.createElement('div');
    row.className = 'exercise-row';

    let badgeHtml = '';
    let detailText = ex.sets + ' × ' + ex.reps;
    if (ex.weight > 0) detailText += ' @ ' + ex.weight + ' ' + ex.unit;

    if (lastEx && lastEx.actualWeight) {
      const suggestion = suggestNextWeight(ex.id, lastEx);
      if (suggestion > lastEx.actualWeight) {
        detailText = ex.sets + ' × ' + ex.reps + ' @ ' + suggestion + ' kg';
        badgeHtml = '<span class="badge badge-up">+' + (suggestion - lastEx.actualWeight).toFixed(1) + ' kg</span>';
      } else {
        detailText = ex.sets + ' × ' + ex.reps + ' @ ' + lastEx.actualWeight + ' kg';
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
      ${badgeHtml}
    `;
    list.appendChild(row);
  });
}

function suggestNextWeight(exerciseId, lastEx) {
  if (!lastEx || !lastEx.actualWeight) return 0;
  const w = parseFloat(lastEx.actualWeight);
  // Penkkipunnerrus: +2.5 kg per treeni
  if (exerciseId === 'bench') return w + 2.5;
  // Muut: +2.5 kg kun toistot täyttyivät
  if (lastEx.completedReps && lastEx.targetReps && lastEx.completedReps >= lastEx.targetReps) {
    return w + 2.5;
  }
  return w;
}

// ============================================================
// PÄIVÄN VALMENTAJAVIESTI (yksinkertainen, ei API-kutsu)
// ============================================================
function renderDailyCoachMessage(nextWorkout, sessions) {
  const msgEl = document.getElementById('coach-msg-text');
  const plan = WORKOUT_PLAN[nextWorkout];

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
function openLogModal() {
  const nextWorkout = getNextWorkout();
  const plan = WORKOUT_PLAN[nextWorkout];
  const sessions = getSessions();

  const form = document.getElementById('log-form');
  form.innerHTML = '';
  form.dataset.workout = nextWorkout;

  plan.exercises.forEach(ex => {
    const lastSession = [...sessions].reverse().find(s =>
      s.exercises && s.exercises.some(e => e.id === ex.id)
    );
    const lastEx = lastSession ? lastSession.exercises.find(e => e.id === ex.id) : null;
    const suggestedWeight = lastEx ? suggestNextWeight(ex.id, lastEx) : ex.weight;

    const div = document.createElement('div');
    div.className = 'log-exercise';
    div.innerHTML = `
      <div class="log-ex-name">${ex.name}</div>
      <div class="log-ex-target">Tavoite: ${ex.sets} × ${ex.reps}${ex.weight > 0 ? ' @ ' + suggestedWeight + ' kg' : ''}</div>
      <div class="log-fields">
        <div class="log-field">
          <label>Sarjat</label>
          <input type="number" id="sets-${ex.id}" value="${ex.sets}" min="1" max="10" />
        </div>
        <div class="log-field">
          <label>Toistot</label>
          <input type="number" id="reps-${ex.id}" value="${ex.sets}" min="1" max="30" />
        </div>
        <div class="log-field">
          <label>Paino (kg)</label>
          <input type="number" id="weight-${ex.id}" value="${suggestedWeight}" min="0" max="500" step="0.5" />
        </div>
      </div>
      <div class="log-notes">
        <label>Huomioita (valinnainen)</label>
        <input type="text" id="note-${ex.id}" placeholder="Esim. tekniikka hyvä, selkä kipeä..." />
      </div>
    `;
    form.appendChild(div);
  });

  document.getElementById('log-modal').style.display = 'flex';
}

function closeLogModal() {
  document.getElementById('log-modal').style.display = 'none';
}

async function submitLog() {
  const form = document.getElementById('log-form');
  const nextWorkout = form.dataset.workout;
  const plan = WORKOUT_PLAN[nextWorkout];
  const today = new Date().toISOString().split('T')[0];

  const loggedExercises = plan.exercises.map(ex => ({
    id: ex.id,
    name: ex.name,
    actualSets: parseInt(document.getElementById('sets-' + ex.id)?.value) || ex.sets,
    completedReps: parseInt(document.getElementById('reps-' + ex.id)?.value) || 0,
    targetReps: ex.sets,
    actualWeight: parseFloat(document.getElementById('weight-' + ex.id)?.value) || 0,
    note: document.getElementById('note-' + ex.id)?.value || '',
  }));

  const session = {
    date: today,
    workout: nextWorkout,
    exercises: loggedExercises,
    timestamp: Date.now(),
  };

  const sessions = getSessions();
  sessions.push(session);
  saveSessions(sessions);

  closeLogModal();

  // Pyydä AI-analyysi
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
    const exText = s.exercises.map(e =>
      `${e.name}: ${e.actualSets}×${e.completedReps} @ ${e.actualWeight}kg${e.note ? ' (${e.note})' : ''}`
    ).join(', ');
    return `${s.date} (${s.workout}): ${exText}`;
  }).join('\n');

  const prompt = `
Olet kokenut personal trainer ja voimavalmentaja. Analysoi alla oleva treenikirjaus ja anna konkreettinen, lyhyt palaute.

${PROFILE}

Treenien historia (viimeiset 10):
${historyText}

Tänään kirjattu treeni (${session.workout}):
${session.exercises.map(e => `- ${e.name}: ${e.actualSets}×${e.completedReps} @ ${e.actualWeight}kg${e.note ? ' · huomio: ' + e.note : ''}`).join('\n')}

Anna:
1. Lyhyt arvio treenistä (1–2 lausetta)
2. Konkreettiset suositukset jokaiselle liikkeelle ensi kerralle (paino, sarjat, toistot)
3. Yksi tärkeä huomio (progressio, palautuminen, tekniikka tms.)

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
  const historyText = sessions.slice(-5).map(s =>
    `${s.date}: ${s.exercises.map(e => `${e.name} ${e.actualWeight}kg`).join(', ')}`
  ).join('\n');

  showLoading('Valmentaja miettii...');

  const prompt = `
Olet kokenut personal trainer. Vastaa käyttäjän kysymykseen lyhyesti ja käytännöllisesti suomeksi.

${PROFILE}

Viimeiset treenikertasi:
${historyText || 'Ei vielä treenikertoja kirjattuna.'}

Käyttäjän kysymys: ${question}

Vastaa max 150 sanalla. Ole konkreettinen ja selkeä.
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
      showCoachAnswer(data.content[0].text);
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
// HISTORIA-SIVU
// ============================================================
function renderHistory() {
  const sessions = getSessions();

  document.getElementById('total-sessions').textContent = sessions.length;
  document.getElementById('total-weeks').textContent = getWeekNumber();

  // Penkkipunnerrus-historia
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
      row.innerHTML = `
        <div>
          <div class="history-date">${formatDate(s.date)}</div>
          <div class="history-detail">${ex.actualSets}×${ex.completedReps} @ ${ex.actualWeight} kg</div>
        </div>
        <span class="badge badge-done">${ex.actualWeight} kg</span>
      `;
      benchEl.appendChild(row);
    });
  }

  // Kaikki treenikertasi
  const allEl = document.getElementById('all-sessions');
  allEl.innerHTML = '';

  if (sessions.length === 0) {
    allEl.innerHTML = '<p class="empty-state">Ei vielä treenikertojas</p>';
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
  // Täytä API-avain kenttään jos se on jo tallennettu
  const savedKey = getApiKey();
  if (savedKey) {
    document.getElementById('api-key-input').value = savedKey;
  }
  renderHome();
});
