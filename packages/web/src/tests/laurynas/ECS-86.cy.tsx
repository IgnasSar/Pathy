import { PLACES } from "./fixtures";
import {
  TEST_CONFIG,
  addBtn,
  addPlaces,
  expectRouteCount,
  haveExactText,
  norm,
  openRouteTab,
  routeItems,
  screenshotOnPass,
  setupApp,
} from "./helpers";

describe(
  "[ECS-86] Objekto pridėjimas į maršrutą (pataisytas ECS-37)",
  TEST_CONFIG,
  () => {
    beforeEach(() => setupApp()); // TC-ECS86-SETUP
    afterEach(screenshotOnPass);

    it("TC-ECS86-01 [UI] Objekto kortelėje yra mygtukas „Pridėti į maršrutą“ (AC1)", () => {
      addBtn(0).should("be.visible").and(haveExactText("Pridėti į maršrutą"));
    });

    it("TC-ECS86-02 [EP, DT] Objekto pridėjimas į tuščią maršrutą (AC2, AC4, AC5; EP1, EP3, R1)", () => {
      addBtn(0).click();

      addBtn(0).should(haveExactText("Pridėta"));
      expectRouteCount(1);
      openRouteTab();
      routeItems().should("have.length", 1);
      cy.get(`#route-item-${PLACES[0].id}`)
        .should("be.visible")
        .and("contain.text", PLACES[0].name);
    });

    it("TC-ECS86-03 [EP, DT] To paties objekto negalima pridėti antrą kartą (AC3; EP2, R3)", () => {
      addBtn(0).click();
      addBtn(0).should(haveExactText("Pridėta"));

      addBtn(0).click();

      expectRouteCount(1);
      openRouteTab();
      routeItems().should("have.length", 1);
      cy.get(`#route-item-${PLACES[0].id}`).should("exist");
    });

    [8, 9].forEach((n) => {
      it(`TC-ECS86-04 [BVA] Pridėjimas iki limito imtinai: N = ${n} → ${n + 1} (AC5, AC6; BV${n - 7}, EP3, R1)`, () => {
        addPlaces(n);

        addBtn(n).click();

        addBtn(n).should(haveExactText("Pridėta"));
        expectRouteCount(n + 1);
        openRouteTab();
        routeItems().should("have.length", n + 1);
      });
    });

    it("TC-ECS86-05 [BVA, DT] 11-ojo objekto pridėjimas atmetamas (AC6; BV3, EP4, R2)", () => {
      addPlaces(10);
      const card = `#place-card-${PLACES[10].id}`;

      cy.get(card)
        .invoke("text")
        .then((before) => {
          addBtn(10).click();
          cy.get(card).should(($card) => {
            const added = norm($card.text().replace(before, ""));
            expect(added, "kortelėje rodomas klaidos pranešimas").not.to.be
              .empty;
          });
        });
      addBtn(10).should(($btn) =>
        expect(norm($btn.text())).not.to.eq("Pridėta"),
      );
      expectRouteCount(10);
      openRouteTab();
      routeItems().should("have.length", 10);
      cy.get(`#route-item-${PLACES[10].id}`).should("not.exist");
    });

    it("TC-ECS86-06 [DT] Pakartotinis pridėjimas, kai sąrašas pilnas (AC3, AC6; EP2, EP4, R3)", () => {
      addPlaces(10);
      addBtn(0).should(haveExactText("Pridėta"));

      addBtn(0).click();

      expectRouteCount(10);
      openRouteTab();
      routeItems().should("have.length", 10);
      cy.get(`#route-item-${PLACES[0].id}`).should("exist");
    });
  },
);
