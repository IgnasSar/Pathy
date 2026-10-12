import type {
  PlaceSummary,
  RoutePreviewRequest,
  TransportType,
} from "@pathy/shared";
import App from "../../App";

const MSG_MIN_PLACES =
  "Pasirinkite bent 2 lankytinus objektus maršrutui sudaryti.";
const MSG_TRANSPORT = "Pasirinkite transporto tipą.";

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

const PLACES = Array.from({ length: 10 }, (_, i) =>
  makePlace(`p${i + 1}`, `Objektas ${i + 1}`, 54 + i * 0.1, 23 + i * 0.1),
);

function routeResponse({ placeIds, transportType }: RoutePreviewRequest) {
  const stops = PLACES.filter((place) => placeIds.includes(place.id));
  const path = stops.map((place) => place.coordinates);
  return {
    stops: stops.map((place, index) => ({
      order: index + 1,
      id: place.id,
      name: place.name,
      coordinates: place.coordinates,
    })),
    totals: { distanceKm: 42.5, durationMinutes: 50, transportType },
    path,
    segments: [path],
  };
}

// TC-ECS67-SETUP (N): N objektų pridėta paieškoje, atidaryta skiltis „Maršrutas“
function setupRoute(n: number) {
  PLACES.slice(0, n).forEach((place) =>
    cy.get(`#add-to-route-${place.id}`).click(),
  );
  cy.get("#nav-tab-route").click();
}

function generateAndExpectRoute(n: number, transportType: TransportType) {
  cy.get("#generate-route-btn").click();

  cy.wait("@routePreview")
    .its("request.body")
    .should((body) => {
      expect(body.placeIds, "užklausos objektai").to.have.length(n);
      expect(body.transportType, "užklausos transportas").to.eq(transportType);
    });
  cy.contains(MSG_MIN_PLACES).should("not.exist");
  cy.contains(MSG_TRANSPORT).should("not.exist");
  cy.contains("42.5 km").should("be.visible");
  // RouteMapView po 80 ms kviečia map.invalidateSize() (laikmatis neišvalomas) –
  // palaukiama, kad klaida nepersikeltų į kitą testą, kai žemėlapis jau pašalintas
  cy.wait(200);
}

describe("[ECS-67] Maršruto generavimo sąlygų validavimas – UI", () => {
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
    cy.intercept("POST", "/api/route-preview", (req) => {
      req.reply({ statusCode: 200, body: routeResponse(req.body) });
    }).as("routePreview");

    cy.mount(<App />);
    cy.wait("@places");
  });

  const boundaries: [number, string][] = [
    [2, "BV2"],
    [3, "BV3"],
    [9, "BV4"],
    [10, "BV5"],
  ];
  boundaries.forEach(([n, bv]) => {
    it(`TC-ECS67-01 [BVA, DT] Generavimas su galiojančiu objektų skaičiumi: N = ${n} (AC1, AC7; ${bv}, EP1, R1)`, () => {
      setupRoute(n);

      cy.get("#transport-car").click();

      generateAndExpectRoute(n, "car");
    });
  });

  const transports: [TransportType, string][] = [
    ["car", "Automobilis"],
    ["bike", "Dviratis"],
    ["walk", "Pėsčiomis"],
  ];
  transports.forEach(([transportType, label]) => {
    it(`TC-ECS67-02 [EP] Generavimas su transporto tipu: ${label} (AC2, AC7; EP4, R1)`, () => {
      setupRoute(2);

      cy.get(`#transport-${transportType}`).click();

      generateAndExpectRoute(2, transportType);
    });
  });

  it("TC-ECS67-03 [BVA, DT] 1 objektas, transportas pasirinktas (AC1, AC3; BV1, EP2, R3)", () => {
    setupRoute(2);
    cy.get("#transport-car").click();
    cy.get(`#remove-route-${PLACES[0].id}`).click();
    cy.get('[id^="route-item-"]').should("have.length", 1);

    cy.contains(MSG_MIN_PLACES).should("be.visible");
    cy.contains(MSG_TRANSPORT).should("not.exist");
    cy.get("@routePreview.all").should("have.length", 0);
  });

  it("TC-ECS67-04 [EP] 0 objektų, transportas pasirinktas (AC1, AC3; EP2, R3)", () => {
    setupRoute(2);
    cy.get("#transport-car").click();
    cy.get(`#remove-route-${PLACES[0].id}`).click();
    cy.get(`#remove-route-${PLACES[1].id}`).click();
    cy.get('[id^="route-item-"]').should("not.exist");

    cy.contains(MSG_MIN_PLACES).should("be.visible");
    cy.get("@routePreview.all").should("have.length", 0);
  });

  it("TC-ECS67-05 [EP, DT] Transporto tipas nepasirinktas (AC2, AC4; EP5, R2)", () => {
    setupRoute(2);

    cy.get("#generate-route-btn").click({ force: true });

    cy.contains(MSG_TRANSPORT).should("be.visible");
    cy.contains(MSG_MIN_PLACES).should("not.exist");
    cy.get("@routePreview.all").should("have.length", 0);
  });

  it("TC-ECS67-06 [DT] Netenkinamos abi sąlygos: 1 objektas, be transporto (AC5; EP2, EP5, R4)", () => {
    setupRoute(1);

    cy.contains(MSG_MIN_PLACES).should("be.visible");
    cy.contains(MSG_TRANSPORT).should("be.visible");
    cy.get("@routePreview.all").should("have.length", 0);
  });
});
