Iš 1-ojo LD ataskaitos:

# Projekto „Pathy“ apžvalga

## Projekto apžvalga

Dalykinė sritis: Turizmas ir laisvalaikis Lietuvoje.

Kuriama informacinė sistema, skirta vartotojams, kurie nori:

- atrasti lankytinus objektus Lietuvoje;
- Gauti pasiūlymus apie panašius objektus, remiantis pateiktu aprašymu arba nuotrauka;
- Suplanuoti kelionės maršrutą tarp kelių pasirinktų vietų.

Sistema orientuota į individualius keliautojus ir vietinį turizmą.

---

## Sistemos funkcionalumas ir architektūra

### Kokias funkcijas atliks informacinė sistema?

Sistemos naudotojas galės:

- Pagal nuotrauką arba įkeltą aprašą ieškoti panašių objektų.
- Pasirinkti lankytinus objektus iš populiariausių vietų sąrašo.
- Peržiūrėti objektų aprašymus, vietas bei kategorijas.
- Pasirinkti atstumo spindulį nuo savo esamos lokacijos.
- Pasirinkti maršruto trukmę (pagal atstumą arba laiką).

Sistema automatiškai:

- Nustato objektų kategorijas (pvz., pilys, muziejai, gamtos objektai).
- Suranda kitus tos pačios kategorijos objektus.
- Pasiūlo vartotojui panašius lankytinus objektus.
- Sudaro optimalų kelionės maršrutą tarp pasirinktų taškų.

### Kokių funkcijų neatliks informacinė sistema?

- Viešbučių, bilietų ar ekskursijų rezervacijos.
- Mokėjimų ar atsiskaitymo apdorojimo.
- Realaus laiko viešojo transporto stebėjimo.
- Socialinių funkcijų (komentarų, reitingų, vartotojo paskyrų).
- Personalizuotų rekomendacijų pagal vartotojo elgsenos istoriją.

### Kitų sistemų ir API integracija

Sistema integruosis su šiomis išorinėmis paslaugomis:

1.  Žemėlapių ir maršrutų API (OpenRouteService, OpenStreetMap):
    - Atstumų skaičiavimui.
    - Maršrutų sudarymui (automobiliu, pėsčiomis, dviračiu).
    - Objektų atvaizdavimui žemėlapyje.
2.  Atviri duomenų šaltiniai (Wikidata, Kultūros vertybių registras):
    - Lankytinų objektų adresų gavimui.
    - Vietovės informacijos pateikimui.
3.  Web scraping:
    - Lankytinų objektų aprašymams.
    - Kategorijų nustatymui.
    - Papildomai informacijai iš viešų turizmo svetainių.

---

## Rinkos analizė ir technologiniai sprendimai

### Esamos sistemos rinkoje

Rinkoje egzistuoja sistemos, teikiančios tik dalį reikalingo funkcionalumo:

- Bendros paskirties žemėlapiai: Leidžia sudaryti maršrutus, bet nesiūlo specifinių turistinių rekomendacijų (pvz., „Google Maps“, „Apple Maps“).
- Turizmo portalai: Pateikia sąrašus, bet trūksta automatinio panašumo filtravimo.
- Kelionių programėlės: Dažniausiai orientuotos į tarptautinį turizmą, o ne į detalias Lietuvos vietoves.

Sistemos išskirtinumas:

- Griežta orientacija į Lietuvos lankytinus objektus.
- Automatinis panašių objektų siūlymas pagal kategorijas.
- Greitas maršruto generavimas su pasirinktais objektais.

### Duomenų šaltiniai

- Vidiniai duomenys: DB su pavadinimais, kategorijomis, regionais, koordinatėmis ir aprašymais.
- Išoriniai duomenys: web scraping (turizmo portalai, savivaldybių svetainės) ir API paslaugos.

DI integracija: Leidžia identifikuoti objektą iš vartotojo įkeltos nuotraukos.

### Panašių sistemų palyginimas

| Sistemos pavadinimas | Sistemos aprašymas                                     | Gerosios patirtys                                    | Blogosios patirtys                                                         |
| :------------------- | :----------------------------------------------------- | :--------------------------------------------------- | :------------------------------------------------------------------------- |
| Google Maps          | Navigacijos sistema, skirta rasti vietas ir maršrutus. | Tikslūs maršrutai, patikimi duomenys, patogi sąsaja. | Nėra automatinių rekomendacijų, nėra orientuota į turizmą.                 |
| Apple Maps           | „Apple“ ekosistemos navigacijos sprendimas.            | Sklandi integracija, aiškus vizualas, paprastumas.   | Ribota informacija apie LT objektus, trūksta filtravimo pagal kategorijas. |
| TripAdvisor          | Turizmo platforma su apžvalgomis ir reitingais.        | Daug aprašymų, naudotojų atsiliepimai.               | Maršrutų sudarymas nėra pagrindinė funkcija, reikia daug rankinio darbo.   |
| Atlas Obscura        | Platforma neįprastiems lankytiniems objektams.         | Unikalūs objektai, įdomi informacija.                | Mažai objektų Lietuvoje, nėra maršrutų planavimo.                          |

### Funkcinis palyginimas

| Sistema         | Panašių objektų siūlymas  | Maršrutų sudarymas | Orientacija į LT |
| :-------------- | :-----------------------: | :----------------: | :--------------: |
| Google Maps     |            Ne             |        Taip        |    Iš dalies     |
| Apple Maps      |            Ne             |        Taip        |    Iš dalies     |
| TripAdvisor     | Iš dalies (rankiniu būdu) |         Ne         |    Iš dalies     |
| Atlas Obscura   |            Ne             |         Ne         |        Ne        |
| Siūloma sistema | Taip (pagal kategorijas)  |        Taip        |       Taip       |

---

### Verslo poreikiai

#### Vizija 1: greitas planavimas

- Suinteresuoti asmenys: individualūs keliautojai Lietuvoje.
- Problema: kelionės planavimas užima daug laiko.
- Sprendimas: automatinis maršruto sudarymas.
- Verslo tikslas: maršruto sudarymo laikas < 10 sek.

#### Vizija 2: aktualios rekomendacijos

- Problema: savarankiška panašių objektų paieška yra sudėtinga.
- Sprendimas: automatinės rekomendacijos pagal kategoriją/atstumą.
- Verslo tikslas: ≥60% vartotojų pasinaudoja rekomendacijomis.

#### Vizija 3: prieinamumas užsieniečiams

- Problema: trūksta informacijos užsienio kalbomis.
- Sprendimas: daugiakalbė sąsaja (anglų, lenkų, latvių, vokiečių).
- Verslo tikslas: sistema turi būti išversta į bent 4 populiariausias kalbas.

---

## Išvados

Kuriama informacinė sistema „Pathy“ efektyviai išspręs individualių keliautojų problemas Lietuvoje. Automatizuotas panašių objektų siūlymas ir optimalaus maršruto generavimas išskiria šį projektą iš bendrinio pobūdžio žemėlapių programų. DI technologijų integravimas objektų atpažinimui suteiks sistemai technologinį pranašumą vietinio turizmo rinkoje.
