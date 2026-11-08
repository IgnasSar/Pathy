// Simuliacija: ORS serveris veikia, bet grąžina 503 Service Unavailable.
// Failas įkeliamas paleidžiant API (node --import), programos kodas nekeičiamas.
const realFetch = globalThis.fetch;

globalThis.fetch = (url, options) => {
  if (String(url).includes("openrouteservice")) {
    return Promise.resolve(
      new Response("Service Unavailable", { status: 503 }),
    );
  }
  return realFetch(url, options);
};
