// Talpa: kiek užklausų per sekundę API atlaiko ir kiek klaidų atsiranda,
// kai 10 ir 50 naudotojų siunčia paieškos užklausas be pertraukų.
// Po paleidimo API gali kelias minutes "virškinti" užklausų eilę, todėl prieš
// kartojant testą patikrink, ar API vėl greitai atsako (žr. README).
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
    // Riba: mažiau nei 1 % nesėkmingų užklausų.
    "http_req_failed{scenario:naudotojai_10}": ["rate<0.01"],
    "http_req_failed{scenario:naudotojai_50}": ["rate<0.01"],
    // Šios dvi eilutės tik tam, kad suvestinėje matytųsi užklausų skaičius
    // atskirai kiekvienam atvejui. Užklausos per sekundę = count / 30 s
    // (k6 rodomas "/s" skaičiuojamas pagal viso testo trukmę, ne pagal atvejį).
    "http_reqs{scenario:naudotojai_10}": ["count>0"],
    "http_reqs{scenario:naudotojai_50}": ["count>0"],
  },
};

export default function () {
  const res = http.get(`${API}/api/places?query=pilis`, { timeout: "10s" });
  check(res, { "statusas 200": (r) => r.status === 200 });
}
