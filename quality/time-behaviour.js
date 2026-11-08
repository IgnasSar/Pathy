// elgsena laike: api atsako laikas p95, kai vienu metu dirba 10 ir 100 naudotoju
import http from "k6/http";
import { check, sleep } from "k6";

const API = "http://localhost:3001";

export const options = {
  scenarios: {
    naudotojai_10: { executor: "constant-vus", vus: 10, duration: "30s" },
    naudotojai_100: {
      executor: "constant-vus",
      vus: 100,
      duration: "30s",
      startTime: "35s",
    },
  },
  // riba: p95 < 500 ms
  thresholds: {
    "http_req_duration{scenario:naudotojai_10,name:paieska}": ["p(95)<500"],
    "http_req_duration{scenario:naudotojai_10,name:marsrutas}": ["p(95)<500"],
    "http_req_duration{scenario:naudotojai_100,name:paieska}": ["p(95)<500"],
    "http_req_duration{scenario:naudotojai_100,name:marsrutas}": ["p(95)<500"],
  },
};

export function setup() {
  const res = http.get(`${API}/api/places?limit=2`);
  return { placeIds: res.json("items.#.id") };
}

export default function (data) {
  const search = http.get(`${API}/api/places?query=pilis`, {
    tags: { name: "paieska" },
  });
  check(search, { "paieska 200": (r) => r.status === 200 });

  const route = http.post(
    `${API}/api/route-preview`,
    JSON.stringify({ placeIds: data.placeIds, transportType: "car" }),
    {
      headers: { "Content-Type": "application/json" },
      tags: { name: "marsrutas" },
    },
  );
  check(route, { "marsrutas 200": (r) => r.status === 200 });

  sleep(1);
}
