// User assistance (ISO 25010:2023): axe pazeidimai dviejuose vaizduose
// ir dvi uzduotys tik klaviatura (Tab + Enter).
// UI perjungiamas i anglu kalba, mygtukai randami pagal tiksliu teksta.
import puppeteer from "puppeteer";
import { AxePuppeteer } from "@axe-core/puppeteer";

const WEB = "http://localhost:4173";
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });

async function openApp() {
  await page.goto(WEB, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    localStorage.setItem("pathy_language", "EN");
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: "networkidle0" });
}

async function axeCheck(viewName) {
  const result = await new AxePuppeteer(page).analyze();
  const elements = result.violations.reduce(
    (sum, v) => sum + v.nodes.length,
    0,
  );

  console.log(
    `\n${viewName}: ${result.violations.length} taisykliu pazeidimai, ${elements} elementai`,
  );
  console.table(
    result.violations.map((v) => ({
      taisykle: v.id,
      svarba: v.impact,
      elementu: v.nodes.length,
      aprasymas: v.help,
    })),
  );
}

// Tikslus atitikimas, kad "Add" nesutaptu su "Added" (paspaudus "Added" objektas pasalinamas).
async function clickButton(text) {
  await page.click(`::-p-xpath(//button[normalize-space()="${text}"])`);
  await wait(1000);
}

console.log("1 metrika. axe pazeidimai (riba: 0 critical ir serious)");

await openApp();
await axeCheck("Paieskos vaizdas");

await clickButton("Add");
await clickButton("Add");
await page.click("#nav-tab-route");
await wait(1000);
await axeCheck("Marsruto vaizdas (2 objektai)");

// Spaudzia Tab, kol fokusas pasiekia mygtuka su nurodytu tekstu, tada Enter.
// Grazina Tab paspaudimu skaiciu arba null, jei mygtukas nepasiekiamas.
async function tabToAndPress(text, maxTabs = 80) {
  for (let tabs = 1; tabs <= maxTabs; tabs++) {
    await page.keyboard.press("Tab");
    const lines = await page.evaluate(() =>
      // Fokusas ant BODY reiskia, kad niekas nepazymeta.
      document.activeElement === document.body
        ? []
        : document.activeElement.innerText
            .split("\n")
            .map((line) => line.trim()),
    );
    if (lines.includes(text)) {
      await page.keyboard.press("Enter");
      await wait(1000);
      return tabs;
    }
  }
  return null;
}

async function keyboardTask(buttons) {
  let totalTabs = 0;
  for (const button of buttons) {
    const tabs = await tabToAndPress(button);
    if (tabs === null) return { "Tab paspaudimu": `nepasiektas "${button}"` };
    totalTabs += tabs;
  }
  return { "Tab paspaudimu": totalTabs };
}

console.log("\n2 metrika. Uzduotys tik klaviatura (riba: abi atliekamos)");

await openApp();

const taskA = await keyboardTask(["Add"]);
taskA.atlikta = (
  await page.$eval("#nav-tab-route", (el) => el.innerText)
).includes("1");

// Marsruta galima generuoti tik pasirinkus transporta. Pavyko, jei atsirado trukme.
const taskB = await keyboardTask(["Add", "Route", "Car", "Generate route"]);
taskB.atlikta = await page.evaluate(() =>
  document.body.innerText.includes("Duration"),
);

console.table([
  { uzduotis: "A. Prideti objekta i marsruta", ...taskA },
  { uzduotis: "B. Sudaryti marsruta is 2 objektu", ...taskB },
]);

await browser.close();
