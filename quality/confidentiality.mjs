// Konfidencialumas: ar išsaugotą maršrutą gali matyti tik jį sukūręs įrenginys.
// Maršrutus saugo tik deviceId (atsitiktinis ID naršyklės localStorage).
// Naudojami tik testiniai deviceId, sukurtas maršrutas pabaigoje ištrinamas.
const API = "http://localhost:3001";
const JSON_HEADERS = { "Content-Type": "application/json" };

const OWNER = `qa-savininkas-${Date.now()}`;
const STRANGER = `qa-svetimas-${Date.now()}`;

// Paruošimas: savininkas išsisaugo maršrutą.
const places = await (await fetch(`${API}/api/places?limit=2`)).json();
const created = await (
  await fetch(`${API}/api/saved-routes`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      deviceId: OWNER,
      name: "QA konfidencialumo testas",
      placeIds: places.items.map((place) => place.id),
      transportType: "car",
    }),
  })
).json();
const routeId = created.item.id;

// Bandymas pasiekti savininko maršrutą su nurodytu deviceId.
// "užblokuota" reiškia, kad svetimas asmuo maršruto duomenų negavo.
async function tryToRead(deviceId) {
  const byId = await fetch(
    `${API}/api/saved-routes/${routeId}?deviceId=${deviceId}`,
  );
  const list = await (
    await fetch(`${API}/api/saved-routes?deviceId=${deviceId}`)
  ).json();
  const listHasRoute = list.items.some((route) => route.id === routeId);

  return [
    {
      bandymas: "Gauti maršrutą pagal ID",
      statusas: byId.status,
      užblokuota: byId.status !== 200,
    },
    {
      bandymas: "Rasti maršrutą įrenginio sąraše",
      statusas: 200,
      užblokuota: !listHasRoute,
    },
  ];
}

function report(title, rows) {
  const blocked = rows.filter((row) => row.užblokuota).length;
  console.log(
    `${title}: užblokuota ${blocked}/${rows.length} (${Math.round((blocked / rows.length) * 100)} %)`,
  );
  console.table(rows);
}

console.log("1 metrika. Neautorizuotos prieigos blokavimas (riba: 100 %)");
// 1 atvejis: svetimas įrenginys žino tik maršruto ID.
report("Svetimas deviceId", await tryToRead(STRANGER));
// 2 atvejis: svetimas asmuo sužinojo savininko deviceId (pvz., iš URL ar serverio logų).
report("Nutekėjęs savininko deviceId", await tryToRead(OWNER));

// Sutvarkom: ištrinam testinį maršrutą.
await fetch(`${API}/api/saved-routes/${routeId}?deviceId=${OWNER}`, {
  method: "DELETE",
});
console.log(
  `Testinis maršrutas ištrintas. Testinis deviceId logams patikrinti: ${OWNER}`,
);
