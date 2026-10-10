import { FilterBar } from './FilterBar';
import { LangStoreProvider } from '../store/langStore';
import type { PlaceCategory, RadiusOptionKm } from '@pathy/shared';

describe('<FilterBar /> - [ECS-9] Vartotojo objektų filtravimas (atstumas)', () => {
  const defaultCategories: PlaceCategory[] = ['castle', 'museum', 'nature', 'viewpoint'];
  const defaultRadiusOptions: RadiusOptionKm[] = [5, 10, 25, 50, 100];

  const mountComponent = (props = {}) => {
    const onCategoryChangeSpy = cy.spy().as('onCategoryChangeSpy');
    const onRadiusChangeSpy = cy.spy().as('onRadiusChangeSpy');

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
      </LangStoreProvider>
    );

    return { onCategoryChangeSpy, onRadiusChangeSpy };
  };

  it('UI: Komponentas sėkmingai atvaizduoja kategorijas ir atstumo filtrus, kai lokacija žinoma', () => {
    mountComponent();

    // Kategorijų mygtukai
    cy.get('button#filter-cat-all').should('be.visible');
    cy.get('button#filter-cat-castle').should('be.visible');
    cy.get('button#filter-cat-museum').should('be.visible');

    // Atstumo mygtukai
    cy.get('button#filter-radius-all').should('be.visible');
    cy.get('button#filter-radius-5').should('be.visible');
    cy.get('button#filter-radius-10').should('be.visible');
  });

  it('TC-ECS9-01 [EP]: Patikrinti atstumo pasirinkimą iš pateiktų reikšmių (5 km, 10 km) (AC1, AC3)', () => {
    mountComponent();

    // Paspausti 5 km mygtuką
    cy.get('button#filter-radius-5').click();
    cy.get('@onRadiusChangeSpy').should('have.been.calledWith', 5);

    // Paspausti 10 km mygtuką
    cy.get('button#filter-radius-10').click();
    cy.get('@onRadiusChangeSpy').should('have.been.calledWith', 10);
  });

  it('TC-ECS9-02 [BVA]: Patikrinti minimalią leistiną sąrašo ribą (apatinė reikšmė 5 km) (AC1, AC5)', () => {
    mountComponent();

    // Pirmoji minimali reikšmė iš galimų pasirinkimų sąrašo
    cy.get('button#filter-radius-5').click();
    cy.get('@onRadiusChangeSpy').should('have.been.calledWith', 5);
  });

  it('TC-ECS9-03 [EP]: Patikrinti atstumo filtro atšaukimą pasirinkus "Visi" (AC1)', () => {
    mountComponent({ selectedRadius: 10 });

    cy.get('button#filter-radius-all').click();
    cy.get('@onRadiusChangeSpy').should('have.been.calledWith', null);
  });

  it('TC-ECS9-04 [BVA]: Patikrinti maksimalią leistiną sąrašo ribą (viršutinė reikšmė 100 km) (AC1, AC5)', () => {
    mountComponent();

    // Didžiausia leistina reikšmė iš radiusOptions sąrašo
    cy.get('button#filter-radius-100').click();
    cy.get('@onRadiusChangeSpy').should('have.been.calledWith', 100);
  });

  it('TC-ECS9-05 [DT]: Patikrinti pakartotinį pasirinkto atstumo paspaudimą (atžymėjimą)', () => {
    // Kai jau pasirinktas 10 km, paspaudus ant jo dar kartą, filtras išvalomas
    mountComponent({ selectedRadius: 10 });

    cy.get('button#filter-radius-10').click();
    cy.get('@onRadiusChangeSpy').should('have.been.calledWith', null);
  });

  it('TC-ECS9-06 [DT]: Patikrinti, kad atstumo pasirinkimai nerodomi, kai vartotojo lokacija nežinoma (hasLocation=false)', () => {
    mountComponent({ hasLocation: false });

    // Kategorijos turi būti matomos
    cy.get('button#filter-cat-all').should('be.visible');

    // Atstumo pasirinkimai neturi egzistuoti DOM'e
    cy.get('button#filter-radius-all').should('not.exist');
    cy.get('button#filter-radius-5').should('not.exist');
    cy.get('button#filter-radius-10').should('not.exist');
  });

  it('TC-ECS9-07 [EP]: Patikrinti aktyvaus atstumo mygtuko stiliaus būseną (active klasė)', () => {
    mountComponent({ selectedRadius: 25 });

    cy.get('button#filter-radius-25').should('have.class', 'active');
    cy.get('button#filter-radius-5').should('not.have.class', 'active');
    cy.get('button#filter-radius-all').should('not.have.class', 'active');
  });

  it('TC-ECS9-08 [DT]: Patikrinti filtro išvalymo mygtuką ("Išvalyti")', () => {
    mountComponent({ selectedCategory: 'castle', selectedRadius: 10 });

    // Turi matytis suvestinės eilutė ir mygtukas "Išvalyti"
    cy.contains('button', 'Išvalyti').should('be.visible').click();

    cy.get('@onCategoryChangeSpy').should('have.been.calledWith', null);
    cy.get('@onRadiusChangeSpy').should('have.been.calledWith', null);
  });

  it('TC-ECS9-09 [EP]: Patikrinti suvestinės tekstą, kai pasirinktas atstumo filtras', () => {
    mountComponent({ selectedRadius: 10 });

    cy.contains('<= 10 km').should('be.visible');
  });

  it('TC-ECS9-10 [EP]: Patikrinti kategorijos ir atstumo filtrų bendrą sąveiką', () => {
    mountComponent({ selectedCategory: 'castle', selectedRadius: 5 });

    // Abu turi turėti active klasę
    cy.get('button#filter-cat-castle').should('have.class', 'active');
    cy.get('button#filter-radius-5').should('have.class', 'active');
  });
});
