# Neuroștiințe pentru admiterea la Psihologie UBB Cluj

Un instrument independent de studiu pentru cei care se pregătesc pentru admiterea la Psihologie la UBB Cluj: 812 de carduri de neuroștiințe, repetare spațiată, moduri de reamintire, atlas vizual și simulări de examen.

**Aplicația live:** [mariuscomper.github.io/neuroscience-flashcards](https://mariuscomper.github.io/neuroscience-flashcards/)

## Ce este livrat

- 812 de carduri și 812 de întrebări unice, împărțite în șase module;
- repetare spațiată inspirată de SM-2, cu intervale și evaluări persistente;
- cinci moduri: clasic, completare, invers, grilă și reamintire activă;
- Atlas cu căutare textuală, filtre după modul și stare, șase diagrame interactive, hartă conceptuală și 12 mnemonice;
- simulator local de examen cu 10, 20 sau 50 de întrebări, cronometru de 45 de minute și rezultat pe module;
- panou de progres cu ritm zilnic, serie de studiu, acuratețe, activitate și repere;
- temă luminoasă și întunecată, navigare cu tastatura, design adaptiv și suport pentru preferința de mișcare redusă;
- export și import JSON;
- PWA cu service worker și cache local pentru funcționare offline după prima încărcare.

## Module

| Modul | Temă | Carduri |
| --- | --- | ---: |
| M1 | Perspectivă istorică | 123 |
| M2 | Neuroni și celule gliale | 135 |
| M3 | Semnalizare sinaptică | 133 |
| M4 | Neuroanatomie | 157 |
| M5 | Dezvoltarea sistemului nervos | 118 |
| M6 | Văzul | 146 |
| **Total** |  | **812** |

## Pornire locală

Nu există proces de construire sau dependențe externe. Pentru o verificare locală:

```bash
python3 -m http.server 8000
```

Apoi deschide `http://localhost:8000/neurostiinte-improved.html`.

Fișierele aplicației sunt:

- `neurostiinte-improved.html` — shell HTML, metadate și descrierea publicului;
- `cards-data.js` — setul de carduri;
- `neuro-app.js` — interfață, repetare, atlas, examen și progres;
- `manifest.webmanifest`, `sw.js`, pictogramele — instalare și cache offline.

## Cum se studiază

Începe cu cardurile scadente. Afișează răspunsul, apoi evaluează sincer: „Nu știam”, „Greu”, „Bine” sau „Ușor”. Pentru consolidare, schimbă modul: completarea și reamintirea activă cer mai mult decât recunoașterea unui răspuns.

Comanda `/` duce la căutare, iar bara de spațiu afișează răspunsul în modul clasic. Datele de studiu rămân în browserul curent și pot fi mutate prin export/import.

## Documentație

- [Ghid de utilizare](USER_GUIDE.md)
- [Lista funcționalităților](FEATURES.md)
- [Documentație tehnică](TECHNICAL.md)
- [Planul livrat și backlogul](INTEGRATION_PLAN.md)
- [Rezumatul produsului](PRODUCT_SUMMARY.md)
- [Raportul celor 812 carduri](RAPORT_FINAL.md)
- [Raportul QA](qa/report.json)

## Limite asumate

Aplicația este un instrument independent, nu un produs oficial UBB și nu garantează rezultatul la admitere. Cardurile provin din materialul de studiu existent și nu înlocuiesc verificarea cu suportul de curs, literatura de specialitate sau sfatul medical. Nu există cont, sincronizare în cloud, predicție validată a notei ori evaluare clinică.
