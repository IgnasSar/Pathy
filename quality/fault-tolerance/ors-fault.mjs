// ORS gedimo simuliacija. Failas įkeliamas paleidžiant API (node --import),
// programos kodas nekeičiamas. Pakeitus reikšmes, API reikia paleisti iš naujo.
//
// Testiniai atvejai:
//   1 metrika: FAULT = "503" ir FAULT = "offline"
//   2 metrika: FAULT = "slow", DELAY_MS = 5000 ir DELAY_MS = 30000
const FAULT = "503";
const DELAY_MS = 5000;

const realFetch = globalThis.fetch;

globalThis.fetch = async (url, options) => {
  if (!String(url).includes("openrouteservice")) {
    return realFetch(url, options);
  }

  // ORS serveris veikia, bet grąžina klaidą.
  if (FAULT === "503") {
    return new Response("Service Unavailable", { status: 503 });
  }

  // ORS serveris visai nepasiekiamas (nėra tinklo ryšio).
  if (FAULT === "offline") {
    throw new TypeError("fetch failed");
  }

  // ORS atsako labai lėtai ir tada grąžina klaidą.
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return new Response("Gateway Timeout", { status: 504 });
};
