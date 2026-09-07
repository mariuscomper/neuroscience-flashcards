# Documentație tehnică — neuroștiințe pentru admiterea la Psihologie UBB Cluj

## Arhitectură efectivă

Aplicația este un site static fără proces de construire și fără dependențe externe:

```text
neurostiinte-improved.html
├── cards-data.js
├── neuro-app.js
├── manifest.webmanifest
├── sw.js
├── icon-192.svg
└── icon-512.svg
```

HTML-ul conține doar metadatele, punctul `#root` și scripturile locale. `cards-data.js` expune `window.NEURO_CARDS`, iar `neuro-app.js` construiește interfața și atașează evenimentele.

## Modelul cardului

Datele sursă folosesc `q`, `a` și `m`. Runtime-ul normalizează fiecare card la:

```javascript
{
  id: "card-<hash>-<index>",
  hash: "<hash al întrebării și răspunsului>",
  question: "...",
  answer: "...",
  module: "M1" | "M2" | "M3" | "M4" | "M5" | "M6",
  interval: 0,
  easeFactor: 2.5,
  repetitions: 0,
  reviews: 0,
  correct: 0,
  nextReview: "<ISO date>",
  lastReview: null,
  isDifficult: false
}
```

Progresul este asociat prin hash-ul conținutului. Astfel, o corectură de text nu mută automat progresul pe alt card.

## Repetare spațiată

Evaluările sunt mapate astfel:

- 1 — nu știam;
- 3 — greu;
- 4 — bine;
- 5 — ușor.

Evaluările sub 3 resetează repetițiile și readuc cardul la o revenire apropiată. Evaluările reușite cresc intervalul: prima revenire este scurtă, apoi intervalul este multiplicat cu factorul de ușurință. Factorul are o limită inferioară pentru a evita intervale nerezonabil de mici.

Cardurile scadente sunt cele cu `nextReview` mai mic sau egal cu momentul curent. Obiectivul zilnic, seria și activitatea sunt derivate din istoricul local.

## Starea locală

Cheia principală este `neuro-ubb-admitere-v1` și conține:

```javascript
{
  version: 1,
  cards: [...],
  history: [{ type: "review" | "exam", at: "...", ... }],
  settings: { theme: "light" | "dark", dailyGoal: 20 }
}
```

Runtime-ul migrează progresul versiunii anterioare din `neuro-nobel-v1` sau `neuro-improved-v2`. Dacă `localStorage` nu este disponibil, păstrează un fallback în memorie pentru sesiunea curentă și afișează un avertisment, astfel încât utilizatorul să poată exporta datele.

## Interfață și accesibilitate

CSS-ul este injectat local și folosește variabile semantice pentru suprafețe, text, accente și borduri. Există teme luminoasă și întunecată, focus vizibil, link de salt la conținut, etichete pentru barele de progres, controale cu nume accesibil și regulă `prefers-reduced-motion`.

Valorile cromatice au fost alese și verificate pentru contrastul textului normal în combinațiile principale de suprafață și accent. Stilurile nu folosesc culori hardcodate în atribute `style`; atributele inline rămase controlează numai dimensiuni numerice de progres.

## PWA și offline

`manifest.webmanifest` descrie aplicația instalabilă, iar `sw.js`:

1. pune în cache shell-ul, datele, runtime-ul, manifestul și pictogramele;
2. activează imediat noul worker;
3. elimină cache-urile vechi;
4. folosește cache-first pentru fișierele deja vizitate și încearcă rețeaua pentru cele noi.

Service worker-ul este înregistrat numai pe HTTP(S), nu la deschiderea directă prin `file://`.

## Verificare locală

```bash
node --check cards-data.js
node --check neuro-app.js
node --check sw.js
node -e "JSON.parse(require('fs').readFileSync('manifest.webmanifest','utf8'))"
git diff --check
```

Verificarea în browser trebuie să acopere panoul, Atlasul, toate modurile de studiu, examenul, progresul, setările, tema întunecată, exportul/importul și comportamentul offline după prima încărcare.

## Limite

Runtime-ul nu folosește un server și nu poate oferi sincronizare sau notificări între dispozitive. Rezultatele examenului sunt orientative. Conținutul educațional trebuie confruntat cu sursa didactică și nu este sfat medical.
