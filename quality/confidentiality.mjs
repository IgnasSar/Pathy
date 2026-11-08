// Konfidencialumas: ar issaugota marsruta gali matyti tik ji sukures irenginys.
// Naudojami tik testiniai deviceId, sukurtas marsrutas pabaigoje istrinamas.
const API = "http://localhost:3001";
const JSON_HEADERS = { "Content-Type": "application/json" };

const OWNER = `qa-savininkas-${Date.now()}`;
const STRANGER = `qa-svetimas-${Date.now()}`;

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
      bandymas: "Gauti marsruta pagal ID",
      statusas: byId.status,
      uzblokuota: byId.status !== 200,
    },
    {
      bandymas: "Rasti marsruta irenginio sarase",
      statusas: 200,
      uzblokuota: !listHasRoute,
    },
  ];
}

function report(title, rows) {
  const blocked = rows.filter((row) => row.uzblokuota).length;
  console.log(
    `${title}: uzblokuota ${blocked}/${rows.length} (${Math.round((blocked / rows.length) * 100)} %)`,
  );
  console.table(rows);
}

console.log("1 metrika. Neautorizuotos prieigos blokavimas (riba: 100 %)");
report("Svetimas deviceId", await tryToRead(STRANGER));
// Pvz., deviceId suzinotas is URL ar serverio logu.
report("Nutekejes savininko deviceId", await tryToRead(OWNER));

await fetch(`${API}/api/saved-routes/${routeId}?deviceId=${OWNER}`, {
  method: "DELETE",
});
console.log(
  `Testinis marsrutas istrintas. Testinis deviceId logams patikrinti: ${OWNER}`,
);
