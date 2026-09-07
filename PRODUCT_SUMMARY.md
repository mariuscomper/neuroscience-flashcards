# Rezumatul produsului — pregătire pentru admiterea la Psihologie UBB Cluj

## Stare

La 7 septembrie 2026, aplicația este implementată în `neurostiinte-improved.html` și publicată pe GitHub Pages ca instrument independent pentru cei care se pregătesc pentru admiterea la Psihologie la UBB Cluj. Nu este un produs oficial UBB, nu garantează rezultatul la admitere și nu validează automat conținutul sau performanța utilizatorului.

## Ce a fost livrat

- fundația de 812 carduri cu identificatori bazați pe conținut și repetare spațiată;
- cinci moduri de învățare activă;
- Atlas cu căutare, filtre, șase diagrame, hartă conceptuală și 12 mnemonice;
- simulator de examen cu cronometrul și rezultat pe module;
- progres local cu serie, obiectiv, activitate și repere;
- export/import, temă dublă, tastatură, responsive și PWA offline;
- separarea datelor în `cards-data.js` și a runtime-ului în `neuro-app.js`, fără React, Babel, fonturi sau alte resurse CDN.

## Îmbunătățiri ale materialului

Înainte de publicare au fost reparate probleme de integritate care făceau materialul mai puțin clar:

- două module `undefined` au fost încadrate explicit în M4 și M5;
- răspunsul trunchiat despre zona ventriculară a fost completat;
- întrebarea despre pacientul Tan a fost aliniată cu răspunsul despre localizarea leziunii;
- au fost eliminate întrebările duplicate prin formulări distincte;
- au fost corectate formulări gramaticale evidente.

Aceste corecții nu reprezintă o revizie de specialitate a tuturor celor 812 de afirmații; pentru aceasta rămâne necesară verificarea cu materialul didactic și literatura de specialitate.

Dovezile de verificare sunt consemnate în [raportul QA](qa/report.json). Acesta marchează explicit ca restantă doar captura vizuală live la 390 de pixeli, deoarece controlul de viewport nu a fost disponibil în sesiunea de lucru.

## Arhitectură

Aplicația este un site static:

```text
neurostiinte-improved.html  — shell, metadate și punct de montare
cards-data.js              — datele cardurilor
neuro-app.js               — UI, stare, repetare, Atlas și examen
manifest.webmanifest       — metadate de instalare
sw.js                      — cache offline și actualizare
```

Progresul rămâne în browser. Exportul JSON este mecanismul de mutare între dispozitive; nu există server sau cont.

## Ce rămâne pentru versiunea următoare

Căutarea semantică, exercițiile de identificare pentru diagrame, progresul separat pe Atlas, istoricul complet al examenelor, analiza curbei de uitare și sincronizarea între dispozitive sunt delimitate ca backlog în [INTEGRATION_PLAN.md](INTEGRATION_PLAN.md).
