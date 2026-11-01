import { beforeEach, describe, expect, it, vi } from "vitest";
import { listPlaces } from "../../../packages/api/src/db/placesRepository.js";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../../../packages/api/src/db/client.js", () => ({ pool: { query } }));

const row = {
  id: "pilis",
  name: "Pilis",
  category: "castle",
  short_description: "Aprašymas",
  region: "Vilniaus",
  municipality: "Trakai",
  lat: 54.65,
  lng: 24.93,
  thumbnail_url: null,
  recommended_visit_minutes: 60,
};

beforeEach(() => {
  query.mockReset();
  query.mockResolvedValueOnce({ rows: [row] });
  query.mockResolvedValueOnce({ rows: [{ count: "1" }] });
});

describe("listPlaces – DKM", () => {
  it("naudoja numatytą puslapiavimą ir konvertuoja DB duomenis", async () => {
    const result = await listPlaces({});
    expect(query.mock.calls[0][1]).toEqual([24, 0]);
    expect(result).toMatchObject({
      total: 1,
      limit: 24,
      offset: 0,
      items: [
        {
          id: "pilis",
          shortDescription: "Aprašymas",
          coordinates: { lat: 54.65, lng: 24.93 },
        },
      ],
    });
  });

  it("paieškai perduoda tekstą ir LIKE šabloną", async () => {
    await listPlaces({ query: "pilis" });
    expect(query.mock.calls[0][1]).toEqual(["pilis", "%pilis%", 24, 0]);
    expect(query.mock.calls[0][0]).toContain("websearch_to_tsquery");
  });

  it("sujungia kategorijos, regiono, potipio ir excludeId filtrus", async () => {
    await listPlaces({
      category: "castle",
      region: "Vilniaus",
      sourceSubTypeName: "Pilys",
      excludeId: "x",
    });
    expect(query.mock.calls[0][1]).toEqual([
      "castle",
      "Vilniaus",
      "Pilys",
      "x",
      24,
      0,
    ]);
    expect(query.mock.calls[0][0]).toContain("p.slug <> $4");
  });

  it("su origin taiko spindulį metrais ir rikiuoja pagal atstumą", async () => {
    await listPlaces({ origin: { lat: 54, lng: 25 }, radiusKm: 5 });
    expect(query.mock.calls[0][1]).toEqual([25, 54, 5000, 24, 0]);
    expect(query.mock.calls[0][0]).toContain("ST_DWithin");
    expect(query.mock.calls[0][0]).toContain("distance_km asc");
  });

  it("be origin spindulio netaiko", async () => {
    await listPlaces({ radiusKm: 5 });
    expect(query.mock.calls[0][0]).not.toContain("ST_DWithin");
  });

  it("nupjauna puslapiavimo trupmeninę dalį ir jos nenaudoja count užklausoje", async () => {
    const result = await listPlaces({ limit: 3.9, offset: 2.1 });
    expect(result).toMatchObject({ limit: 3, offset: 2 });
    expect(query.mock.calls[0][1]).toEqual([3, 2]);
    expect(query.mock.calls[1][1]).toEqual([]);
  });
});
