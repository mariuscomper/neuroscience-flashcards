(function () {
  'use strict';

  var root = document.getElementById('root');
  var rawCards = [];
  var appStarted = false;
  var STORAGE_KEY = 'neuro-ubb-admitere-v1';
  var LEGACY_PRODUCT_KEY = 'neuro-nobel-v1';
  var LEGACY_STORAGE_KEY = 'neuro-improved-v2';
  var now = function () { return new Date(); };

  var MODULES = [
    { id: 'M1', roman: 'I', name: 'Perspectivă istorică', short: 'Istorie', colorClass: 'module-m1' },
    { id: 'M2', roman: 'II', name: 'Neuroni și celule gliale', short: 'Celule', colorClass: 'module-m2' },
    { id: 'M3', roman: 'III', name: 'Semnalizare sinaptică', short: 'Sinapse', colorClass: 'module-m3' },
    { id: 'M4', roman: 'IV', name: 'Neuroanatomie', short: 'Anatomie', colorClass: 'module-m4' },
    { id: 'M5', roman: 'V', name: 'Dezvoltarea sistemului nervos', short: 'Dezvoltare', colorClass: 'module-m5' },
    { id: 'M6', roman: 'VI', name: 'Văzul', short: 'Văz', colorClass: 'module-m6' }
  ];

  var NAV_ITEMS = [
    { id: 'dashboard', label: 'Panou', icon: '⌂' },
    { id: 'study', label: 'Studiu', icon: '◉' },
    { id: 'atlas', label: 'Atlas', icon: '⌘' },
    { id: 'exam', label: 'Examen', icon: '△' },
    { id: 'progress', label: 'Progres', icon: '↗' },
    { id: 'settings', label: 'Setări', icon: '⊙' }
  ];

  var MODE_ITEMS = [
    { id: 'classic', label: 'Clasic', note: 'întrebare → răspuns' },
    { id: 'cloze', label: 'Completare', note: 'umple spațiul' },
    { id: 'reverse', label: 'Invers', note: 'răspuns → întrebare' },
    { id: 'mcq', label: 'Grilă', note: 'alege răspunsul' },
    { id: 'recall', label: 'Reamintire', note: 'scrie din memorie' }
  ];

  var MNEMONICS = [
    { module: 'M1', title: 'De la inimă la creier', text: 'Cardiocentrism → cefalocentrism → localizare → rețele distribuite.', use: 'Urmărește schimbarea ideii despre locul în care apare mintea.' },
    { module: 'M2', title: 'Glia ține scena în picioare', text: 'Astrocite, oligodendrocite, microglie și celule Schwann.', use: 'Leagă fiecare tip de glie de sprijin, mielinizare sau apărare.' },
    { module: 'M3', title: 'Pre, prin, post', text: 'Presinaptic eliberează, fanta lasă să treacă, postsinaptic răspunde.', use: 'Repetă traseul unui neurotransmițător în trei pași.' },
    { module: 'M4', title: 'Dorsal face, ventral vede', text: 'Calea dorsală: unde și cum. Calea ventrală: ce.', use: 'Asociază parietalul cu acțiunea și temporalul cu identitatea.' },
    { module: 'M5', title: 'Dinăuntru spre afară', text: 'În cortex, neuronii mai noi trec peste cei mai vechi.', use: 'Imaginează-ți straturile construite în ordinea migrației.' },
    { module: 'M6', title: 'M vede mișcarea, P vede detaliul', text: 'Magnocelular: schimbare și mișcare. Parvocelular: culoare și finețe.', use: 'M = mișcare, P = precizie.' },
    { module: 'M1', title: 'Broca produce, Wernicke primește', text: 'Broca ține de producerea limbajului, Wernicke de înțelegere.', use: 'Folosește perechea ca punct de orientare, nu ca hartă completă a limbajului.' },
    { module: 'M2', title: 'Dendrita ascultă, axonul anunță', text: 'Dendritele primesc, soma integrează, axonul conduce, terminația transmite.', use: 'Parcurge neuronul în direcția fluxului informațional.' },
    { module: 'M3', title: 'Excitație sau frână', text: 'Glutamatul tinde să excite, GABA și glicina tind să inhibe.', use: 'Verifică mereu receptorul și contextul înainte de a generaliza.' },
    { module: 'M4', title: 'Hipocampul leagă locul de episod', text: 'Memorie declarativă și orientare spațială.', use: 'Leagă harta spațiului de amintirea evenimentului.' },
    { module: 'M5', title: 'Use it or lose it', text: 'Conexiunile folosite se consolidează, cele slabe pot fi eliminate.', use: 'Repetarea nu este decor: ea schimbă traseul pe care revii.' },
    { module: 'M6', title: 'Lumina închide canale', text: 'În fotoreceptor, lumina produce hiperpolarizare prin închiderea canalelor de Na⁺.', use: 'Ține minte excepția: lumină → mai puțin curent întunecat.' }
  ];

  var DIAGRAMS = [
    {
      id: 'neuron',
      title: 'Circuitul unui neuron',
      subtitle: 'recepție → integrare → conducere → transmitere',
      nodes: [
        { id: 'dendrite', label: 'Dendrite', x: 110, y: 92, description: 'Prelungiri care primesc semnale de la alte celule.' },
        { id: 'soma', label: 'Soma', x: 300, y: 145, description: 'Corpul celular: integrează semnale și conține nucleul.' },
        { id: 'axon', label: 'Axon', x: 500, y: 145, description: 'Prelungirea care conduce potențialul de acțiune.' },
        { id: 'terminal', label: 'Terminație', x: 690, y: 92, description: 'Capătul axonului, unde semnalul este transmis la sinapsă.' }
      ],
      edges: [['dendrite', 'soma'], ['soma', 'axon'], ['axon', 'terminal']]
    },
    {
      id: 'synapse',
      title: 'Sinapsa tripartită',
      subtitle: 'eliberare, fantă, receptor și reglare',
      nodes: [
        { id: 'pre', label: 'Presinaptic', x: 170, y: 128, description: 'Terminalul care eliberează neurotransmițătorul.' },
        { id: 'cleft', label: 'Fanta sinaptică', x: 400, y: 70, description: 'Spațiul îngust traversat de moleculele de semnalizare.' },
        { id: 'post', label: 'Postsinaptic', x: 630, y: 128, description: 'Membrana cu receptori care transformă semnalul în răspuns.' },
        { id: 'astro', label: 'Astrocit', x: 400, y: 220, description: 'A treia componentă, implicată în captarea și reglarea mediului sinaptic.' }
      ],
      edges: [['pre', 'cleft'], ['cleft', 'post'], ['astro', 'cleft']]
    },
    {
      id: 'visual',
      title: 'Calea vizuală',
      subtitle: 'retină → chiasmă → NGL → V1',
      nodes: [
        { id: 'retina', label: 'Retină', x: 120, y: 130, description: 'Transformă lumina în semnal neuronal.' },
        { id: 'chiasm', label: 'Chiasmă', x: 320, y: 130, description: 'Punctul în care unele fibre ale nervilor optici se încrucișează.' },
        { id: 'ngl', label: 'NGL', x: 520, y: 130, description: 'Nucleul geniculat lateral din talamus, stație de releu.' },
        { id: 'v1', label: 'V1', x: 710, y: 130, description: 'Cortexul vizual primar din lobul occipital.' }
      ],
      edges: [['retina', 'chiasm'], ['chiasm', 'ngl'], ['ngl', 'v1']]
    },
    {
      id: 'retina',
      title: 'Straturile retinei',
      subtitle: 'lumina traversează retina până la fotoreceptori',
      nodes: [
        { id: 'pigment', label: 'Epiteliu pigmentar', x: 160, y: 76, description: 'Strat de susținere și absorbție a luminii.' },
        { id: 'photo', label: 'Fotoreceptori', x: 340, y: 76, description: 'Bastonașele și conurile transformă lumina în semnal electric.' },
        { id: 'bipolar', label: 'Bipolare', x: 520, y: 76, description: 'Transmit semnalul dintre fotoreceptori și celulele ganglionare.' },
        { id: 'ganglion', label: 'Ganglionare', x: 700, y: 76, description: 'Axonii lor formează nervul optic.' }
      ],
      edges: [['pigment', 'photo'], ['photo', 'bipolar'], ['bipolar', 'ganglion']]
    },
    {
      id: 'tube',
      title: 'Formarea tubului neural',
      subtitle: 'placă → închidere → vezicule',
      nodes: [
        { id: 'plate', label: 'Placă neurală', x: 140, y: 150, description: 'Îngroșare a ectodermului care inițiază formarea sistemului nervos.' },
        { id: 'fold', label: 'Pliuri neurale', x: 350, y: 105, description: 'Marginile plăcii se ridică și se apropie.' },
        { id: 'tube', label: 'Tub neural', x: 560, y: 150, description: 'Structura închisă din care se dezvoltă creierul și măduva spinării.' },
        { id: 'vesicles', label: 'Vezicule', x: 740, y: 105, description: 'Regiuni timpurii ale encefalului în dezvoltare.' }
      ],
      edges: [['plate', 'fold'], ['fold', 'tube'], ['tube', 'vesicles']]
    },
    {
      id: 'csf',
      title: 'Circulația LCR',
      subtitle: 'ventriculi → apeduct → spațiu subarahnoidian',
      nodes: [
        { id: 'lateral', label: 'Ventriculi laterali', x: 160, y: 92, description: 'Cavități care contribuie la producerea și circulația LCR.' },
        { id: 'monro', label: 'Foramen Monro', x: 360, y: 92, description: 'Legătura dintre ventriculii laterali și ventriculul al treilea.' },
        { id: 'aqueduct', label: 'Apeduct', x: 560, y: 92, description: 'Canalul dintre ventriculul al treilea și al patrulea.' },
        { id: 'sub', label: 'Spațiu subarahnoidian', x: 730, y: 175, description: 'Spațiul în care LCR înconjoară creierul și măduva.' }
      ],
      edges: [['lateral', 'monro'], ['monro', 'aqueduct'], ['aqueduct', 'sub']]
    }
  ];

  var CONCEPTS = [
    { id: 'neuron', label: 'Neuron', module: 'M2', x: 130, y: 72, detail: 'Unitatea celulară care primește, integrează și transmite semnale.' },
    { id: 'sinapsa', label: 'Sinapsă', module: 'M3', x: 330, y: 52, detail: 'Punct de comunicare între celule, prin semnale chimice sau electrice.' },
    { id: 'plasticitate', label: 'Plasticitate', module: 'M1', x: 550, y: 88, detail: 'Capacitatea circuitelor de a-și modifica organizarea și eficiența.' },
    { id: 'memorie', label: 'Memorie', module: 'M4', x: 760, y: 58, detail: 'Păstrarea și folosirea informației; cardurile ating mai ales memoria declarativă.' },
    { id: 'mielina', label: 'Mielină', module: 'M2', x: 105, y: 210, detail: 'Înveliș care accelerează conducerea axonală.' },
    { id: 'neurotransmitator', label: 'Neurotransmițător', module: 'M3', x: 330, y: 190, detail: 'Moleculă eliberată la sinapsă pentru a influența celula-țintă.' },
    { id: 'receptori', label: 'Receptori', module: 'M3', x: 540, y: 220, detail: 'Proteine care convertesc prezența semnalului într-un răspuns celular.' },
    { id: 'cortex', label: 'Cortex', module: 'M4', x: 760, y: 190, detail: 'Stratul de substanță cenușie implicat în percepție, acțiune și cogniție.' },
    { id: 'dezvoltare', label: 'Dezvoltare', module: 'M5', x: 105, y: 360, detail: 'Formarea, migrarea și rafinarea circuitelor nervoase.' },
    { id: 'migrare', label: 'Migrare', module: 'M5', x: 330, y: 350, detail: 'Deplasarea neuronilor către pozițiile lor funcționale.' },
    { id: 'vedere', label: 'Vedere', module: 'M6', x: 550, y: 365, detail: 'Procesarea luminii și a formelor prin calea vizuală.' },
    { id: 'retina', label: 'Retină', module: 'M6', x: 760, y: 350, detail: 'Țesut senzorial care începe prelucrarea informației vizuale.' }
  ];

  var CONCEPT_EDGES = [
    ['neuron', 'sinapsa'], ['neuron', 'mielina'], ['sinapsa', 'neurotransmitator'],
    ['neurotransmitator', 'receptori'], ['receptori', 'plasticitate'], ['plasticitate', 'memorie'],
    ['memorie', 'cortex'], ['dezvoltare', 'migrare'], ['migrare', 'cortex'],
    ['retina', 'vedere'], ['vedere', 'cortex'], ['mielina', 'dezvoltare']
  ];

  var memoryFallback = {};
  var deferredInstallPrompt = null;
  var examClock = null;
  var focusAfterRender = '';
  var state = {
    view: 'dashboard',
    atlasTab: 'search',
    cards: [],
    history: [],
    theme: 'light',
    dailyGoal: 20,
    query: '',
    moduleFilter: 'all',
    statusFilter: 'all',
    mode: 'classic',
    studyQueue: [],
    studyIndex: 0,
    showAnswer: false,
    studyChoice: null,
    recallText: '',
    recallRevealed: false,
    diagramId: 'neuron',
    diagramNode: 'soma',
    conceptId: 'neuron',
    examSize: 10,
    exam: null,
    toast: '',
    storageIssue: false,
    installable: false
  };

  function esc(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function hashString(value) {
    var hash = 0;
    var text = String(value || '');
    for (var i = 0; i < text.length; i += 1) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }

  function getModule(id) {
    for (var i = 0; i < MODULES.length; i += 1) {
      if (MODULES[i].id === id) return MODULES[i];
    }
    return MODULES[0];
  }

  function normalizeModule(value, question) {
    var candidate = String(value || '').toUpperCase();
    if (/^M[1-6]$/.test(candidate)) return candidate;
    if (/dezvolt|neural|migra|apoptoz|pruning/i.test(question || '')) return 'M5';
    return 'M1';
  }

  function isoDaysFromNow(days) {
    var date = now();
    date.setDate(date.getDate() + days);
    return date.toISOString();
  }

  function makeCard(raw, index, saved) {
    var question = String(raw && (raw.q || raw.question) || '').trim();
    var answer = String(raw && (raw.a || raw.answer) || '').trim();
    var hash = hashString(question + answer);
    var base = {
      id: 'card-' + hash + '-' + index,
      hash: hash,
      question: question,
      answer: answer,
      module: normalizeModule(raw && (raw.m || raw.module), question),
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      reviews: 0,
      correct: 0,
      nextReview: new Date().toISOString(),
      lastReview: null,
      isDifficult: false
    };
    if (!saved) return base;
    return {
      id: base.id,
      hash: base.hash,
      question: base.question,
      answer: base.answer,
      module: base.module,
      interval: Number(saved.interval) || 0,
      easeFactor: Number(saved.easeFactor) || 2.5,
      repetitions: Number(saved.repetitions) || 0,
      reviews: Number(saved.reviews) || 0,
      correct: Number(saved.correct) || 0,
      nextReview: saved.nextReview || base.nextReview,
      lastReview: saved.lastReview || null,
      isDifficult: Boolean(saved.isDifficult)
    };
  }

  function safeParse(key) {
    try {
      var value = typeof localStorage === 'undefined' ? memoryFallback[key] : localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      state.storageIssue = true;
      try {
        return memoryFallback[key] ? JSON.parse(memoryFallback[key]) : null;
      } catch (fallbackError) {
        return null;
      }
    }
  }

  function loadData() {
    var saved = safeParse(STORAGE_KEY);
    var previousProduct = saved ? null : safeParse(LEGACY_PRODUCT_KEY);
    var legacy = saved || previousProduct ? null : safeParse(LEGACY_STORAGE_KEY);
    var migrated = saved || previousProduct;
    var savedCards = Array.isArray(migrated && migrated.cards) ? migrated.cards : (Array.isArray(legacy) ? legacy : []);
    var byHash = {};
    savedCards.forEach(function (card) {
      if (card && card.hash) byHash[card.hash] = card;
    });
    state.cards = rawCards.map(function (raw, index) {
      return makeCard(raw, index, byHash[hashString(String(raw.q || raw.question || '') + String(raw.a || raw.answer || ''))]);
    }).filter(function (card) { return card.question || card.answer; });
    state.history = Array.isArray(migrated && migrated.history) ? migrated.history : [];
    var settings = migrated && migrated.settings ? migrated.settings : {};
    state.theme = settings.theme === 'dark' || settings.theme === 'light' ? settings.theme : (
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    );
    state.dailyGoal = Math.max(5, Math.min(200, Number(settings.dailyGoal) || 20));
    if (!saved && state.cards.length) persist();
  }

  function persist() {
    var snapshot = JSON.stringify({
      version: 1,
      cards: state.cards,
      history: state.history.slice(-1500),
      settings: { theme: state.theme, dailyGoal: state.dailyGoal }
    });
    try {
      if (typeof localStorage === 'undefined') throw new Error('localStorage indisponibil');
      localStorage.setItem(STORAGE_KEY, snapshot);
    } catch (error) {
      state.storageIssue = true;
      memoryFallback[STORAGE_KEY] = snapshot;
    }
  }

  function dateKey(dateValue) {
    var date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (isNaN(date.getTime())) return '';
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }

  function isDue(card) {
    return !card.nextReview || new Date(card.nextReview) <= now();
  }

  function currentStats() {
    var reviewed = 0;
    var correct = 0;
    state.cards.forEach(function (card) {
      reviewed += card.reviews || 0;
      correct += card.correct || 0;
    });
    var reviewHistory = state.history.filter(function (entry) { return entry.type !== 'exam'; });
    var todayKey = dateKey(now());
    var todayReviews = reviewHistory.filter(function (entry) { return dateKey(entry.at) === todayKey; }).length;
    return {
      total: state.cards.length,
      due: state.cards.filter(isDue).length,
      difficult: state.cards.filter(function (card) { return card.isDifficult; }).length,
      mastered: state.cards.filter(function (card) { return card.repetitions >= 3; }).length,
      reviewed: reviewed,
      correct: correct,
      accuracy: reviewed ? Math.round((correct / reviewed) * 100) : 0,
      todayReviews: todayReviews,
      goal: state.dailyGoal,
      streak: getStreak()
    };
  }

  function moduleStats(moduleId) {
    var cards = state.cards.filter(function (card) { return card.module === moduleId; });
    var mastered = cards.filter(function (card) { return card.repetitions >= 3; }).length;
    var due = cards.filter(isDue).length;
    return {
      total: cards.length,
      mastered: mastered,
      due: due,
      difficult: cards.filter(function (card) { return card.isDifficult; }).length,
      progress: cards.length ? Math.round((mastered / cards.length) * 100) : 0
    };
  }

  function getStreak() {
    var days = {};
    state.history.forEach(function (entry) {
      if (entry.type !== 'exam') days[dateKey(entry.at)] = true;
    });
    var cursor = new Date();
    var today = dateKey(cursor);
    if (!days[today]) cursor.setDate(cursor.getDate() - 1);
    if (!days[dateKey(cursor)]) return 0;
    var count = 0;
    while (days[dateKey(cursor)]) {
      count += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return count;
  }

  function seededNumber(seed) {
    var number = parseInt(hashString(seed), 36);
    return (number % 100000) / 100000;
  }

  function shuffled(items, seed) {
    var result = items.slice();
    for (var i = result.length - 1; i > 0; i -= 1) {
      var index = Math.floor(seededNumber(seed + '-' + i) * (i + 1));
      var temp = result[i];
      result[i] = result[index];
      result[index] = temp;
    }
    return result;
  }

  function startStudy(moduleId, onlyDue, explicitIds) {
    var pool = explicitIds ? state.cards.filter(function (card) { return explicitIds.indexOf(card.id) >= 0; }) : state.cards.filter(function (card) {
      return !moduleId || moduleId === 'all' || card.module === moduleId;
    });
    if (onlyDue) {
      var due = pool.filter(isDue);
      pool = due.length ? due : pool.slice(0, 20);
    }
    if (!pool.length) {
      showToast('Nu există carduri în această selecție.');
      return;
    }
    state.studyQueue = shuffled(pool.map(function (card) { return card.id; }), dateKey(now()) + '-' + (moduleId || 'all'));
    state.studyIndex = 0;
    state.showAnswer = false;
    state.studyChoice = null;
    state.recallText = '';
    state.recallRevealed = false;
    state.view = 'study';
    render();
  }

  function getCurrentCard() {
    var id = state.studyQueue[state.studyIndex];
    for (var i = 0; i < state.cards.length; i += 1) {
      if (state.cards[i].id === id) return state.cards[i];
    }
    return null;
  }

  function calculateReview(card, quality) {
    var next = Object.assign({}, card);
    var q = Number(quality);
    if (q < 3) {
      next.repetitions = 0;
      next.interval = 1;
    } else {
      if (next.repetitions === 0) next.interval = 1;
      else if (next.repetitions === 1) next.interval = 3;
      else next.interval = Math.max(1, Math.round((next.interval || 3) * next.easeFactor));
      next.repetitions += 1;
    }
    next.easeFactor = Math.max(1.3, Math.min(2.8, next.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))));
    next.reviews += 1;
    if (q >= 3) next.correct += 1;
    next.nextReview = isoDaysFromNow(next.interval);
    next.lastReview = now().toISOString();
    return next;
  }

  function rateCurrent(quality) {
    var card = getCurrentCard();
    if (!card) return;
    var updated = calculateReview(card, quality);
    state.cards = state.cards.map(function (item) { return item.id === card.id ? updated : item; });
    state.history.push({
      type: 'review',
      at: now().toISOString(),
      hash: card.hash,
      module: card.module,
      quality: Number(quality),
      mode: state.mode
    });
    persist();
    if (state.studyIndex < state.studyQueue.length - 1) {
      state.studyIndex += 1;
      state.showAnswer = false;
      state.studyChoice = null;
      state.recallText = '';
      state.recallRevealed = false;
      render();
    } else {
      state.view = 'dashboard';
      state.studyQueue = [];
      showToast('Sesiune completată. Progresul a fost salvat.');
      render();
    }
  }

  function toggleDifficult() {
    var card = getCurrentCard();
    if (!card) return;
    state.cards = state.cards.map(function (item) {
      return item.id === card.id ? Object.assign({}, item, { isDifficult: !item.isDifficult }) : item;
    });
    persist();
    render();
  }

  function getOptions(card) {
    var others = state.cards.filter(function (item) { return item.id !== card.id && item.answer !== card.answer; });
    var distractors = shuffled(others, card.hash).slice(0, 3).map(function (item) { return item.answer; });
    return shuffled([card.answer].concat(distractors), card.hash + '-options');
  }

  function clozePrompt(card) {
    var words = card.answer.split(/\s+/);
    if (words.length < 4) return card.question + ' — completează răspunsul în minte.';
    var hiddenIndex = Math.max(1, Math.floor(words.length / 2));
    var copy = words.slice();
    copy[hiddenIndex] = '_____';
    return card.question + ' ' + copy.join(' ');
  }

  function markRecall() {
    state.recallRevealed = true;
    state.showAnswer = true;
    render();
  }

  function showToast(message) {
    state.toast = message;
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(function () {
      state.toast = '';
      render();
    }, 3200);
  }

  function button(label, action, className, extra) {
    return '<button type="button" class="button ' + (className || '') + '" data-action="' + esc(action) + '"' + (extra || '') + '>' + label + '</button>';
  }

  function progressBar(value, label) {
    var safe = Math.max(0, Math.min(100, Number(value) || 0));
    return '<div class="progress-line" role="progressbar" aria-label="' + esc(label || 'Progres') + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + safe + '"><span style="--progress:' + safe + '%"></span></div>';
  }

  function renderShell() {
    var stats = currentStats();
    var nav = NAV_ITEMS.map(function (item) {
      var active = state.view === item.id || (item.id === 'atlas' && state.view === 'atlas');
      return '<button type="button" class="nav-item ' + (active ? 'is-active' : '') + '" data-action="navigate" data-view="' + item.id + '" aria-current="' + (active ? 'page' : 'false') + '">' +
        '<span class="nav-icon" aria-hidden="true">' + item.icon + '</span><span>' + item.label + '</span></button>';
    }).join('');
    var storageNotice = state.storageIssue ? '<div class="notice notice-warn"><strong>Salvare locală indisponibilă.</strong> Poți studia în continuare, dar exportă progresul înainte de a închide pagina.</div>' : '';
    return '<div class="app-shell" data-theme="' + state.theme + '">' +
      '<a class="skip-link" href="#main-content">Sari la conținut</a>' +
      '<div class="app-layout">' +
        '<aside class="sidebar" aria-label="Navigație principală">' +
          '<div class="brand"><div class="brand-mark"><span class="brand-dot"></span><span>NF</span></div><div><div class="brand-kicker">UBB CLUJ / ADMITERE</div><div class="brand-name">Neuroștiințe</div><div class="brand-sub">Psihologie · pregătire</div></div></div>' +
          '<div class="sidebar-rule"></div>' +
          '<nav class="nav-list">' + nav + '</nav>' +
          '<div class="sidebar-bottom"><div class="streak-mini"><span class="streak-orbit" aria-hidden="true">✦</span><div><strong>' + stats.streak + ' zile</strong><span>serie de studiu</span></div></div>' +
          '<div class="goal-mini">' + progressBar(Math.round((stats.todayReviews / stats.goal) * 100), 'Obiectiv zilnic') + '<span>' + stats.todayReviews + '/' + stats.goal + ' astăzi</span></div></div>' +
        '</aside>' +
        '<div class="app-column">' +
          '<header class="topbar"><div class="mobile-brand"><span class="brand-dot"></span><strong>Neuroștiințe UBB</strong></div><div class="topbar-meta"><span class="pulse"></span><span>memorie locală</span><span class="kbd">/</span><button type="button" class="icon-button" data-action="theme-toggle" aria-label="' + (state.theme === 'dark' ? 'Activează tema luminoasă' : 'Activează tema întunecată') + '" aria-pressed="' + (state.theme === 'dark' ? 'true' : 'false') + '">' + (state.theme === 'dark' ? '☼' : '☾') + '</button></div></header>' +
          '<main id="main-content" class="main-content" tabindex="-1">' + storageNotice + renderView() + '</main>' +
          '<footer class="app-footer">Instrument independent pentru pregătirea admiterii la Psihologie la UBB Cluj · verifică răspunsurile cu materialul de curs; nu înlocuiește sfatul medical.</footer>' +
        '</div>' +
      '</div>' +
      '<div class="toast" aria-live="polite" aria-atomic="true">' + (state.toast ? esc(state.toast) : '') + '</div>' +
    '</div>';
  }

  function renderView() {
    if (state.view === 'study') return renderStudy();
    if (state.view === 'atlas') return renderAtlas();
    if (state.view === 'exam') return renderExam();
    if (state.view === 'progress') return renderProgress();
    if (state.view === 'settings') return renderSettings();
    return renderDashboard();
  }

  function renderDashboard() {
    var stats = currentStats();
    var moduleNodes = MODULES.map(function (module, index) {
      var item = moduleStats(module.id);
      var x = 76 + index * 132;
      var y = index % 2 ? 102 : 150;
      return '<g class="neural-node ' + module.colorClass + '" data-module="' + module.id + '"><circle cx="' + x + '" cy="' + y + '" r="17"></circle><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle">' + module.roman + '</text><title>' + esc(module.name) + ': ' + item.progress + '%</title></g>';
    }).join('');
    var lines = MODULES.slice(0, -1).map(function (module, index) {
      var x1 = 76 + index * 132;
      var y1 = index % 2 ? 102 : 150;
      var x2 = 76 + (index + 1) * 132;
      var y2 = (index + 1) % 2 ? 102 : 150;
      return '<line class="neural-line" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '"></line>';
    }).join('');
    var modules = MODULES.map(function (module) {
      var item = moduleStats(module.id);
      return '<article class="module-card ' + module.colorClass + '">' +
        '<div class="module-card-head"><span class="module-index">' + module.roman + '</span><div><h3>' + esc(module.name) + '</h3><p>' + item.total + ' carduri</p></div><span class="module-percent">' + item.progress + '%</span></div>' +
        progressBar(item.progress, 'Progres ' + module.name) +
        '<div class="module-card-stats"><span><b>' + item.due + '</b> de repetat</span><span><b>' + item.mastered + '</b> stăpânite</span></div>' +
        '<div class="module-card-actions">' + button('Învață scadente', 'start-module-due', 'button-small button-quiet', ' data-module="' + module.id + '"') + button('Toate', 'start-module-all', 'button-small button-ghost', ' data-module="' + module.id + '"') + '</div>' +
      '</article>';
    }).join('');
    var primaryLabel = stats.due ? 'Începe repetarea (' + stats.due + ')' : 'Începe o sesiune';
    return '<section class="view dashboard-view">' +
      '<div class="hero-grid"><div class="hero-copy"><p class="eyebrow">ADMITERE PSIHOLOGIE UBB CLUJ · 812 DE CARDURI</p><h1>Pregătește-te pentru admitere.</h1><p class="hero-lede">Fișe de studiu pentru cei care se pregătesc pentru admiterea la Psihologie la UBB Cluj: îți amintești, verifici și revii exact când memoria are nevoie.</p><div class="hero-actions">' + button(primaryLabel, 'start-all-due', 'button-primary') + button('Explorează atlasul', 'navigate-atlas', 'button-secondary') + '</div><div class="hero-footnote"><span class="signal-mark">↳</span><span>Răspunsurile și progresul rămân în browserul tău.</span></div></div>' +
      '<div class="neural-panel"><div class="panel-label"><span>câmp neural</span><span>' + stats.mastered + '/' + stats.total + '</span></div><svg class="neural-map" viewBox="0 0 840 230" role="img" aria-label="Harta celor șase module și progresul lor">' + lines + moduleNodes + '<path class="neural-arc" d="M 60 188 C 250 215, 570 215, 790 178"></path></svg><div class="neural-legend"><span><i class="legend-dot legend-active"></i>progres</span><span><i class="legend-dot legend-rest"></i>următorul nod: ' + esc(getNextModuleName()) + '</span></div></div></div>' +
      '<div class="stat-strip"><div class="stat-cell"><span class="stat-label">de repetat</span><strong>' + stats.due + '</strong><span class="stat-note">astăzi</span></div><div class="stat-cell"><span class="stat-label">stăpânite</span><strong>' + stats.mastered + '</strong><span class="stat-note">din ' + stats.total + '</span></div><div class="stat-cell"><span class="stat-label">acuratețe</span><strong>' + (stats.reviewed ? stats.accuracy + '%' : '—') + '</strong><span class="stat-note">' + stats.reviewed + ' evaluări</span></div><div class="stat-cell"><span class="stat-label">serie</span><strong>' + stats.streak + '</strong><span class="stat-note">zile consecutive</span></div></div>' +
      '<div class="section-heading"><div><p class="eyebrow">TRASEUL TĂU</p><h2>Șase module, un singur circuit.</h2></div><button type="button" class="text-button" data-action="navigate" data-view="progress">Vezi raportul →</button></div>' +
      '<div class="module-grid">' + modules + '</div>' +
      '<div class="lower-grid"><article class="lab-card"><div class="card-overline"><span class="card-number">01</span><span>un impuls pentru azi</span></div><h3>' + (stats.due ? 'Începe cu ce este scadent.' : 'Construiește următoarea conexiune.') + '</h3><p>' + (stats.due ? stats.due + ' de carduri așteaptă o reîntâlnire. O sesiune scurtă păstrează circuitul activ.' : 'Alege un modul și adaugă câteva carduri noi. Ritmul constant bate maratonul.') + '</p>' + button(stats.due ? 'Repetă acum' : 'Alege un modul', stats.due ? 'start-all-due' : 'navigate-study', 'button-secondary button-small') + '</article><article class="lab-card mnemonic-card"><div class="card-overline"><span class="card-number">02</span><span>instrument de memorie</span></div><h3>' + esc(MNEMONICS[stats.todayReviews % MNEMONICS.length].title) + '</h3><p>' + esc(MNEMONICS[stats.todayReviews % MNEMONICS.length].text) + '</p><button type="button" class="text-button" data-action="open-mnemonics">Deschide mnemonicele →</button></article></div>' +
    '</section>';
  }

  function getNextModuleName() {
    for (var i = 0; i < MODULES.length; i += 1) {
      if (moduleStats(MODULES[i].id).due > 0) return MODULES[i].short;
    }
    return MODULES[0].short;
  }

  function renderStudy() {
    var card = getCurrentCard();
    if (!card) {
      return '<section class="view empty-view"><p class="eyebrow">STUDIU</p><h1>Nicio sesiune deschisă.</h1>' + button('Înapoi la panou', 'navigate-dashboard', 'button-primary') + '</section>';
    }
    var module = getModule(card.module);
    var position = state.studyIndex + 1;
    var total = state.studyQueue.length;
    var canRate = state.showAnswer || state.studyChoice !== null || state.recallRevealed;
    var prompt = state.mode === 'reverse' ? card.answer : (state.mode === 'cloze' ? clozePrompt(card) : card.question);
    var response = state.mode === 'reverse' ? card.question : card.answer;
    var body = '';
    if (state.mode === 'mcq') {
      var options = getOptions(card);
      body = '<div class="choice-list">' + options.map(function (option, index) {
        var selected = state.studyChoice === option;
        var correct = option === card.answer;
        var cls = selected ? (correct ? 'choice-correct' : 'choice-wrong') : '';
        return '<button type="button" class="choice-button ' + cls + '" data-action="study-choice" data-choice="' + esc(option) + '" aria-pressed="' + (selected ? 'true' : 'false') + '"><span class="choice-letter">' + String.fromCharCode(65 + index) + '</span><span>' + esc(option) + '</span></button>';
      }).join('') + '</div>' + (state.studyChoice !== null ? '<div class="choice-feedback ' + (state.studyChoice === card.answer ? 'feedback-good' : 'feedback-bad') + '">' + (state.studyChoice === card.answer ? 'Răspuns corect.' : 'Răspunsul corect este: ' + esc(card.answer)) + '</div>' : '');
    } else if (state.mode === 'recall') {
      body = '<label class="recall-label" for="recall-input">Scrie ce îți amintești înainte să verifici.</label><textarea id="recall-input" class="recall-input" rows="5" placeholder="Formulează răspunsul în cuvintele tale.">' + esc(state.recallText) + '</textarea>' + (state.recallRevealed ? '<div class="recall-answer"><span class="answer-label">Răspunsul din card</span><p>' + esc(response) + '</p></div>' : button('Arată răspunsul', 'reveal-recall', 'button-secondary') );
    } else {
      body = '<button type="button" class="flashcard-surface ' + (state.showAnswer ? 'is-revealed' : '') + '" data-action="toggle-answer" aria-expanded="' + (state.showAnswer ? 'true' : 'false') + '"><span class="card-type">' + (state.mode === 'cloze' ? 'COMPLETARE' : state.mode === 'reverse' ? 'INVERS' : 'ÎNTREBARE') + '</span><span class="card-prompt">' + esc(prompt) + '</span>' + (state.showAnswer ? '<span class="card-answer-label">RĂSPUNS</span><span class="card-answer">' + esc(response) + '</span>' : '<span class="card-reveal-hint">Apasă pentru a verifica · Space</span>') + '</button>';
    }
    var ratings = canRate ? '<div class="rating-block"><div class="rating-heading"><span>Ce nivel de certitudine ai avut?</span><span class="progress-chip">' + card.repetitions + '/3 repetări</span></div><div class="rating-grid">' + button('Nu știam', 'rate-card', 'rating-button rating-low', ' data-quality="1"') + button('Greu', 'rate-card', 'rating-button rating-mid', ' data-quality="3"') + button('Bine', 'rate-card', 'rating-button rating-good', ' data-quality="4"') + button('Ușor', 'rate-card', 'rating-button rating-easy', ' data-quality="5"') + '</div><p class="microcopy">Evaluarea schimbă intervalul până la următoarea repetare.</p></div>' : '';
    var modeTabs = MODE_ITEMS.map(function (item) {
      return '<button type="button" class="mode-tab ' + (state.mode === item.id ? 'is-active' : '') + '" data-action="study-mode" data-mode="' + item.id + '" aria-pressed="' + (state.mode === item.id ? 'true' : 'false') + '"><strong>' + item.label + '</strong><span>' + item.note + '</span></button>';
    }).join('');
    return '<section class="view study-view"><div class="study-topline"><button type="button" class="back-link" data-action="navigate-dashboard">← Panou</button><span class="study-counter">' + position + ' / ' + total + '</span><span class="module-tag ' + module.colorClass + '">' + module.roman + ' · ' + esc(module.short) + '</span></div><div class="study-intro"><div><p class="eyebrow">SESIUNE ACTIVĂ</p><h1>Rămâi cu întrebarea.</h1></div><div class="study-actions">' + button(card.isDifficult ? '★ Dificil' : '☆ Marchează dificil', 'toggle-difficult', 'button-ghost button-small') + '</div></div><div class="mode-tabs" role="tablist" aria-label="Mod de studiu">' + modeTabs + '</div><div class="study-card-wrap"><div class="study-card-meta"><span>' + esc(module.name) + '</span><span>' + (card.reviews || 0) + ' evaluări · ' + (card.isDifficult ? 'marcat dificil' : 'ritm normal') + '</span></div>' + body + ratings + '</div><div class="study-footer"><span><kbd>Space</kbd> verifică răspunsul</span><span><kbd>1–4</kbd> evaluează după răspuns</span><button type="button" class="text-button" data-action="skip-card">Sari peste →</button></div></section>';
  }

  function filterCards() {
    var query = state.query.trim().toLowerCase();
    return state.cards.filter(function (card) {
      var moduleOk = state.moduleFilter === 'all' || card.module === state.moduleFilter;
      var statusOk = state.statusFilter === 'all' ||
        (state.statusFilter === 'due' && isDue(card)) ||
        (state.statusFilter === 'difficult' && card.isDifficult) ||
        (state.statusFilter === 'mastered' && card.repetitions >= 3) ||
        (state.statusFilter === 'unseen' && card.reviews === 0);
      var textOk = !query || (card.question + ' ' + card.answer).toLowerCase().indexOf(query) >= 0;
      return moduleOk && statusOk && textOk;
    }).slice(0, 120);
  }

  function renderAtlas() {
    var tabs = [
      { id: 'search', label: 'Carduri' },
      { id: 'diagrams', label: 'Diagrame' },
      { id: 'concepts', label: 'Hartă conceptuală' },
      { id: 'mnemonics', label: 'Mnemonice' }
    ].map(function (tab) {
      return '<button type="button" class="atlas-tab ' + (state.atlasTab === tab.id ? 'is-active' : '') + '" data-action="atlas-tab" data-tab="' + tab.id + '" aria-selected="' + (state.atlasTab === tab.id ? 'true' : 'false') + '">' + tab.label + '</button>';
    }).join('');
    var content = state.atlasTab === 'diagrams' ? renderDiagrams() : state.atlasTab === 'concepts' ? renderConceptMap() : state.atlasTab === 'mnemonics' ? renderMnemonics() : renderSearch();
    return '<section class="view atlas-view"><div class="view-heading"><div><p class="eyebrow">ATLASUL NEURAL</p><h1>Vezi cum se leagă lucrurile.</h1><p class="view-lede">Căutare pentru precizie, diagrame pentru orientare, concepte pentru imaginea de ansamblu.</p></div><div class="atlas-count"><strong>' + state.cards.length + '</strong><span>carduri în câmp</span></div></div><div class="atlas-tabs" role="tablist" aria-label="Secțiuni atlas">' + tabs + '</div>' + content + '</section>';
  }

  function renderSearch() {
    var results = filterCards();
    var moduleOptions = '<option value="all">Toate modulele</option>' + MODULES.map(function (module) { return '<option value="' + module.id + '"' + (state.moduleFilter === module.id ? ' selected' : '') + '>' + module.roman + ' · ' + esc(module.short) + '</option>'; }).join('');
    var statusOptions = '<option value="all">Orice stare</option><option value="due"' + (state.statusFilter === 'due' ? ' selected' : '') + '>De repetat</option><option value="unseen"' + (state.statusFilter === 'unseen' ? ' selected' : '') + '>Nevăzute</option><option value="difficult"' + (state.statusFilter === 'difficult' ? ' selected' : '') + '>Dificile</option><option value="mastered"' + (state.statusFilter === 'mastered' ? ' selected' : '') + '>Stăpânite</option>';
    var cards = results.map(function (card) {
      var module = getModule(card.module);
      return '<article class="search-card"><div class="search-card-top"><span class="module-tag ' + module.colorClass + '">' + module.roman + ' · ' + esc(module.short) + '</span><span>' + (card.repetitions >= 3 ? 'stăpânit' : card.reviews ? card.reviews + ' evaluări' : 'nou') + '</span></div><h3>' + esc(card.question) + '</h3><p>' + esc(card.answer) + '</p><div class="search-card-bottom"><span>' + (card.isDifficult ? '★ dificil · ' : '') + (isDue(card) ? 'de repetat' : 'următoarea: ' + new Date(card.nextReview).toLocaleDateString('ro-RO')) + '</span>' + button('Studiază', 'study-one', 'button-small button-quiet', ' data-card-id="' + esc(card.id) + '"') + '</div></article>';
    }).join('');
    return '<div class="search-panel"><div class="search-controls"><label class="search-box"><span aria-hidden="true">⌕</span><input class="atlas-search" type="search" value="' + esc(state.query) + '" placeholder="Caută în întrebări și răspunsuri" aria-label="Caută în carduri"><kbd>/</kbd></label><label class="select-wrap"><span>Modul</span><select data-filter="module" aria-label="Filtrează după modul">' + moduleOptions + '</select></label><label class="select-wrap"><span>Stare</span><select data-filter="status" aria-label="Filtrează după stare">' + statusOptions + '</select></label></div><div class="results-summary"><span>' + (state.query || state.moduleFilter !== 'all' || state.statusFilter !== 'all' ? results.length + ' rezultate afișate' : 'Caută sau alege un filtru') + '</span><span>rezultatele rămân în browser</span></div><div class="search-results">' + (cards || '<div class="empty-panel"><span class="empty-glyph">∅</span><h2>Nimic aici încă.</h2><p>Încearcă un alt termen sau elimină filtrele.</p>' + button('Curăță filtrele', 'clear-filters', 'button-secondary button-small') + '</div>') + '</div></div>';
  }

  function renderDiagrams() {
    var diagram = DIAGRAMS.filter(function (item) { return item.id === state.diagramId; })[0] || DIAGRAMS[0];
    var node = diagram.nodes.filter(function (item) { return item.id === state.diagramNode; })[0] || diagram.nodes[0];
    var diagramButtons = DIAGRAMS.map(function (item) {
      return '<button type="button" class="diagram-picker ' + (item.id === diagram.id ? 'is-active' : '') + '" data-action="diagram-select" data-diagram="' + item.id + '"><span class="diagram-index">' + String(DIAGRAMS.indexOf(item) + 1).padStart(2, '0') + '</span><span><strong>' + esc(item.title) + '</strong><small>' + esc(item.subtitle) + '</small></span></button>';
    }).join('');
    var edges = diagram.edges.map(function (edge) {
      var from = diagram.nodes.filter(function (n) { return n.id === edge[0]; })[0];
      var to = diagram.nodes.filter(function (n) { return n.id === edge[1]; })[0];
      return '<line class="diagram-edge" x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '"></line>';
    }).join('');
    var nodes = diagram.nodes.map(function (item) {
      var active = item.id === node.id;
      return '<g class="diagram-node ' + (active ? 'is-selected' : '') + '" data-action="diagram-node" data-node="' + item.id + '" tabindex="0" role="button" aria-label="' + esc(item.label) + (active ? ', selectat' : '') + '"><circle cx="' + item.x + '" cy="' + item.y + '" r="' + (active ? 25 : 21) + '"></circle><text x="' + item.x + '" y="' + (item.y + 4) + '" text-anchor="middle">' + esc(item.label) + '</text></g>';
    }).join('');
    var nodeList = diagram.nodes.map(function (item) { return '<button type="button" class="node-list-button ' + (item.id === node.id ? 'is-active' : '') + '" data-action="diagram-node" data-node="' + item.id + '"><span>+</span>' + esc(item.label) + '</button>'; }).join('');
    return '<div class="diagram-layout"><div class="diagram-picker-list">' + diagramButtons + '</div><article class="diagram-stage"><div class="stage-heading"><div><p class="eyebrow">DIAGRAMĂ ' + String(DIAGRAMS.indexOf(diagram) + 1).padStart(2, '0') + '</p><h2>' + esc(diagram.title) + '</h2><p>' + esc(diagram.subtitle) + '</p></div><span class="stage-note">selectează un nod</span></div><svg class="diagram-art" viewBox="0 0 840 300" role="img" aria-label="' + esc(diagram.title) + '">' + edges + nodes + '</svg><div class="diagram-detail"><div><span class="detail-kicker">NOD SELECTAT</span><h3>' + esc(node.label) + '</h3><p>' + esc(node.description) + '</p></div><div class="node-list">' + nodeList + '</div></div></article></div>';
  }

  function renderConceptMap() {
    var selected = CONCEPTS.filter(function (item) { return item.id === state.conceptId; })[0] || CONCEPTS[0];
    var edges = CONCEPT_EDGES.map(function (edge) {
      var from = CONCEPTS.filter(function (item) { return item.id === edge[0]; })[0];
      var to = CONCEPTS.filter(function (item) { return item.id === edge[1]; })[0];
      return '<line class="concept-edge" x1="' + from.x + '" y1="' + from.y + '" x2="' + to.x + '" y2="' + to.y + '"></line>';
    }).join('');
    var nodes = CONCEPTS.map(function (item) {
      return '<g class="concept-node ' + getModule(item.module).colorClass + ' ' + (item.id === selected.id ? 'is-selected' : '') + '" data-action="concept-select" data-concept="' + item.id + '" tabindex="0" role="button" aria-label="' + esc(item.label) + '"><circle cx="' + item.x + '" cy="' + item.y + '" r="' + (item.id === selected.id ? 19 : 14) + '"></circle><text x="' + item.x + '" y="' + (item.y + 36) + '" text-anchor="middle">' + esc(item.label) + '</text></g>';
    }).join('');
    var related = state.cards.filter(function (card) {
      return (card.question + ' ' + card.answer).toLowerCase().indexOf(selected.label.toLowerCase()) >= 0;
    }).slice(0, 4);
    return '<div class="concept-layout"><article class="concept-stage"><div class="stage-heading"><div><p class="eyebrow">HARTĂ CONCEPTUALĂ</p><h2>Conceptele au vecini.</h2><p>O hartă orientativă pentru a alege următoarea întrebare.</p></div><span class="stage-note">selectează un concept</span></div><svg class="concept-art" viewBox="0 0 860 450" role="img" aria-label="Hartă conceptuală a noțiunilor din neuroștiințe">' + edges + nodes + '</svg><div class="concept-key">' + MODULES.map(function (module) { return '<span><i class="' + module.colorClass + '"></i>' + esc(module.short) + '</span>'; }).join('') + '</div></article><aside class="concept-detail"><span class="detail-kicker">CONCEPT SELECTAT</span><h2>' + esc(selected.label) + '</h2><p>' + esc(selected.detail) + '</p><div class="related-heading">Carduri asociate</div>' + (related.length ? related.map(function (card) { return '<button type="button" class="related-card" data-action="study-one" data-card-id="' + esc(card.id) + '"><span>' + esc(card.question) + '</span><b>→</b></button>'; }).join('') : '<p class="muted-copy">Caută termenul în atlas pentru a găsi carduri asociate.</p>') + '</aside></div>';
  }

  function renderMnemonics() {
    return '<div class="mnemonic-grid">' + MNEMONICS.map(function (item, index) {
      var module = getModule(item.module);
      return '<article class="mnemonic-tile ' + module.colorClass + '"><div class="mnemonic-top"><span>' + String(index + 1).padStart(2, '0') + '</span><span>' + module.roman + ' · ' + esc(module.short) + '</span></div><h2>' + esc(item.title) + '</h2><p class="mnemonic-text">' + esc(item.text) + '</p><p class="mnemonic-use">' + esc(item.use) + '</p></article>';
    }).join('') + '</div>';
  }

  function makeExamQuestion(card) {
    return { cardId: card.id, module: card.module, prompt: card.question, answer: card.answer, options: getOptions(card), selected: null };
  }

  function startExam(size) {
    var count = Math.min(Number(size) || 10, state.cards.length);
    var cards = shuffled(state.cards, dateKey(now()) + '-exam').slice(0, count);
    state.exam = { questions: cards.map(makeExamQuestion), index: 0, startedAt: now().toISOString(), endAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(), complete: false, result: null };
    state.view = 'exam';
    render();
  }

  function finishExam(expired) {
    if (!state.exam || state.exam.complete) return;
    var correct = state.exam.questions.filter(function (question) { return question.selected === question.answer; }).length;
    var byModule = {};
    state.exam.questions.forEach(function (question) {
      if (!byModule[question.module]) byModule[question.module] = { total: 0, correct: 0 };
      byModule[question.module].total += 1;
      if (question.selected === question.answer) byModule[question.module].correct += 1;
    });
    state.exam.complete = true;
    state.exam.result = { correct: correct, total: state.exam.questions.length, score: Math.round((correct / state.exam.questions.length) * 100), byModule: byModule, expired: Boolean(expired) };
    state.history.push({ type: 'exam', at: now().toISOString(), score: state.exam.result.score, total: state.exam.questions.length });
    persist();
    stopExamClock();
    render();
  }

  function stopExamClock() {
    if (examClock) window.clearInterval(examClock);
    examClock = null;
  }

  function syncExamClock() {
    if (!state.exam || state.exam.complete) {
      stopExamClock();
      return;
    }
    if (examClock) return;
    examClock = window.setInterval(function () {
      if (!state.exam || state.exam.complete) return stopExamClock();
      if (new Date(state.exam.endAt) <= now()) finishExam(true);
      else {
        var timer = document.getElementById('exam-timer');
        if (timer) timer.textContent = formatDuration(new Date(state.exam.endAt) - now());
      }
    }, 1000);
  }

  function formatDuration(milliseconds) {
    var seconds = Math.max(0, Math.floor(milliseconds / 1000));
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
  }

  function renderExam() {
    if (!state.exam) {
      var sizes = [10, 20, 50].map(function (size) {
        return '<button type="button" class="exam-size ' + (state.examSize === size ? 'is-active' : '') + '" data-action="exam-size" data-size="' + size + '"><strong>' + size + '</strong><span>întrebări</span></button>';
      }).join('');
      return '<section class="view exam-view"><div class="view-heading"><div><p class="eyebrow">CAMERA DE EXAMEN</p><h1>Testează ce rămâne fără indicii.</h1><p class="view-lede">Un set de întrebări cu variante, generat din cele 812 de carduri. Rezultatul este un reper personal, nu o predicție.</p></div></div><div class="exam-start-card"><div class="exam-glyph" aria-hidden="true">△</div><div><span class="detail-kicker">SIMULARE LOCALĂ</span><h2>Alege lungimea sesiunii.</h2><p>Ai 45 de minute; poți încheia mai devreme. Răspunsurile nu părăsesc browserul.</p><div class="exam-size-list">' + sizes + '</div>' + button('Pornește simularea', 'exam-start', 'button-primary') + '</div></div><div class="exam-rules"><div><strong>01</strong><span>O singură variantă este corectă.</span></div><div><strong>02</strong><span>Poți reveni la întrebările anterioare.</span></div><div><strong>03</strong><span>La final vezi rezultatul pe module.</span></div></div></section>';
    }
    if (state.exam.complete) return renderExamResult();
    var question = state.exam.questions[state.exam.index];
    var total = state.exam.questions.length;
    var options = question.options.map(function (option, index) {
      var selected = question.selected === option;
      return '<button type="button" class="exam-option ' + (selected ? 'is-selected' : '') + '" data-action="exam-option" data-option="' + esc(option) + '" aria-pressed="' + (selected ? 'true' : 'false') + '"><span>' + String.fromCharCode(65 + index) + '</span><strong>' + esc(option) + '</strong></button>';
    }).join('');
    var navigator = state.exam.questions.map(function (item, index) {
      return '<button type="button" class="exam-dot ' + (index === state.exam.index ? 'is-current' : '') + ' ' + (item.selected !== null ? 'is-answered' : '') + '" data-action="exam-go" data-index="' + index + '" aria-label="Întrebarea ' + (index + 1) + (item.selected !== null ? ', completată' : '') + '">' + (index + 1) + '</button>';
    }).join('');
    return '<section class="view exam-view"><div class="exam-topline"><button type="button" class="back-link" data-action="navigate-dashboard">← Abandonează</button><span>întrebarea ' + (state.exam.index + 1) + ' din ' + total + '</span><strong id="exam-timer">' + formatDuration(new Date(state.exam.endAt) - now()) + '</strong></div><div class="exam-progress">' + progressBar(Math.round(((state.exam.index + 1) / total) * 100), 'Progres simulare') + '</div><div class="exam-question-card"><div class="question-number">Q' + String(state.exam.index + 1).padStart(2, '0') + '<span>' + getModule(question.module).short + '</span></div><h1>' + esc(question.prompt) + '</h1><div class="exam-options">' + options + '</div></div><div class="exam-navigation"><div class="exam-dots">' + navigator + '</div><div class="exam-nav-actions">' + button('← Înapoi', 'exam-prev', 'button-ghost button-small', state.exam.index === 0 ? ' disabled' : '') + (state.exam.index < total - 1 ? button('Următoarea →', 'exam-next', 'button-secondary button-small') : button('Încheie simularea', 'exam-finish', 'button-primary button-small')) + '</div></div></section>';
  }

  function renderExamResult() {
    var result = state.exam.result;
    var moduleRows = Object.keys(result.byModule).map(function (moduleId) {
      var item = result.byModule[moduleId];
      return '<div class="result-module"><span>' + esc(getModule(moduleId).short) + '</span>' + progressBar(Math.round((item.correct / item.total) * 100), 'Rezultat ' + getModule(moduleId).short) + '<strong>' + item.correct + '/' + item.total + '</strong></div>';
    }).join('');
    return '<section class="view exam-view"><div class="result-hero"><p class="eyebrow">REZULTAT SALVAT</p><div class="result-score">' + result.score + '<span>%</span></div><h1>' + (result.score >= 80 ? 'Circuitul ține.' : result.score >= 60 ? 'Circuitul se conturează.' : 'Ai găsit următoarele conexiuni.') + '</h1><p>' + result.correct + ' răspunsuri corecte din ' + result.total + (result.expired ? '. Timpul s-a încheiat.' : '.') + '</p><div class="hero-actions">' + button('Mai încearcă o simulare', 'exam-reset', 'button-primary') + button('Vezi progresul', 'navigate-progress', 'button-secondary') + '</div></div><div class="result-card"><div class="card-overline"><span class="card-number">01</span><span>pe module</span></div><h2>Unde merită să revii.</h2>' + moduleRows + '</div></section>';
  }

  function activityData() {
    var result = [];
    var today = new Date();
    for (var i = 13; i >= 0; i -= 1) {
      var date = new Date(today);
      date.setDate(today.getDate() - i);
      var key = dateKey(date);
      result.push({ key: key, label: date.toLocaleDateString('ro-RO', { weekday: 'short' }).replace('.', ''), count: state.history.filter(function (entry) { return entry.type !== 'exam' && dateKey(entry.at) === key; }).length });
    }
    return result;
  }

  function achievements() {
    var stats = currentStats();
    var list = [
      { icon: '○', title: 'Prima întrebare', done: stats.reviewed >= 1, note: 'Completează prima evaluare.' },
      { icon: '◌', title: 'Ritm de trei zile', done: stats.streak >= 3, note: 'Studiază trei zile consecutive.' },
      { icon: '✦', title: 'O sută de reveniri', done: stats.reviewed >= 100, note: 'Adună 100 de evaluări.' },
      { icon: '◎', title: 'Un modul întreg', done: MODULES.some(function (module) { return moduleStats(module.id).progress === 100; }), note: 'Stăpânește toate cardurile unui modul.' },
      { icon: '✧', title: 'Câmp complet', done: stats.mastered === stats.total && stats.total > 0, note: 'Stăpânește toate cardurile.' }
    ];
    return list;
  }

  function renderProgress() {
    var stats = currentStats();
    var activity = activityData();
    var maxActivity = Math.max.apply(null, activity.map(function (item) { return item.count; }).concat([1]));
    var bars = activity.map(function (item) { return '<div class="activity-bar-wrap"><span class="activity-count">' + (item.count || '') + '</span><div class="activity-bar" style="--bar-height:' + Math.max(5, Math.round((item.count / maxActivity) * 100)) + '%"></div><span>' + esc(item.label) + '</span></div>'; }).join('');
    var rows = MODULES.map(function (module) {
      var item = moduleStats(module.id);
      return '<tr><th scope="row"><span class="module-table-dot ' + module.colorClass + '"></span>' + module.roman + ' · ' + esc(module.name) + '</th><td>' + item.total + '</td><td>' + item.mastered + '</td><td>' + item.due + '</td><td><div class="table-progress">' + progressBar(item.progress, 'Progres ' + module.name) + '<span>' + item.progress + '%</span></div></td></tr>';
    }).join('');
    var badges = achievements().map(function (item) { return '<div class="badge-item ' + (item.done ? 'is-earned' : '') + '"><span class="badge-icon">' + item.icon + '</span><div><strong>' + esc(item.title) + '</strong><span>' + esc(item.done ? 'obținut' : item.note) + '</span></div></div>'; }).join('');
    return '<section class="view progress-view"><div class="view-heading"><div><p class="eyebrow">RAPORT DE LABORATOR</p><h1>Progresul devine vizibil.</h1><p class="view-lede">O privire asupra ritmului, nu o notă despre valoarea ta.</p></div><div class="report-date">' + now().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' }) + '</div></div><div class="progress-hero"><div><span class="detail-kicker">ACURATEȚE PE CARDURI</span><strong>' + (stats.reviewed ? stats.accuracy + '%' : '—') + '</strong><p>' + stats.reviewed + ' evaluări înregistrate local.</p></div><div class="goal-ring"><span>' + Math.min(100, Math.round((stats.todayReviews / stats.goal) * 100)) + '%</span><small>obiectiv azi</small></div><div><span class="detail-kicker">SERIE CURENTĂ</span><strong>' + stats.streak + ' zile</strong><p>' + (stats.streak ? 'Circuitul rămâne activ.' : 'Prima zi poate începe acum.') + '</p></div></div><div class="progress-grid"><article class="report-card activity-card"><div class="card-overline"><span class="card-number">01</span><span>ultimele 14 zile</span></div><h2>Frecvența revenirilor.</h2><div class="activity-chart" aria-label="Activitatea ultimelor 14 zile">' + bars + '</div></article><article class="report-card"><div class="card-overline"><span class="card-number">02</span><span>repere</span></div><h2>Urmele rămase.</h2><div class="badge-list">' + badges + '</div></article></div><article class="report-card module-report"><div class="card-overline"><span class="card-number">03</span><span>pe module</span></div><h2>Unde se află circuitul.</h2><div class="table-scroll"><table><thead><tr><th scope="col">Modul</th><th scope="col">Total</th><th scope="col">Stăpânite</th><th scope="col">Scadente</th><th scope="col">Progres</th></tr></thead><tbody>' + rows + '</tbody></table></div></article></section>';
  }

  function renderSettings() {
    return '<section class="view settings-view"><div class="view-heading"><div><p class="eyebrow">INSTRUMENTE</p><h1>Reglează laboratorul.</h1><p class="view-lede">Datele rămân locale, iar opțiunile de aici afectează doar experiența ta.</p></div></div><div class="settings-grid"><article class="settings-card"><span class="detail-kicker">APARENȚĂ</span><h2>Temă</h2><p>Alege modul în care vrei să vezi câmpul.</p><div class="theme-choices"><button type="button" class="theme-choice ' + (state.theme === 'light' ? 'is-active' : '') + '" data-action="set-theme" data-theme="light" aria-pressed="' + (state.theme === 'light' ? 'true' : 'false') + '"><span>☼</span><strong>Luminos</strong></button><button type="button" class="theme-choice ' + (state.theme === 'dark' ? 'is-active' : '') + '" data-action="set-theme" data-theme="dark" aria-pressed="' + (state.theme === 'dark' ? 'true' : 'false') + '"><span>☾</span><strong>Întunecat</strong></button></div></article><article class="settings-card"><span class="detail-kicker">RITM ZILNIC</span><h2>Obiectiv</h2><p>Câte carduri vrei să evaluezi într-o zi obișnuită?</p><label class="number-control"><input type="number" min="5" max="200" value="' + state.dailyGoal + '" data-setting="daily-goal"><span>carduri pe zi</span></label></article><article class="settings-card"><span class="detail-kicker">DATE LOCALE</span><h2>Mută-ți progresul.</h2><p>Exportă o copie JSON sau importă una existentă. Nimic nu pleacă automat din browser.</p><div class="settings-actions">' + button('Export progres', 'export-progress', 'button-secondary button-small') + button('Import progres', 'import-progress', 'button-ghost button-small') + '</div></article><article class="settings-card"><span class="detail-kicker">FUNCȚII PLANIFICATE</span><h2>Fără promisiuni ascunse.</h2><p>Diagramele, harta, simularea și mnemonicele sunt acum disponibile aici. Sincronizarea în cloud și notificările rămân în afara acestei versiuni.</p>' + (state.installable ? button('Instalează aplicația', 'install-app', 'button-secondary button-small') : '<span class="settings-note">Pentru instalare, folosește meniul browserului dacă acesta oferă opțiunea.</span>') + '</article></div><div class="danger-zone"><div><span class="detail-kicker">RESETARE</span><h2>Șterge progresul local.</h2><p>Cardurile rămân, dar evaluările și marcajele se întorc la starea inițială.</p></div>' + button('Reset progres', 'reset-progress', 'button-danger button-small') + '</div></section>';
  }

  function clearFilters() {
    state.query = '';
    state.moduleFilter = 'all';
    state.statusFilter = 'all';
    focusAfterRender = '.atlas-search';
    render();
  }

  function handleClick(event) {
    var target = event.target.closest ? event.target.closest('[data-action]') : null;
    if (!target || !root.contains(target)) return;
    var action = target.getAttribute('data-action');
    if (action === 'navigate' || action.indexOf('navigate-') === 0) {
      var view = target.getAttribute('data-view') || action.replace('navigate-', '');
      state.view = view === 'dashboard' ? 'dashboard' : view;
      if (state.view === 'atlas') state.atlasTab = 'search';
      render();
    } else if (action === 'theme-toggle') {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      persist();
      render();
    } else if (action === 'set-theme') {
      state.theme = target.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      persist();
      render();
    } else if (action === 'start-all-due') {
      startStudy('all', true);
    } else if (action === 'start-module-due') {
      startStudy(target.getAttribute('data-module'), true);
    } else if (action === 'start-module-all') {
      startStudy(target.getAttribute('data-module'), false);
    } else if (action === 'navigate-study') {
      startStudy('all', true);
    } else if (action === 'open-mnemonics') {
      state.view = 'atlas';
      state.atlasTab = 'mnemonics';
      render();
    } else if (action === 'toggle-answer') {
      state.showAnswer = true;
      render();
    } else if (action === 'study-mode') {
      state.mode = target.getAttribute('data-mode') || 'classic';
      state.showAnswer = false;
      state.studyChoice = null;
      state.recallText = '';
      state.recallRevealed = false;
      render();
    } else if (action === 'study-choice') {
      state.studyChoice = target.getAttribute('data-choice');
      state.showAnswer = true;
      render();
    } else if (action === 'reveal-recall') {
      markRecall();
    } else if (action === 'toggle-difficult') {
      toggleDifficult();
    } else if (action === 'rate-card') {
      rateCurrent(target.getAttribute('data-quality'));
    } else if (action === 'skip-card') {
      if (state.studyIndex < state.studyQueue.length - 1) {
        state.studyIndex += 1;
        state.showAnswer = false;
        state.studyChoice = null;
        state.recallText = '';
        state.recallRevealed = false;
        render();
      }
    } else if (action === 'clear-filters') {
      clearFilters();
    } else if (action === 'atlas-tab') {
      state.atlasTab = target.getAttribute('data-tab') || 'search';
      render();
    } else if (action === 'study-one') {
      startStudy('all', false, [target.getAttribute('data-card-id')]);
    } else if (action === 'diagram-select') {
      state.diagramId = target.getAttribute('data-diagram') || 'neuron';
      state.diagramNode = (DIAGRAMS.filter(function (item) { return item.id === state.diagramId; })[0] || DIAGRAMS[0]).nodes[0].id;
      render();
    } else if (action === 'diagram-node') {
      state.diagramNode = target.getAttribute('data-node') || state.diagramNode;
      render();
    } else if (action === 'concept-select') {
      state.conceptId = target.getAttribute('data-concept') || state.conceptId;
      render();
    } else if (action === 'exam-size') {
      state.examSize = Number(target.getAttribute('data-size')) || 10;
      render();
    } else if (action === 'exam-start') {
      startExam(state.examSize);
    } else if (action === 'exam-option') {
      if (state.exam) state.exam.questions[state.exam.index].selected = target.getAttribute('data-option');
      render();
    } else if (action === 'exam-next') {
      if (state.exam && state.exam.index < state.exam.questions.length - 1) state.exam.index += 1;
      render();
    } else if (action === 'exam-prev') {
      if (state.exam && state.exam.index > 0) state.exam.index -= 1;
      render();
    } else if (action === 'exam-go') {
      if (state.exam) state.exam.index = Number(target.getAttribute('data-index')) || 0;
      render();
    } else if (action === 'exam-finish') {
      finishExam(false);
    } else if (action === 'exam-reset') {
      state.exam = null;
      render();
    } else if (action === 'export-progress') {
      exportProgress();
    } else if (action === 'import-progress') {
      importProgress();
    } else if (action === 'reset-progress') {
      resetProgress();
    } else if (action === 'install-app') {
      installApp();
    }
  }

  function handleInput(event) {
    if (event.target.matches('.atlas-search')) {
      state.query = event.target.value;
      focusAfterRender = '.atlas-search';
      render();
    } else if (event.target.matches('#recall-input')) {
      state.recallText = event.target.value;
    }
  }

  function handleChange(event) {
    if (event.target.matches('[data-filter="module"]')) {
      state.moduleFilter = event.target.value;
      render();
    } else if (event.target.matches('[data-filter="status"]')) {
      state.statusFilter = event.target.value;
      render();
    } else if (event.target.matches('[data-setting="daily-goal"]')) {
      state.dailyGoal = Math.max(5, Math.min(200, Number(event.target.value) || 20));
      persist();
      showToast('Obiectivul zilnic a fost actualizat.');
      render();
    }
  }

  function exportProgress() {
    var payload = JSON.stringify({ exportedAt: now().toISOString(), app: 'Neuroștiințe UBB — pregătire pentru admiterea la Psihologie', version: 1, cards: state.cards, history: state.history, settings: { theme: state.theme, dailyGoal: state.dailyGoal } }, null, 2);
    var blob = new Blob([payload], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = 'neurostiinte-progres-' + dateKey(now()) + '.json';
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exportul a fost pregătit.');
  }

  function importProgress() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = function () {
      var file = input.files && input.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        try {
          var imported = JSON.parse(reader.result);
          var importedCards = Array.isArray(imported) ? imported : imported.cards;
          if (!Array.isArray(importedCards) || !importedCards.length) throw new Error('format');
          var byHash = {};
          importedCards.forEach(function (card) { if (card && card.hash) byHash[card.hash] = card; });
          state.cards = rawCards.map(function (raw, index) {
            var hash = hashString(String(raw.q || raw.question || '') + String(raw.a || raw.answer || ''));
            return makeCard(raw, index, byHash[hash]);
          }).filter(function (card) { return card.question || card.answer; });
          if (!Array.isArray(imported) && Array.isArray(imported.history)) state.history = imported.history;
          persist();
          showToast('Progres importat pentru ' + state.cards.length + ' carduri.');
          render();
        } catch (error) {
          showToast('Fișierul nu are un format de progres recunoscut.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function resetProgress() {
    if (!window.confirm('Resetezi progresul local? Această acțiune nu poate fi anulată.')) return;
    state.cards = state.cards.map(function (card) {
      return Object.assign({}, card, { interval: 0, easeFactor: 2.5, repetitions: 0, reviews: 0, correct: 0, nextReview: now().toISOString(), lastReview: null, isDifficult: false });
    });
    state.history = [];
    persist();
    showToast('Progresul a fost resetat.');
    render();
  }

  function installApp() {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then(function () {
      deferredInstallPrompt = null;
      state.installable = false;
      render();
    });
  }

  function bindEvents() {
    root.onclick = handleClick;
    root.oninput = handleInput;
    root.onchange = handleChange;
    var focusElement = focusAfterRender ? root.querySelector(focusAfterRender) : null;
    if (focusElement) {
      focusElement.focus();
      if (focusElement.setSelectionRange) focusElement.setSelectionRange(focusElement.value.length, focusElement.value.length);
      focusAfterRender = '';
    }
    syncExamClock();
  }

  function render() {
    if (!root) return;
    syncThemeMeta();
    root.innerHTML = renderShell();
    bindEvents();
    var main = root.querySelector('#main-content');
    if (main && state.view !== 'study') document.title = 'Neuroștiințe pentru admiterea la Psihologie UBB Cluj';
  }

  function syncThemeMeta() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', state.theme === 'dark' ? '#091522' : '#f4f0e7');
  }

  function keyHandler(event) {
    var tag = event.target && event.target.tagName ? event.target.tagName.toLowerCase() : '';
    var typing = tag === 'input' || tag === 'textarea' || tag === 'select' || event.target.isContentEditable;
    if (event.key === '/' && !typing) {
      var search = root.querySelector('.atlas-search');
      if (search) {
        event.preventDefault();
        search.focus();
      } else {
        state.view = 'atlas';
        state.atlasTab = 'search';
        render();
        var nextSearch = root.querySelector('.atlas-search');
        if (nextSearch) nextSearch.focus();
      }
    }
    if (state.view === 'study' && !typing) {
      if (event.key === ' ' && state.mode !== 'mcq' && state.mode !== 'recall') {
        event.preventDefault();
        state.showAnswer = true;
        render();
      }
      if (state.showAnswer || state.studyChoice !== null || state.recallRevealed) {
        var qualities = { '1': '1', '2': '1', '3': '3', '4': '4' };
        if (qualities[event.key]) rateCurrent(qualities[event.key]);
      }
    }
  }

  function registerPwa() {
    if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
      navigator.serviceWorker.register('./sw.js').catch(function () {});
    }
    window.addEventListener('beforeinstallprompt', function (event) {
      event.preventDefault();
      deferredInstallPrompt = event;
      state.installable = true;
      if (state.view === 'settings') render();
    });
    window.addEventListener('appinstalled', function () {
      deferredInstallPrompt = null;
      state.installable = false;
    });
  }

  function injectStyles() {
    if (document.getElementById('neuro-app-styles')) return;
    var css = [
      ':root { color-scheme: light; --bg: #f4f0e7; --surface: #fffaf1; --surface-strong: #ffffff; --surface-muted: #e9e3d8; --ink: #122338; --muted: #415268; --faint: #394b5c; --line: #c8d0d0; --line-strong: #9fadb3; --coral: #7d241b; --coral-soft: #f0d8cf; --teal: #005455; --teal-soft: #cde8e3; --gold: #6a4300; --gold-soft: #fff0ca; --module-1: #4f439d; --module-2: #6b3fa0; --module-3: #8a2f6e; --module-4: #915a00; --module-5: #006653; --module-6: #006b7a; --shadow: 0 22px 60px rgba(21, 38, 55, .10); --shadow-small: 0 7px 24px rgba(21, 38, 55, .08); --on-accent: #fffaf1; --radius: 18px; --serif: Iowan Old Style, Baskerville, Georgia, serif; --sans: Avenir Next, Futura, Trebuchet MS, sans-serif; --mono: SFMono-Regular, Consolas, Liberation Mono, monospace; }',
      '[data-theme="dark"] { color-scheme: dark; --bg: #091522; --surface: #0e2032; --surface-strong: #142a40; --surface-muted: #19334a; --ink: #f3eee4; --muted: #c0cbd2; --faint: #b4c5cc; --line: #365068; --line-strong: #5b7488; --coral: #ffb0a6; --coral-soft: #2b1c23; --teal: #5bd2c8; --teal-soft: #0c2e30; --gold: #e8bd61; --gold-soft: #302715; --module-1: #b9b0ff; --module-2: #cf9eff; --module-3: #ff9ed8; --module-4: #f3c16b; --module-5: #72dfae; --module-6: #7bdff0; --shadow: 0 24px 64px rgba(0, 0, 0, .28); --shadow-small: 0 8px 24px rgba(0, 0, 0, .22); --on-accent: #081521; }',
      '[data-theme="dark"] .app-shell { background-image: radial-gradient(circle at 85% 0%, rgba(91, 210, 200, .08), transparent 30rem); }',
      '[data-theme="light"] .app-shell { background-image: radial-gradient(circle at 78% 0%, rgba(0, 111, 112, .06), transparent 32rem); }',
      '.app-shell, .app-shell *, .app-shell *::before, .app-shell *::after { box-sizing: border-box; }',
      '.app-shell { min-height: 100vh; background-color: var(--bg); color: var(--ink); font-family: var(--sans); line-height: 1.45; transition: background-color .2s ease, color .2s ease; }',
      '.app-shell button, .app-shell input, .app-shell select, .app-shell textarea { font: inherit; }',
      '.app-shell button { color: inherit; }',
      '.app-shell button:focus-visible, .app-shell input:focus-visible, .app-shell select:focus-visible, .app-shell textarea:focus-visible, .app-shell [tabindex="0"]:focus-visible { outline: 3px solid var(--teal); outline-offset: 3px; }',
      '.skip-link { position: fixed; left: 14px; top: -60px; z-index: 50; padding: 10px 14px; background: var(--ink); color: var(--bg); border-radius: 8px; } .skip-link:focus { top: 14px; }',
      '.app-layout { min-height: 100vh; display: grid; grid-template-columns: 248px minmax(0, 1fr); }',
      '.sidebar { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; padding: 28px 20px 22px; border-right: 1px solid var(--line); background: var(--bg); }',
      '.brand { display: flex; gap: 11px; align-items: center; } .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid var(--teal); color: var(--teal); font: 700 11px var(--mono); letter-spacing: -.08em; border-radius: 50%; } .brand-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--coral); box-shadow: 0 0 0 4px var(--coral-soft); } .brand-kicker, .eyebrow, .detail-kicker, .card-overline, .card-type, .answer-label { font: 700 10px var(--mono); letter-spacing: .14em; text-transform: uppercase; } .brand-kicker { color: var(--teal); font-size: 9px; } .brand-name { font: 700 20px var(--serif); letter-spacing: -.03em; } .brand-sub { color: var(--muted); font-size: 11px; margin-top: -2px; }',
      '.sidebar-rule { width: 100%; border-top: 1px solid var(--line); margin: 33px 0 20px; } .nav-list { display: grid; gap: 5px; } .nav-item { display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px; border: 0; border-radius: 10px; background: transparent; color: var(--muted); text-align: left; cursor: pointer; font-size: 13px; } .nav-item:hover { background: var(--surface-muted); color: var(--ink); } .nav-item.is-active { background: var(--surface-strong); color: var(--ink); box-shadow: var(--shadow-small); } .nav-icon { width: 19px; text-align: center; color: var(--teal); font-size: 17px; }',
      '.sidebar-bottom { margin-top: auto; display: grid; gap: 18px; } .streak-mini { display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid var(--line); border-radius: 12px; } .streak-orbit { color: var(--coral); font-size: 20px; } .streak-mini strong, .streak-mini span, .goal-mini span { display: block; } .streak-mini strong { font-size: 12px; } .streak-mini span { color: var(--muted); font-size: 10px; } .goal-mini { display: grid; gap: 7px; color: var(--muted); font: 10px var(--mono); }',
      '.app-column { min-width: 0; } .topbar { height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 5vw; border-bottom: 1px solid var(--line); } .topbar-meta { display: flex; gap: 10px; align-items: center; color: var(--muted); font: 10px var(--mono); text-transform: uppercase; letter-spacing: .08em; } .pulse { width: 6px; height: 6px; background: var(--teal); border-radius: 50%; box-shadow: 0 0 0 4px var(--teal-soft); } .kbd, kbd { padding: 2px 5px; border: 1px solid var(--line-strong); border-radius: 4px; color: var(--muted); font: 10px var(--mono); } .icon-button { width: 32px; height: 32px; border: 1px solid var(--line); border-radius: 50%; background: var(--surface); cursor: pointer; font-size: 16px; } .mobile-brand { display: none; align-items: center; gap: 9px; font: 700 18px var(--serif); }',
      '.main-content { max-width: 1440px; margin: 0 auto; padding: 54px 5vw 90px; } .view { animation: view-in .35s ease both; } @keyframes view-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: none; } } .eyebrow, .detail-kicker { color: var(--teal); } .view h1, .view h2, .view h3, .view p { margin-top: 0; } .view h1 { max-width: 750px; margin-bottom: 14px; font: 700 clamp(38px, 5vw, 70px)/.97 var(--serif); letter-spacing: -.055em; } .view h2 { font: 700 28px/1.05 var(--serif); letter-spacing: -.04em; } .view h3 { font: 700 18px/1.15 var(--serif); letter-spacing: -.025em; } .view-lede { max-width: 610px; color: var(--muted); font-size: 16px; }',
      '.hero-grid { display: grid; grid-template-columns: minmax(280px, .85fr) minmax(400px, 1.15fr); gap: clamp(28px, 5vw, 82px); align-items: center; } .hero-copy { padding: 20px 0; } .hero-copy h1 { max-width: 470px; } .hero-lede { max-width: 480px; color: var(--muted); font-size: 16px; } .hero-actions { display: flex; gap: 10px; flex-wrap: wrap; margin: 26px 0 18px; } .hero-footnote { display: flex; align-items: center; gap: 8px; color: var(--faint); font-size: 11px; } .signal-mark { color: var(--coral); font-size: 18px; }',
      '.button { display: inline-flex; align-items: center; justify-content: center; min-height: 42px; padding: 10px 16px; border: 1px solid transparent; border-radius: 9px; cursor: pointer; font-weight: 700; font-size: 12px; text-decoration: none; transition: transform .18s ease, background-color .18s ease, border-color .18s ease; } .button:hover { transform: translateY(-1px); } .button:disabled { cursor: not-allowed; opacity: .45; transform: none; } .button-primary { background: var(--coral); color: var(--on-accent) !important; } .button-primary:hover { background: var(--ink); } .button-secondary { background: var(--teal); color: var(--on-accent) !important; } .button-secondary:hover { background: var(--ink); } .button-ghost { background: transparent; border-color: var(--line-strong); } .button-quiet { background: var(--surface-muted); border-color: transparent; } .button-danger { background: var(--coral-soft); border-color: var(--coral); color: var(--coral) !important; } .button-small { min-height: 34px; padding: 7px 11px; font-size: 11px; } .text-button, .back-link { border: 0; padding: 3px 0; background: transparent; color: var(--teal); cursor: pointer; font-size: 12px; font-weight: 700; } .back-link { color: var(--muted); font-weight: 500; }',
      '.neural-panel { min-width: 0; padding: 20px 18px 17px; border: 1px solid var(--line); border-radius: 22px; background: var(--surface); box-shadow: var(--shadow); } .panel-label, .neural-legend, .study-topline, .study-footer, .exam-topline { display: flex; justify-content: space-between; gap: 12px; color: var(--muted); font: 10px var(--mono); text-transform: uppercase; letter-spacing: .1em; } .neural-map { display: block; width: 100%; height: auto; margin: 18px 0 8px; } .neural-line, .neural-arc { stroke: var(--line-strong); stroke-width: 1.2; fill: none; } .neural-arc { stroke: var(--teal); stroke-dasharray: 2 9; opacity: .7; } .neural-node circle { fill: var(--surface-strong); stroke: currentColor; stroke-width: 2; } .neural-node text { fill: currentColor; font: 700 11px var(--mono); } .neural-node.module-m1 { color: var(--module-1); } .neural-node.module-m2 { color: var(--module-2); } .neural-node.module-m3 { color: var(--module-3); } .neural-node.module-m4 { color: var(--module-4); } .neural-node.module-m5 { color: var(--module-5); } .neural-node.module-m6 { color: var(--module-6); } .neural-legend { justify-content: flex-start; font-size: 9px; text-transform: none; letter-spacing: 0; } .legend-dot { width: 7px; height: 7px; display: inline-block; margin-right: 4px; border-radius: 50%; background: var(--teal); } .legend-rest { background: var(--line-strong); }',
      '.stat-strip { display: grid; grid-template-columns: repeat(4, 1fr); margin: 48px 0 68px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); } .stat-cell { min-height: 128px; display: flex; flex-direction: column; justify-content: center; padding: 18px 22px; border-right: 1px solid var(--line); } .stat-cell:last-child { border-right: 0; } .stat-label, .stat-note { color: var(--muted); font: 10px var(--mono); text-transform: uppercase; letter-spacing: .1em; } .stat-cell strong { margin: 5px 0 1px; font: 700 33px var(--serif); } .stat-note { font: 10px var(--sans); text-transform: none; letter-spacing: 0; }',
      '.section-heading, .view-heading { display: flex; justify-content: space-between; align-items: end; gap: 20px; margin-bottom: 24px; } .section-heading h2 { margin-bottom: 0; } .module-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 13px; } .module-card, .lab-card, .report-card, .settings-card, .exam-start-card, .result-card { border: 1px solid var(--line); background: var(--surface); border-radius: var(--radius); } .module-card { padding: 18px; } .module-card-head { display: grid; grid-template-columns: 31px 1fr auto; align-items: start; gap: 10px; margin-bottom: 18px; } .module-index { display: grid; place-items: center; width: 28px; height: 28px; border: 1px solid currentColor; border-radius: 50%; color: var(--teal); font: 11px var(--mono); } .module-card h3 { margin-bottom: 3px; } .module-card p, .module-card-head p { margin: 0; color: var(--muted); font-size: 11px; } .module-percent { font: 700 18px var(--serif); } .module-card-stats { display: flex; justify-content: space-between; margin: 13px 0 16px; color: var(--muted); font-size: 10px; } .module-card-stats b { color: var(--ink); font-size: 13px; } .module-card-actions { display: flex; gap: 7px; } .module-card-actions .button { flex: 1; }',
      '.progress-line { position: relative; height: 5px; overflow: hidden; border-radius: 10px; background: var(--surface-muted); } .progress-line span { display: block; width: var(--progress); height: 100%; border-radius: inherit; background: var(--teal); transition: width .35s ease; } .module-m1 .progress-line span, .module-table-dot.module-m1 { background: var(--module-1); } .module-m2 .progress-line span, .module-table-dot.module-m2 { background: var(--module-2); } .module-m3 .progress-line span, .module-table-dot.module-m3 { background: var(--module-3); } .module-m4 .progress-line span, .module-table-dot.module-m4 { background: var(--module-4); } .module-m5 .progress-line span, .module-table-dot.module-m5 { background: var(--module-5); } .module-m6 .progress-line span, .module-table-dot.module-m6 { background: var(--module-6); }',
      '.lower-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 13px; margin-top: 13px; } .lab-card { min-height: 220px; padding: 23px; } .lab-card h3 { max-width: 350px; margin: 31px 0 10px; font-size: 24px; } .lab-card p { max-width: 450px; color: var(--muted); font-size: 13px; } .card-overline { display: flex; justify-content: space-between; align-items: center; color: var(--muted); font-size: 9px; letter-spacing: .08em; } .card-number { color: var(--coral); } .mnemonic-card { background: var(--teal-soft); border-color: transparent; } .mnemonic-card h3 { color: var(--ink); }',
      '.study-topline, .exam-topline { align-items: center; margin-bottom: 35px; } .study-counter { color: var(--ink); } .module-tag { display: inline-flex; align-items: center; width: fit-content; padding: 4px 8px; border-radius: 5px; background: var(--surface-muted); color: var(--muted); font: 10px var(--mono); } .study-intro { display: flex; justify-content: space-between; align-items: end; gap: 20px; } .study-intro h1 { font-size: clamp(36px, 5vw, 60px); } .mode-tabs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; margin: 12px 0 22px; border-bottom: 1px solid var(--line); } .mode-tab { padding: 11px 8px 13px; border: 0; border-bottom: 2px solid transparent; background: transparent; text-align: left; cursor: pointer; } .mode-tab strong, .mode-tab span { display: block; } .mode-tab strong { font-size: 12px; } .mode-tab span { margin-top: 2px; color: var(--muted); font-size: 10px; } .mode-tab.is-active { border-color: var(--coral); } .mode-tab.is-active strong { color: var(--coral); } .study-card-wrap { max-width: 900px; margin: 38px auto 0; } .study-card-meta { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 10px; color: var(--muted); font: 10px var(--mono); text-transform: uppercase; letter-spacing: .08em; } .flashcard-surface { width: 100%; min-height: 370px; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; gap: 17px; padding: clamp(25px, 6vw, 70px); border: 1px solid var(--line-strong); border-radius: 22px; background: var(--surface-strong); box-shadow: var(--shadow); cursor: pointer; text-align: left; } .card-prompt { max-width: 760px; font: 700 clamp(26px, 4vw, 45px)/1.08 var(--serif); letter-spacing: -.04em; } .card-reveal-hint { margin-top: 20px; color: var(--teal); font-size: 12px; } .card-answer-label, .card-type { color: var(--coral); } .card-answer-label { margin-top: 20px; font: 700 10px var(--mono); letter-spacing: .14em; } .card-answer { max-width: 740px; color: var(--muted); font: 400 clamp(19px, 2.4vw, 29px)/1.25 var(--serif); } .rating-block { margin-top: 18px; padding: 16px; border: 1px solid var(--line); border-radius: 15px; background: var(--surface); } .rating-heading { display: flex; justify-content: space-between; gap: 10px; margin-bottom: 11px; color: var(--muted); font-size: 12px; } .progress-chip { padding: 4px 7px; border-radius: 5px; background: var(--teal-soft); color: var(--teal); font: 10px var(--mono); } .rating-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; } .rating-button { min-height: 48px; border: 1px solid transparent; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 12px; } .rating-low { background: var(--coral-soft); color: var(--coral); } .rating-mid { background: var(--gold-soft); color: var(--gold); } .rating-good { background: var(--teal-soft); color: var(--teal); } .rating-easy { background: var(--surface-muted); color: var(--teal); } .microcopy { margin: 10px 0 0; color: var(--faint); font-size: 10px; } .study-footer { align-items: center; margin-top: 19px; text-transform: none; letter-spacing: 0; }',
      '.choice-list, .exam-options { display: grid; gap: 9px; width: 100%; } .choice-button, .exam-option { display: flex; align-items: center; gap: 12px; width: 100%; padding: 15px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); text-align: left; cursor: pointer; } .choice-button:hover, .exam-option:hover, .choice-button[aria-pressed="true"] { border-color: var(--teal); background: var(--teal-soft); } .choice-letter, .exam-option span { display: grid; place-items: center; flex: 0 0 27px; width: 27px; height: 27px; border: 1px solid var(--line-strong); border-radius: 50%; color: var(--teal); font: 11px var(--mono); } .choice-correct { border-color: var(--teal); background: var(--teal-soft); } .choice-wrong { border-color: var(--coral); background: var(--coral-soft); } .choice-feedback { margin-top: 12px; padding: 12px; border-radius: 9px; font-size: 12px; } .feedback-good { background: var(--teal-soft); color: var(--teal); } .feedback-bad { background: var(--coral-soft); color: var(--coral); } .recall-label { display: block; margin-bottom: 9px; color: var(--muted); font-size: 12px; } .recall-input { display: block; width: 100%; resize: vertical; padding: 16px; border: 1px solid var(--line-strong); border-radius: 11px; background: var(--surface); color: var(--ink); } .recall-answer { margin-top: 14px; padding: 17px; border-left: 3px solid var(--teal); background: var(--teal-soft); } .recall-answer p { margin: 5px 0 0; font: 20px/1.3 var(--serif); }',
      '.view-heading { align-items: start; margin-bottom: 42px; } .view-heading h1 { margin-bottom: 10px; } .atlas-count { min-width: 105px; padding: 13px; border-left: 1px solid var(--line-strong); } .atlas-count strong, .atlas-count span { display: block; } .atlas-count strong { font: 700 30px var(--serif); } .atlas-count span { color: var(--muted); font-size: 10px; } .atlas-tabs { display: flex; gap: 4px; overflow-x: auto; margin-bottom: 24px; border-bottom: 1px solid var(--line); } .atlas-tab { padding: 12px 16px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--muted); cursor: pointer; font-size: 12px; white-space: nowrap; } .atlas-tab.is-active { border-color: var(--coral); color: var(--ink); font-weight: 700; } .search-controls { display: grid; grid-template-columns: minmax(220px, 1fr) 180px 180px; gap: 9px; } .search-box { display: flex; align-items: center; gap: 9px; padding: 0 12px; border: 1px solid var(--line-strong); border-radius: 9px; background: var(--surface); } .search-box span { color: var(--teal); font-size: 22px; } .search-box input { min-width: 0; flex: 1; padding: 12px 0; border: 0; outline: 0; background: transparent; color: var(--ink); } .select-wrap { display: grid; gap: 4px; color: var(--muted); font-size: 10px; } .select-wrap select, .number-control input { width: 100%; padding: 11px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); color: var(--ink); } .results-summary { display: flex; justify-content: space-between; gap: 12px; padding: 17px 0 12px; color: var(--muted); font: 10px var(--mono); } .search-results { display: grid; gap: 9px; } .search-card { padding: 18px; border: 1px solid var(--line); border-radius: 13px; background: var(--surface); } .search-card-top, .search-card-bottom { display: flex; justify-content: space-between; gap: 10px; color: var(--muted); font-size: 10px; } .search-card h3 { margin: 16px 0 8px; font-size: 17px; } .search-card p { margin: 0; color: var(--muted); font-size: 13px; } .search-card-bottom { align-items: center; margin-top: 18px; } .empty-panel { padding: 65px 20px; border: 1px dashed var(--line-strong); border-radius: 14px; text-align: center; } .empty-glyph { color: var(--teal); font-size: 35px; } .empty-panel p { color: var(--muted); }',
      '.diagram-layout, .concept-layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 14px; } .diagram-picker-list { display: grid; align-content: start; gap: 6px; } .diagram-picker { display: grid; grid-template-columns: 29px 1fr; gap: 8px; padding: 12px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); text-align: left; cursor: pointer; } .diagram-picker.is-active { border-color: var(--teal); box-shadow: var(--shadow-small); } .diagram-index { color: var(--coral); font: 11px var(--mono); } .diagram-picker strong, .diagram-picker small { display: block; } .diagram-picker strong { font-size: 11px; } .diagram-picker small { margin-top: 4px; color: var(--muted); font-size: 10px; } .diagram-stage, .concept-stage, .concept-detail { padding: 22px; border: 1px solid var(--line); border-radius: 16px; background: var(--surface); } .stage-heading { display: flex; justify-content: space-between; gap: 20px; align-items: start; } .stage-heading h2 { margin: 7px 0 3px; } .stage-heading p { margin: 0; color: var(--muted); font-size: 12px; } .stage-note { color: var(--faint); font: 10px var(--mono); } .diagram-art, .concept-art { display: block; width: 100%; height: auto; margin: 26px 0; } .diagram-edge, .concept-edge { stroke: var(--line-strong); stroke-width: 2; stroke-dasharray: 4 7; } .diagram-node circle { fill: var(--surface-strong); stroke: var(--teal); stroke-width: 2; transition: r .2s ease, fill .2s ease; } .diagram-node text { fill: var(--ink); font: 700 11px var(--sans); pointer-events: none; } .diagram-node:hover circle, .diagram-node.is-selected circle { fill: var(--teal-soft); stroke: var(--coral); } .diagram-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; padding-top: 17px; border-top: 1px solid var(--line); } .detail-kicker { display: block; font-size: 9px; } .diagram-detail h3 { margin: 7px 0; } .diagram-detail p, .concept-detail p { margin: 0; color: var(--muted); font-size: 13px; } .node-list { display: flex; flex-wrap: wrap; gap: 6px; align-content: start; } .node-list-button { display: flex; gap: 6px; align-items: center; padding: 7px 9px; border: 1px solid var(--line); border-radius: 7px; background: transparent; color: var(--muted); cursor: pointer; font-size: 10px; } .node-list-button span { color: var(--coral); } .node-list-button.is-active { border-color: var(--teal); color: var(--ink); background: var(--teal-soft); } .concept-layout { grid-template-columns: minmax(0, 1fr) 270px; } .concept-art { min-height: 260px; } .concept-node circle { fill: var(--surface-strong); stroke: currentColor; stroke-width: 2; } .concept-node text { fill: var(--ink); font: 11px var(--sans); } .concept-node.module-m1 { color: var(--module-1); } .concept-node.module-m2 { color: var(--module-2); } .concept-node.module-m3 { color: var(--module-3); } .concept-node.module-m4 { color: var(--module-4); } .concept-node.module-m5 { color: var(--module-5); } .concept-node.module-m6 { color: var(--module-6); } .concept-node.is-selected circle { fill: var(--teal-soft); stroke: var(--coral); } .concept-detail h2 { margin: 9px 0; } .related-heading { margin: 27px 0 8px; color: var(--teal); font: 700 10px var(--mono); text-transform: uppercase; letter-spacing: .1em; } .related-card { display: flex; justify-content: space-between; gap: 10px; width: 100%; padding: 10px 0; border: 0; border-top: 1px solid var(--line); background: transparent; text-align: left; cursor: pointer; font-size: 11px; } .related-card b { color: var(--coral); } .concept-key { display: flex; flex-wrap: wrap; gap: 10px; color: var(--muted); font-size: 10px; } .concept-key i { display: inline-block; width: 7px; height: 7px; margin-right: 4px; border-radius: 50%; background: var(--teal); } .concept-key i.module-m1 { background: var(--module-1); } .concept-key i.module-m2 { background: var(--module-2); } .concept-key i.module-m3 { background: var(--module-3); } .concept-key i.module-m4 { background: var(--module-4); } .concept-key i.module-m5 { background: var(--module-5); } .concept-key i.module-m6 { background: var(--module-6); }',
      '.mnemonic-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; } .mnemonic-tile { min-height: 235px; padding: 20px; border: 1px solid var(--line); border-radius: 15px; background: var(--surface); } .mnemonic-tile.module-m1 { border-top: 3px solid var(--module-1); } .mnemonic-tile.module-m2 { border-top: 3px solid var(--module-2); } .mnemonic-tile.module-m3 { border-top: 3px solid var(--module-3); } .mnemonic-tile.module-m4 { border-top: 3px solid var(--module-4); } .mnemonic-tile.module-m5 { border-top: 3px solid var(--module-5); } .mnemonic-tile.module-m6 { border-top: 3px solid var(--module-6); } .mnemonic-top { display: flex; justify-content: space-between; color: var(--muted); font: 10px var(--mono); } .mnemonic-top span:first-child { color: var(--coral); } .mnemonic-tile h2 { margin: 32px 0 12px; font-size: 22px; } .mnemonic-text { font: 18px/1.25 var(--serif); } .mnemonic-use { color: var(--muted); font-size: 11px; }',
      '.exam-start-card { display: grid; grid-template-columns: 110px 1fr; gap: 28px; max-width: 800px; padding: 30px; box-shadow: var(--shadow); } .exam-glyph { display: grid; place-items: center; width: 90px; height: 90px; border: 1px solid var(--coral); border-radius: 50%; color: var(--coral); font: 50px var(--serif); } .exam-start-card h2 { margin: 8px 0; } .exam-start-card p { max-width: 500px; color: var(--muted); font-size: 13px; } .exam-size-list { display: flex; gap: 7px; margin: 20px 0; } .exam-size { display: grid; gap: 1px; min-width: 75px; padding: 10px; border: 1px solid var(--line); border-radius: 8px; background: transparent; color: var(--muted); cursor: pointer; text-align: left; } .exam-size strong { color: var(--ink); font: 22px var(--serif); } .exam-size span { font-size: 10px; } .exam-size.is-active { border-color: var(--teal); background: var(--teal-soft); } .exam-rules { display: grid; grid-template-columns: repeat(3, 1fr); max-width: 800px; gap: 20px; margin-top: 40px; } .exam-rules div { display: grid; grid-template-columns: 27px 1fr; gap: 8px; color: var(--muted); font-size: 11px; } .exam-rules strong { color: var(--coral); font: 11px var(--mono); } .exam-progress { margin-bottom: 25px; } .exam-question-card { max-width: 800px; padding: clamp(24px, 5vw, 50px); border: 1px solid var(--line-strong); border-radius: 18px; background: var(--surface); box-shadow: var(--shadow); } .question-number { display: flex; justify-content: space-between; color: var(--coral); font: 700 11px var(--mono); text-transform: uppercase; letter-spacing: .1em; } .question-number span { color: var(--muted); } .exam-question-card h1 { margin: 32px 0; font-size: clamp(27px, 4vw, 42px); } .exam-navigation { display: flex; justify-content: space-between; align-items: center; gap: 15px; max-width: 800px; margin-top: 19px; } .exam-dots { display: flex; flex-wrap: wrap; gap: 4px; } .exam-dot { min-width: 25px; height: 25px; padding: 2px; border: 1px solid var(--line); border-radius: 5px; background: transparent; color: var(--muted); cursor: pointer; font: 9px var(--mono); } .exam-dot.is-current { border-color: var(--coral); color: var(--coral); } .exam-dot.is-answered { background: var(--teal-soft); color: var(--teal); } .exam-nav-actions { display: flex; gap: 7px; } .result-hero { padding: 34px 0 58px; border-bottom: 1px solid var(--line); } .result-score { margin: 18px 0 4px; font: 700 clamp(74px, 12vw, 150px)/.8 var(--serif); letter-spacing: -.08em; } .result-score span { margin-left: 7px; color: var(--coral); font-size: .35em; letter-spacing: 0; } .result-hero h1 { margin: 20px 0 8px; font-size: 38px; } .result-hero p { color: var(--muted); } .result-card { max-width: 800px; margin-top: 20px; padding: 24px; } .result-card h2 { margin: 24px 0; } .result-module { display: grid; grid-template-columns: 120px 1fr 55px; align-items: center; gap: 12px; padding: 12px 0; border-top: 1px solid var(--line); color: var(--muted); font-size: 11px; } .result-module strong { color: var(--ink); text-align: right; }',
      '.progress-hero { display: grid; grid-template-columns: 1fr 150px 1fr; align-items: center; gap: 30px; padding: 25px; border: 1px solid var(--line); border-radius: 15px; background: var(--surface); } .progress-hero strong { display: block; margin: 7px 0; font: 700 42px var(--serif); } .progress-hero p { margin: 0; color: var(--muted); font-size: 11px; } .goal-ring { display: grid; place-items: center; width: 132px; height: 132px; margin: 0 auto; border: 7px solid var(--teal); border-radius: 50%; text-align: center; } .goal-ring span, .goal-ring small { display: block; } .goal-ring span { font: 700 26px var(--serif); } .goal-ring small { color: var(--muted); font-size: 9px; } .report-date { color: var(--muted); font: 10px var(--mono); text-transform: uppercase; } .progress-grid { display: grid; grid-template-columns: 1.35fr .65fr; gap: 13px; margin-top: 13px; } .report-card { padding: 23px; } .report-card h2 { margin: 22px 0 28px; } .activity-chart { display: flex; align-items: end; justify-content: space-between; gap: 6px; min-height: 165px; padding-top: 20px; border-bottom: 1px solid var(--line); } .activity-bar-wrap { position: relative; display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: end; gap: 5px; height: 165px; color: var(--muted); font: 9px var(--mono); } .activity-bar { width: min(20px, 70%); height: var(--bar-height); min-height: 5px; border-radius: 5px 5px 0 0; background: var(--teal); } .activity-count { min-height: 12px; color: var(--teal); font-size: 9px; } .badge-list { display: grid; gap: 7px; } .badge-item { display: flex; gap: 10px; align-items: center; padding: 9px; border: 1px solid var(--line); border-radius: 9px; opacity: .55; } .badge-item.is-earned { border-color: var(--teal); opacity: 1; background: var(--teal-soft); } .badge-icon { display: grid; place-items: center; width: 26px; height: 26px; border: 1px solid currentColor; border-radius: 50%; color: var(--coral); } .badge-item strong, .badge-item span { display: block; } .badge-item strong { font-size: 11px; } .badge-item div span { color: var(--muted); font-size: 10px; } .module-report { margin-top: 13px; } .table-scroll { overflow-x: auto; } table { width: 100%; border-collapse: collapse; color: var(--muted); font-size: 11px; } th, td { padding: 13px 8px; border-top: 1px solid var(--line); text-align: left; white-space: nowrap; } th { color: var(--ink); font-weight: 700; } .module-table-dot { display: inline-block; width: 8px; height: 8px; margin-right: 7px; border-radius: 50%; } .table-progress { display: flex; align-items: center; gap: 8px; min-width: 120px; } .table-progress .progress-line { flex: 1; } .table-progress > span { min-width: 28px; color: var(--ink); }',
      '.settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 13px; } .settings-card { min-height: 210px; padding: 23px; } .settings-card h2 { margin: 10px 0 8px; } .settings-card p { max-width: 420px; color: var(--muted); font-size: 12px; } .theme-choices { display: flex; gap: 7px; margin-top: 22px; } .theme-choice { display: flex; align-items: center; gap: 9px; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: transparent; cursor: pointer; font-size: 11px; } .theme-choice span { color: var(--teal); font-size: 18px; } .theme-choice.is-active { border-color: var(--teal); background: var(--teal-soft); } .number-control { display: flex; align-items: center; gap: 8px; max-width: 250px; margin-top: 21px; color: var(--muted); font-size: 11px; } .number-control input { width: 85px; } .settings-actions { display: flex; gap: 7px; margin-top: 22px; } .settings-note { display: block; margin-top: 24px; color: var(--muted); font-size: 11px; } .danger-zone { display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-top: 25px; padding: 20px; border: 1px solid var(--coral); border-radius: 14px; } .danger-zone h2 { margin: 7px 0; font-size: 20px; } .danger-zone p { margin: 0; color: var(--muted); font-size: 11px; }',
      '.notice { margin-bottom: 20px; padding: 12px 14px; border-radius: 9px; font-size: 12px; } .notice-warn { border: 1px solid var(--coral); background: var(--coral-soft); color: var(--coral); } .data-load-error { margin: 30px; } .app-footer { padding: 0 5vw 28px; color: var(--faint); font: 10px/1.5 var(--mono); } .toast { position: fixed; z-index: 20; right: 22px; bottom: 22px; max-width: min(360px, calc(100vw - 44px)); padding: 12px 15px; border: 1px solid var(--teal); border-radius: 9px; background: var(--surface-strong); color: var(--ink); box-shadow: var(--shadow); font-size: 12px; pointer-events: none; } .toast:empty { display: none; } .muted-copy { color: var(--muted); font-size: 12px; }',
      '@media (max-width: 1050px) { .app-layout { grid-template-columns: 205px minmax(0, 1fr); } .sidebar { padding-left: 14px; padding-right: 14px; } .hero-grid { grid-template-columns: 1fr; } .neural-panel { max-width: 800px; } .module-grid { grid-template-columns: repeat(2, 1fr); } .mnemonic-grid { grid-template-columns: repeat(2, 1fr); } }',
      '@media (max-width: 760px) { .app-layout { display: block; } .sidebar { position: sticky; z-index: 10; top: 0; width: 100%; height: auto; display: block; padding: 10px 13px 7px; border-right: 0; border-bottom: 1px solid var(--line); background: var(--bg); } .brand { display: none; } .sidebar-rule, .sidebar-bottom { display: none; } .nav-list { display: flex; gap: 3px; overflow-x: auto; } .nav-item { min-width: max-content; justify-content: center; padding: 9px 10px; font-size: 11px; } .nav-icon { width: auto; font-size: 14px; } .topbar { height: 52px; padding: 0 16px; border-bottom: 0; } .mobile-brand { display: flex; } .topbar-meta > span:not(.pulse) { display: none; } .main-content { padding: 30px 16px 60px; } .view h1 { font-size: 43px; } .hero-grid { display: block; } .neural-panel { margin-top: 28px; padding: 13px 10px 12px; } .stat-strip { grid-template-columns: repeat(2, 1fr); margin: 32px 0 48px; } .stat-cell:nth-child(2) { border-right: 0; } .stat-cell:nth-child(-n+2) { border-bottom: 1px solid var(--line); } .module-grid, .lower-grid, .settings-grid, .progress-grid, .mnemonic-grid { grid-template-columns: 1fr; } .section-heading, .view-heading, .study-intro { display: block; } .section-heading .text-button { display: block; margin-top: 11px; } .mode-tabs { grid-template-columns: repeat(5, minmax(98px, 1fr)); overflow-x: auto; } .study-card-wrap { margin-top: 28px; } .flashcard-surface { min-height: 330px; padding: 28px 22px; } .study-footer { flex-wrap: wrap; } .study-footer > span { display: none; } .search-controls { grid-template-columns: 1fr; } .search-box { min-height: 45px; } .diagram-layout, .concept-layout { grid-template-columns: 1fr; } .diagram-picker-list { display: flex; overflow-x: auto; } .diagram-picker { min-width: 220px; } .diagram-detail { grid-template-columns: 1fr; } .diagram-art { margin: 22px 0; } .stage-heading { display: block; } .stage-note { display: block; margin-top: 12px; } .concept-detail { order: -1; } .exam-start-card { grid-template-columns: 1fr; padding: 22px; } .exam-rules { grid-template-columns: 1fr; gap: 10px; } .exam-navigation { display: block; } .exam-dots { margin-bottom: 14px; } .exam-nav-actions { justify-content: space-between; } .progress-hero { grid-template-columns: 1fr; gap: 18px; } .goal-ring { margin: 0; } .report-date { margin-top: 8px; } .danger-zone { display: block; } .danger-zone .button { margin-top: 17px; } }',
      '@media (prefers-reduced-motion: reduce) { .app-shell *, .app-shell *::before, .app-shell *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; } }'
    ].join('\n');
    var style = document.createElement('style');
    style.id = 'neuro-app-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function init() {
    if (!root) return;
    rawCards = Array.isArray(window.NEURO_CARDS) ? window.NEURO_CARDS : [];
    if (!rawCards.length) {
      window.addEventListener('load', init, { once: true });
      return;
    }
    if (appStarted) return;
    appStarted = true;
    injectStyles();
    loadData();
    if (!state.cards.length) {
      root.innerHTML = '<main class="empty-panel data-load-error"><h1>Baza de carduri nu s-a încărcat.</h1><p>Reîncarcă pagina cu acces la fișierele aplicației.</p></main>';
      return;
    }
    render();
    registerPwa();
    document.addEventListener('keydown', keyHandler);
  }

  window.addEventListener('beforeunload', persist);
  window.addEventListener('load', init, { once: true });
  init();
}());
