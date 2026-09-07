# Funcționalități — Neuroștiințe UBB, Nobel Edition

Stare verificată la 7 septembrie 2026. Acest document separă funcțiile livrate de lucrurile lăsate intenționat pentru o versiune ulterioară.

## Livrat în versiunea publică

| Zonă | Ce funcționează |
| --- | --- |
| Carduri | 812 de carduri, 812 de întrebări unice, șase module |
| Repetare | evaluări, intervale, carduri scadente, carduri stăpânite, marcaje dificile |
| Moduri | clasic, completare, invers, grilă, reamintire activă |
| Atlas | căutare textuală, filtre după modul/stare, rezultate cu acces direct la studiu |
| Diagrame | șase scheme SVG cu noduri selectabile și explicații |
| Hartă conceptuală | 12 concepte și 12 relații orientative, cu carduri asociate |
| Mnemonice | 12 fișe de memorie, grupate pe module |
| Examen | simulări de 10, 20 sau 50 de întrebări, 45 de minute, navigare, scor și rezultat pe module |
| Progres | serie, obiectiv zilnic, acuratețe, activitate pe 14 zile, repere și tabel pe module |
| Date | export/import JSON, resetare locală, fallback în memorie dacă stocarea browserului nu este disponibilă |
| Interfață | lumină/întuneric, responsive, tastatură, focus vizibil, mișcare redusă |
| Publicare | pagină statică fără CDN, manifest, service worker și cache offline după prima încărcare |

## Ce nu este livrat încă

- căutare semantică, fuzzy search și operatori booleani;
- ocultarea etichetelor sau exerciții de identificare pentru diagrame;
- progres separat pentru diagrame și mnemonice;
- hartă de 100+ concepte sau generator automat de trasee;
- istoric vizual al tuturor examenelor, predicție de scor sau intervale de încredere;
- detectarea automată a „leech cards” și curbă de uitare;
- cont, sincronizare în cloud, notificări sau colaborare între dispozitive.

Acestea rămân backlog explicit, nu promisiuni ascunse în interfața actuală.

## Principii

Aplicația păstrează datele local, folosește HTML/CSS/JavaScript fără dependențe de rețea și nu prezintă rezultatul examenului drept evaluare academică sau medicală. Conținutul este un material de studiu și trebuie confruntat cu sursa de curs.
