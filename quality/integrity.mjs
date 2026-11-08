// Vientisumas: ar API apsaugo duomenis nuo SQL injekcijų ir netinkamų duomenų.
// Naudojamas tik testinis deviceId, visi sukurti maršrutai pabaigoje ištrinami.
const API = "http://localhost:3001";
const JSON_HEADERS = { "Content-Type": "application/json" };
const DEVICE = `qa-vientisumas-${Date.now()}`;

// ── 1 metrika. SQL injekcijų atmetimas ──────────────────────────────────────
// Klasikiniai SQL injekcijų pavyzdžiai (OWASP). Injekcija laikoma suveikusia,
// jei API grąžina 500 klaidą arba visus DB objektus.
const PAYLOADS = [
  "' OR '1'='1",
  "' OR 1=1 --",
  "'; DROP TABLE places; --",
  "' UNION SELECT null, null --",
  "\\",
];

const all = await (await fetch(`${API}/api/places?limit=1`)).json();
const allCount = all.total;

async function injectInto(param) {
  const rows = [];
  for (const payload of PAYLOADS) {
    const res = await fetch(
      `${API}/api/places?${param}=${encodeURIComponent(payload)}`,
    );
    const body = await res.json();
    const worked = res.status >= 500 || body.total === allCount;
    rows.push({
      parametras: param,
      payload,
      statusas: res.status,
      rasta: body.total,
      atmesta: !worked,
    });
  }
  return rows;
}

function report(title, rows, okField) {
  const ok = rows.filter((row) => row[okField]).length;
  console.log(
    `${title}: ${ok}/${rows.length} (${Math.round((ok / rows.length) * 100)} %)`,
  );
  console.table(rows);
}

console.log("1 metrika. SQL injekcijų atmetimas (riba: 100 %)");
report("Paieškos laukas (query)", await injectInto("query"), "atmesta");
report("Regiono filtras (region)", await injectInto("region"), "atmesta");

// ── 2 metrika. Netinkamų duomenų atmetimas ─────────────────────────────────
// Kiekvienas atvejis yra netinkamas, todėl API turėtų grąžinti 4xx klaidą.
const places = await (await fetch(`${API}/api/places?limit=2`)).json();
const [placeA, placeB] = places.items.map((place) => place.id);

function create(body) {
  return fetch(`${API}/api/saved-routes`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ deviceId: DEVICE, transportType: "car", ...body }),
  });
}

const createCases = [
  ["Neegzistuojantys objektai", { name: "QA", placeIds: ["nera-1", "nera-2"] }],
  ["Objektų ID ne tekstas", { name: "QA", placeIds: [1, 2] }],
  ["Tas pats objektas du kartus", { name: "QA", placeIds: [placeA, placeA] }],
  [
    "10 000 simbolių pavadinimas",
    { name: "x".repeat(10000), placeIds: [placeA, placeB] },
  ],
];

const createRows = [];
for (const [title, body] of createCases) {
  const res = await create(body);
  createRows.push({
    atvejis: title,
    statusas: res.status,
    atmesta: res.status >= 400,
  });
}

// Atnaujinimui pirmiausia susikuriam vieną tinkamą maršrutą.
const valid = await (
  await create({ name: "QA", placeIds: [placeA, placeB] })
).json();
const routeId = valid.item.id;

const updateCases = [
  ["Tuščias objektų sąrašas", { placeIds: [] }],
  ["Tik vienas objektas", { placeIds: [placeA] }],
  ["Objektai ne sąrašas", { placeIds: "tekstas" }],
  ["Tuščias pavadinimas", { name: "   " }],
];

const updateRows = [];
for (const [title, body] of updateCases) {
  const res = await fetch(`${API}/api/saved-routes/${routeId}`, {
    method: "PATCH",
    headers: JSON_HEADERS,
    body: JSON.stringify({ deviceId: DEVICE, ...body }),
  });
  updateRows.push({
    atvejis: title,
    statusas: res.status,
    atmesta: res.status >= 400,
  });
}

console.log("2 metrika. Netinkamų duomenų atmetimas (riba: 100 %)");
report("Maršruto kūrimas (POST)", createRows, "atmesta");
report("Maršruto keitimas (PATCH)", updateRows, "atmesta");

// Sutvarkom: ištrinam visus šio testo maršrutus.
const saved = await (
  await fetch(`${API}/api/saved-routes?deviceId=${DEVICE}`)
).json();
for (const route of saved.items) {
  await fetch(`${API}/api/saved-routes/${route.id}?deviceId=${DEVICE}`, {
    method: "DELETE",
  });
}
console.log(`Ištrinta testinių maršrutų: ${saved.items.length}`);
