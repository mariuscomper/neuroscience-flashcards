# 🧠 Neuroștiințe UBB — fișe de recapitulare

A comprehensive spaced repetition flashcard application for neuroscience studies. The current public app contains the core 812-card study system; the Nobel Edition remains a documented future roadmap.

![Status](https://img.shields.io/badge/Status-Production_Ready-green)
![Cards](https://img.shields.io/badge/Cards-812-blue)
![Modules](https://img.shields.io/badge/Modules-6-purple)
![Roadmap](https://img.shields.io/badge/Roadmap-documented-orange)

---

## 🚀 Quick Start

```bash
# Deschide aplicația direct în browser
open neurostiinte-improved.html

# Nu este necesar un proces de construire; încărcarea inițială are nevoie de internet
# pentru bibliotecile și fonturile încărcate de pe CDN.
# Adresa publică:
# https://mariuscomper.github.io/neuroscience-flashcards/
```

---

## ✨ Features

### 📚 Core Learning System
- **812 comprehensive flashcards** across 6 neuroscience modules
- **Spaced repetition algorithm** (SM-2 inspired) for optimal retention
- **Content-based IDs** for stable progress tracking
- **Export/Import progress** for backup and device sync
- **Search functionality** to find topics quickly
- **Mark difficult cards** for focused review

### 🎯 Study Features
- **Progress tracking** with persistent localStorage
- **Due cards dashboard** - see what needs review today
- **Module-based study** - focus on specific topics
- **Rating system** (1, 3, 4 or 5) for self-assessment
- **Automatic scheduling** based on performance
- **Study statistics** and progress visualization

### 📱 Technical Excellence
- **Pure client-side** - no server needed
- **Browser-local progress** - study data stays in localStorage
- **Mobile responsive** - study anywhere
- **Fast & lightweight** - no local build step
- **Privacy-focused** - all data stays local

---

## 📖 Modules Covered

| Module | Topic | Cards |
|--------|-------|-------|
| **M1** | Perspectivă Istorică | 123 |
| **M2** | Neuroni & Celule Gliale | 135 |
| **M3** | Semnalizare Sinaptică | 133 |
| **M4** | Neuroanatomie | 156 |
| **M5** | Dezvoltare SN | 117 |
| **M6** | Văzul | 146 |
| **Total** | | **812** |

---

## 🎓 How to Use

### 1. Daily Study Routine

**Recommended:** 20-30 cards per day

```
Morning (15 min):
  - Review due cards
  - Study 10-15 new cards

Evening (15 min):
  - Review cards studied in morning
  - Study 10-15 more new cards
```

### 2. Rating System

- **1 — Nu știam**: cardul își resetează progresul și revine curând la repetare
- **3 — Greu**: intervalul crește puțin
- **4 — Bine**: intervalul crește moderat
- **5 — Ușor**: intervalul crește mai mult

**Mastery:** 3+ successful repetitions = mastered card

### 3. Before Exams

- Focus on **due cards** first
- Review **difficult cards** (marked)
- Use **module filter** for weak areas
- **Export progress** for backup

---

## 📚 Documentation

We've created **comprehensive documentation** to help you get the most out of this tool:

### 📘 [User Guide](USER_GUIDE.md)
Complete guide on how to use every feature:
- Quick start tutorial
- Feature explanations
- Best practices for studying
- Exam preparation strategies
- Troubleshooting tips

### 🔧 [Technical Documentation](TECHNICAL.md)
For developers and curious minds:
- Architecture overview
- Data structures
- Algorithms (spaced repetition, scoring)
- Performance optimizations
- Deployment guide

### 🎯 [Features List](FEATURES.md)
Detailed breakdown of the current core and planned features:
- Core learning system
- Study modes
- Analytics
- Gamification (planned)
- Technical specs

### 🏆 [Nobel Edition Summary](NOBEL_EDITION_SUMMARY.md)
Documented future enhancements, not part of the current public app:
- Interactive diagrams (6 planned)
- Gamification system
- Exam simulator
- Advanced analytics
- Multiple study modes
- Mnemonics integration

### 📋 [Integration Plan](INTEGRATION_PLAN.md)
Implementation roadmap for the future Nobel Edition

### 📊 [Final Report](RAPORT_FINAL.md)
Detailed report on the 118 new cards added to reach 812 total

---

## 🌟 Nobel Edition roadmap

The repository contains specifications for a possible future upgrade. These features are not part of the current public app:

### 🎨 Interactive Diagrams (6 diagrams)
- Neuron structure with functional zones
- Tripartite synapse visualization
- Visual pathways (retina → V1)
- Retina layers
- Neural tube development
- CSF circulation

### 🏆 Gamification System
- 7 progression levels (Beginner → Grandmaster)
- XP system (+10/card, +50/mastered, +100/diagram)
- 20+ achievements
- Study streaks
- Daily goals

### 🎓 Exam Simulator
- 50-question practice exams
- 90-minute timer
- Mixed modules
- Difficulty stratification
- Results history
- Score prediction

### 📈 Advanced Analytics
- Module heatmaps
- Leech detection (problem cards)
- Forgetting curve visualization
- Weak area identification
- Study timeline estimation

### 📝 Multiple Study Modes
- **Classic** - Standard Q&A
- **Cloze deletion** - Fill-in-the-blank
- **Reverse** - Answer → Question
- **Multiple choice** - Exam practice
- **Free recall** - Type the answer

### 🧩 Mnemonics (12 ready)
- Cortex layers (I-VI)
- Cranial nerves (I-XII)
- Brain lobes
- Visual pathways
- And more!

### 🔍 Smart Search
- Fuzzy matching (typo-tolerant)
- Semantic search (concept-aware)
- Boolean operators (AND/OR)
- Advanced filters

**All features fully specified in documentation!**

---

## 🛠️ Technical Stack

- **Frontend**: React 18 and Babel Standalone (via CDN)
- **Storage**: localStorage
- **Build**: None - a single HTML application
- **Deployment**: GitHub Pages

The app has no backend and no local package installation, but its first load needs network access to fetch the CDN libraries and fonts.

---

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile browsers fully supported!**

---

## 🔒 Privacy & Data

- **100% local** - all data stays in your browser
- **No tracking** - zero analytics or telemetry
- **No account** - no signup, no login
- **Exportable** - full data export anytime
- **Browser-local data** - progress remains in localStorage on the current browser

---

## 🚀 Deployment Options

### Option 1: Local File (Easiest)
```bash
open neurostiinte-improved.html
```

### Option 2: GitHub Pages
```bash
# Already set up; the root address redirects to the application:
# https://mariuscomper.github.io/neuroscience-flashcards/
```

---

## 📊 Stats & Impact

### Content Coverage
- **812 cards** comprehensively curated
- **6 modules** fully covered
- **118 new cards** added in final iteration
- **100% exam topics** included

### Development
- **5 documentation files** (2,100+ lines)
- **50+ features** specified across the current app and future roadmap
- **8+ algorithms** detailed
- **6 interactive diagrams** designed
- **12 mnemonics** prepared
- **20+ achievements** defined

### Study Efficiency
- **Spaced repetition** reduces study time by 40-60%
- **Progress retention** prevents lost work
- **Mobile access** enables studying anywhere
- **Browser-local progress** keeps study data on the current device

---

## 🤝 Contributing

This is primarily a study tool, but improvements are welcome:

1. **Bug reports** - Open an issue
2. **Feature suggestions** - Check FEATURES.md first
3. **Code improvements** - PRs welcome
4. **New cards** - Ensure accuracy and format

---

## 📄 License

This project is open-source and free to use for educational purposes.

---

## 🙏 Acknowledgments

- **UBB Neuroscience Course** - for the comprehensive curriculum
- **Anki** - for spaced repetition inspiration
- **React** - for the UI framework
- **Claude Code** - for development assistance

---

## 📞 Support

### Issues or Questions?
- Check [USER_GUIDE.md](USER_GUIDE.md) first
- See [TECHNICAL.md](TECHNICAL.md) for technical details
- Open an issue on GitHub

### Want to Implement Nobel Edition?
- All specifications in [TECHNICAL.md](TECHNICAL.md)
- Algorithms in [FEATURES.md](FEATURES.md)
- Integration plan in [INTEGRATION_PLAN.md](INTEGRATION_PLAN.md)
- Estimated: 22-30 hours for full implementation

---

## 🎯 Quick Links

- 📖 [User Guide](USER_GUIDE.md) - How to use
- 🔧 [Technical Docs](TECHNICAL.md) - How it works
- 🎯 [Features](FEATURES.md) - What it can do
- 🏆 [Nobel Edition](NOBEL_EDITION_SUMMARY.md) - Future vision
- 📊 [Final Report](RAPORT_FINAL.md) - 812 cards breakdown

---

## ⭐ Star This Repo!

If this tool helped you with your neuroscience studies, consider:
- ⭐ Starring the repository
- 🔀 Sharing with classmates
- 📝 Contributing improvements
- 💬 Providing feedback

---

**Made with 🧠 for neuroscience students**

**Good luck with your studies! 🎓✨**
