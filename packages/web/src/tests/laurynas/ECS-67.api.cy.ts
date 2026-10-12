// Reikia veikiančio API (pnpm dev:api) su DATABASE_URL. Adresą galima pakeisti: --expose API_URL=...
const API: string = Cypress.expose("API_URL") ?? "http://localhost:3001";

interface Dataset {
  label: string;
  n: number;
  transportType: string;
  covers: string;
}

describe("[ECS-67] Maršruto generavimo sąlygų validavimas – serverio pusė (POST /api/route-preview)", () => {
  let ids: string[] = [];

  before(() => {
    cy.request(`${API}/api/places?limit=11&offset=300`).then((res) => {
      ids = res.body.items.map((p: { id: string }) => p.id);
      expect(ids, "galiojantys objektų ID").to.have.length(11);
    });
  });

  const postRoute = (ds: Dataset) =>
    cy.request({
      method: "POST",
      url: `${API}/api/route-preview`,
      body: { placeIds: ids.slice(0, ds.n), transportType: ds.transportType },
      failOnStatusCode: false,
    });

  const rejected: Dataset[] = [
    { label: "a) 1 ID + car", n: 1, transportType: "car", covers: "BV1, EP2" },
    {
      label: "b) 11 ID + car",
      n: 11,
      transportType: "car",
      covers: "BV6, EP3",
    },
    { label: "c) 2 ID + plane", n: 2, transportType: "plane", covers: "EP6" },
  ];
  rejected.forEach((ds) => {
    it(`TC-ECS67-07 [EP, BVA] Serveris atmeta užklausą: ${ds.label} (AC6; ${ds.covers})`, () => {
      postRoute(ds).then((res) => {
        cy.log(`HTTP ${res.status}: ${JSON.stringify(res.body).slice(0, 200)}`);
        expect(res.status, "užklausa atmesta (4xx)").to.be.within(400, 499);
        expect(res.body, "klaidos pranešimas")
          .to.have.property("error")
          .that.is.a("string")
          .with.length.above(0);
        expect(res.body, "maršrutas negrąžinamas").not.to.have.property(
          "stops",
        );
      });
    });
  });

  const accepted: Dataset[] = [
    {
      label: "a) 2 ID + car",
      n: 2,
      transportType: "car",
      covers: "BV2, EP1, EP4",
    },
    {
      label: "b) 10 ID + walk",
      n: 10,
      transportType: "walk",
      covers: "BV5, EP1, EP4",
    },
  ];
  accepted.forEach((ds) => {
    it(`TC-ECS67-08 [BVA] Serveris priima užklausą ties riba: ${ds.label} (AC6, AC7; ${ds.covers})`, () => {
      postRoute(ds).then((res) => {
        cy.log(`HTTP ${res.status}: totals ${JSON.stringify(res.body.totals)}`);
        expect(res.status, "užklausa priimta").to.eq(200);
        expect(res.body.stops, "maršruto stotelės").to.have.length(ds.n);
        expect(res.body.totals.transportType).to.eq(ds.transportType);
      });
    });
  });
});
