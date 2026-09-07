# Plan de integrare — ce a fost livrat și ce urmează

## Decizia de arhitectură

Am ales o aplicație statică modulară, nu un fișier monolitic și nu un proiect dependent de CDN:

- datele cardurilor sunt în `cards-data.js`;
- runtime-ul este în `nobel-app.js`;
- `neurostiinte-improved.html` rămâne shell-ul public;
- manifestul și service worker-ul asigură instalarea și cache-ul offline;
- progresul rămâne în browser și poate fi exportat JSON.

Alegerea păstrează pornirea simplă pentru GitHub Pages și face posibilă funcționarea offline după prima încărcare.

## Etapele livrate

1. **Fundație:** 812 carduri, identificare bazată pe conținut și repetare spațiată.
2. **Învățare activă:** completare, invers, grilă și reamintire activă.
3. **Atlas:** căutare și filtre, șase diagrame SVG, hartă conceptuală și mnemonice.
4. **Examen:** seturi de 10/20/50 de întrebări, cronometru, navigare și rezultat pe module.
5. **Progres:** serie, obiectiv, activitate, repere și tabel modular.
6. **Reziliență:** teme luminoasă/întunecată, focus accesibil, mișcare redusă, export/import, fallback pentru stocare și PWA.
7. **Curățarea materialului:** module invalide, duplicate, răspunsuri trunchiate și formulări evidente.

## Backlog delimitat

### Prioritate înaltă

- verificare de specialitate a afirmațiilor card cu card;
- exerciții de identificare și occlusion pentru diagrame;
- progres și statistici separate pentru Atlas;
- istoric vizual al examenelor, cu revizuirea răspunsurilor.

### Prioritate medie

- căutare tolerantă la greșeli și semantică;
- detectarea cardurilor-problemă și recomandări de revenire;
- trasee de studiu bazate pe prerechizite;
- îmbunătățirea mnemonicei într-un mod de exersare.

### În afara versiunii statice actuale

- cont și sincronizare în cloud;
- notificări push;
- predicție validată a notei sau evaluare clinică.

## Regula de lucru

Orice funcție nouă se adaugă numai după ce are o descriere clară, o stare locală explicită, o alternativă accesibilă și o verificare în browser. Documentația trebuie să distingă permanent între „livrat” și „planificat”.
