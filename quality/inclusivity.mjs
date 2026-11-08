// inclusivity: kiek ui tekstu ir turinio isversta i EN ir DE
// verslo tikslas: sistema isversta bent i 4 kalbas
import { translations } from "../packages/web/src/i18n/translations.ts";

const API = "http://localhost:3001";
const LANGUAGES = ["EN", "DE"];

// tekstas isverstas, jei jis yra ir skiriasi nuo LT.
// kai kurie trumpiniai sutampa teisetai (pvz., "h" anglu kalba), juos perziurim rankiniu budu
console.log("1 metrika: isversti ui tekstai (riba: 100 %)");

const keys = Object.keys(translations);
const uiRows = LANGUAGES.map((language) => {
  const notTranslated = keys.filter((key) => {
    const text = translations[key][language];
    return !text || text === translations[key].LT;
  });

  return {
    kalba: language,
    "tekstu is viso": keys.length,
    isversta: keys.length - notTranslated.length,
    "isversta %": (
      ((keys.length - notTranslated.length) / keys.length) *
      100
    ).toFixed(1),
    "neisversti (sutampa su LT)": notTranslated.join(", "),
  };
});
console.table(uiRows);

console.log("2 metrika: isverstas turinys (riba: 100 %)");

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
    "lauku patikrinta": fields,
    isversta: translated,
    "isversta %": ((translated / fields) * 100).toFixed(1),
    pavyzdys: places[0].shortDescription.slice(0, 50),
  });
}
console.table(contentRows);
