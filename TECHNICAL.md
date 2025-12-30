# 🔧 Technical Documentation - Neuroscience Flashcards Nobel Edition

## Architecture Overview

### Technology Stack

- **Frontend Framework**: React 18.2.0 (via CDN)
- **Visualization**: D3.js v7 (knowledge graph)
- **Storage**: localStorage + IndexedDB (PWA)
- **Service Worker**: For offline functionality
- **Build**: None - pure HTML with embedded JavaScript
- **Deployment**: Static hosting (GitHub Pages, Netlify, or local file)

### File Structure

```
neurostiinte-nobel-edition.html  # Main application (5000+ lines)
├── HTML Structure
├── Embedded CSS (inline styles)
├── React Components (Babel-transpiled JSX)
├── Data Structures (NEURO_CARDS array, KNOWLEDGE_GRAPH, MNEMONICS)
├── Algorithms (spaced repetition, exam generation, analytics)
└── Service Worker integration

sw.js                            # Service Worker (created on first run)
manifest.json                    # PWA manifest (created on first run)
```

---

## Data Structures

### 1. Cards Structure

```javascript
// Main card object
{
  id: "card-123",                    // Index-based ID
  hash: "2k8j9f",                    // Content-based hash (SHA-like)
  question: "Ce e glutamatul?",      // Question text
  answer: "Principal NT excitator",  // Answer text
  module: "M3",                      // Module ID (M1-M6)

  // Spaced repetition data
  interval: 7,                       // Days until next review
  easeFactor: 2.5,                   // Difficulty multiplier (1.3 - 2.5)
  repetitions: 3,                    // Successful repetitions count
  nextReview: "2025-01-05T10:00:00Z", // ISO date of next review
  lastReview: "2024-12-30T10:00:00Z", // ISO date of last review

  // User annotations
  isDifficult: false,                // Manual difficulty flag

  // Optional metadata (for some cards)
  ref: {
    page: "47-48",                   // Manual page reference
    figure: "3.5",                   // Figure number
    citation: "Purves et al. (2012)" // Citation
  }
}
```

### 2. Gamification State

```javascript
{
  // Level & XP
  level: 3,                          // Current level (1-7)
  xp: 1250,                          // Total XP earned
  xpForNextLevel: 1500,              // XP needed for next level

  // Achievements
  achievements: [
    {
      id: "first-10",
      unlockedAt: "2024-12-25T12:00:00Z",
      seen: true                     // User has seen unlock notification
    },
    // ... more achievements
  ],

  // Streaks
  currentStreak: 7,                  // Days studied consecutively
  longestStreak: 14,                 // Best streak ever
  lastStudyDate: "2024-12-30",       // ISO date (for streak calculation)
  studyCalendar: {                   // Map of dates studied
    "2024-12-24": true,
    "2024-12-25": true,
    // ...
  },

  // Daily goals
  dailyGoal: 20,                     // Cards to study per day
  dailyProgress: 15,                 // Cards studied today
  dailyGoalLastReset: "2024-12-30"   // Date for daily reset
}
```

### 3. Exam History

```javascript
{
  examId: "exam-1735574400000",      // Timestamp-based ID
  timestamp: "2024-12-30T15:00:00Z", // When exam was taken

  questions: [                       // All 50 questions
    {
      cardHash: "2k8j9f",
      question: "...",
      correctAnswer: "...",
      userAnswer: "...",
      isCorrect: true,
      timeTaken: 45                  // Seconds spent on question
    },
    // ... 49 more
  ],

  score: 85,                         // Total score (0-100)
  scoreByModule: {                   // Breakdown per module
    M1: 90,
    M2: 80,
    M3: 85,
    M4: 88,
    M5: 78,
    M6: 92
  },

  timeElapsed: 4200,                 // Total seconds (70 minutes)
  flaggedQuestions: [3, 15, 42]      // Question indices flagged for review
}
```

### 4. Diagrams Progress

```javascript
{
  "neuron-structure": {
    attempts: 15,                    // Total attempts
    correctIdentifications: 12,      // Correct answers
    lastAttempt: "2024-12-30T10:00:00Z",
    mastered: false                  // true if >90% accuracy
  },
  "tripartite-synapse": {
    attempts: 8,
    correctIdentifications: 7,
    lastAttempt: "2024-12-29T14:00:00Z",
    mastered: false
  },
  // ... 4 more diagrams
}
```

### 5. Knowledge Graph Structure

```javascript
{
  nodes: [
    {
      id: "gradient-electrochimic",
      label: "Gradient Electrochimic",
      module: "M3",
      cardHashes: ["2k8j9f", "9hj3k2"], // Associated cards
      type: "concept"                    // concept | process | structure
    },
    // ... 100+ nodes
  ],

  edges: [
    {
      from: "gradient-electrochimic",
      to: "potential-repaus",
      type: "prerequisite"               // prerequisite | related | part-of
    },
    // ... 150+ edges
  ]
}
```

---

## Algorithms

### 1. Spaced Repetition (SM-2 Inspired)

```javascript
function updateCard(card, rating) {
  if (rating < 3) {
    // Failed - reset progress
    card.repetitions = 0;
    card.interval = 0;
    card.nextReview = new Date(); // Due immediately
  } else {
    // Passed - increase interval
    card.repetitions += 1;

    if (card.repetitions === 1) {
      card.interval = 1; // 1 day
    } else if (card.repetitions === 2) {
      card.interval = 6; // 6 days
    } else {
      card.interval = Math.round(card.interval * card.easeFactor);
    }

    // Adjust ease factor
    card.easeFactor += (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    card.easeFactor = Math.max(1.3, Math.min(2.5, card.easeFactor));

    // Calculate next review date
    card.nextReview = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);
  }

  card.lastReview = new Date();
  return card;
}
```

**Key Parameters:**
- `rating`: 0-5 (user's self-assessment)
- `easeFactor`: 1.3-2.5 (difficulty multiplier)
- `interval`: Days until next review
- `repetitions`: Successful repetitions count

**Mastery Criteria:**
- Card is "mastered" when `repetitions >= 3`

###  2. Exam Question Selection

```javascript
function generateExam(cards, count = 50) {
  // Filter: only cards that have been reviewed at least once
  const eligibleCards = cards.filter(c => c.repetitions > 0);

  // Calculate module distribution (proportional to module size)
  const moduleDistribution = calculateProportionalDistribution(eligibleCards);

  // Select cards per module
  const selectedCards = [];

  for (const [module, count] of Object.entries(moduleDistribution)) {
    const moduleCards = eligibleCards.filter(c => c.module === module);

    // Stratify by difficulty
    const easy = moduleCards.filter(c => c.repetitions >= 3); // Mastered
    const medium = moduleCards.filter(c => c.repetitions === 1-2); // Learning
    const hard = moduleCards.filter(c => c.isDifficult || c.repetitions === 0); // Difficult

    // Select: 30% easy, 50% medium, 20% hard
    const easyCount = Math.round(count * 0.3);
    const mediumCount = Math.round(count * 0.5);
    const hardCount = count - easyCount - mediumCount;

    selectedCards.push(...randomSample(easy, easyCount));
    selectedCards.push(...randomSample(medium, mediumCount));
    selectedCards.push(...randomSample(hard, hardCount));
  }

  // Shuffle to mix modules
  return shuffle(selectedCards).slice(0, count);
}
```

### 3. Score Prediction Algorithm

```javascript
function predictExamScore(cards) {
  const totalCards = cards.length;
  const mastered = cards.filter(c => c.repetitions >= 3).length;
  const learning = cards.filter(c => c.repetitions > 0 && c.repetitions < 3).length;
  const unseen = cards.filter(c => c.repetitions === 0).length;

  // Weighted scoring
  const score = (
    (mastered / totalCards) * 100 * 0.9 +  // 90% accuracy on mastered
    (learning / totalCards) * 100 * 0.6 +  // 60% accuracy on learning
    (unseen / totalCards) * 100 * 0.2      // 20% accuracy on unseen (guessing)
  );

  // Calculate confidence interval (simplified)
  const variance = calculateVariance(cards);
  const stdDev = Math.sqrt(variance);
  const confidenceInterval = {
    lower: Math.max(0, score - 1.96 * stdDev),
    upper: Math.min(100, score + 1.96 * stdDev)
  };

  return {
    predicted: Math.round(score),
    confidence: confidenceInterval
  };
}
```

### 4. Leech Detection

```javascript
function detectLeeches(cards) {
  // A card is a "leech" if:
  // 1. It has been reviewed >5 times
  // 2. It has <2 successful repetitions
  // 3. OR it's marked difficult and has low success rate

  return cards.filter(card => {
    const totalReviews = countReviews(card); // Track from history
    const successRate = card.repetitions / totalReviews;

    return (totalReviews > 5 && card.repetitions < 2) ||
           (card.isDifficult && successRate < 0.4);
  });
}
```

### 5. Fuzzy Search

```javascript
function fuzzyMatch(search, text, threshold = 2) {
  // Levenshtein distance algorithm
  const searchLower = search.toLowerCase();
  const textLower = text.toLowerCase();

  if (textLower.includes(searchLower)) return true; // Exact match

  // Calculate edit distance
  const distance = levenshteinDistance(searchLower, textLower);

  return distance <= threshold;
}

function levenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
```

---

## Component Hierarchy

```
App
├── Sidebar
│   ├── Search
│   ├── ModuleFilter
│   ├── StatsWidget (streak, level, daily goal)
│   └── QuickActions
│
├── MainContent (routed by view state)
│   ├── Dashboard
│   │   ├── ProgressOverview
│   │   ├── ModuleCards
│   │   └── DueCardsWidget
│   │
│   ├── StudySession
│   │   ├── ModeSelector (classic, cloze, reverse, MCQ, free-recall)
│   │   ├── CardDisplay
│   │   ├── RatingButtons
│   │   └── ProgressBar
│   │
│   ├── Diagrams
│   │   ├── DiagramSelector
│   │   ├── SVGDiagram (interactive)
│   │   └── DiagramProgress
│   │
│   ├── KnowledgeGraph
│   │   ├── D3Visualization
│   │   ├── GraphControls (zoom, filter)
│   │   └── NodeDetails
│   │
│   ├── ExamMode
│   │   ├── ExamSetup
│   │   ├── ExamSession (timer, questions, nav)
│   │   └── ExamReview
│   │
│   ├── Analytics
│   │   ├── ModuleHeatmap
│   │   ├── LeechList
│   │   ├── ForgettingCurve (chart)
│   │   ├── ScorePrediction
│   │   └── WeakAreas
│   │
│   ├── Mnemonics
│   │   ├── MnemonicList
│   │   ├── PracticeMode
│   │   └── QuizMode
│   │
│   └── Achievements
│       ├── LevelDisplay
│       ├── XPProgressBar
│       ├── AchievementGrid
│       └── DailyGoals
│
└── Notifications (achievement unlocks, reminders)
```

---

## State Management

### localStorage Schema

```javascript
// Key: neuro-cards-v3
{
  version: 3,
  cards: [...],                    // Array of card objects
  lastSync: "2024-12-30T15:00:00Z"
}

// Key: neuro-diagrams-v3
{
  version: 3,
  progress: {...},                 // Diagram progress object
  lastUpdated: "2024-12-30T15:00:00Z"
}

// Key: neuro-gamification-v3
{
  version: 3,
  level: 3,
  xp: 1250,
  achievements: [...],
  streaks: {...},
  dailyGoal: {...}
}

// Key: neuro-exam-history-v3
{
  version: 3,
  exams: [...]                     // Array of exam result objects
}

// Key: neuro-settings-v3
{
  version: 3,
  theme: "light",                  // light | dark
  studyMode: "classic",            // default study mode
  dailyGoalTarget: 20,
  notificationsEnabled: false,
  soundsEnabled: true
}
```

### State Persistence Strategy

1. **Auto-save**: Every 30 seconds (debounced)
2. **On navigation**: Before changing views
3. **On unload**: Before window closes
4. **Recovery**: On crash/refresh, restore from localStorage

---

## Performance Optimizations

### 1. Virtualization (for large lists)

```javascript
// Only render visible cards (windowing)
function VirtualizedCardList({ cards, renderCard }) {
  const [visibleRange, setVisibleRange] = useState([0, 20]);

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const startIndex = Math.floor(scrollTop / CARD_HEIGHT);
    const endIndex = startIndex + VISIBLE_COUNT;
    setVisibleRange([startIndex, endIndex]);
  };

  const visibleCards = cards.slice(visibleRange[0], visibleRange[1]);

  return (
    <div onScroll={handleScroll}>
      {visibleCards.map(renderCard)}
    </div>
  );
}
```

### 2. Debouncing (for search)

```javascript
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### 3. Memoization (expensive computations)

```javascript
// Memoize analytics calculations
const analytics = useMemo(() => {
  return calculateAnalytics(cards);
}, [cards]); // Only recalculate when cards change
```

---

## Security Considerations

1. **No server-side code** - Pure client-side app
2. **No user authentication** - Single-user local storage
3. **Data privacy** - All data stays in browser
4. **XSS protection** - React auto-escapes user input
5. **CSP headers** (optional for deployment)

---

## Browser Compatibility

**Minimum requirements:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features used:**
- ES6+ (let/const, arrow functions, destructuring)
- localStorage API
- Service Worker API (for PWA)
- CSS Grid & Flexbox
- SVG 1.1

---

## Deployment

### Option 1: Local File
```bash
# Just open the file in browser
open neurostiinte-nobel-edition.html
```

### Option 2: GitHub Pages
```bash
git add neurostiinte-nobel-edition.html
git commit -m "Add Nobel Edition"
git push origin main

# Enable GitHub Pages in repo settings
# URL: https://yourusername.github.io/repo-name/neurostiinte-nobel-edition.html
```

### Option 3: Netlify
```bash
# Drop file in Netlify deploy UI
# Or use Netlify CLI
netlify deploy --prod --dir=.
```

---

## Development Workflow

### Making changes:
1. Edit `neurostiinte-nobel-edition.html`
2. Refresh browser to see changes
3. Test in DevTools console
4. Commit to git

### Debugging:
- Chrome DevTools → Application → localStorage
- React DevTools (if using extension)
- Console logs (search for "// DEBUG:")

### Testing localStorage:
```javascript
// In browser console
localStorage.getItem('neuro-cards-v3');
localStorage.clear(); // Reset all data
```

---

## Known Limitations

1. **No cloud sync** - Data only in one browser
2. **Storage limits** - localStorage ~10MB limit
3. **No collaborative features** - Single-user only
4. **Basic PWA** - No advanced offline strategies
5. **Manual page refs** - Not linked to actual PDF

---

## Future Technical Improvements

1. **IndexedDB migration** - For larger storage
2. **WebAssembly** - For faster algorithms
3. **WebRTC** - For multiplayer features
4. **Canvas rendering** - For complex diagrams
5. **TypeScript** - For type safety
6. **Unit tests** - Jest + React Testing Library

---

**Last Updated**: 2024-12-30
**Version**: 3.0.0 (Nobel Edition)
**Maintainer**: Claude Code Agent
