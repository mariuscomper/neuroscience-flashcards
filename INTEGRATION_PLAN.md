# Plan de integrare — Neuroștiințe UBB, Nobel Edition

## Stare verificată — 7 septembrie 2026

Planul de mai jos este o propunere arhivată, nu o execuție în curs. Identificatorii agenților și stările „în lucru” provin dintr-un jurnal istoric; nu există aceste rezultate în aplicația publică actuală.

---

## Arhitectură propusă

### Fișiere Output Așteptate:
- `neurostiinte-improved.html` (original cu 812 carduri)
- `neurostiinte-diagrams.html` (cu diagrame interactive)
- `neurostiinte-exam-analytics.html` (cu exam + analytics)
- `neurostiinte-knowledge-graph.html` (cu graf)
- `neurostiinte-study-modes.html` (cu moduri + mnemonice)
- `neurostiinte-search-pwa.html` (cu search + PWA)
- `neurostiinte-gamified.html` (cu achievements)

### STRATEGIA DE MERGE:

**Opțiune A: Fișier Unic Mastodont**
- Integrează TOATE features într-un singur HTML
- Pro: O singură aplicație, tot centralizat
- Con: Fișier mare (~5000+ linii), posibil mai lent la load

**Opțiune B: Modulare cu Import**
- HTML principal + module JS separate
- Pro: Cod mai organizat, lazy loading
- Con: Mai complexă structura

**DECIZIE: Opțiunea A - Un singur fișier mega-comprehensiv**
Motivație inițială: un singur fișier fără proces local de construire. Aplicația actuală încarcă însă React, ReactDOM și Babel de pe CDN și nu oferă PWA sau funcționare offline garantată.

---

## ORDINEA INTEGRĂRII:

### FAZA 1: Core Features (Fundație)
1. Pornește de la `neurostiinte-improved.html` (baseline cu 812 carduri)
2. Integrează **Search Inteligent + PWA** (infrastractură)
3. Adaugă **Gamification** (motivație layer peste tot)

### FAZA 2: Study Enhancements
4. Integrează **Study Modes + Mnemonics**
5. Adaugă **Diagrame Interactive**
6. Integrează **Knowledge Graph**

### FAZA 3: Advanced Analytics
7. Integrează **Exam Simulator + Analytics Dashboard**

---

## CONFLICT RESOLUTION:

### State Management:
Toate feature-urile adaugă state - trebuie unified:

```javascript
// UNIFIED STATE STRUCTURE
const [cards, setCards] = useState([]);
const [view, setView] = useState('dashboard'); // dashboard | study | diagrams | graph | exam | analytics
const [studyMode, setStudyMode] = useState('classic'); // classic | cloze | reverse | mcq | free-recall
const [diagramsProgress, setDiagramsProgress] = useState({});
const [graphData, setGraphData] = useState(null);
const [examState, setExamState] = useState(null);
const [analyticsData, setAnalyticsData] = useState({});
const [gamificationData, setGamificationData] = useState({ level: 1, xp: 0, achievements: [], streak: 0 });
const [searchResults, setSearchResults] = useState([]);
```

### UI Navigation:
```
Top Nav:
  🏠 Dashboard | 📚 Studiu | 📊 Diagrame | 🕸️ Graf | 🎓 Examen | 📈 Analytics | 🏆 Achievements

Sidebar (persistent):
  - Search bar (cu fuzzy + semantic)
  - Module filter
  - Study streak counter
  - Level + XP bar
  - Daily goal progress
```

### localStorage Keys:
- `neuro-cards-v3` - carduri + progres
- `neuro-diagrams-v3` - progres diagrame
- `neuro-exam-history-v3` - istoric examene
- `neuro-gamification-v3` - achievements, XP, level
- `neuro-settings-v3` - preferințe user

---

## TESTING CHECKLIST:

După integrare, test:
- [ ] Toate 812 carduri se încarcă corect
- [ ] Search fuzzy funcționează (typos)
- [ ] Search semantic funcționează (sinonime)
- [ ] Toate 6 diagrame interactive funcționează
- [ ] Knowledge graph se renderează (D3.js)
- [ ] Exam mode: timer, 50 întrebări, scoring
- [ ] Analytics: heatmap, leech detection, predictions
- [ ] Study modes: toate 5 modurile funcționează
- [ ] Mnemonice: 10+ mnemonice vizibile
- [ ] Gamification: achievements unlock, XP crește
- [ ] PWA: offline mode funcționează
- [ ] Service worker cache-uiește assets
- [ ] Touch gestures pe mobil
- [ ] Install prompt pe mobil
- [ ] Export/import progres
- [ ] Toate datele se salvează în localStorage
- [ ] Mobile responsive (320px - 1920px)
- [ ] Dark mode (dacă există)
- [ ] Accessibility (keyboard nav)

---

## PERFORMANCE TARGETS:

- Initial load: <3s
- Time to interactive: <4s
- Lighthouse score: >85
- Bundle size: <500KB (HTML + embedded assets)
- Smooth 60fps animations
- Lazy load carduri (virtualization pentru liste mari)

---

## DOCUMENTATION TO CREATE:

1. **USER_GUIDE.md** - Cum să folosești toate features
2. **FEATURES.md** - Lista completă de funcționalități
3. **TECHNICAL.md** - Arhitectură tehnică
4. **CHANGELOG.md** - De la 812 carduri la Nobel Edition

---

## BACKUP STRATEGY:

Înainte de integrare:
```bash
cp neurostiinte-improved.html neurostiinte-improved-BACKUP-BEFORE-MERGE.html
git checkout -b feature/nobel-edition-integration
```

După integrare:
```bash
git add neurostiinte-final-nobel.html
git commit -m "feat: Integrate all Nobel-level features"
```

---

## Pași următori, dacă proiectul este reluat

1. Colectez toate output-urile
2. Analizez conflictele de state
3. Merge incremental (nu big bang)
4. Test după fiecare merge
5. Fix bugs
6. Deploy final
7. Update README
8. Create PR

---

**ETA: ~5 ore** (conform cererii utilizatorului)

Status: PAUSED — funcțiile Nobel Edition nu sunt implementate în versiunea publică.
