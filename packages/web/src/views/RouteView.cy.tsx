import type { PlaceSummary, PlacesResponse } from '@pathy/shared';
import { RouteView } from './RouteView';
import { SearchView } from './SearchView';
import { PlaceCard } from '../components/PlaceCard';
import { LangStoreProvider } from '../store/langStore';
import { RouteStoreProvider } from '../store/routeStore';

const SESSION_KEY = 'pathy_route_places_v2';

const makePlace = (id: string, name: string, lat = 54.68, lng = 25.28): PlaceSummary => ({
  id,
  name,
  category: 'landmark',
  shortDescription: `${name} aprašymas`,
  region: 'Vilniaus apskritis',
  municipality: 'Vilniaus m. sav.',
  coordinates: { lat, lng },
  thumbnailUrl: null,
  recommendedVisitMinutes: 60,
});

const PLACE_A = makePlace('a', 'Objektas A', 54.68, 25.28);
const PLACE_B = makePlace('b', 'Objektas B', 54.9, 23.9);
const PLACE_C = makePlace('c', 'Objektas C', 55.7, 21.1);

const TEN_PLACES = Array.from({ length: 10 }, (_, i) =>
  makePlace(`p${i + 1}`, `Objektas ${i + 1}`, 54 + i * 0.1, 23 + i * 0.1),
);

const seedRoute = (places: PlaceSummary[]) => {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(places));
};

const routeItems = () => cy.get('[id^="route-item-"]');
const counter = () => cy.contains('p', '/ 10');

const markNoReload = () =>
  cy.window().then((win) => {
    (win as unknown as { __noReload?: boolean }).__noReload = true;
  });

const assertNoReload = () =>
  cy.window().its('__noReload').should('eq', true);

const mountRoute = () =>
  cy.mount(
    <LangStoreProvider>
      <RouteStoreProvider>
        <RouteView />
      </RouteStoreProvider>
    </LangStoreProvider>,
  );

describe('[ECS-98] Pasirinktų objektų sąrašo peržiūra', () => {
  beforeEach(() => {
    localStorage.setItem('pathy_language', 'LT');
    sessionStorage.clear();
  });

  it('TC-01 [BVA]: Tuščias sąrašas (0 objektų) (AC1, AC4, AC5)', () => {
    mountRoute();

    routeItems().should('have.length', 0);
    cy.contains('0 / 10').should('be.visible');
    cy.contains('Maršrutas tuščias').should('be.visible');
    cy.contains('Paieškoje pasirinkite vietas ir jos atsiras čia. Galite pridėti iki 10 vietų.').should(
      'be.visible',
    );
  });

  it('TC-02 [BVA]: Sąrašas su 1 objektu (minimali riba) (AC1, AC2, AC4)', () => {
    seedRoute([PLACE_A]);
    mountRoute();

    routeItems().should('have.length', 1);
    routeItems().first().should('contain.text', 'Objektas A').and('be.visible');
    counter().invoke('text').should('match', /^\s*1\s*\/\s*10/);
  });

  it('TC-03 [BVA]: Sąrašas su 10 objektų (maksimali riba) (AC1, AC2, AC4)', () => {
    seedRoute(TEN_PLACES);
    mountRoute();

    routeItems().should('have.length', 10);
    TEN_PLACES.forEach((place) => {
      cy.get(`#route-item-${place.id}`).should('contain.text', place.name);
    });
    counter().invoke('text').should('match', /^\s*10\s*\/\s*10/);
  });

  it('TC-04 [State]: Numatytasis rikiavimas pagal pridėjimo laiką (AC3)', () => {
    cy.mount(
      <LangStoreProvider>
        <RouteStoreProvider>
          <PlaceCard place={PLACE_A} />
          <PlaceCard place={PLACE_B} />
          <RouteView />
        </RouteStoreProvider>
      </LangStoreProvider>,
    );

    cy.get(`#add-to-route-${PLACE_A.id}`).click();
    cy.get(`#add-to-route-${PLACE_B.id}`).click();

    routeItems().should('have.length', 2);
    routeItems().eq(0).should('contain.text', 'Objektas A');
    routeItems().eq(1).should('contain.text', 'Objektas B');
  });

  it('TC-ECS98-05 [UC/DT]: „Drag-and-drop“ – C nutempiamas virš A (AC3)', () => {
    seedRoute([PLACE_A, PLACE_B, PLACE_C]);
    mountRoute();

    routeItems().should('have.length', 3);

    const dataTransfer = new DataTransfer();
    cy.get(`#route-item-${PLACE_C.id}`)
      .should('have.attr', 'draggable', 'true')
      .trigger('dragstart', { dataTransfer });
    cy.get(`#route-item-${PLACE_A.id}`)
      .trigger('dragenter', { dataTransfer })
      .trigger('dragover', { dataTransfer })
      .trigger('drop', { dataTransfer });
    cy.get(`#route-item-${PLACE_C.id}`).trigger('dragend', { dataTransfer });

    routeItems().eq(0).should('contain.text', 'Objektas C');
    routeItems().eq(1).should('contain.text', 'Objektas A');
    routeItems().eq(2).should('contain.text', 'Objektas B');
  });

  it('TC-06 [DT]: Dinaminis atsinaujinimas pridėjus objektą (AC6)', () => {
    const NEW_PLACE = makePlace('new', 'Trakų pilis', 54.65, 24.93);

    cy.intercept('GET', '/api/filters', {
      statusCode: 200,
      body: { categories: [], regions: [], transportTypes: [], radiusOptionsKm: [] },
    });
    cy.intercept('GET', '/api/places*', (req) => {
      const query = typeof req.query.query === 'string' ? req.query.query : '';
      const items = query && 'trakų pilis'.includes(query.toLowerCase()) ? [NEW_PLACE] : [];
      const body: PlacesResponse = { items, total: items.length, limit: 24, offset: 0 };
      req.reply({ statusCode: 200, body });
    }).as('places');

    seedRoute([PLACE_A]);
    cy.mount(
      <LangStoreProvider>
        <RouteStoreProvider>
          <RouteView />
          <SearchView />
        </RouteStoreProvider>
      </LangStoreProvider>,
    );

    routeItems().should('have.length', 1);
    counter().invoke('text').should('match', /^\s*1\s*\/\s*10/);
    markNoReload();

    cy.wait('@places');
    cy.get('input#search-input').type('Trakų');
    cy.wait('@places');
    cy.get(`#add-to-route-${NEW_PLACE.id}`).click();

    routeItems().should('have.length', 2);
    cy.get(`#route-item-${NEW_PLACE.id}`).should('contain.text', 'Trakų pilis');
    counter().invoke('text').should('match', /^\s*2\s*\/\s*10/);
    assertNoReload();
  });

  it('TC-07 [DT]: Dinaminis atsinaujinimas pašalinus objektą (AC6)', () => {
    seedRoute([PLACE_A, PLACE_B]);
    mountRoute();

    routeItems().should('have.length', 2);
    markNoReload();

    cy.get(`#remove-route-${PLACE_B.id}`).click();

    cy.get(`#route-item-${PLACE_B.id}`).should('not.exist');
    routeItems().should('have.length', 1);
    counter().invoke('text').should('match', /^\s*1\s*\/\s*10/);
    assertNoReload();
  });
});
