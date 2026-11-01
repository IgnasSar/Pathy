# 2 LD

Kiekvienas studentas tiria du metodus. Kiekvienam metodui yra du rinkiniai:

- `*.baseline.test.ts` – pradinis 5 dalies rinkinys;
- `*.llm.test.ts` – 8 dalies DKM rinkinys pagal [trumpus promptus](./prompts.md).

Palyginame jų vykdymo rezultatus, padengiamumą ir testų kodo kokybę.
Integracinis testas bendras – `integration/routePreview.int.test.ts`.

## Testai

Iš projekto šakninio aplanko:

```sh
pnpm test
pnpm typecheck:tests
pnpm test:baseline
pnpm test:llm
```

Atskiros HTML ataskaitos: `coverage/baseline/index.html` ir `coverage/llm/index.html`.
Kiekviename kataloge yra ir `lcov.info` SonarQube importui.
`pnpm test:coverage` paleidžia abu rinkinius iš eilės, jų rezultatų nesujungia.
Ataskaita apima testuojamus API failus ir `web/src/utils/geo.ts`, ne visą projektą.
Tai įrankio sakinių, šakų, funkcijų ir eilučių rodikliai, be savų perskaičiavimų.

Vienas studentas arba vienas metodas:

```sh
pnpm test tests/unit/laurynas
pnpm exec vitest run tests/unit/ignas/listPlaces.llm.test.ts --coverage --coverage.reportsDirectory=coverage/metodas
```

DB ir tinklo prieigos pakeistos mock'ais – tikros paslaugos nereikalingos.

## Metrikos

```sh
pnpm metrics:complexity
pnpm metrics:mi
pnpm metrics:coupling
```

- **Sudėtingumas:** ESLint `complexity` (CC) ir SonarJS `cognitive-complexity` (COG).
  Išvestyje metodą atpažinsi pagal vardą arba failą ir eilutę (anoniminiams handleriams).
  COG 0 taisyklė nepraneša. Įspėjimai čia naudojami reikšmėms parodyti.
- **MI:** `typhonjs-escomplex` pateiktos failų reikšmės ir modulių vidurkis (skalė iki 171).
- **Sujungimas:** `dependency-cruiser` lentelė: Ca – kas priklauso nuo modulio,
  Ce – nuo ko priklauso modulis, I – nestabilumas. Įtraukti ir TypeScript tipų importai.

Ekrano vaizdus darykite iš komandų išvesties ir HTML padengiamumo ataskaitos.
