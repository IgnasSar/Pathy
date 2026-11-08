// Inclusivity (ISO 25010:2023): ar sistema tinkama įvairių kalbų naudotojams.
// Verslo tikslas: sistema išversta bent į 4 populiariausias kalbas.
// 1 metrika: kiek sąsajos (UI) tekstų išversta į EN ir DE.
// 2 metrika: kiek turinio (objektų pavadinimų ir aprašymų) išversta į EN ir DE.
import { translations } from "../packages/web/src/i18n/translations.ts";

const API = "http://localhost:3001";
const LANGUAGES = ["EN", "DE"];

// ── 1 metrika. UI vertimai ─────────────────────────────────────────────────
// Tekstas laikomas išverstu, jei jis yra ir skiriasi nuo lietuviško.
// Kai kurie trumpiniai teisėtai sutampa (pvz., "h" valandai angliškai),
// todėl sąrašą "neišversti" peržiūrim rankiniu būdu.
console.log("1 metrika. Išversti sąsajos tekstai (riba: 100 %)");

const keys = Object.keys(translations);
const uiRows = LANGUAGES.map((language) => {
  const notTranslated = keys.filter((key) => {
    const text = translations[key][language];
    return !text || text === translations[key].LT;
  });

  return {
    kalba: language,
    "tekstų iš viso": keys.length,
    išversta: keys.length - notTranslated.length,
    "išversta %": (
      ((keys.length - notTranslated.length) / keys.length) *
      100
    ).toFixed(1),
    "neišversti (sutampa su LT)": notTranslated.join(", "),
  };
});
console.table(uiRows);

// ── 2 metrika. Turinio vertimai ────────────────────────────────────────────
// Prašom tų pačių objektų lietuviškai ir kita kalba (Accept-Language antraštė)
// ir lyginam pavadinimus bei aprašymus.
console.log("2 metrika. Išverstas turinys (riba: 100 %)");

async function getPlaces(language) {
  const res = await fetch(`${API}/api/places?limit=20`, {
    headers: { "Accept-Language": language.toLowerCase() },
  });
  return (await res.json()).items;
}

const ltPlaces = await getPlaces("LT");
const contentRows = [];
for (const language of LANGUAGES) {
  const places = await getPlaces(language);
  let fields = 0;
  let translated = 0;

  places.forEach((place, i) => {
    for (const field of ["name", "shortDescription"]) {
      fields++;
      if (place[field] !== ltPlaces[i][field]) translated++;
    }
  });

  contentRows.push({
    kalba: language,
    "laukų patikrinta": fields,
    išversta: translated,
    "išversta %": ((translated / fields) * 100).toFixed(1),
    pavyzdys: places[0].shortDescription.slice(0, 50),
  });
}
console.table(contentRows);
