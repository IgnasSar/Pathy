// konfidencialumas: OWASP ZAP baseline (pasyvus) skenavimas, nieko nekeicia
// testiniai atvejai: api "http://localhost:3001/api/places" ir web "http://localhost:4173"
import { execSync } from "node:child_process";

const TARGET = "http://localhost:3001/api/places";

const report = `zap-${new URL(TARGET).port}.html`;

execSync(
  `docker run --rm --network host -v "${process.cwd()}/quality/results:/zap/wrk:rw" ` +
    `ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -I -t ${TARGET} -r ${report}`,
  { stdio: "inherit" },
);

console.log(`ataskaita: quality/results/${report}`);
