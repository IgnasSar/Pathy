# Užklausos testams (8 dalis)

Bendros taisyklės: naudok Vitest, aiškius lietuviškus testų pavadinimus ir paprastus
`it` / `expect`. Nesijunk prie tikros DB ar išorinių API – pakeisk jas mock'ais.
Nekeisk programos kodo. Išvestis – vienas `*.llm.test.ts` failas pasirinktam metodui,
be papildomų paaiškinimų.

## Laurynas

- Parašyk `getPlacesQueryError` (`packages/api/src/app.ts`) testus. Patikrink galiojančius
  filtrus, netinkamą kategoriją, koordinates, spindulį, limit ir offset ribas bei klaidų prioritetą.
- Parašyk `isRoutePreviewRequest` (tas pats failas) testus. Patikrink teisingą struktūrą,
  trūkstamus laukus, netinkamus tipus ir neprivalomą origin.

## Airidas

- Parašyk `POST /api/saved-routes` handlerio (`packages/api/src/app.ts`) testus per
  `buildApp().inject()`. Patikrink sukūrimą, tarpų apkarpymą, privalomus laukus, transportą,
  tuščią pavadinimą ir bent dviejų vietų reikalavimą.
- Parašyk `optimizePlacesOrder` (`packages/web/src/utils/geo.ts`) testus. Patikrink trumpus
  sąrašus, artimiausios vietos parinkimą, fiksuotą pradžią, lygius atstumus ir įvesties nekeičiamumą.

## Džiugas

- Parašyk `POST /api/recognize` handlerio (`packages/api/src/app.ts`) testus per
  `buildApp().inject()`. Patikrink atpažinimą, filtrus, neatpažintą potipį, netinkamą
  nuotraukos formatą, koordinates, spindulį ir per didelę nuotrauką.
- Parašyk `recognizeImage` (`packages/api/src/lib/mistral.ts`) testus. Patikrink API raktą,
  tuščią potipių sąrašą, base64 ir data URL, API klaidą bei JSON atsakymo apdorojimą.

## Ignas

- Parašyk `listPlaces` (`packages/api/src/db/placesRepository.ts`) testus. Patikrink numatytus
  parametrus, paieškos ir kitų filtrų SQL parametrus, spindulį, puslapiavimą ir grąžinamų duomenų formatą.
- Parašyk `updateSavedRoute` (`packages/api/src/db/savedRoutesRepository.ts`) testus.
  Patikrink atskirų ir visų laukų atnaujinimą, parametrų eilę, užklausą be pakeitimų ir nerastą maršrutą.
