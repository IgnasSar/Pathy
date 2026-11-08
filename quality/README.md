# 3 LD – produkto kokybės matavimai

8 sub-charakteristikos pagal ISO/IEC 25010:2023. Kiekviena turi 2 metrikas,
kiekviena metrika – 2 testinius atvejus. Atvejai įrašyti pačiuose failuose:
norint pakeisti (pvz., 100 → 1100 naudotojų), keičiam skaičių faile ir paleidžiam iš naujo.

## Paruošimas

Reikia Docker (k6 ir ZAP) ir Chrome (Lighthouse).
Komandos parašytos `sh` sintakse – Windows'e leisti per Git Bash arba WSL.

Du terminalai:

```sh
pnpm q:api   # API be ORS ir Mistral raktų – testai nedegina išorinių API kvotų
pnpm q:web   # web build versija http://localhost:4173 (/api nukreipiamas į API)
```

DB yra tikra (Supabase). Testai, kurie rašo į DB, naudoja tik testinius `deviceId`
(`qa-...`) ir savo įrašus pabaigoje ištrina.

## Matavimai

| #   | Sub-charakteristika     | Metrika                            | Testiniai atvejai                    | Riba                  | Komanda                            |
| --- | ----------------------- | ---------------------------------- | ------------------------------------ | --------------------- | ---------------------------------- |
| 1   | Elgsena laike           | API atsako laikas p95              | 10 ir 100 naudotojų                  | < 500 ms              | `pnpm q:time`                      |
|     |                         | Puslapio LCP                       | lėtas 4G ir lėtas 3G                 | ≤ 2,5 s               | `pnpm q:lcp:4g`, `pnpm q:lcp:3g`   |
| 2   | Talpa                   | Užklausos per sekundę              | 10 ir 50 naudotojų                   | – (lyginam)           | `pnpm q:capacity`                  |
|     |                         | Nesėkmingų užklausų dalis          | 10 ir 50 naudotojų                   | < 1 %                 | `pnpm q:capacity`                  |
| 3   | Konfidencialumas        | Neautorizuotos prieigos blokavimas | svetimas ir nutekėjęs `deviceId`     | 100 %                 | `pnpm q:confidentiality`           |
|     |                         | Saugumo įspėjimai (ZAP baseline)   | API ir web                           | 0                     | `pnpm q:zap:api`, `pnpm q:zap:web` |
| 4   | Vientisumas             | SQL injekcijų atmetimas            | `query` ir `region` parametrai       | 100 %                 | `pnpm q:integrity`                 |
|     |                         | Netinkamų duomenų atmetimas        | kūrimas (POST) ir keitimas (PATCH)   | 100 %                 | `pnpm q:integrity`                 |
| 5   | Atsparumas (resistance) | Apribotų užklausų dalis (429)      | 100 ir 1000 užklausų vienu metu      | > 0 %                 | `pnpm q:resistance`                |
|     |                         | Per didelės užklausos              | `limit=24` ir `limit=100000`         | per didelis atmetamas | `pnpm q:resistance`                |
| 6   | Atsparumas klaidoms     | Sėkmingai sudaryti maršrutai       | ORS grąžina 503 ir ORS nepasiekiamas | 100 %                 | `pnpm q:fault-tolerance`           |
|     |                         | Atsako laikas                      | ORS vėluoja 5 s ir 30 s              | < 3 s                 | `pnpm q:fault-tolerance`           |
| 7   | User assistance         | axe pažeidimai (WCAG)              | paieškos ir maršruto vaizdai         | 0 critical / serious  | `pnpm q:user-assistance`           |
|     |                         | Užduotis tik klaviatūra            | pridėti objektą ir sudaryti maršrutą | abi atliekamos        | `pnpm q:user-assistance`           |
| 8   | Inclusivity             | Išversti UI tekstai                | EN ir DE                             | 100 %                 | `pnpm q:inclusivity`               |
|     |                         | Išverstas turinys                  | EN ir DE                             | 100 %                 | `pnpm q:inclusivity`               |

Ataskaitos (Lighthouse, ZAP) išsaugomos `quality/results/`.

## Pastabos

**Talpa.** Po `q:capacity` API kelias minutes apdoroja susikaupusią užklausų eilę.
Prieš kartojant bet kurį apkrovos testą patikrink, ar paieška vėl atsako greitai:

```sh
curl -o /dev/null -w "%{http_code} %{time_total}s\n" "http://localhost:3001/api/places?query=pilis"
```

k6 rodomas „/s“ skaičiuojamas pagal viso testo trukmę, todėl užklausos per sekundę
vienam atvejui = `count / 30`.

**Atsparumas klaidoms.** API paleidžiamas su ORS gedimo simuliacija vietoj `q:api`
(failai `quality/fault-tolerance/ors-*.mjs`, programos kodas nekeičiamas), tada `pnpm q:fault-tolerance`:

```sh
pnpm q:api:ors-503       # 1 metrika, 1 atvejis
pnpm q:api:ors-offline   # 1 metrika, 2 atvejis
pnpm q:api:ors-slow      # 2 metrika: DELAY_MS faile ors-slow.mjs (5000, po to 30000)
```

**Konfidencialumas.** `deviceId` perduodamas URL'e, todėl patenka į serverio logus.
`q:confidentiality` pabaigoje išveda testinį `deviceId`, jį galima rasti API terminalo išvestyje.
ZAP prieš web tikrina `vite preview` serverį – produkcinio serverio antraštės priklausytų nuo hostingo.

**Lighthouse** naudoja kompiuteryje įdiegtą Chrome. Jei jo nėra, galima nurodyti
puppeteer atsisiųstą: `CHROME_PATH=$(node -e 'import("puppeteer").then(async p=>console.log(await p.default.executablePath()))') pnpm q:lcp:4g`.

## Įrankiai

- k6 – https://k6.io (apkrovos testai, per Docker `grafana/k6`)
- Lighthouse – https://developer.chrome.com/docs/lighthouse (LCP)
- OWASP ZAP – https://www.zaproxy.org (saugumo skenavimas, per Docker)
- axe-core – https://github.com/dequelabs/axe-core (WCAG patikra per puppeteer)
- Puppeteer – https://pptr.dev (naršyklės valdymas klaviatūros testui)

## Šaltiniai ribomis

- LCP ≤ 2,5 s – Google Core Web Vitals: https://web.dev/articles/lcp
- WCAG 2.1 – https://www.w3.org/TR/WCAG21/
- SQL injekcijos, prieigos kontrolė – OWASP Top 10: https://owasp.org/Top10/
- Užklausų ribojimas – OWASP API Security Top 10, API4:2023 Unrestricted Resource Consumption:
  https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/
