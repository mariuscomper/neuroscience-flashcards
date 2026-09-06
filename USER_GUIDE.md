# Ghid de utilizare — Neuroștiințe UBB

## Starea aplicației

Acest ghid descrie aplicația publică actuală, neurostiinte-improved.html. Ea conține 812 carduri împărțite în șase module, repetare spațiată, căutare, marcarea cardurilor dificile și salvarea progresului în browser.

Documentele despre Nobel Edition descriu funcții propuse. Diagramele interactive, simulatorul de examen, analiticele avansate, modurile suplimentare de studiu, gamificarea și PWA nu sunt disponibile în versiunea actuală.

## Pornire

1. Deschide [aplicația publică](https://mariuscomper.github.io/neuroscience-flashcards/) sau fișierul neurostiinte-improved.html.
2. La prima încărcare, asigură-te că ai acces la internet: React, ReactDOM, Babel și fonturile sunt încărcate de pe CDN.
3. Alege un modul și apasă „Învață” pentru cardurile care trebuie repetate sau „Toate” pentru întregul modul.
4. Pentru o sesiune generală, folosește butonul de repetare a cardurilor scadente de pe panoul principal.

## Cum se studiază un card

1. Citește întrebarea.
2. Apasă pe card pentru a afișa răspunsul.
3. Dacă întrebarea îți creează probleme, apasă „Marchează ca dificil”.
4. Alege evaluarea potrivită:
   - „Nu știam” resetează progresul cardului;
   - „Greu” mărește puțin intervalul până la următoarea repetare;
   - „Bine” mărește moderat intervalul;
   - „Ușor” mărește mai mult intervalul.

Un card este considerat stăpânit după cel puțin trei repetări reușite. Butonul „Înapoi” te duce la panoul principal fără să pierzi progresul deja salvat.

## Panoul principal

Panoul afișează:

- numărul total de carduri;
- cardurile care trebuie repetate;
- cardurile stăpânite;
- cardurile marcate ca dificile;
- progresul separat pentru modulele M1–M6.

Cronometrul de studiu poate fi pornit și oprit cu „Start” și „Pauză”. El este doar un ajutor pentru organizarea sesiunii și nu schimbă programarea cardurilor.

## Căutare

Apasă „Caută în carduri” și introdu un text. Căutarea verifică atât întrebările, cât și răspunsurile, fără deosebire între litere mari și mici. Rezultatele afișează modulul, răspunsul și numărul de repetări.

## Salvarea și mutarea progresului

Progresul este salvat automat în localStorage, pe dispozitivul și în browserul curent. Nu există cont, sincronizare în cloud sau istoric comun între dispozitive.

- „Export progres” descarcă o copie JSON a progresului.
- „Import progres” încarcă o copie JSON existentă; fă un export înainte dacă vrei să păstrezi starea curentă.
- „Reset progres” reinițializează progresul local.

Păstrează exporturile într-un loc sigur dacă schimbi browserul sau ștergi datele site-ului.

## O rutină simplă

Pentru o sesiune zilnică:

1. repetă mai întâi cardurile scadente;
2. lucrează apoi cardurile marcate ca dificile;
3. adaugă carduri noi dintr-un singur modul;
4. exportă progresul periodic.

Un ritm constant este mai util decât o sesiune foarte lungă urmată de o pauză de mai multe zile.

## Limite cunoscute

- Aplicația nu are cont și nu sincronizează datele între dispozitive.
- Nu există service worker, PWA sau funcționare offline garantată.
- Încărcarea inițială are nevoie de internet pentru bibliotecile și fonturile de pe CDN.
- Căutarea actuală este textuală; nu face căutare semantică și nu corectează automat greșelile de scriere.
- Funcțiile Nobel Edition rămân în documentația de planificare și trebuie implementate și testate separat înainte de a fi promovate ca disponibile.

## Depanare

**Pagina rămâne goală:** verifică accesul la CDN și reîncarcă pagina. Dacă ai deschis fișierul local, încearcă și adresa GitHub Pages.

**Progresul a dispărut:** verifică dacă folosești același browser și aceeași adresă. Dacă ai un export JSON, folosește „Import progres”.

**Vrei să începi de la zero:** folosește „Reset progres” numai după ce ai făcut un export, dacă există date pe care ai putea dori să le păstrezi.

## Date și confidențialitate

Aplicația nu are server propriu, cont sau telemetrie configurată. Cardurile și progresul rămân în browserul local; bibliotecile și fonturile sunt cerute de la furnizorii CDN la încărcarea paginii.
