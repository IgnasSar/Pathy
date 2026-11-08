// Simuliacija: ORS atsako labai lėtai ir tada grąžina klaidą.
// Failas įkeliamas paleidžiant API (node --import), programos kodas nekeičiamas.
// Testiniai atvejai: 5000 ir 30000 ms. Pakeitus reikšmę, API reikia paleisti iš naujo.
const DELAY_MS = 5000;
const realFetch = globalThis.fetch;

globalThis.fetch = async (url, options) => {
  if (String(url).includes("openrouteservice")) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return new Response("Gateway Timeout", { status: 504 });
  }
  return realFetch(url, options);
};
