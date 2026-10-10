import type { PlaceSummary, PlacesResponse } from '@pathy/shared';
import { SearchView } from './SearchView';
import { LangStoreProvider } from '../store/langStore';
import { RouteStoreProvider } from '../store/routeStore';

const makePlace = (id: string, name: string): PlaceSummary => ({
  id,
  name,
  category: 'landmark',
  shortDescription: `${name} aprašymas`,
  region: 'Vilniaus apskritis',
  municipality: 'Vilniaus m. sav.',
  coordinates: { lat: 54.68, lng: 25.28 },
  thumbnailUrl: null,
  recommendedVisitMinutes: 60,
});

const DB: PlaceSummary[] = [
  makePlace('1', 'Trakų pilis'),
  makePlace('2', 'Vilniaus katedra'),
  makePlace('3', 'Kauno arkikatedra bazilika'),
  makePlace('4', 'Gedimino pilis'),
  makePlace('5', 'Aukštaitijos nacionalinis parkas'),
  makePlace('6', 'Kryžių kalnas'),
];

describe('[ECS-87] Vartotojo objektų paieška pagal pavadinimą', () => {
  beforeEach(() => {
    localStorage.setItem('pathy_language', 'LT');
    sessionStorage.clear();

    cy.intercept('GET', '/api/filters', {
      statusCode: 200,
      body: { categories: [], regions: [], transportTypes: [], radiusOptionsKm: [] },
    }).as('filters');

    cy.intercept('GET', '/api/places*', (req) => {
      const query = typeof req.query.query === 'string' ? req.query.query : '';
      const items = query
        ? DB.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
        : DB;
      const body: PlacesResponse = { items, total: items.length, limit: 24, offset: 0 };
      req.reply({ statusCode: 200, body });
    }).as('places');

    cy.mount(
      <LangStoreProvider>
        <RouteStoreProvider>
          <SearchView />
        </RouteStoreProvider>
      </LangStoreProvider>,
    );

    cy.wait('@places');
  });

  const search = (text: string) => {
    cy.get('input#search-input').clear().type(text);
    cy.wait('@places').its('request.query.query').should('eq', text);
  };

  it('TC-01 [EP]: Paieška įvedus pilną, tikslų objekto pavadinimą (AC1, AC3)', () => {
    search('Trakų pilis');

    cy.get('article[id^="place-card-"]').should('have.length.at.least', 1);
    cy.get('article[id^="place-card-"]').contains('h3', 'Trakų pilis').should('be.visible');
  });

  it('TC-02 [EP]: Paieška pagal dalinį objekto pavadinimą (AC1, AC3)', () => {
    search('kated');

    cy.get('article[id^="place-card-"] h3').should('have.length', 2);
    cy.get('article[id^="place-card-"] h3').each(($h3) => {
      expect($h3.text().toLowerCase()).to.contain('kated');
    });
    cy.contains('h3', 'Vilniaus katedra').should('be.visible');
  });

  it('TC-03 [EP]: Paieška nejautri raidžių registrui (AC4)', () => {
    search('gEdiMinO PiLiS');

    cy.get('article[id^="place-card-"] h3').should('have.length', 1);
    cy.contains('h3', 'Gedimino pilis').should('be.visible');
  });

  it("TC-04 [DT]: Nerasta objektų – rodomas pranešimas „Vietų nerasta“ (AC5)", () => {
    search("Xyzqwerty");

    cy.get('article[id^="place-card-"]').should("not.exist");
    cy.contains("Vietų nerasta").should("be.visible");
  });

  it('TC-05 [BVA]: Tuščias paieškos laukelis (0 simbolių) – rodomas pradinis sąrašas (AC2)', () => {
    search('Trakų');
    cy.get('article[id^="place-card-"]').should('have.length', 1);

    cy.get('input#search-input').clear().should('have.value', '');

    cy.wait('@places').its('request.query').should('not.have.property', 'query');
    cy.get('article[id^="place-card-"]').should('have.length', DB.length);
  });

  it('TC-06 [BVA]: Paieška su minimaliu simbolių kiekiu – 1 simbolis (AC1, AC3)', () => {
    search('A');

    const expected = DB.filter((p) => p.name.toLowerCase().includes('a'));
    cy.get('article[id^="place-card-"] h3').should('have.length', expected.length);
    cy.get('article[id^="place-card-"] h3').each(($h3) => {
      expect($h3.text().toLowerCase()).to.contain('a');
    });
  });
});
