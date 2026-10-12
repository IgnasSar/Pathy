import type { PlaceSummary } from "@pathy/shared";
import App from "../../App";

const makePlace = (
  id: string,
  name: string,
  lat: number,
  lng: number,
): PlaceSummary => ({
  id,
  name,
  category: "landmark",
  shortDescription: `${name} aprašymas`,
  region: "Vilniaus apskritis",
  municipality: "Vilniaus m. sav.",
  coordinates: { lat, lng },
  thumbnailUrl: null,
  recommendedVisitMinutes: 60,
});

const PLACES = Array.from({ length: 11 }, (_, i) =>
  makePlace(`p${i + 1}`, `Objektas ${i + 1}`, 54 + i * 0.1, 23 + i * 0.1),
);

const addButton = (place: PlaceSummary) => cy.get(`#add-to-route-${place.id}`);
const routeCount = () => cy.get("#nav-tab-route .font-bold");
const routeItems = () => cy.get('[id^="route-item-"]');

const addPlaces = (n: number) => {
  PLACES.slice(0, n).forEach((place) => addButton(place).click());
  routeCount().should("have.text", String(n));
};

describe("[ECS-86] Objekto pridėjimas į maršrutą (pataisytas ECS-37)", () => {
  // TC-ECS86-SETUP: nauja sesija (tuščias maršrutas), LT kalba, paieškoje 11 objektų
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.setItem("pathy_language", "LT");

    cy.intercept("GET", "/api/filters", {
      statusCode: 200,
      body: {
        categories: [],
        regions: [],
        transportTypes: [],
        radiusOptionsKm: [],
      },
    });
    cy.intercept("GET", "/api/places*", {
      statusCode: 200,
      body: { items: PLACES, total: PLACES.length, limit: 24, offset: 0 },
    }).as("places");

    cy.mount(<App />);
    cy.wait("@places");
  });

  it("TC-ECS86-01 [UI] Objekto kortelėje yra mygtukas „Pridėti į maršrutą“ (AC1)", () => {
    addButton(PLACES[0])
      .should("be.visible")
      .and("have.text", "Pridėti į maršrutą");
  });

  it("TC-ECS86-02 [EP, DT] Objekto pridėjimas į tuščią maršrutą (AC2, AC4, AC5; EP1, EP3, R1)", () => {
    addButton(PLACES[0]).click();

    addButton(PLACES[0]).should("have.text", "Pridėta");
    routeCount().should("have.text", "1");
    cy.get("#nav-tab-route").click();
    routeItems().should("have.length", 1);
    cy.get(`#route-item-${PLACES[0].id}`)
      .should("be.visible")
      .and("contain.text", PLACES[0].name);
  });

  it("TC-ECS86-03 [EP, DT] To paties objekto negalima pridėti antrą kartą (AC3; EP2, R3)", () => {
    addButton(PLACES[0]).click();
    addButton(PLACES[0]).should("have.text", "Pridėta");

    addButton(PLACES[0]).click();

    routeCount().should("have.text", "1");
    cy.get("#nav-tab-route").click();
    routeItems().should("have.length", 1);
    cy.get(`#route-item-${PLACES[0].id}`).should("exist");
  });

  [8, 9].forEach((n) => {
    it(`TC-ECS86-04 [BVA] Pridėjimas iki limito imtinai: N = ${n} → ${n + 1} (AC5, AC6; BV${n - 7}, EP3, R1)`, () => {
      addPlaces(n);

      addButton(PLACES[n]).click();

      addButton(PLACES[n]).should("have.text", "Pridėta");
      routeCount().should("have.text", String(n + 1));
      cy.get("#nav-tab-route").click();
      routeItems().should("have.length", n + 1);
    });
  });

  it("TC-ECS86-05 [BVA, DT] 11-ojo objekto pridėjimas atmetamas (AC6; BV3, EP4, R2)", () => {
    addPlaces(10);
    const card = `#place-card-${PLACES[10].id}`;

    cy.get(card)
      .invoke("text")
      .then((before) => {
        addButton(PLACES[10]).click();
        // Kortelėje atsiranda klaidos pranešimas (AC6 tikslaus teksto nenurodo)
        cy.get(card).should(($card) => {
          expect(
            $card.text().replace(before, "").trim(),
            "klaidos pranešimas",
          ).to.have.length.above(0);
        });
      });
    addButton(PLACES[10]).should("not.have.text", "Pridėta");
    routeCount().should("have.text", "10");
    cy.get("#nav-tab-route").click();
    routeItems().should("have.length", 10);
    cy.get(`#route-item-${PLACES[10].id}`).should("not.exist");
  });

  it("TC-ECS86-06 [DT] Pakartotinis pridėjimas, kai sąrašas pilnas (AC3, AC6; EP2, EP4, R3)", () => {
    addPlaces(10);
    addButton(PLACES[0]).should("have.text", "Pridėta");

    addButton(PLACES[0]).click();

    routeCount().should("have.text", "10");
    cy.get("#nav-tab-route").click();
    routeItems().should("have.length", 10);
    cy.get(`#route-item-${PLACES[0].id}`).should("exist");
  });
});
