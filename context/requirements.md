Last synced: 2026-05-24

---

# 1. Epic: [ECS-15] Objektų paieška

- **Statusas:** To Do
- **Prioritetas:** Medium

### [ECS-7] Sistema turi pateikti paieškos rezultatus per ≤ 2 sekundes.

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** 2
- **Atsakingas:** Dziugas Kriukonis
- **Žymos:** Nefunkcinis_reikalavimas
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-10
  - _Susiję su (Relates):_ ECS-10, ECS-30

### [ECS-10] Vartotojo objektų paieška pagal pavadinimą

- **Statusas:** Done
- **Prioritetas:** Highest
- **Istorijos taškai:** 8
- **Atsakingas:** Laurynas Raustys
- **Žymos:** Detalizuotas, Vartotojo_reikalavimas
- **Laiko įvertinimai:** pradinis 14 h, likęs 11 h, praleista —
- **Aprašymas ir priėmimo kriterijai:**
  Sistema leidžia vartotojui įvesti objekto pavadinimą ir rasti labiausiai atitinkančius objektus.

  _Priėmimo kriterijai:_
  - Vartotojas gali įvesti pilną arba dalinį objekto pavadinimą.
  - Sistema pagal įvestą tekstą identifikuoja labiausiai atitinkančius objektus.
  - Paieškai didžiosios ir mažosios raidės įtakos nedaro.
  - Jei nepavyksta identifikuoti objekto → rodomas pranešimas vartotojui.

- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-7, ECS-30
  - _Susiję su (Relates):_ ECS-7, ECS-11, ECS-9, ECS-25
- **Sub-užduotys:**
  - [Done] [ECS-42] Sukurti paieškos lauką UI _(Atsakingas: Laurynas Raustys)_
  - [Done] [ECS-43] Siųsti paieškos užklausą į backend _(Atsakingas: Laurynas Raustys)_
  - [Done] [ECS-44] Implementuoti paiešką pagal pavadinimą duomenų bazėje _(Atsakingas: Laurynas Raustys)_
  - [Done] [ECS-45] Grąžinti rezultatus iš DB _(Atsakingas: Laurynas Raustys)_
  - [Done] [ECS-46] Atvaizduoti rezultatus vartotojui _(Atsakingas: Laurynas Raustys)_

### [ECS-24] DI modelio atpažinimo tikslumas

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** 21
- **Atsakingas:** Airidas Plokštys
- **Žymos:** Nefunkcinis_reikalavimas
- **Aprašymas:**
  Sistema turi užtikrinti, kad bent 90% atvejų nufotografuotas Lietuvos lankytinas objektas būtų atpažintas teisingai.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-30

### [ECS-25] Objekto atpažinimas pagal nuotrauką (DI)

- **Statusas:** Done
- **Prioritetas:** High
- **Istorijos taškai:** 13
- **Atsakingas:** Airidas Plokštys
- **Žymos:** Detalizuotas, Funkcinis_reikalavimas
- **Laiko įvertinimai:** pradinis 9 h, likęs 9 h, praleista —
- **Aprašymas ir priėmimo kriterijai:**
  Sistema turi apdoroti vartotojo įkeltą nuotrauką, naudojant Google Vision API (arba kitą pasirinktą paslaugą) nustatyti joje esantį objektą ir susieti jį su duomenų bazės įrašu.

  _Priėmimo kriterijai:_
  - Sistema leidžia įkelti nuotrauką JPG, PNG formatais (iki 5MB).
  - Identifikavimo procesas (nuo įkėlimo iki rezultato) trunka ne ilgiau 5 sekundžių.
  - DI modelio sėkmingo atpažinimo tikslumas turi būti ne mažesnis nei 90%.
  - Jei objektas atpažįstamas, ekrane parodomas jo pavadinimas, nuotrauka iš DB ir trumpas aprašymas.
  - Jei objektas neatpažįstamas (pvz., nufotografuotas neaiškus vaizdas), sistema parodo klaidą: „Objektas nerastas, bandykite kitą kampą“.

- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-11
  - _Priklauso nuo (Blocked by):_ ECS-32
  - _Susiję su (Relates):_ ECS-10
- **Sub-užduotys:**
  - [Done] [ECS-70] Nuotraukos įkėlimo komponento ir kameros prieigos UI kūrimas.
  - [Done] [ECS-71] Integracija su AI vaizdo atpažinimo API
  - [Done] [ECS-72] Atpažinto raktažodžio susiejimo su DB įrašais logikos programavimas.
  - [Done] [ECS-73] Rezultato kortelės ir klaidų pranešimų atvaizdavimas vartotojo sąsajoje.

### [ECS-26] Automatinis duomenų atnaujinimas (scraping)

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** 13
- **Atsakingas:** Airidas Plokštys
- **Žymos:** Funkcinis_reikalavimas
- **Aprašymas:**
  Sistema turi periodiškai nuskaityti turizmo portalus ir atnaujinti objektų aprašymus bei kategorijas.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-30

### [ECS-32] Kaip vartotojas, aš noriu įkelti nuotrauką iš savo telefono galerijos ieškant objektų

- **Statusas:** Done
- **Prioritetas:** High
- **Istorijos taškai:** 3
- **Atsakingas:** Ignas Sarapinas
- **Žymos:** Detalizuotas, Vartotojo_reikalavimas
- **Laiko įvertinimai:** pradinis 11 h, likęs 5 h 30 min, praleista —
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu įkelti nuotrauką iš savo įrenginio galerijos ieškant objektų, kad galėčiau greitai atpažinti matytą vietą.

  _Priėmimo kriterijai:_
  - Paieškos skiltyje yra matomas mygtukas/ikona nuotraukai įkelti.
  - Paspaudus mygtuką, atidaromas įrenginio failų pasirinkimo langas.
  - Sistema leidžia įkelti tik standartinių formatų vaizdus (JPG, PNG). Saugumui užtikrinti tikrinamas ne tik failo plėtinys, bet ir vidinis turinis, kad nebūtų įkelti kenksmingi duomenys.
  - Siekiant taupyti mobiliojo ryšio duomenis, įkeliamos nuotraukos yra automatiškai mažinamos (optimizuojamos) prieš siuntimą.
  - Nuotraukos įkėlimas ir apdorojimas sistemoje turi veikti nepriklausomai nuo to, ar dirbtinio intelekto (AI) modelis tuo metu yra pasiekiamas.
  - Įkėlus netinkamo formato, pažeistą ar per didelį failą, vartotojui rodomas aiškus klaidos pranešimas.

- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-25
  - _Susiję su (Relates):_ ECS-9
- **Sub-užduotys:**
  - [Done] [ECS-52] Sukurti mygtuką - ikoną paieškos skiltyje
  - [Done] [ECS-53] Atidaryti įrenginio failų pasirinkimo dialogo langą
  - [Done] [ECS-54] Validuoti failo formatą, kaip PNG, JPG ir dydį
  - [Done] [ECS-55] Sukurti endpoint'ą ir papildomai failą validuoti serveryje

---

# 2. Epic: [ECS-16] Objektų filtravimas

- **Statusas:** To Do
- **Prioritetas:** Medium

### [ECS-8] Sistema turi pritaikyti filtrus ir atnaujinti rezultatus per ≤ 2 sekundes.

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** 2
- **Atsakingas:** Dziugas Kriukonis
- **Žymos:** Nefunkcinis_reikalavimas
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-9
  - _Susiję su (Relates):_ ECS-9

### [ECS-9] Vartotojo objektų filtravimas

- **Statusas:** Done
- **Prioritetas:** Highest
- **Istorijos taškai:** —
- **Atsakingas:** Dziugas Kriukonis
- **Žymos:** Detalizuotas, Vartotojo_reikalavimas
- **Aprašymas ir priėmimo kriterijai:**
  Sistema leidžia vartotojui pasirinkti arba įvesti norimą atstumo spindulį nuo savo buvimo vietos arba pasirinktos lokacijos. Paspaudus filtravimo mygtuką, sistema pateikia tik tuos objektus, kurie patenka į nurodytą atstumą.

  _Priėmimo kriterijai:_
  - Vartotojas gali pasirinkti atstumą iš pateiktų reikšmių (pvz., 1 km, 5 km, 10 km) arba įvesti savo atstumo reikšmę.
  - Pakeitus atstumo reikšmę, filtravimas įvykdomas dar kartą paspaudus filtravimo mygtuką.
  - Sistema pateikia tik tuos objektus, kurie patenka į nurodytą atstumą.
  - Jei nėra objektų nurodytame spindulyje - rodomas pranešimas vartotojui.

- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-8
  - _Susiję su (Relates):_ ECS-10, ECS-20, ECS-32, ECS-14, ECS-8
- **Sub-užduotys:**
  - [Done] [ECS-38] Sukurti UI komponentą atstumo pasirinkimui (Frontend) _(Atsakingas: Dziugas Kriukonis)_
  - [Done] [ECS-39] Implementuoti filtravimo logiką backend’e _(Atsakingas: Dziugas Kriukonis)_
  - [Done] [ECS-40] Gauti objektus pagal atstumą iš duomenų bazės _(Atsakingas: Dziugas Kriukonis)_
  - [Done] [ECS-41] Atnaujinti rezultatų atvaizdavimą UI _(Atsakingas: Dziugas Kriukonis)_

### [ECS-20] Sistema turi pasiūlyti panašius lankytinus objektus pagal pasirinktą objekto kategoriją.

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Vincas Anikevičius
- **Žymos:** Funkcinis_reikalavimas
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-28, ECS-9

### [ECS-27] Kaip vartotojas, noriu automatiškai nustatyti savo lokaciją.

- **Statusas:** Done
- **Prioritetas:** High
- **Istorijos taškai:** —
- **Atsakingas:** Airidas Plokštys
- **Žymos:** Detalizuotas, Vartotojo_reikalavimas
- **Aprašymas ir priėmimo kriterijai:**
  Noriu, kad sistema pati nustatytų mano GPS koordinates, jog nereiktų jų vesti rankiniu būdu planuojant maršrutą.

  _Priėmimo kriterijai:_
  - Sistema paprašo leidimo naudoti GPS duomenis (Browser/OS prompt).
  - Sėkmingai gavus koordinates, pagrindiniame lange rodomas atstumas iki kiekvieno objekto kilometrais.
  - Jei vartotojas nesuteikia leidimo, sistema leidžia maršruto pradžios tašką (miestą ar adresą) įvesti rankiniu būdu.

- **Sub-užduotys:**
  - [Done] [ECS-77] Vartotojo koordinačių perdavimo į serverį API sukūrimas.
  - [Done] [ECS-78] Objektų filtravimo pagal gautas koordinates SQL užklausa.
  - [Done] [ECS-79] Atstumo rodiklio atvaizdavimas objektų sąraše.

---

# 3. Epic: [ECS-17] Objektų peržiūra

- **Statusas:** To Do
- **Prioritetas:** Medium

### [ECS-11] Vartotojo objekto aprašymo ir nuotraukų peržiūrėjimas.

- **Statusas:** In Progress
- **Prioritetas:** High
- **Istorijos taškai:** —
- **Atsakingas:** Dziugas Kriukonis
- **Žymos:** Vartotojo_reikalavimas
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-56, ECS-25
  - _Susiję su (Relates):_ ECS-10

### [ECS-14] Kaip vartotojas, noriu matyti objekto vietą žemėlapyje, kad galėčiau lengviau jį rasti.

- **Statusas:** In Progress
- **Prioritetas:** High
- **Istorijos taškai:** —
- **Atsakingas:** Vincas Anikevičius
- **Žymos:** Vartotojo_reikalavimas
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-9, ECS-22

### [ECS-28] Kaip vartotojas, noriu matyti objektus pagal kategorijų piktogramas

- **Statusas:** Done
- **Prioritetas:** Low
- **Istorijos taškai:** —
- **Atsakingas:** Airidas Plokštys
- **Žymos:** Vartotojo_reikalavimas
- **Aprašymas:**
  Noriu interaktyvaus sąrašo su piktogramomis, kad galėčiau greitai rasti dominančio tipo vietas.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-20

### [ECS-29] Kaip vartotojas, noriu peržiūrėti informaciją užsienio kalba

- **Statusas:** To Do
- **Prioritetas:** High
- **Istorijos taškai:** —
- **Atsakingas:** Airidas Plokštys
- **Žymos:** Vartotojo_reikalavimas
- **Aprašymas:**
  Noriu turėti galimybę pakeisti sistemos kalbą į kitą užsienio kalbą.

### [ECS-30] Sistemos klaidų registravimas ir pranešimų siuntimas

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Ignas Sarapinas
- **Žymos:** Detalizuotas, Nefunkcinis_reikalavimas
- **Laiko įvertinimai:** pradinis 6 h, likęs 6 h, praleista —
- **Aprašymas ir priėmimo kriterijai:**
  Sistema turi automatiškai fiksuoti kritines klaidas (pvz., kaip API sutrikimai) ir apie jas informuoti administratorius.

  _Priėmimo kriterijai:_
  - Visos kritinės klaidos automatiškai išsaugomos naudojant įrašantį įrankį, pvz. “Sentry”.
  - Fiksuojamas tikslus klaidos laikas, tipas, modulis ir pradiniai užklausos duomenys (be jautrios informacijos).
  - Administratoriams el. laiškas siunčiamas tik įvykus kritinei klaidai. Smulkios klaidos (pvz., 404 ar validacijos klaidos) administratoriaus pašto dėžutės nepasiekia.
  - Įvykus klaidai, vartotojui rodomas standartizuotas pranešimas: „Atsiprašome, įvyko nenumatyta techninė klaida. Mūsų komanda jau informuota ir sprendžia problemą. Prašome pabandyti vėliau.“ (Jokių stack trace ar vidinių klaidų kodų).
  - Klaidų registravimas ir pranešimų siuntimas vyksta fone (asinchroniškai) ir neturi jokios įtakos vartotojo sąsajos greitaveikai.

- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-10
  - _Susiję su (Relates):_ ECS-33, ECS-26, ECS-21, ECS-24, ECS-7
- **Sub-užduotys:**
  - [To Do] [ECS-47] Klaidų gaudymo mechanizmo implementacija _(Atsakingas: Ignas Sarapinas)_
  - [To Do] [ECS-48] Įrašymas serverio klaidų į log failus _(Atsakingas: Ignas Sarapinas)_
  - [To Do] [ECS-49] Elektroninių laiškų siuntimas administratoriams _(Atsakingas: Ignas Sarapinas)_
  - [To Do] [ECS-50] Užtikrinti, kad klaidų pranešimai ir elektroniniai laiškai būtų siunčiami asinchroniniu būdu fone _(Atsakingas: Ignas Sarapinas)_
  - [To Do] [ECS-51] Suprantama klaidų pranešimo formuluotė be techninių detalių _(Atsakingas: Ignas Sarapinas)_

### [ECS-31] Daugiakalbio turinio valdymo sąsaja administratoriams

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Ignas Sarapinas
- **Žymos:** Funkcinis_reikalavimas

### [ECS-34] Numatytųjų (default) nuotraukų priskyrimas objektams be vaizdinės informacijos

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Ignas Sarapinas
- **Žymos:** Funkcinis_reikalavimas

### [ECS-35] Kaip vartotojas, aš noriu matyti rekomenduojamą objekto lankymo trukmę

- **Statusas:** Done
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Ignas Sarapinas
- **Žymos:** Vartotojo_reikalavimas

---

# 4. Epic: [ECS-18] Objektų pasirinkimas

- **Statusas:** To Do
- **Prioritetas:** Medium

### [ECS-37] Objekto pridėjimas į maršrutą

- **Statusas:** Done
- **Prioritetas:** Highest
- **Istorijos taškai:** —
- **Atsakingas:** Laurynas Raustys
- **Žymos:** Detalizuotas, Vartotojo_reikalavimas
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu pridėti pasirinktą objektą į maršrutą iš objekto kortelės, kad galėčiau sudaryti planuojamų aplankyti vietų sąrašą prieš generuojant kelionės maršrutą.

  Priėmimo kriterijai:
  - Objekto peržiūros lange yra mygtukas "Pridėti į maršrutą".
  - Paspaudus mygtuką, objektas atsiranda pasirinktų objektų sąraše.
  - Tas pats objektas negali būti pridėtas antrą kartą.
  - Po sėkmingo pridėjimo vartotojui rodomas aiškus patvirtinimas.
  - Po pridėjimo atsinaujina pasirinktų objektų skaičius.
  - Maksimalus maršruto objektų skaičius - 10. Viršijus limitą, rodomas klaidos pranešimas.

- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-12, ECS-56, ECS-67
  - _Susiję su (Relates):_ ECS-12, ECS-65, ECS-66, ECS-68
- **Sub-užduotys:**
  - [Done] [ECS-57] Sukurti mygtuką objekto kortelėje
  - [Done] [ECS-58] Implementuoti objekto pridėjimo logiką
  - [Done] [ECS-59] Atnaujinti pasirinktų objektų skaitiklį
  - [Done] [ECS-60] Užtikrinti, kad tas pats objektas nebūtų pridėtas du kartus

### [ECS-56] Pasirinktų objektų sąrašo peržiūra

- **Statusas:** In Progress
- **Prioritetas:** Highest
- **Istorijos taškai:** —
- **Atsakingas:** —
- **Žymos:** Detalizuotas, Vartotojo_reikalavimas
- **Laiko įvertinimai:** pradinis 2 h, likęs 2 h, praleista —
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu matyti visų pasirinktų objektų sąrašą prieš generuojant maršrutą, kad galėčiau peržiūrėti savo kelionės planą ir įsitikinti, jog pasirinkau tinkamas vietas.

  Priėmimo kriterijai:
  - Vartotojas mato pasirinktų objektų sąrašą atskiroje srityje arba lange.
  - Prie kiekvieno objekto rodomas bent pavadinimas.
  - Vartotojas gali keisti objektų tvarką sąraše naudojant drag-and-drop funkciją. Pagal nutylėjimą, rikiuojama pagal pridėjimo laiką (pirmiau pridėtas viršuje).
  - Rodomas bendras pasirinktų objektų kiekis.
  - Jei sąrašas tuščias, rodomas aiškus pranešimas, kad objektų dar nepasirinkta.
  - Sąrašas atsinaujina iš karto po objekto pridėjimo arba pašalinimo.

- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-65, ECS-11
  - _Priklauso nuo (Blocked by):_ ECS-37
  - _Susiję su (Relates):_ ECS-12, ECS-66, ECS-68, ECS-67
- **Sub-užduotys:**
  - [Done] [ECS-61] Sukurti pasirinktų objektų sąrašo UI
  - [Done] [ECS-62] Gauti ir atvaizduoti pasirinktus objektus
  - [Done] [ECS-63] Įgyvendinti tuščio sąrašo pranešimą
  - [Done] [ECS-64] Atnaujinti sąrašą po pridėjimo ar pašalinimo
  - [To Do] [ECS-84] Integruoti drag-and-drop biblioteką objektų eiliškumo keitimui

### [ECS-65] Objekto šalinimas iš maršruto

- **Statusas:** Done
- **Prioritetas:** Highest
- **Istorijos taškai:** —
- **Atsakingas:** Laurynas Raustys
- **Žymos:** Vartotojo_reikalavimas
- **Aprašymas:**
  Kaip vartotojas, noriu pašalinti objektą iš pasirinkto maršruto sąrašo, kad galėčiau koreguoti planuojamų aplankyti vietų rinkinį prieš sudarant galutinį maršrutą.
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-56
  - _Susiję su (Relates):_ ECS-37, ECS-12, ECS-66, ECS-68, ECS-67

### [ECS-66] Pasirinktų objektų išsaugojimas sesijos metu

- **Statusas:** Done
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Laurynas Raustys
- **Žymos:** Funkcinis_reikalavimas
- **Aprašymas:**
  Sistema turi išsaugoti vartotojo pasirinktus objektus sesijos metu, kad vartotojas neprarastų pasirinkimų atnaujinęs puslapį arba pereidamas tarp sistemos langų.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-37, ECS-56, ECS-65

### [ECS-68] Pasirinkimų sąrašo atnaujinimas be puslapio perkrovimo

- **Statusas:** Done
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Laurynas Raustys
- **Žymos:** Nefunkcinis_reikalavimas
- **Aprašymas:**
  Sistema turi atnaujinti pasirinktų objektų sąrašą ir jų skaičių be puslapio perkrovimo, kad vartotojo veiksmai būtų matomi iš karto ir sąsaja išliktų sklandi.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-37, ECS-56, ECS-65

---

# 5. Epic: [ECS-19] Maršruto sudarymas

- **Statusas:** To Do
- **Prioritetas:** Medium

### [ECS-12] Sistema turi sudaryti maršrutą pagal pasirinktus objektus ir transporto priemonę

- **Statusas:** Done
- **Prioritetas:** High
- **Istorijos taškai:** 13
- **Atsakingas:** Dziugas Kriukonis
- **Žymos:** Funkcinis_reikalavimas
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-37, ECS-13
  - _Susiję su (Relates):_ ECS-37, ECS-33, ECS-21, ECS-13, ECS-56, ECS-65, ECS-67, ECS-22

### [ECS-13] Vartotojas gali pasirinkti transporto tipą

- **Statusas:** Done
- **Prioritetas:** High
- **Istorijos taškai:** 5
- **Atsakingas:** Vincas Anikevičius
- **Žymos:** Detalizuotas, Vartotojo_reikalavimas
- **Laiko įvertinimai:** pradinis 4 h 30 min, likęs 4 h 30 min, praleista —
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu UI sąsajoje pasirinkti transporto priemonę, kad maršrutas būtų pritaikytas mano keliavimo būdui.

  Priėmimo kriterijai:
  - Vartotojas gali pasirinkti vieną transporto tipą iš pateiktų variantų UI sąsajoje
  - Pasirinktas transporto tipas yra išsaugomas sesijos metu
  - Jei transporto tipas nepasirinktas, maršruto generavimas nėra leidžiamas ir vartotojui rodomas pranešimas, kad reikia pasirinkti transporto tipą

- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-12, ECS-67
  - _Susiję su (Relates):_ ECS-12
- **Sub-užduotys:**
  - [Done] [ECS-69] Transporto priemonės tipo lauko UI _(Atsakingas: Vincas Anikevičius)_
  - [Done] [ECS-74] Transporto tipo išsaugojimas _(Atsakingas: Vincas Anikevičius)_
  - [Done] [ECS-75] Maršruto skaičiavimo algoritmo atnaujinimas, kad skaičiuotų pagal tai, kokia transporto priemonė pasirinkta _(Atsakingas: Vincas Anikevičius)_
  - [Done] [ECS-76] Transporto priemonės tipo laukas duombazėje _(Atsakingas: Vincas Anikevičius)_

### [ECS-21] Sistema turi apskaičiuoti maršruto trukmę.

- **Statusas:** Done
- **Prioritetas:** Medium
- **Istorijos taškai:** 3
- **Atsakingas:** Vincas Anikevičius
- **Žymos:** Detalizuotas, Funkcinis_reikalavimas
- **Laiko įvertinimai:** pradinis 5 h, likęs 5 h, praleista —
- **Aprašymas ir priėmimo kriterijai:**
  Sistema turi apskaičiuoti kelionės trukmę tarp pasirinktų objektų, atsižvelgiant į atstumą ir pasirinktą transporto tipą.

  Priėmimo kriterijai:
  - Sistema apskaičiuoja bendrą maršruto trukmę naudodama API
  - Trukmė pateikiama vartotojui suprantamu formatu (pvz., valandos ir minutės)
  - Skaičiavimas naudoja pasirinktą transporto tipą
  - Pasikeitus objektams arba transportui, trukmė atnaujinama
  - Jei nepavyks gauti duomenų iš API, vartotojui rodomas klaidos pranešimas

- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-22, ECS-12, ECS-30
- **Sub-užduotys:**
  - [Done] [ECS-80] Maršruto trukmės saugojimas duombazėje _(Atsakingas: Vincas Anikevičius)_
  - [Done] [ECS-82] Maršruto trukmės parodymas UI _(Atsakingas: Vincas Anikevičius)_
  - [Done] [ECS-83] Maršruto apskaičiavimo API integracija _(Atsakingas: Vincas Anikevičius)_

### [ECS-22] Sistema turi vizualiai parodyti sugeneruotą maršrutą žemėlapyje.

- **Statusas:** Done
- **Prioritetas:** Medium
- **Istorijos taškai:** 13
- **Atsakingas:** Vincas Anikevičius
- **Žymos:** Funkcinis_reikalavimas
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-14, ECS-12, ECS-21

### [ECS-33] Kaip vartotojas, aš noriu išsaugoti sudarytą maršrutą

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** 5
- **Atsakingas:** Ignas Sarapinas
- **Žymos:** Vartotojo_reikalavimas
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-12, ECS-30

### [ECS-67] Maršruto generavimo sąlygų validavimas.

- **Statusas:** Done
- **Prioritetas:** Medium
- **Istorijos taškai:** 2
- **Atsakingas:** Laurynas Raustys
- **Žymos:** Funkcinis_reikalavimas
- **Aprašymas:**
  Sistema turi patikrinti, ar prieš maršruto generavimą vartotojas yra pasirinkęs pakankamą objektų skaičių ir nurodęs būtinus parametrus, kad maršrutas būtų sudarytas korektiškai.
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-13, ECS-37
  - _Susiję su (Relates):_ ECS-12, ECS-56, ECS-65

---

# 6. Kiti / Sisteminiai reikalavimai (Nepriskirti konkrečiam Epic)

### [ECS-23] Sistema turi palaikyti bent 100 vienu metu aktyvių vartotojų neprarandant funkcionalumo.

- **Statusas:** To Do
- **Prioritetas:** Medium
- **Istorijos taškai:** —
- **Atsakingas:** Vincas Anikevičius
- **Žymos:** Nefunkcinis_reikalavimas
