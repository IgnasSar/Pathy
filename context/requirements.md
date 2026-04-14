Last synced: 2026-04-14 18:39

---

# 1. Epic: [ECS-15] Objektų paieška

### [ECS-7] Sistema turi pateikti paieškos rezultatus per ≤ 2 sekundes.

- **Prioritetas:** Medium
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-10
  - _Susiję su (Relates):_ ECS-10

### [ECS-10] Vartotojo objektų paieška pagal pavadinimą

- **Prioritetas:** Highest
- **Aprašymas ir priėmimo kriterijai:**
  Sistema leidžia vartotojui įvesti objekto pavadinimą ir identifikavus atitinkamą objektą, pateikia sąrašą kitų objektų, kurie yra panašūs pagal kategoriją.
  _Priėmimo kriterijai:_
  - Vartotojas gali įvesti pilną arba dalinį objekto pavadinimą.
  - Sistema pagal įvestą tekstą identifikuoja labiausiai atitinkantį objektą.
  - Identifikavus objektą, pateikiami kiti objektai iš tos pačios kategorijos.
  - Paieškai didžiosios ir mažosios raidės įtakos nedaro.
  - Rezultatai pateikiami per ≤ 2 sek.
  - Jei nepavyksta identifikuoti objekto → rodomas pranešimas vartotojui.
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-7
  - _Susiję su (Relates):_ ECS-11, ECS-9, ECS-25, ECS-7, ECS-30
- **Sub-užduotys:**
  - [ECS-42] Sukurti paieškos lauką UI
  - [ECS-43] Siųsti paieškos užklausą į backend
  - [ECS-44] Implementuoti paiešką pagal pavadinimą duomenų bazėje
  - [ECS-45] Grąžinti rezultatus iš DB
  - [ECS-46] Atvaizduoti rezultatus vartotojui

### [ECS-24] DI modelio atpažinimo tikslumas

- **Prioritetas:** Medium
- **Aprašymas:** Sistema turi užtikrinti, kad bent 85% atvejų nufotografuotas Lietuvos lanktynas objektas būtų atpažintas teisingai.

### [ECS-25] Objekto atpažinimas pagal nuotrauką (DI)

- **Prioritetas:** Medium
- **Aprašymas ir priėmimo kriterijai:**
  Sistema turi apdoroti vartotojo įkeltą nuotrauką, naudojant Google Vision API (arba kitą pasirinktą paslaugą) nustatyti joje esantį objektą ir susieti jį su duomenų bazės įrašu.
  _Priėmimo kriterijai:_
  - Sistema leidžia įkelti nuotrauką JPG, PNG formatais (iki 5MB).
  - Identifikavimo procesas (nuo įkėlimo iki rezultato) trunka ne ilgiau 5 sekundžių.
  - DI modelio sėkmingo atpažinimo tikslumas turi būti ne mažesnis nei 90%.
  - Jei objektas atpažįstamas, ekrane parodomas jo pavadinimas, nuotrauka iš DB ir trumpas aprašymas.
  - Jei objektas neatpažįstamas (pvz., nufotografuotas neaiškus vaizdas), sistema parodo klaidą: „Objektas nerastas, bandykite kitą kampą“.
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-32
  - _Susiję su (Relates):_ ECS-11, ECS-10
- **Sub-užduotys:**
  - [ECS-70] Nuotraukos įkėlimo komponento ir kameros prieigos UI kūrimas.
  - [ECS-71] Integracija su AI vaizdo atpažinimo API
  - [ECS-72] Atpažinto raktažodžio susiejimo su DB įrašais logikos programavimas.
  - [ECS-73] Rezultato kortelės ir klaidų pranešimų atvaizdavimas vartotojo sąsajoje.

### [ECS-26] Automatinis duomenų atnaujinimas (scraping)

- **Prioritetas:** Medium
- **Aprašymas:** Sistema turi periodiškai nuskaityti turizmo portalus ir atnaujinti objektų aprašymus bei kategorijas. _(Funkcinis reikalavimas)_

### [ECS-32] Kaip vartotojas, aš noriu įkelti nuotrauką iš savo telefono galerijos ieškant objektų

- **Prioritetas:** High
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu įkelti nuotrauką iš savo įrenginio galerijos ieškant objektų, kad galėčiau greitai atpažinti matytą vietą.
  _Priėmimo kriterijai:_
  - Paieškos skiltyje yra matomas mygtukas/ikona nuotraukai įkelti.
  - Paspaudus mygtuką, atidaromas įrenginio failų pasirinkimo langas.
  - Sistema leidžia įkelti tik standartinių formatų vaizdus (JPG, PNG).
  - Sistema riboja maksimalų įkeliamo failo dydį (iki 10 MB).
  - Įkėlus netinkamo formato ar per didelį failą, vartotojui rodomas klaidos pranešimas.
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-25
  - _Susiję su (Relates):_ ECS-9
- **Sub-užduotys:**
  - [ECS-52] Sukurti mygtuką - ikoną paieškos skiltyje
  - [ECS-53] Atidaryti įrenginio failų pasirinkimo dialogo langą
  - [ECS-54] Validuoti failo formatą, kaip PNG, JPG ir dydį
  - [ECS-55] Sukurti endpoint'ą ir papildomai failą validuoti serveryje

---

# 2. Epic: [ECS-16] Objektų filtravimas

### [ECS-8] Sistema turi pritaikyti filtrus ir atnaujinti rezultatus per ≤ 2 sekundes.

- **Prioritetas:** Medium
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-9
  - _Susiję su (Relates):_ ECS-9

### [ECS-9] Vartotojo objektų filtravimas

- **Prioritetas:** Highest
- **Aprašymas ir priėmimo kriterijai:**
  Sistema leidžia vartotojui pasirinkti arba įvesti norimą atstumo spindulį nuo savo buvimo vietos arba pasirinktos lokacijos. Paspaudus filtravimo mygtuką, sistema pateikia tik tuos objektus, kurie patenka į nurodytą atstumą.
  _Priėmimo kriterijai:_
  - Vartotojas gali pasirinkti atstumą iš pateiktų reikšmių (pvz., 1 km, 5 km, 10 km) arba įvesti savo atstumo reikšmę.
  - Pakeitus atstumo reikšmę, filtravimas įvykdomas dar kartą paspaudus filtravimo mygtuką.
  - Sistema pateikia tik tuos objektus, kurie patenka į nurodytą atstumą.
  - Jei nėra objektų nurodytame spindulyje → rodomas pranešimas vartotojui.
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-8
  - _Susiję su (Relates):_ ECS-10, ECS-20, ECS-32, ECS-14, ECS-8
- **Sub-užduotys:**
  - [ECS-38] Sukurti UI komponentą atstumo pasirinkimui (Frontend)
  - [ECS-39] Implementuoti filtravimo logiką backend’e
  - [ECS-40] Gauti objektus pagal atstumą iš duomenų bazės
  - [ECS-41] Atnaujinti rezultatų atvaizdavimą UI

### [ECS-20] Sistema turi pasiūlyti panašius lankytinus objektus pagal pasirinktą objekto kategoriją.

- **Prioritetas:** Medium
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-28, ECS-9

### [ECS-27] Kaip vartotojas, noriu automatiškai nustatyti savo lokaciją

- **Prioritetas:** High
- **Aprašymas ir priėmimo kriterijai:**
  Noriu, kad sistema pati nustatytų mano GPS koordinates, jog nereiktų jų vesti rankiniu būdu planuojant maršrutą.
  _Priėmimo kriterijai:_
  - Sistema paprašo leidimo naudoti GPS duomenis (Browser/OS prompt).
  - Sėkmingai gavus koordinates, pagrindiniame lange rodomas atstumas iki kiekvieno objekto kilometrais.
  - Jei vartotojas nesuteikia leidimo, sistema leidžia maršruto pradžios tašką (miestą ar adresą) įvesti rankiniu būdu.
- **Sub-užduotys:**
  - [ECS-77] Vartotojo koordinačių perdavimo į serverį API sukūrimas.
  - [ECS-78] Objektų filtravimo pagal gautas koordinates SQL užklausa.
  - [ECS-79] Atstumo rodiklio atvaizdavimas objektų sąraše.

---

# 3. Epic: [ECS-17] Objektų peržiūra

### [ECS-11] Vartotojo objekto aprašymo ir nuotraukų peržiūrėjimas.

- **Prioritetas:** High
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-56, ECS-25, ECS-10

### [ECS-14] Kaip vartotojas, noriu matyti objekto vietą žemėlapyje, kad galėčiau lengviau jį rasti.

- **Prioritetas:** High
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-9, ECS-22

### [ECS-28] Kaip vartotojas, noriu matyti objektus pagal kategorijų piktogramas

- **Prioritetas:** Low
- **Aprašymas:** Noriu interaktyvaus sąrašo su piktogramomis, kad galėčiau greitai rasti dominančio tipo vietas.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-20

### [ECS-29] Kaip vartotojas, noriu peržiūrėti informaciją užsienio kalba

- **Prioritetas:** High
- **Aprašymas:** Noriu turėti galimybę pakeisti sistemos kalbą į kitą užsienio kalbą.

### [ECS-30] Sistemos klaidų registravimas ir pranešimų siuntimas

- **Prioritetas:** Medium
- **Aprašymas ir priėmimo kriterijai:**
  Sistema turi automatiškai fiksuoti kritines klaidas (pvz., kaip API sutrikimai) ir apie jas informuoti administratorius.
  _Priėmimo kriterijai:_
  - Kritinės klaidos automatiškai išsaugomos serverio log faile.
  - Fiksuojamas tikslus laikas, klaidos tipas ir modulis.
  - Administratoriams automatiškai išsiunčiamas el. laiškas apie klaidą.
  - Klaidų registravimas veikia fone ir nestabdo vartotojo sąsajos.
  - Įvykus klaidai, vartotojui rodomas tik bendrinis pranešimas (jokių techninių detalių).
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-10
- **Sub-užduotys:**
  - [ECS-47] Klaidų gaudymo mechanizmo implementacija
  - [ECS-48] Įrašymas serverio klaidų į log failus
  - [ECS-49] Elektroninių laiškų siuntimas administratoriams
  - [ECS-50] Užtikrinti, kad klaidų pranešimai ir elektroniniai laiškai būtų siunčiami asinchroniniu būdu fone
  - [ECS-51] Suprantama klaidų pranešimo formuluotė be techninių detalių

### [ECS-31] Daugiakalbio turinio valdymo sąsaja administratoriams

- **Prioritetas:** Medium

### [ECS-34] Numatytųjų (default) nuotraukų priskyrimas objektams be vaizdinės informacijos

- **Prioritetas:** Medium

### [ECS-35] Kaip vartotojas, aš noriu matyti rekomenduojamą objekto lankymo trukmę

- **Prioritetas:** Medium

---

# 4. Epic: [ECS-18] Objektų pasirinkimas

### [ECS-37] Objekto pridėjimas į maršrutą

- **Prioritetas:** Highest
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu pridėti pasirinktą objektą į maršrutą iš objekto kortelės, kad galėčiau sudaryti planuojamų aplankyti vietų sąrašą prieš generuojant kelionės maršrutą.
  _Priėmimo kriterijai:_
  - Objekto peržiūros lange yra mygtukas "Pridėti į maršrutą".
  - Paspaudus mygtuką, objektas atsiranda pasirinktų objektų sąraše.
  - Tas pats objektas negali būti pridėtas antrą kartą.
  - Po sėkmingo pridėjimo vartotojui rodomas aiškus patvirtinimas.
  - Po pridėjimo atsinaujina pasirinktų objektų skaičius.
  - Maksimalus maršruto objektų skaičius - 10. Viršijus limitą, rodomas klaidos pranešimas.
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-12
  - _Priklauso nuo (Blocked by):_ ECS-12
  - _Susiję su (Relates):_ ECS-56, ECS-67, ECS-65, ECS-66, ECS-68
- **Sub-užduotys:**
  - [ECS-57] Sukurti mygtuką objekto kortelėje
  - [ECS-58] Implementuoti objekto pridėjimo logiką
  - [ECS-59] Atnaujinti pasirinktų objektų skaitiklį
  - [ECS-60] Užtikrinti, kad tas pats objektas nebūtų pridėtas du kartus

### [ECS-56] Pasirinktų objektų sąrašo peržiūra

- **Prioritetas:** Highest
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu matyti visų pasirinktų objektų sąrašą prieš generuojant maršrutą, kad galėčiau peržiūrėti savo kelionės planą ir įsitikinti, jog pasirinkau tinkamas vietas.
  _Priėmimo kriterijai:_
  - Vartotojas mato pasirinktų objektų sąrašą atskiroje srityje arba lange.
  - Prie kiekvieno objekto rodomas bent pavadinimas.
  - Vartotojas gali keisti objektų tvarką sąraše naudojant drag-and-drop funkciją. Pagal nutylėjimą, rikiuojama pagal pridėjimo laiką (pirmiau pridėtas viršuje).
  - Rodomas bendras pasirinktų objektų kiekis.
  - Jei sąrašas tuščias, rodomas aiškus pranešimas, kad objektų dar nepasirinkta.
  - Sąrašas atsinaujina iš karto po objekto pridėjimo arba pašalinimo.
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-37
  - _Priklauso nuo (Blocked by):_ ECS-12
  - _Susiję su (Relates):_ ECS-65, ECS-11, ECS-66, ECS-68, ECS-67
- **Sub-užduotys:**
  - [ECS-61] Sukurti pasirinktų objektų sąrašo UI
  - [ECS-62] Gauti ir atvaizduoti pasirinktus objektus
  - [ECS-63] Įgyvendinti tuščio sąrašo pranešimą
  - [ECS-64] Atnaujinti sąrašą po pridėjimo ar pašalinimo
  - [ECS-84] Integruoti drag-and-drop biblioteką objektų eiliškumo keitimui

### [ECS-65] Objekto šalinimas iš maršruto

- **Prioritetas:** Highest
- **Aprašymas:** Kaip vartotojas, noriu pašalinti objektą iš pasirinkto maršruto sąrašo, kad galėčiau koreguoti planuojamų aplankyti vietų rinkinį prieš sudarant galutinį maršrutą.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-56, ECS-37, ECS-12, ECS-66, ECS-68, ECS-67

### [ECS-66] Pasirinktų objektų išsaugojimas sesijos metu

- **Prioritetas:** Medium
- **Aprašymas:** Sistema turi išsaugoti vartotojo pasirinktus objektus sesijos metu, kad vartotojas neprarastų pasirinkimų atnaujinęs puslapį arba pereidamas tarp sistemos langų.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-37, ECS-56, ECS-65

### [ECS-68] Pasirinkimų sąrašo atnaujinimas be puslapio perkrovimo

- **Prioritetas:** Medium
- **Aprašymas:** Sistema turi atnaujinti pasirinktų objektų sąrašą ir jų skaičių be puslapio perkrovimo, kad vartotojo veiksmai būtų matomi iš karto ir sąsaja išliktų sklandi.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-37, ECS-56, ECS-65

---

# 5. Epic: [ECS-19] Maršruto sudarymas

### [ECS-12] Sistema turi sudaryti maršrutą pagal pasirinktus objektus ir transporto priemonę

- **Prioritetas:** Medium
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-37, ECS-13
  - _Priklauso nuo (Blocked by):_ ECS-37
  - _Susiję su (Relates):_ ECS-33, ECS-21, ECS-13, ECS-56, ECS-65, ECS-67, ECS-22

### [ECS-13] Vartotojas gali pasirinkti transporto tipą

- **Prioritetas:** High
- **Aprašymas ir priėmimo kriterijai:**
  Kaip vartotojas, noriu UI sąsajoje pasirinkti transporto priemonę, kad maršrutas būtų pritaikytas mano keliavimo būdui.
  _Priėmimo kriterijai:_
  - Vartotojas gali pasirinkti vieną transporto tipą iš pateiktų variantų UI sąsajoje
  - Pasirinktas transporto tipas yra išsaugomas sesijos metu
  - Jei transporto tipas nepasirinktas, maršruto generavimas nėra leidžiamas ir vartotojui rodomas pranešimas, kad reikia pasirinkti transporto tipą
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-12
  - _Priklauso nuo (Blocked by):_ ECS-12
  - _Susiję su (Relates):_ ECS-67
- **Sub-užduotys:**
  - [ECS-69] Transporto priemonės tipo lauko UI
  - [ECS-74] Transporto tipo išsaugojimas
  - [ECS-75] Maršruto skaičiavimo algoritmo atnaujinimas, kad skaičiuotų pagal tai, kokia transporto priemonė pasirinkta
  - [ECS-76] Transporto priemonės tipo laukas duombazėje

### [ECS-21] Sistema turi apskaičiuoti maršruto trukmę.

- **Prioritetas:** Medium
- **Aprašymas ir priėmimo kriterijai:**
  Sistema turi apskaičiuoti kelionės trukmę tarp pasirinktų objektų, atsižvelgiant į atstumą ir pasirinktą transporto tipą.
  _Priėmimo kriterijai:_
  - Sistema apskaičiuoja bendrą maršruto trukmę naudodama API
  - Trukmė pateikiama vartotojui suprantamu formatu (pvz., valandos ir minutės)
  - Skaičiavimas naudoja pasirinktą transporto tipą
  - Pasikeitus objektams arba transportui, trukmė atnaujinama
  - Jei nepavyks gauti duomenų iš API, vartotojui rodomas klaidos pranešimas
- **Ryšiai:**
  - _Priklauso nuo (Blocked by):_ ECS-22
  - _Susiję su (Relates):_ ECS-12
- **Sub-užduotys:**
  - [ECS-80] Maršruto trukmės saugojimas duombazėje
  - [ECS-82] Maršruto trukmės parodymas UI
  - [ECS-83] Maršruto apskaičiavimo API integracija

### [ECS-22] Sistema turi vizualiai parodyti sugeneruotą maršrutą žemėlapyje.

- **Prioritetas:** Medium
- **Ryšiai:**
  - _Blokuoja (Blocks):_ ECS-21
  - _Susiję su (Relates):_ ECS-14, ECS-12

### [ECS-33] Kaip vartotojas, aš noriu išsaugoti sudarytą maršrutą

- **Prioritetas:** Medium
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-12

### [ECS-67] Maršruto generavimo sąlygų validavimas

- **Prioritetas:** Medium
- **Aprašymas:** Sistema turi patikrinti, ar prieš maršruto generavimą vartotojas yra pasirinkęs pakankamą objektų skaičių ir nurodęs būtinus parametrus, kad maršrutas būtų sudarytas korektiškai.
- **Ryšiai:**
  - _Susiję su (Relates):_ ECS-13, ECS-37, ECS-12, ECS-56, ECS-65

---

# 6. Kiti / Sisteminiai reikalavimai (Nepriskirti konkrečiam Epic)

### [ECS-23] Sistema turi palaikyti bent 100 vienu metu aktyvių vartotojų neprarandant funkcionalumo.

- **Prioritetas:** Medium
