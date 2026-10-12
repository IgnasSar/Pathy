import type { PlaceSummary } from "@pathy/shared";
import App from "../../App";

const ROUTE_PLACES_SESSION_KEY = "pathy_route_places_v2";
const selectedPlaces: PlaceSummary[] = [
  {
    id: "place-1",
    name: "Gedimino pilis",
    category: "castle",
    shortDescription: "Istorinė pilis",
    region: "Vilniaus apskritis",
    municipality: "Vilnius",
    coordinates: { lat: 54.6867, lng: 25.2902 },
    thumbnailUrl: null,
    recommendedVisitMinutes: 60,
  },
  {
    id: "place-2",
    name: "Vilniaus katedra",
    category: "church",
    shortDescription: "Katedra Vilniaus centre",
    region: "Vilniaus apskritis",
    municipality: "Vilnius",
    coordinates: { lat: 54.6851, lng: 25.2878 },
    thumbnailUrl: null,
    recommendedVisitMinutes: 45,
  },
];

describe("RouteView - transporto tipo pasirinkimas ir maršruto generavimas", () => {
  beforeEach(() => {
    sessionStorage.clear();
    sessionStorage.setItem(
      ROUTE_PLACES_SESSION_KEY,
      JSON.stringify(selectedPlaces),
    );
    cy.mount(<App />);
    cy.get("#nav-tab-route").click();
  });

  it("TC-01 [EP]: Pasirenkamas automobilis kaip aktyvus transporto tipas ir generuojamas marsrutas (AC1)", () => {
    cy.get("#transport-car")
      .click()
      .should("have.css", "color", "rgb(52, 199, 89)");
  });

  it("TC-02 [EP]: Pasirenkamas dviratis kaip aktyvus transporto tipas ir generuojamas maršrutas (AC1)", () => {
    cy.get("#transport-bike")
      .click()
      .should("have.css", "color", "rgb(52, 199, 89)");
  });

  it("TC-03 [EP]: Pasirenkamas ėjimas pėsčiomis kaip aktyvus transporto tipas ir generuojamas maršrutas (AC1)", () => {
    cy.get("#transport-walk")
      .click()
      .should("have.css", "color", "rgb(52, 199, 89)");
  });

  it("TC-04: Anksčiau pasirinktas transporto tipas lieka pasirinktas pereinant taro sistemos skilčių ir grįžus į maršruto sąsają (AC2)", () => {
    cy.get("#transport-bike").click();
    cy.get("#transport-bike").should("have.css", "color", "rgb(52, 199, 89)");
    cy.get("#nav-tab-search").click();
    cy.get("#nav-tab-route").click();

    cy.get("#transport-bike").should("have.css", "color", "rgb(52, 199, 89)");
  });

  it("TC-05 [DT]: Generuojamas maršrutas, kai transporto tipas pasirinktas (AC3)", () => {
    cy.intercept("POST", "**/api/route-preview", {
      statusCode: 500,
      body: { error: "Test response" },
    }).as("routePreview");

    cy.get("#transport-car").click();
    cy.get("#generate-route-btn").should("be.enabled").click();

    cy.wait("@routePreview")
      .its("request.body")
      .should("deep.equal", {
        placeIds: ["place-1", "place-2"],
        transportType: "car",
      });
    cy.contains("Test response").should("be.visible");
  });

  it("TC-06 [DT]: Kai transporto tipas nepasirinktas parodo pranešimą, kad jį reikia pasirinkti ir neleidžia generuoti maršruto(AC3)", () => {
    cy.intercept("POST", "**/api/route-preview").as("routePreview");
    const alertStub = cy.stub().as("transportAlert");
    cy.on("window:alert", alertStub);

    cy.get("#generate-route-btn").should("be.disabled");
    cy.get("#generate-route-btn").click({ force: true });
    cy.get("@routePreview.all").should("have.length", 0);
    cy.get("@transportAlert").should(
      "have.been.calledOnceWith",
      "Pasirinkite transporto priemonę, kad galėtumėte generuoti maršrutą.",
    );
  });
});
