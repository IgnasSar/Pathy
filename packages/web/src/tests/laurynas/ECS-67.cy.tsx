import type { TransportType } from "@pathy/shared";
import { PLACES, ROUTE_PREVIEW } from "./fixtures";
import {
  MSG_MIN_PLACES,
  MSG_TRANSPORT,
  TEST_CONFIG,
  addPlaces,
  attemptGenerate,
  expectNoRouteRequest,
  openRouteTab,
  routeItems,
  screenshotOnPass,
  setupApp,
} from "./helpers";

/** TC-ECS67-SETUP (N): TC-ECS86-SETUP + N objektų pridėta + atidaryta skiltis „Maršrutas“. */
function setupRoute(n: number) {
  setupApp();
  if (n > 0) addPlaces(n);
  openRouteTab();
}

function generateAndExpectRoute(n: number, transport: TransportType) {
  cy.get("#generate-route-btn").click();

  cy.wait("@routePreview")
    .its("request.body")
    .should((body) => {
      expect(body.placeIds, "užklausos objektai").to.have.length(n);
      expect(body.transportType, "užklausos transportas").to.eq(transport);
    });
  cy.contains(MSG_MIN_PLACES).should("not.exist");
  cy.contains(MSG_TRANSPORT).should("not.exist");
  cy.contains(`${ROUTE_PREVIEW.totals.distanceKm} km`).should("be.visible");
}

describe(
  "[ECS-67] Maršruto generavimo sąlygų validavimas – UI",
  TEST_CONFIG,
  () => {
    afterEach(screenshotOnPass);

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
    transports.forEach(([key, label]) => {
      it(`TC-ECS67-02 [EP] Generavimas su transporto tipu: ${label} (AC2, AC7; EP4, R1)`, () => {
        setupRoute(2);

        cy.get(`#transport-${key}`).click();

        generateAndExpectRoute(2, key);
      });
    });

    it("TC-ECS67-03 [BVA, DT] 1 objektas, transportas pasirinktas (AC1, AC3; BV1, EP2, R3)", () => {
      setupRoute(2);
      cy.get("#transport-car").click();
      cy.get(`#remove-route-${PLACES[0].id}`).click();
      routeItems().should("have.length", 1);

      attemptGenerate();

      expectNoRouteRequest();
      cy.contains(MSG_MIN_PLACES).should("be.visible");
      cy.contains(MSG_TRANSPORT).should("not.exist");
    });

    it("TC-ECS67-04 [EP] 0 objektų, transportas pasirinktas (AC1, AC3; EP2, R3)", () => {
      setupRoute(2);
      cy.get("#transport-car").click();
      cy.get(`#remove-route-${PLACES[0].id}`).click();
      cy.get(`#remove-route-${PLACES[1].id}`).click();
      routeItems().should("not.exist");

      attemptGenerate();

      expectNoRouteRequest();
      cy.contains(MSG_MIN_PLACES).should("be.visible");
    });

    it("TC-ECS67-05 [EP, DT] Transporto tipas nepasirinktas (AC2, AC4; EP5, R2)", () => {
      setupRoute(2);

      attemptGenerate();

      expectNoRouteRequest();
      cy.contains(MSG_TRANSPORT).should("be.visible");
      cy.contains(MSG_MIN_PLACES).should("not.exist");
    });

    it("TC-ECS67-06 [DT] Netenkinamos abi sąlygos: 1 objektas, be transporto (AC5; EP2, EP5, R4)", () => {
      setupRoute(1);

      attemptGenerate();

      expectNoRouteRequest();
      cy.contains(MSG_MIN_PLACES).should("be.visible");
      cy.contains(MSG_TRANSPORT).should("be.visible");
    });
  },
);
