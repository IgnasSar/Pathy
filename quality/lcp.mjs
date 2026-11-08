// Elgsena laike, 2 metrika: puslapio LCP (Largest Contentful Paint) su Lighthouse.
// Reikia paleistos web build versijos (pnpm quality:web).
//
// Testiniai atvejai:
//   lėtas 4G: RTT_MS = 150, THROUGHPUT_KBPS = 1600
//   lėtas 3G: RTT_MS = 400, THROUGHPUT_KBPS = 400
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const RTT_MS = 150;
const THROUGHPUT_KBPS = 1600;

const report = `quality/results/lcp-${RTT_MS}ms-${THROUGHPUT_KBPS}kbps`;

execSync(
  `lighthouse http://localhost:4173 --only-categories=performance --chrome-flags=--headless ` +
    `--throttling.rttMs=${RTT_MS} --throttling.throughputKbps=${THROUGHPUT_KBPS} ` +
    `--output=html --output=json --output-path=${report} --quiet`,
  { stdio: "inherit" },
);

const result = JSON.parse(readFileSync(`${report}.report.json`, "utf8"));
console.log(
  `LCP: ${result.audits["largest-contentful-paint"].displayValue} (riba: ≤ 2,5 s)`,
);
console.log(`Ataskaita: ${report}.report.html`);
