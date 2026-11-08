// Talpa: uzklausos per sekunde ir klaidu dalis, kai 10 ir 50 naudotoju siuncia paieskas be pertrauku.
// Po testo API kelias minutes apdoroja susikaupusia eile, pries kartojant zr. README.
import http from "k6/http";
import { check } from "k6";

const API = "http://localhost:3001";

export const options = {
  scenarios: {
    naudotojai_10: { executor: "constant-vus", vus: 10, duration: "30s" },
    naudotojai_50: {
      executor: "constant-vus",
      vus: 50,
      duration: "30s",
      startTime: "35s",
    },
  },
  thresholds: {
    // Riba: maziau nei 1 % klaidu.
    "http_req_failed{scenario:naudotojai_10}": ["rate<0.01"],
    "http_req_failed{scenario:naudotojai_50}": ["rate<0.01"],
    // Tik tam, kad suvestineje matytusi uzklausu skaicius. Uzklausos per sekunde = count / 30.
    "http_reqs{scenario:naudotojai_10}": ["count>0"],
    "http_reqs{scenario:naudotojai_50}": ["count>0"],
  },
};

export default function () {
  const res = http.get(`${API}/api/places?query=pilis`, { timeout: "10s" });
  check(res, { "statusas 200": (r) => r.status === 200 });
}
