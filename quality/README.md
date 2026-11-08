# 3 LD: produkto kokybės matavimai

8 sub-charakteristikos pagal ISO/IEC 25010:2023. Kiekviena turi 2 metrikas,
kiekviena metrika 2 testinius atvejus. Testiniai atvejai įrašyti failo viršuje.
Norint išbandyti kitą reikšmę (pvz., 100 → 1100 naudotojų), keičiam ją faile
ir paleidžiam iš naujo.

Abu atvejus per vieną paleidimą išmatuoja visi scenarijai, išskyrus tris. Juose
viršuje yra viena reikšmė, kurią pakeitus matuojamas antras atvejis:
`lcp.mjs` (tinklo greitis), `zap.mjs` (tikrinamas adresas) ir
`fault-tolerance/ors-fault.mjs` (ORS gedimo tipas).

## Paruošimas

Reikia Docker (k6 ir ZAP) ir Chrome (Lighthouse).
Komandos parašytos `sh` sintakse, todėl Windows'e leisti per Git Bash arba WSL.

Du terminalai:

```sh
pnpm quality:api   # API be ORS ir Mistral raktų, kad testai nedegintų išorinių API kvotų
pnpm quality:web   # web build versija http://localhost:4173 (/api nukreipiamas į API)
```

DB yra tikra (Supabase). Testai, kurie rašo į DB, naudoja tik testinius `deviceId`
(`qa-...`) ir savo įrašus pabaigoje ištrina.

## Matavimai

Viena komanda skirta vienam įrankiui. Jei abi metrikas matuoja tas pats įrankis, komanda viena;
jei skirtingi (pvz., k6 ir Lighthouse), komandos dvi. `quality:api:ors-fault` nieko nematuoja,
jis tik paleidžia API su ORS gedimo simuliacija vietoj `quality:api`.

| #   | Sub-charakteristika     | Metrika                            | Testiniai atvejai                    | Riba                  | Komanda                        |
| --- | ----------------------- | ---------------------------------- | ------------------------------------ | --------------------- | ------------------------------ |
| 1   | Elgsena laike           | API atsako laikas p95              | 10 ir 100 naudotojų                  | < 500 ms              | `pnpm quality:time`            |
|     |                         | Puslapio LCP                       | lėtas 4G ir lėtas 3G                 | ≤ 2,5 s               | `pnpm quality:lcp`             |
| 2   | Talpa                   | Užklausos per sekundę              | 10 ir 50 naudotojų                   | lyginam               | `pnpm quality:capacity`        |
|     |                         | Nesėkmingų užklausų dalis          | 10 ir 50 naudotojų                   | < 1 %                 | `pnpm quality:capacity`        |
| 3   | Konfidencialumas        | Neautorizuotos prieigos blokavimas | svetimas ir nutekėjęs `deviceId`     | 100 %                 | `pnpm quality:confidentiality` |
|     |                         | Saugumo įspėjimai (ZAP baseline)   | API ir web                           | 0                     | `pnpm quality:zap`             |
| 4   | Vientisumas             | SQL injekcijų atmetimas            | `query` ir `region` parametrai       | 100 %                 | `pnpm quality:integrity`       |
|     |                         | Netinkamų duomenų atmetimas        | kūrimas (POST) ir keitimas (PATCH)   | 100 %                 | `pnpm quality:integrity`       |
| 5   | Atsparumas (resistance) | Apribotų užklausų dalis (429)      | 100 ir 1000 užklausų vienu metu      | > 0 %                 | `pnpm quality:resistance`      |
|     |                         | Per didelės užklausos              | `limit=24` ir `limit=100000`         | per didelis atmetamas | `pnpm quality:resistance`      |
| 6   | Atsparumas klaidoms     | Sėkmingai sudaryti maršrutai       | ORS grąžina 503 ir ORS nepasiekiamas | 100 %                 | `pnpm quality:fault-tolerance` |
|     |                         | Atsako laikas                      | ORS vėluoja 5 s ir 30 s              | < 3 s                 | `pnpm quality:fault-tolerance` |
| 7   | User assistance         | axe pažeidimai (WCAG)              | paieškos ir maršruto vaizdai         | 0 critical / serious  | `pnpm quality:user-assistance` |
|     |                         | Užduotis tik klaviatūra            | pridėti objektą ir sudaryti maršrutą | abi atliekamos        | `pnpm quality:user-assistance` |
| 8   | Inclusivity             | Išversti UI tekstai                | EN ir DE                             | 100 %                 | `pnpm quality:inclusivity`     |
|     |                         | Išverstas turinys                  | EN ir DE                             | 100 %                 | `pnpm quality:inclusivity`     |

Ataskaitos (Lighthouse, ZAP) išsaugomos `quality/results/`.

## Pastabos

**Talpa.** Po `quality:capacity` API kelias minutes apdoroja susikaupusią užklausų eilę.
Prieš kartojant bet kurį apkrovos testą patikrink, ar paieška vėl atsako greitai:

```sh
curl -o /dev/null -w "%{http_code} %{time_total}s\n" "http://localhost:3001/api/places?query=pilis"
```

k6 rodomas „/s“ skaičiuojamas pagal viso testo trukmę, todėl užklausos per sekundę
vienam atvejui = `count / 30`.

**Atsparumas klaidoms.** Vietoj `quality:api` paleidžiam API su ORS gedimo simuliacija
(programos kodas nekeičiamas), tada matuojam:

```sh
pnpm quality:api:ors-fault     # gedimo tipas: FAULT ir DELAY_MS faile fault-tolerance/ors-fault.mjs
pnpm quality:fault-tolerance
```

**Konfidencialumas.** `deviceId` perduodamas URL'e, todėl patenka į serverio logus.
`quality:confidentiality` pabaigoje išveda testinį `deviceId`, jį galima rasti API terminalo išvestyje.
ZAP prieš web tikrina `vite preview` serverį, o produkcinio serverio antraštės priklausytų nuo hostingo.

**User assistance.** Scenarijus UI perjungia į anglų kalbą ir mygtukus randa pagal jų tekstą ("Add", "Route").

**Lighthouse** naudoja kompiuteryje įdiegtą Chrome. Jei jo nėra, galima nurodyti
puppeteer atsisiųstą: `CHROME_PATH=$(node -e 'import("puppeteer").then(async p=>console.log(await p.default.executablePath()))') pnpm quality:lcp`.

## Įrankiai

- k6: https://k6.io (apkrovos testai, per Docker `grafana/k6`)
- Lighthouse: https://developer.chrome.com/docs/lighthouse (LCP)
- OWASP ZAP: https://www.zaproxy.org (saugumo skenavimas, per Docker)
- axe-core: https://github.com/dequelabs/axe-core (WCAG patikra per puppeteer)
- Puppeteer: https://pptr.dev (naršyklės valdymas klaviatūros testui)

## Šaltiniai ribomis

- LCP ≤ 2,5 s, Google Core Web Vitals: https://web.dev/articles/lcp
- WCAG 2.1: https://www.w3.org/TR/WCAG21/
- SQL injekcijos ir prieigos kontrolė, OWASP Top 10: https://owasp.org/Top10/
- Užklausų ribojimas, OWASP API Security Top 10 (API4:2023 Unrestricted Resource Consumption):
  https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/
