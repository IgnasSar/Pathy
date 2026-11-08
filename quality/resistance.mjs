// Atsparumas (resistance): ar API apsisaugo nuo per didelio užklausų kiekio
// ir nuo per didelių užklausų.
const API = "http://localhost:3001";

// 1 metrika. Užklausų ribojimas (rate limiting).
// Vienu metu siunčiam N užklausų ir skaičiuojam, kiek atmesta su 429 Too Many Requests.
// /health nenaudoja DB, todėl testas neapkrauna duomenų bazės.
async function burst(count) {
  const responses = await Promise.all(
    Array.from({ length: count }, () => fetch(`${API}/health`)),
  );
  const limited = responses.filter((res) => res.status === 429).length;

  return {
    "užklausų vienu metu": count,
    "atmesta su 429": limited,
    "apribota %": ((limited / count) * 100).toFixed(1),
  };
}

console.log(
  "1 metrika. Užklausų ribojimas (riba: dalis užklausų turi būti apribota)",
);
console.table([await burst(100), await burst(1000)]);

// 2 metrika. Per didelės užklausos.
// Lyginam įprastą puslapio dydį (24 objektai) su užklausa, kuri prašo visos DB.
async function bigRequest(limit) {
  const start = performance.now();
  const res = await fetch(`${API}/api/places?limit=${limit}`);
  const body = await res.text();

  return {
    limit,
    statusas: res.status,
    "atsakymo dydis KB": Math.round(Buffer.byteLength(body) / 1024),
    "laikas ms": Math.round(performance.now() - start),
  };
}

console.log(
  "2 metrika. Per didelės užklausos (riba: per didelis limit turi būti atmestas arba apribotas)",
);
console.table([await bigRequest(24), await bigRequest(100000)]);
