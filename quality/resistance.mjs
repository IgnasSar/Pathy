// atsparumas (resistance): ar api riboja uzklausu kieki ir per dideles uzklausas
const API = "http://localhost:3001";

// /health nenaudoja db, tad testas jos neapkrauna
async function burst(count) {
  const responses = await Promise.all(
    Array.from({ length: count }, () => fetch(`${API}/health`)),
  );
  const limited = responses.filter((res) => res.status === 429).length;

  return {
    "uzklausu vienu metu": count,
    "atmesta su 429": limited,
    "apribota %": ((limited / count) * 100).toFixed(1),
  };
}

console.log("1 metrika: uzklausu ribojimas (riba: dalis uzklausu apribota)");
console.table([await burst(100), await burst(1000)]);

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
  "2 metrika: per dideles uzklausos (riba: per didelis limit atmetamas arba apribojamas)",
);
console.table([await bigRequest(24), await bigRequest(100000)]);
