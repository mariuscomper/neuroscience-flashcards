# Ghid de utilizare — Neuroștiințe UBB

## Pornire

Deschide [aplicația live](https://mariuscomper.github.io/neuroscience-flashcards/) sau, local, `neurostiinte-improved.html`. Prima încărcare descarcă doar fișierele proiectului; aplicația nu folosește biblioteci externe. După prima încărcare într-un browser compatibil, service worker-ul poate păstra aplicația disponibilă offline.

## Panoul

Panoul principal arată numărul de carduri, ce este scadent, progresul pe cele șase module, seria de studiu și obiectivul zilnic. „Începe repetarea” deschide cardurile scadente; din fiecare modul poți alege fie cardurile scadente, fie toate cardurile.

## O sesiune de studiu

1. Citește întrebarea înainte să afișezi răspunsul.
2. Apasă pe card sau folosește bara de spațiu pentru dezvăluire.
3. Alege evaluarea care descrie cât de bine ai știut răspunsul.
4. Repetă până când cardurile scadente se epuizează sau încheie sesiunea.

Evaluarea schimbă intervalul următoarei reveniri. „Nu știam” și „Greu” readuc cardul curând; „Bine” și „Ușor” extind intervalul. „Marchează dificil” adaugă un reper vizual pentru filtrare.

## Cele cinci moduri

- **Clasic:** întrebare, apoi răspuns.
- **Completare:** o porțiune a răspunsului este ascunsă.
- **Invers:** răspunsul este punctul de plecare, iar întrebarea trebuie reconstruită.
- **Grilă:** alegi una dintre patru variante.
- **Reamintire:** scrii ce îți amintești înainte de a verifica răspunsul.

În toate modurile, evaluarea rămâne autoevaluare; aplicația nu pretinde că poate măsura complet înțelegerea.

## Atlasul

Atlasul are patru secțiuni:

- **Carduri:** caută în întrebări și răspunsuri și filtrează după modul sau stare;
- **Diagrame:** explorează șase scheme SVG și selectează noduri pentru explicații;
- **Hartă conceptuală:** urmărește 12 concepte și relațiile lor orientative;
- **Mnemonice:** folosește 12 asocieri scurte pentru a porni reamintirea.

Căutarea este textuală și nu este o căutare semantică tolerantă la greșeli.

## Simulatorul de examen

Alege 10, 20 sau 50 de întrebări. Ai 45 de minute, poți reveni la întrebările anterioare și poți încheia mai devreme. La final primești procentul și repartizarea răspunsurilor pe module. Rezultatul este un reper personal, nu o estimare validată a notei.

## Progres și setări

Pagina „Progres” afișează acuratețea cardurilor evaluate, activitatea ultimelor 14 zile, seria, reperele și situația fiecărui modul. În „Setări” poți schimba tema, obiectivul zilnic, exporta sau importa progresul și reseta datele locale.

Exportul este un fișier JSON. Fă un export înainte de resetare sau înainte de a schimba browserul. Importul înlocuiește starea locală a cardurilor cu starea din fișier.

## Tastatură și accesibilitate

- `/` — focalizează căutarea din Atlas sau deschide Atlasul;
- bara de spațiu — afișează răspunsul în modul clasic/completare/invers;
- `1`–`4` — evaluează răspunsul după dezvăluire;
- `Tab` și `Enter` — navighează controalele.

Există legătură de salt la conținut, etichete pentru progres și controale de temă cu nume accesibil. Interfața respectă preferința de mișcare redusă.

## Date și limite

Cardurile și progresul rămân în browserul curent. Nu există cont, telemetrie configurată sau sincronizare în cloud. Aplicația este un instrument educațional; verifică afirmațiile importante cu materialul de curs și literatura de specialitate.
