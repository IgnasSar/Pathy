import { FilterBar } from "../../components/FilterBar";
import { LangStoreProvider } from "../../store/langStore";
import type { PlaceCategory, RadiusOptionKm } from "@pathy/shared";

describe("[ECS-9] Vartotojo objektų filtravimas (atstumas)", () => {
  const defaultCategories: PlaceCategory[] = [
    "castle",
    "museum",
    "nature",
    "viewpoint",
  ];
  const defaultRadiusOptions: RadiusOptionKm[] = [5, 10, 25, 50, 100];

  const mountComponent = (props = {}) => {
    const onCategoryChangeSpy = cy.spy().as("onCategoryChangeSpy");
    const onRadiusChangeSpy = cy.spy().as("onRadiusChangeSpy");

    cy.mount(
      <LangStoreProvider>
        <FilterBar
          categories={defaultCategories}
          radiusOptions={defaultRadiusOptions}
          selectedCategory={null}
          selectedRadius={null}
          hasLocation={true}
          onCategoryChange={onCategoryChangeSpy}
          onRadiusChange={onRadiusChangeSpy}
          {...props}
        />
      </LangStoreProvider>,
    );

    return { onCategoryChangeSpy, onRadiusChangeSpy };
  };

  it("TC-ECS9-01 [EP]: Patikrinti greitąjį atstumo pasirinkimą (1 km, 5 km, 10 km) (AC1, AC3)", () => {
    mountComponent();

    // Reikalavimas: turi būti greitojo pasirinkimo mygtukai (1 km, 5 km, 10 km)
    cy.get("button#filter-radius-1", { timeout: 1000 }).should("exist");
    cy.get("button#filter-radius-5").click();

    // Reikalavimas: paspaudus atstumą, filtravimas įvykdomas paspaudus mygtuką „Filtruoti“
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("have.been.calledWith", 5);
  });

  it("TC-ECS9-02 [BVA]: Patikrinti minimalią leistiną ribą (Min = 1 km) (AC1, AC3, AC5)", () => {
    mountComponent();

    // Reikalavimas: įvesti reikšmę „1“ į rankinės įvesties lauką ir spausti „Filtruoti“
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("1");
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("have.been.calledWith", 1);
  });

  it("TC-ECS9-03 [BVA]: Patikrinti reikšmę žemiau minimumo (0 km) (AC5, AC6)", () => {
    mountComponent();

    // Reikalavimas: įvesti reikšmę „0“ ir spausti „Filtruoti“ -> Filtravimas nevykdomas, rodomas klaidos pranešimas
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("0");
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("not.have.been.called");
    cy.contains("Klaida: atstumas turi būti bent 1 km", { timeout: 1000 }).should(
      "be.visible",
    );
  });

  it("TC-ECS9-04 [BVA]: Patikrinti maksimalią leistiną ribą (Max = 300 km) (AC1, AC3, AC5)", () => {
    mountComponent();

    // Reikalavimas: įvesti reikšmę „300“ ir spausti „Filtruoti“ -> Filtravimas atliekamas sėkmingai 300 km spinduliu
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("300");
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("have.been.calledWith", 300);
  });

  it("TC-ECS9-05 [BVA]: Patikrinti reikšmę virš leistino maksimumo (301 km) (AC5, AC6)", () => {
    mountComponent();

    // Reikalavimas: įvesti reikšmę „301“ ir spausti „Filtruoti“ -> Filtravimas nevykdomas, rodomas klaidos pranešimas
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("301");
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("not.have.been.called");
    cy.contains("Klaida: atstumas negali viršyti 300 km", { timeout: 1000 }).should(
      "be.visible",
    );
  });

  it("TC-ECS9-06 [EP]: Patikrinti neigiamo skaičiaus įvedimą (AC5, AC6)", () => {
    mountComponent();

    // Reikalavimas: įvesties lauke įvesti „-10“ ir spausti „Filtruoti“ -> Filtravimas nevykdomas, rodomas klaidos pranešimas
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("-10");
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("not.have.been.called");
    cy.contains("Klaida: neigiamas atstumas negalimas", { timeout: 1000 }).should(
      "be.visible",
    );
  });

  it("TC-ECS9-07 [EP]: Patikrinti teksto įvedimą į atstumo lauką (AC5, AC6)", () => {
    mountComponent();

    // Reikalavimas: įvesties lauke įvesti „vilnius“ ir spausti „Filtruoti“ -> Neleidžiama įvesti raidžių arba rodomas klaidos pranešimas
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("vilnius");
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("not.have.been.called");
    cy.contains("Klaida: įveskite skaičių", { timeout: 1000 }).should(
      "be.visible",
    );
  });

  it("TC-ECS9-08 [DT]: Patikrinti, kad pakeitus reikšmę filtravimas neįvyksta be mygtuko paspaudimo (AC2)", () => {
    mountComponent();

    // Reikalavimas: įvesti „50“, bet nespausti mygtuko „Filtruoti“ -> Rezultatai nepersikrauna
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("50");
    cy.get("@onRadiusChangeSpy").should("not.have.been.called");
  });

  it("TC-ECS9-09 [DT]: Patikrinti pakartotinį filtravimą paspaudus mygtuką (AC2, AC3)", () => {
    mountComponent();

    // Reikalavimas: pakeista atstumo reikšmė į „50“. Paspausti mygtuką „Filtruoti“ -> filtravimas atliekamas
    cy.get("input#custom-distance-input", { timeout: 1000 })
      .should("be.visible")
      .type("50");
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.get("@onRadiusChangeSpy").should("have.been.calledWith", 50);
  });

  it("TC-ECS9-10 [EP]: Patikrinti elgseną, kai nurodytame spindulyje objektų nėra (AC4)", () => {
    mountComponent();

    // Reikalavimas: pasirinkti 1 km ir spausti „Filtruoti“ -> Sąrašas tuščias, rodomas pranešimas, kad objektų nerasta
    cy.get("button#filter-radius-1", { timeout: 1000 }).should("exist").click();
    cy.contains("button", "Filtruoti", { timeout: 1000 }).click();
    cy.contains("Objektų nerasta", { timeout: 1000 }).should("be.visible");
  });
});
