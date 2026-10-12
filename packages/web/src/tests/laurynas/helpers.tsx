import App from "../../App";
import { PLACES, ROUTE_PREVIEW } from "./fixtures";

/** Pranešimų tekstai iš ECS-67 AC3 ir AC4. */
export const MSG_MIN_PLACES =
  "Pasirinkite bent 2 lankytinus objektus maršrutui sudaryti.";
export const MSG_TRANSPORT = "Pasirinkite transporto tipą.";

/** Mobilaus ekrano dydis; centruotas scroll, kad sticky header / bottom nav neuždengtų elementų. */
export const TEST_CONFIG: Cypress.TestConfigOverrides = {
  viewportWidth: 430,
  viewportHeight: 932,
  scrollBehavior: "center",
};

/**
 * TC-ECS86-SETUP: nauja naršyklės sesija (tuščias maršrutas), LT kalba,
 * skiltis „Paieška“ su 12 objektų kortelių. API atsakymai pakeičiami fixture'ais.
 */
export function setupApp() {
  cy.clearAllSessionStorage();
  cy.clearAllLocalStorage();

  cy.intercept(
    { method: "GET", pathname: "/api/places" },
    { items: PLACES, total: PLACES.length, limit: 24, offset: 0 },
  ).as("places");
  cy.intercept(
    { method: "GET", pathname: "/api/filters" },
    {
      categories: ["museum", "castle", "church", "nature"],
      regions: ["Lietuva"],
      transportTypes: ["car", "bike", "walk"],
      radiusOptionsKm: [5, 10, 25, 50, 100],
    },
  );
  cy.intercept({ method: "GET", pathname: "/api/saved-routes" }, { items: [] });
  cy.intercept({ method: "POST", pathname: "/api/route-preview" }, (req) => {
    req.reply({
      ...ROUTE_PREVIEW,
      totals: {
        ...ROUTE_PREVIEW.totals,
        transportType: req.body.transportType,
      },
    });
  }).as("routePreview");
  cy.intercept({ hostname: /tile\.openstreetmap\.org$/ }, { statusCode: 204 });

  cy.mount(<App />);
  cy.wait("@places");
  cy.get(`#place-card-${PLACES[0].id}`).should("be.visible");
}

/** i-tojo fixture objekto kortelės mygtukas „Pridėti į maršrutą“ / „Pridėta“. */
export const addBtn = (i: number) => cy.get(`#add-to-route-${PLACES[i].id}`);

/** Elemento tekstas be perteklinių tarpų. */
export const norm = (s: string) => s.replace(/\s+/g, " ").trim();

/** Tikslus elemento teksto palyginimas (su retry per .should). */
export const haveExactText = (text: string) => ($el: JQuery<HTMLElement>) =>
  expect(norm($el.text())).to.eq(text);

/** Pasirinktų objektų skaičius – ženkliukas ant skirtuko „Maršrutas“. */
export function expectRouteCount(n: number) {
  if (n === 0) {
    cy.get("#nav-tab-route .font-bold").should("not.exist");
  } else {
    cy.get("#nav-tab-route .font-bold").should("have.text", String(n));
  }
}

/** Pridėti pirmus n fixture objektų per jų korteles. */
export function addPlaces(n: number) {
  for (let i = 0; i < n; i += 1) {
    addBtn(i).click();
  }
  expectRouteCount(n);
}

export const openRouteTab = () => cy.get("#nav-tab-route").click();

export const routeItems = () => cy.get('[id^="route-item-"]');

/**
 * Vartotojo bandymas sugeneruoti maršrutą: paspaudžiamas „Generuoti maršrutą“,
 * jei mygtukas matomas ir aktyvus. Kitu atveju tai užfiksuojama loge, o
 * laukiamas rezultatas tikrinamas toliau teste.
 */
export function attemptGenerate() {
  cy.get("body").then(($body) => {
    const $btn = $body.find("#generate-route-btn");
    if ($btn.length === 0 || !$btn.is(":visible")) {
      cy.log("„Generuoti maršrutą“ mygtukas nerodomas");
    } else if ($btn.is(":disabled")) {
      cy.log("„Generuoti maršrutą“ mygtukas neaktyvus (disabled)");
    } else {
      cy.wrap($btn).click();
    }
  });
}

/** Maršrutas negeneruojamas – į /api/route-preview neišsiųsta jokia užklausa. */
export const expectNoRouteRequest = () =>
  cy.get("@routePreview.all").should("have.length", 0);

/** Ekrano kopija ir sėkmingiems testams (nesėkmingiems Cypress daro automatiškai). */
export function screenshotOnPass(this: Mocha.Context) {
  const test = this.currentTest;
  if (Cypress.expose("SCREENSHOTS") === false) return;
  if (test?.state === "passed") {
    cy.screenshot(`${test.title} (passed)`, { capture: "runner" });
  }
}
