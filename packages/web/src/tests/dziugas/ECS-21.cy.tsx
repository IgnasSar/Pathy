import type { PlaceSummary, TransportType } from "@pathy/shared";
import App from "../../App";

const ROUTE_PLACES_SESSION_KEY = "pathy_route_places_v2";

const routePlaces: PlaceSummary[] = [
  {
    id: "duration-place-1",
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
    id: "duration-place-2",
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

const replacementPlace: PlaceSummary = {
  id: "duration-place-3",
  name: "Trijų kryžių kalnas",
  category: "landmark",
  shortDescription: "Paminklas Vilniuje",
  region: "Vilniaus apskritis",
  municipality: "Vilnius",
  coordinates: { lat: 54.6872, lng: 25.295 },
  thumbnailUrl: null,
  recommendedVisitMinutes: 30,
};

function routeResponse(transportType: TransportType, durationMinutes: number) {
  return {
    stops: routePlaces.map((place, index) => ({
      order: index + 1,
      id: place.id,
      name: place.name,
      coordinates: place.coordinates,
    })),
    totals: {
      distanceKm: 2.5,
      durationMinutes,
      transportType,
    },
    path: routePlaces.map((place) => place.coordinates),
    segments: [routePlaces.map((place) => place.coordinates)],
  };
}

function generateRoute(transportType: TransportType, durationMinutes: number) {
  cy.intercept("POST", "**/api/route-preview", {
    statusCode: 200,
    body: routeResponse(transportType, durationMinutes),
  }).as("routePreview");

  cy.get(`#transport-${transportType}`).click();
  cy.get("#generate-route-btn").click();
  cy.wait("@routePreview")
    .its("request.body")
    .should("deep.equal", {
      placeIds: routePlaces.map((place) => place.id),
      transportType,
    });
}

function expectDuration(text: RegExp) {
  cy.contains("Trukmė")
    .next("p")
    .should(($duration) => {
      expect($duration.text()).to.match(text);
    });
  cy.wait(200);
}

describe("RouteView - maršruto trukmės apskaičiavimas ir atvaizdavimas", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.setItem("pathy_language", "LT");
    sessionStorage.setItem(
      ROUTE_PLACES_SESSION_KEY,
      JSON.stringify(routePlaces),
    );
    cy.intercept("GET", "**/api/filters", {
      statusCode: 200,
      body: {
        categories: [],
        regions: [],
        transportTypes: ["car", "bike", "walk"],
        radiusOptionsKm: [5, 10, 25, 50, 100],
      },
    });
    cy.intercept("GET", "**/api/places*", {
      statusCode: 200,
      body: { items: [replacementPlace], total: 1, limit: 24, offset: 0 },
    });
    cy.mount(<App />);
    cy.get("#nav-tab-route").click();
  });

  it("TC-01 [EP]: Maršruto trukmės apskaičiavimas su automobiliu (AC1, AC3)", () => {
    generateRoute("car", 32);
    expectDuration(/32\s*min/);
  });

  it("TC-02 [EP]: Maršruto trukmės apskaičiavimas su dviračiu (AC1, AC3)", () => {
    generateRoute("bike", 47);
    expectDuration(/47\s*min/);
  });

  it("TC-03 [EP]: Maršruto trukmės apskaičiavimas pėsčiomis (AC1, AC3)", () => {
    generateRoute("walk", 68);
    expectDuration(/1\s*h\s*8\s*min/);
  });

  it("TC-04 [EP]: Maršruto trukmė mažiau nei 1h (AC2)", () => {
    generateRoute("car", 45);
    expectDuration(/45\s*min/);
  });

  it("TC-05 [EP]: Maršruto trukmė lygiai 1h (AC2)", () => {
    generateRoute("car", 60);
    expectDuration(/1\s*h/);
    cy.contains("Trukmė").next("p").should("have.text", "1h");
  });

  it("TC-06 [EP]: Maršruto trukmė ilgesnė nei 1h (AC2)", () => {
    generateRoute("car", 90);
    expectDuration(/1\s*h\s*30\s*min/);
  });

  it("TC-07 [DT]: Trukmės atnaujinimas pakeitus transporto tipą (AC3, AC4)", () => {
    generateRoute("car", 80);
    expectDuration(/1\s*h\s*20\s*min/);

    cy.intercept("POST", "**/api/route-preview", {
      statusCode: 200,
      body: routeResponse("bike", 35),
    }).as("updatedRoutePreview");
    cy.get("#transport-bike").click();
    cy.get("#generate-route-btn").click();

    cy.wait("@updatedRoutePreview")
      .its("request.body")
      .should("deep.equal", {
        placeIds: routePlaces.map((place) => place.id),
        transportType: "bike",
      });
    expectDuration(/35\s*min/);
  });

  it("TC-08 [DT]: Trukmės atnaujinimas pakeitus norimus aplankyti objektus (AC4)", () => {
    generateRoute("car", 40);
    expectDuration(/40\s*min/);

    cy.get("#route-view-list").click();
    cy.get("#remove-route-duration-place-2").click();
    cy.get("#nav-tab-search").click();
    cy.get("#place-card-duration-place-3").should("be.visible");
    cy.get("#add-to-route-duration-place-3").click();
    cy.get("#nav-tab-route").click();

    cy.intercept("POST", "**/api/route-preview", {
      statusCode: 200,
      body: {
        ...routeResponse("car", 75),
        stops: [
          {
            order: 1,
            id: routePlaces[0].id,
            name: routePlaces[0].name,
            coordinates: routePlaces[0].coordinates,
          },
          {
            order: 2,
            id: replacementPlace.id,
            name: replacementPlace.name,
            coordinates: replacementPlace.coordinates,
          },
        ],
        path: [routePlaces[0].coordinates, replacementPlace.coordinates],
        segments: [[routePlaces[0].coordinates, replacementPlace.coordinates]],
      },
    }).as("updatedRoutePreview");

    cy.get("#generate-route-btn").click();
    cy.wait("@updatedRoutePreview")
      .its("request.body")
      .should("deep.equal", {
        placeIds: [routePlaces[0].id, replacementPlace.id],
        transportType: "car",
      });
    expectDuration(/1\s*h\s*15\s*min/);
  });

  it("TC-09 [DT]: API klaidos pranešimo tikrinimas (AC5)", () => {
    cy.intercept("POST", "**/api/route-preview", {
      statusCode: 503,
      body: { error: "API nepasiekiamas" },
    }).as("routePreview");

    cy.get("#transport-car").click();
    cy.get("#generate-route-btn").click();
    cy.wait("@routePreview");

    cy.contains("API nepasiekiamas").should("be.visible");
    cy.contains("Trukmė").should("not.exist");
  });
});
