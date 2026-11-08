// Atsparumas klaidoms: ar marsrutas sudaromas, kai ORS neveikia, ir kiek laiko laukiama.
// API turi buti paleistas su `pnpm quality:api:ors-fault`.
const API = "http://localhost:3001";
const REQUESTS = 5;

const places = await (await fetch(`${API}/api/places?limit=2`)).json();
const placeIds = places.items.map((place) => place.id);

const rows = [];
for (let i = 1; i <= REQUESTS; i++) {
  const start = performance.now();
  const res = await fetch(`${API}/api/route-preview`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placeIds, transportType: "car" }),
  });
  const body = await res.json();

  rows.push({
    uzklausa: i,
    statusas: res.status,
    "marsrutas gautas": res.status === 200 && body.totals.distanceKm > 0,
    "atstumas km": body.totals?.distanceKm,
    "laikas ms": Math.round(performance.now() - start),
  });
}

const succeeded = rows.filter((row) => row["marsrutas gautas"]).length;
const avgMs = Math.round(
  rows.reduce((sum, row) => sum + row["laikas ms"], 0) / rows.length,
);

console.table(rows);
console.log(
  `1 metrika. Sekmingai sudaryti marsrutai: ${succeeded}/${rows.length} (riba: 100 %)`,
);
console.log(
  `2 metrika. Vidutinis atsako laikas: ${avgMs} ms (riba: < 3000 ms)`,
);
