// User assistance (ISO 25010:2023, buvęs "prieinamumas"):
// ar sistema tinkama žmonėms su įvairiais gebėjimais.
// 1 metrika: axe-core randami prieinamumo pažeidimai (WCAG) dviejuose vaizduose.
// 2 metrika: ar užduotis įmanoma atlikti tik klaviatūra (Tab + Enter).
// Reikia paleisto API ir web build versijos (žr. README).
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

const WEB = "http://localhost:4173";

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 }); // telefono ekranas

// ── 1 metrika. axe pažeidimai ──────────────────────────────────────────────
async function axeCheck(viewName) {
  const result = await new AxePuppeteer(page).analyze();
  const elements = result.violations.reduce(
    (sum, v) => sum + v.nodes.length,
    0,
  );

  console.log(
    `\n${viewName}: ${result.violations.length} taisyklių pažeidimai, ${elements} elementai`,
  );
  console.table(
    result.violations.map((v) => ({
      taisyklė: v.id,
      svarba: v.impact,
      elementų: v.nodes.length,
      aprašymas: v.help,
    })),
  );
}

console.log("1 metrika. axe pažeidimai (riba: 0 critical ir serious)");

await page.goto(WEB, { waitUntil: "networkidle0" });
await axeCheck("Paieškos vaizdas");

// Pridedam 2 objektus ir atidarom maršruto vaizdą.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await page.click("::-p-text(Pridėti)");
await wait(1000);
await page.click("::-p-text(Pridėti)");
await wait(1000);
await page.click("#nav-tab-route");
await wait(1000);
await axeCheck("Maršruto vaizdas (2 objektai)");

// ── 2 metrika. Užduotis tik klaviatūra ─────────────────────────────────────
// Spaudžiam Tab, kol fokusas pasiekia mygtuką su nurodytu tekstu, ir spaudžiam Enter.
// Grąžina Tab paspaudimų skaičių arba null, jei mygtukas nepasiekiamas.
async function tabToAndPress(text, maxTabs = 80) {
  for (let tabs = 1; tabs <= maxTabs; tabs++) {
    await page.keyboard.press("Tab");
    const focusedText = await page.evaluate(() =>
      // Jei fokusas "nukrito" į BODY, jo tekstas yra visas puslapis, todėl jo neskaičiuojam.
      document.activeElement === document.body
        ? ""
        : document.activeElement.innerText.trim(),
    );
    if (focusedText.includes(text)) {
      await page.keyboard.press("Enter");
      await wait(1000);
      return tabs;
    }
  }
  return null;
}

// Atlieka užduotį: iš eilės pasiekia ir paspaudžia nurodytus mygtukus.
async function keyboardTask(buttons) {
  let totalTabs = 0;
  for (const button of buttons) {
    const tabs = await tabToAndPress(button);
    if (tabs === null) return { "Tab paspaudimų": `nepasiektas "${button}"` };
    totalTabs += tabs;
  }
  return { "Tab paspaudimų": totalTabs };
}

console.log("\n2 metrika. Užduotys tik klaviatūra (riba: abi atliekamos)");

// Pradedam iš naujo su tuščiu maršrutu (maršrutas saugomas sessionStorage).
await page.evaluate(() => sessionStorage.clear());
await page.goto(WEB, { waitUntil: "networkidle0" });

// A užduotis: pridėti objektą į maršrutą. Pavyko, jei skaitliukas rodo 1.
const taskA = await keyboardTask(["Pridėti"]);
const routeTab = await page.$eval("#nav-tab-route", (el) => el.innerText);
taskA.atlikta = routeTab.includes("1");

// B užduotis: pridėti antrą objektą, atidaryti maršrutą, pasirinkti transportą ir sugeneruoti.
// Pavyko, jei atsirado maršruto trukmė.
const taskB = await keyboardTask([
  "Pridėti",
  "Maršrutas",
  "Automobilis",
  "Generuoti maršrutą",
]);
taskB.atlikta = await page.evaluate(() =>
  document.body.innerText.includes("Trukmė"),
);

console.table([
  { užduotis: "A. Pridėti objektą į maršrutą", ...taskA },
  { užduotis: "B. Sudaryti maršrutą iš 2 objektų", ...taskB },
]);

await browser.close();
