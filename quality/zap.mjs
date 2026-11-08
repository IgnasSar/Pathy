// Konfidencialumas, 2 metrika: OWASP ZAP baseline (pasyvus) skenavimas.
// Ieško trūkstamų saugumo antraščių ir informacijos nutekėjimo, nieko nekeičia.
//
// Testiniai atvejai:
//   API: TARGET = "http://localhost:3001/api/places"
//   web: TARGET = "http://localhost:4173"
import { execSync } from "node:child_process";

const TARGET = "http://localhost:3001/api/places";

const report = `zap-${new URL(TARGET).port}.html`;

execSync(
  `docker run --rm --network host -v "${process.cwd()}/quality/results:/zap/wrk:rw" ` +
    `ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -I -t ${TARGET} -r ${report}`,
  { stdio: "inherit" },
);

console.log(`Ataskaita: quality/results/${report}`);
