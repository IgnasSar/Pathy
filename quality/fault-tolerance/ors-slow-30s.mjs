// Simuliacija: ORS atsako labai lėtai (po 30 s) ir tada grąžina klaidą.
// Failas įkeliamas paleidžiant API (node --import), programos kodas nekeičiamas.
const DELAY_MS = 30000;
const realFetch = globalThis.fetch;

globalThis.fetch = async (url, options) => {
  if (String(url).includes("openrouteservice")) {
    await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
    return new Response("Gateway Timeout", { status: 504 });
  }
  return realFetch(url, options);
};
