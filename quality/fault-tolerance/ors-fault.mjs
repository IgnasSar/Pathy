// ors gedimo simuliacija, ikeliama paleidziant api (node --import). pakeitus reiksmes, api paleisti is naujo.
// testiniai atvejai:
//   1 metrika: FAULT = "503" ir FAULT = "offline"
//   2 metrika: FAULT = "slow", DELAY_MS = 5000 ir DELAY_MS = 30000
const FAULT = "503";
const DELAY_MS = 5000;

const realFetch = globalThis.fetch;

globalThis.fetch = async (url, options) => {
  if (!String(url).includes("openrouteservice")) {
    return realFetch(url, options);
  }

  if (FAULT === "503") {
    return new Response("Service Unavailable", { status: 503 });
  }

  if (FAULT === "offline") {
    throw new TypeError("fetch failed");
  }

  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return new Response("Gateway Timeout", { status: 504 });
};
