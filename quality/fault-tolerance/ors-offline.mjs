// Simuliacija: ORS serveris visai nepasiekiamas (nėra tinklo ryšio).
// Failas įkeliamas paleidžiant API (node --import), programos kodas nekeičiamas.
const realFetch = globalThis.fetch;

globalThis.fetch = (url, options) => {
  if (String(url).includes("openrouteservice")) {
    return Promise.reject(new TypeError("fetch failed"));
  }
  return realFetch(url, options);
};
