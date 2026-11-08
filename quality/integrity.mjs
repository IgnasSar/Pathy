// Vientisumas: ar API apsaugo duomenis nuo SQL injekciju ir netinkamu duomenu.
// Naudojamas tik testinis deviceId, visi sukurti marsrutai pabaigoje istrinami.
const API = "http://localhost:3001";
const JSON_HEADERS = { "Content-Type": "application/json" };
const DEVICE = `qa-vientisumas-${Date.now()}`;

// Klasikiniai SQL injekciju pavyzdziai (OWASP).
const PAYLOADS = [
  "' OR '1'='1",
  "' OR 1=1 --",
  "'; DROP TABLE places; --",
  "' UNION SELECT null, null --",
  "\\",
];

const all = await (await fetch(`${API}/api/places?limit=1`)).json();
const allCount = all.total;

// Injekcija suveike, jei API grazina 500 klaida arba visus DB objektus.
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

function report(title, rows) {
  const ok = rows.filter((row) => row.atmesta).length;
  console.log(
    `${title}: ${ok}/${rows.length} (${Math.round((ok / rows.length) * 100)} %)`,
  );
  console.table(rows);
}

console.log("1 metrika. SQL injekciju atmetimas (riba: 100 %)");
report("Paieskos laukas (query)", await injectInto("query"));
report("Regiono filtras (region)", await injectInto("region"));

// Visi atvejai netinkami, todel API turetu grazinti 4xx.
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
  ["Objektu ID ne tekstas", { name: "QA", placeIds: [1, 2] }],
  ["Tas pats objektas du kartus", { name: "QA", placeIds: [placeA, placeA] }],
  [
    "10 000 simboliu pavadinimas",
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

const valid = await (
  await create({ name: "QA", placeIds: [placeA, placeB] })
).json();
const routeId = valid.item.id;

const updateCases = [
  ["Tuscias objektu sarasas", { placeIds: [] }],
  ["Tik vienas objektas", { placeIds: [placeA] }],
  ["Objektai ne sarasas", { placeIds: "tekstas" }],
  ["Tuscias pavadinimas", { name: "   " }],
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

console.log("2 metrika. Netinkamu duomenu atmetimas (riba: 100 %)");
report("Marsruto kurimas (POST)", createRows);
report("Marsruto keitimas (PATCH)", updateRows);

const saved = await (
  await fetch(`${API}/api/saved-routes?deviceId=${DEVICE}`)
).json();
for (const route of saved.items) {
  await fetch(`${API}/api/saved-routes/${route.id}?deviceId=${DEVICE}`, {
    method: "DELETE",
  });
}
console.log(`Istrinta testiniu marsrutu: ${saved.items.length}`);
