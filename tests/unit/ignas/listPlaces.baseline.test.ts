import { beforeEach, describe, expect, it, vi } from "vitest";
import { listPlaces } from "../../../packages/api/src/db/placesRepository.js";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../../../packages/api/src/db/client.js", () => ({ pool: { query } }));

const row = {
  id: "trakai",
  name: "Trakų pilis",
  category: "castle",
  short_description: "Pilis saloje",
  region: "Vilniaus",
  municipality: "Trakai",
  lat: 54.65,
  lng: 24.93,
  thumbnail_url: null,
  recommended_visit_minutes: 90,
};

beforeEach(() => {
  query.mockReset();
  // Pirma užklausa gauna vietas, antra – bendrą rezultatų skaičių.
  query.mockResolvedValueOnce({ rows: [row] });
  query.mockResolvedValueOnce({ rows: [{ count: "1" }] });
});

describe("listPlaces", () => {
  it("be filtrų naudoja numatytą limit ir offset, DB laukus paverčia į API rezultatą", async () => {
    const result = await listPlaces({});
    expect(query.mock.calls[0][1]).toEqual([24, 0]);
    expect(result).toEqual({
      items: [
        {
          id: "trakai",
          name: "Trakų pilis",
          category: "castle",
          shortDescription: "Pilis saloje",
          region: "Vilniaus",
          municipality: "Trakai",
          coordinates: { lat: 54.65, lng: 24.93 },
          thumbnailUrl: null,
          recommendedVisitMinutes: 90,
        },
      ],
      total: 1,
      limit: 24,
      offset: 0,
    });
  });

  it("paieškos tekstą perduoda kaip SQL parametrą", async () => {
    await listPlaces({ query: "pilis" });
    const [sql, values] = query.mock.calls[0];
    expect(sql).toContain("websearch_to_tsquery('lithuanian', $1)");
    expect(values).toEqual(["pilis", "%pilis%", 24, 0]);
  });

  it("tuščią paieškos tekstą ignoruoja", async () => {
    await listPlaces({ query: "" });
    expect(query.mock.calls[0][0]).not.toContain("ilike");
    expect(query.mock.calls[0][1]).toEqual([24, 0]);
  });

  it("sujungia kategorijos, regiono, potipio ir išskiriamos vietos filtrus", async () => {
    await listPlaces({
      category: "castle",
      region: "Vilniaus",
      sourceSubTypeName: "Pilys",
      excludeId: "x",
    });
    const [sql, values] = query.mock.calls[0];
    expect(sql).toContain(
      "p.category = $1 and p.region = $2 and p.source_sub_type_name = $3 and p.slug <> $4",
    );
    expect(values).toEqual(["castle", "Vilniaus", "Pilys", "x", 24, 0]);
  });

  it("su origin rikiuoja pagal atstumą, o spindulį paverčia į metrus", async () => {
    await listPlaces({ origin: { lat: 54.68, lng: 25.28 }, radiusKm: 10 });
    const [sql, values] = query.mock.calls[0];
    expect(sql).toContain("ST_DWithin");
    expect(sql).toContain("distance_km asc");
    expect(values).toEqual([25.28, 54.68, 10000, 24, 0]);
  });

  it("spindulio be origin nenaudoja", async () => {
    await listPlaces({ radiusKm: 10 });
    expect(query.mock.calls[0][0]).not.toContain("ST_DWithin");
  });

  it("limit ir offset nupjauna iki sveikųjų ir jų neperduoda count užklausai", async () => {
    const result = await listPlaces({ limit: 5.9, offset: 10.2 });
    expect(result).toMatchObject({ limit: 5, offset: 10 });
    expect(query.mock.calls[0][1]).toEqual([5, 10]);
    expect(query.mock.calls[1][1]).toEqual([]);
  });
});
