import { RouteView } from './RouteView';
import { RouteStoreProvider } from '../store/routeStore';
import { LangStoreProvider } from '../store/langStore';
import { api } from '../api/client';
import type { PlaceSummary, RoutePreviewResponse } from '@pathy/shared';

describe('<RouteView /> - [ECS-12] Maršruto sudarymas pagal objektus ir transportą', () => {
  const SESSION_KEY = 'pathy_route_places_v2';

  const mockPlaces: PlaceSummary[] = [
    {
      id: 'place-1',
      name: 'Gedimino pilies bokštas',
      category: 'castle',
      shortDescription: 'Istorinis bokštas Vilniuje',
      region: 'Vilniaus',
      municipality: 'Vilnius',
      coordinates: { lat: 54.6866, lng: 25.2904 },
      thumbnailUrl: null,
      recommendedVisitMinutes: 60,
    },
    {
      id: 'place-2',
      name: 'Trakų salos pilis',
      category: 'castle',
      shortDescription: 'Pilis Galvės ežero saloje',
      region: 'Vilniaus',
      municipality: 'Trakai',
      coordinates: { lat: 54.6524, lng: 24.9335 },
      thumbnailUrl: null,
      recommendedVisitMinutes: 90,
    },
    {
      id: 'place-3',
      name: 'Kernavės piliakalniai',
      category: 'archaeology',
      shortDescription: 'Valstybinis kultūrinis rezervatas',
      region: 'Vilniaus',
      municipality: 'Širvintos',
      coordinates: { lat: 54.8828, lng: 24.8519 },
      thumbnailUrl: null,
      recommendedVisitMinutes: 75,
    },
  ];

  const mockRouteCar: RoutePreviewResponse = {
    stops: [
      { order: 1, id: 'place-1', name: 'Gedimino pilies bokštas', coordinates: { lat: 54.6866, lng: 25.2904 } },
      { order: 2, id: 'place-2', name: 'Trakų salos pilis', coordinates: { lat: 54.6524, lng: 24.9335 } },
    ],
    totals: {
      distanceKm: 28.5,
      durationMinutes: 35,
      transportType: 'car',
    },
    path: [
      { lat: 54.6866, lng: 25.2904 },
      { lat: 54.6524, lng: 24.9335 },
    ],
    segments: [
      [
        { lat: 54.6866, lng: 25.2904 },
        { lat: 54.6524, lng: 24.9335 },
      ],
    ],
  };

  const mockRouteBike: RoutePreviewResponse = {
    stops: [
      { order: 1, id: 'place-1', name: 'Gedimino pilies bokštas', coordinates: { lat: 54.6866, lng: 25.2904 } },
      { order: 2, id: 'place-2', name: 'Trakų salos pilis', coordinates: { lat: 54.6524, lng: 24.9335 } },
    ],
    totals: {
      distanceKm: 31.0,
      durationMinutes: 95,
      transportType: 'bike',
    },
    path: [
      { lat: 54.6866, lng: 25.2904 },
      { lat: 54.6524, lng: 24.9335 },
    ],
    segments: [
      [
        { lat: 54.6866, lng: 25.2904 },
        { lat: 54.6524, lng: 24.9335 },
      ],
    ],
  };

  const mockRouteWalk: RoutePreviewResponse = {
    stops: [
      { order: 1, id: 'place-1', name: 'Gedimino pilies bokštas', coordinates: { lat: 54.6866, lng: 25.2904 } },
      { order: 2, id: 'place-2', name: 'Trakų salos pilis', coordinates: { lat: 54.6524, lng: 24.9335 } },
    ],
    totals: {
      distanceKm: 27.2,
      durationMinutes: 340,
      transportType: 'walk',
    },
    path: [
      { lat: 54.6866, lng: 25.2904 },
      { lat: 54.6524, lng: 24.9335 },
    ],
    segments: [
      [
        { lat: 54.6866, lng: 25.2904 },
        { lat: 54.6524, lng: 24.9335 },
      ],
    ],
  };

  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('_leaflet_pos') || err.message.includes('invalidateSize')) {
        return false;
      }
    });
  });

  const mountComponent = (initialPlaces: PlaceSummary[] = []) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(initialPlaces));

    cy.mount(
      <LangStoreProvider>
        <RouteStoreProvider>
          <RouteView />
        </RouteStoreProvider>
      </LangStoreProvider>
    );
  };

  it('UI: Rodo tuščio maršruto pranešimą, kai nėra pasirinktų vietų (0 vietų)', () => {
    mountComponent([]);

    cy.contains('Maršrutas tuščias').should('be.visible');
    cy.contains('Eikite į paiešką').should('be.visible');
  });

  it('TC-ECS12-01 [BVA]: Patikrinti maršruto sudarymą su minimaliu objektų kiekiu (2 objektai) (AC1, AC3)', () => {
    cy.stub(api, 'routePreview').resolves(mockRouteCar).as('routePreviewStub');

    mountComponent(mockPlaces.slice(0, 2));

    // Pasirinkti automobilį
    cy.get('button#transport-car').click();

    // Generuoti maršrutą
    cy.get('button#generate-route-btn').click();

    cy.get('@routePreviewStub').should('have.been.calledWith', {
      placeIds: ['place-1', 'place-2'],
      transportType: 'car',
    });

    // Patikrinti, kad persijungė į žemėlapio rodinį ir pateikia atstumą
    cy.contains('28.5 km').should('be.visible');
  });

  it('TC-ECS12-02 [BVA]: Patikrinti sąrašo elgseną su 1 objektu (AC1, AC7)', () => {
    mountComponent(mockPlaces.slice(0, 1));

    // Rodo 1 vietą sąraše
    cy.get('#route-item-place-1').should('be.visible');
    cy.contains('1 / 10').should('be.visible');

    // Transporto pasirinkimas ir generavimo mygtukas nėra rodomi, nes vietų mažiau nei 2
    cy.get('button#generate-route-btn').should('not.exist');
    cy.get('button#transport-car').should('not.exist');
  });

  it('TC-ECS12-03 [EP]: Patikrinti maršruto sudarymą su keliais objektais (>2, pvz. 3 objektai) (AC1, AC3)', () => {
    const mockRoute3: RoutePreviewResponse = {
      stops: [
        { order: 1, id: 'place-1', name: 'Gedimino pilies bokštas', coordinates: { lat: 54.6866, lng: 25.2904 } },
        { order: 2, id: 'place-2', name: 'Trakų salos pilis', coordinates: { lat: 54.6524, lng: 24.9335 } },
        { order: 3, id: 'place-3', name: 'Kernavės piliakalniai', coordinates: { lat: 54.8828, lng: 24.8519 } },
      ],
      totals: { distanceKm: 65.4, durationMinutes: 75, transportType: 'car' },
      path: [{ lat: 54.6866, lng: 25.2904 }, { lat: 54.6524, lng: 24.9335 }, { lat: 54.8828, lng: 24.8519 }],
      segments: [],
    };

    cy.stub(api, 'routePreview').resolves(mockRoute3).as('routePreviewStub');

    mountComponent(mockPlaces);

    cy.get('button#transport-car').click();
    cy.get('button#generate-route-btn').click();

    cy.get('@routePreviewStub').should('have.been.calledWith', {
      placeIds: ['place-1', 'place-2', 'place-3'],
      transportType: 'car',
    });

    cy.contains('65.4 km').should('be.visible');
  });

  it('TC-ECS12-04 [EP]: Patikrinti maršruto sudarymą automobiliu (AC2, AC3)', () => {
    cy.stub(api, 'routePreview').resolves(mockRouteCar).as('routePreviewStub');

    mountComponent(mockPlaces.slice(0, 2));

    cy.get('button#transport-car').click();
    cy.get('button#generate-route-btn').click();

    cy.get('@routePreviewStub').should('have.been.calledWithMatch', {
      transportType: 'car',
    });
  });

  it('TC-ECS12-05 [EP]: Patikrinti maršruto sudarymą dviračiu (AC2, AC3)', () => {
    cy.stub(api, 'routePreview').resolves(mockRouteBike).as('routePreviewStub');

    mountComponent(mockPlaces.slice(0, 2));

    cy.get('button#transport-bike').click();
    cy.get('button#generate-route-btn').click();

    cy.get('@routePreviewStub').should('have.been.calledWithMatch', {
      transportType: 'bike',
    });

    cy.contains('31 km').should('be.visible');
  });

  it('TC-ECS12-06 [EP]: Patikrinti maršruto sudarymą pėsčiomis (AC2, AC3)', () => {
    cy.stub(api, 'routePreview').resolves(mockRouteWalk).as('routePreviewStub');

    mountComponent(mockPlaces.slice(0, 2));

    cy.get('button#transport-walk').click();
    cy.get('button#generate-route-btn').click();

    cy.get('@routePreviewStub').should('have.been.calledWithMatch', {
      transportType: 'walk',
    });

    cy.contains('27.2 km').should('be.visible');
  });

  it('TC-ECS12-07 [EP]: Patikrinti maršruto atvaizdavimą žemėlapyje ir rodinių perjungimą (AC4)', () => {
    cy.stub(api, 'routePreview').resolves(mockRouteCar);

    mountComponent(mockPlaces.slice(0, 2));

    cy.get('button#transport-car').click();
    cy.get('button#generate-route-btn').click();

    // Po generavimo automatiškai rodomas žemėlapis
    cy.get('button#route-view-map').should('have.css', 'color', 'rgb(52, 199, 89)');

    // Galima grįžti į sąrašo rodinį
    cy.get('button#route-view-list').click();
    cy.get('#route-item-place-1').should('be.visible');
  });

  it('TC-ECS12-08 [EP]: Patikrinti bendro atstumo ir trukmės pateikimą UI (AC5)', () => {
    cy.stub(api, 'routePreview').resolves(mockRouteCar);

    mountComponent(mockPlaces.slice(0, 2));

    cy.get('button#transport-car').click();
    cy.get('button#generate-route-btn').click();

    // Atstumas ir trukmė turi būti aiškiai atvaizduojami
    cy.contains('Atstumas').should('be.visible');
    cy.contains('28.5 km').should('be.visible');
    cy.contains('Trukmė').should('be.visible');
    cy.contains('35min').should('be.visible');
  });

  it('TC-ECS12-09 [DT]: Patikrinti maršruto perskaičiavimą pakeitus transporto priemonę (AC6)', () => {
    const routeStub = cy.stub(api, 'routePreview');
    routeStub.onFirstCall().resolves(mockRouteCar);
    routeStub.onSecondCall().resolves(mockRouteBike);

    mountComponent(mockPlaces.slice(0, 2));

    // Pirmas skaičiavimas automobiliu
    cy.get('button#transport-car').click();
    cy.get('button#generate-route-btn').click();
    cy.contains('28.5 km').should('be.visible');

    // Keičiame transportą į dviratį
    cy.get('button#transport-bike').click();
    cy.get('button#generate-route-btn').click();
    cy.contains('31 km').should('be.visible');
  });

  it('TC-ECS12-10 [DT]: Patikrinti elgseną, kai nepasirinkta jokia transporto priemonė (AC8)', () => {
    mountComponent(mockPlaces.slice(0, 2));

    // Parodoma instrukcija pasirinkti transportą
    cy.contains('Pasirinkite transporto priemonę').should('be.visible');

    // Generavimo mygtukas yra neaktyvus (disabled)
    cy.get('button#generate-route-btn').should('be.disabled');
  });

  it('TC-ECS12-11 [EP]: Patikrinti sistemos elgseną nutrūkus ryšiui su maršruto API (AC9)', () => {
    cy.stub(api, 'routePreview').rejects(new Error('Tinklo klaida: maršruto API nepasiekiamas'));

    mountComponent(mockPlaces.slice(0, 2));

    cy.get('button#transport-car').click();
    cy.get('button#generate-route-btn').click();

    // Turi būti atvaizduotas klaidos pranešimas
    cy.contains('Tinklo klaida: maršruto API nepasiekiamas').should('be.visible');

    // Atstumo blokas neturi būti rodomas
    cy.contains('Atstumas').should('not.exist');
  });

  it('Papildomas testas: Patikrinti vietos pašalinimą ir maršruto išvalymą', () => {
    mountComponent(mockPlaces.slice(0, 2));

    // Pašalinti vieną vietą
    cy.get('#remove-route-place-1').click();
    cy.get('#route-item-place-1').should('not.exist');
    cy.get('#route-item-place-2').should('be.visible');

    // Išvalyti viską
    cy.get('button#clear-route-btn').click();
    cy.contains('Maršrutas tuščias').should('be.visible');
  });
});
