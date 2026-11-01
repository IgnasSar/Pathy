import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "../../packages/api/src/app.js";

// Tikri app.ts, geo.ts ir ors.ts moduliai. Pakeistos tik DB ir tinklo prieigos.
const places = [
  { id: "a", name: "A", coordinates: { lat: 0, lng: 0 } },
  { id: "b", name: "B", coordinates: { lat: 0, lng: 1 } },
];
vi.mock("../../packages/api/src/db/placesRepository.js", () => ({
  getPlacesByIds: vi.fn(async (ids: string[]) =>
    ids.map((id) => places.find((p) => p.id === id)),
  ),
}));
vi.mock("../../packages/api/src/db/savedRoutesRepository.js", () => ({}));

const fetchMock = vi.fn();
const request = { placeIds: ["a", "b"], transportType: "car" };
let app: ReturnType<typeof buildApp>;

beforeEach(() => {
  app = buildApp();
  app.log.level = "silent";
  vi.stubEnv("OPENROUTE_API_KEY", "");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue(new Response("unavailable", { status: 503 }));
});
afterEach(() => app.close());

describe("Maršruto peržiūros integracija", () => {
  it("validuoja užklausą, gauna vietas ir apskaičiuoja maršrutą", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/route-preview",
      payload: request,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      stops: [
        { order: 1, ...places[0] },
        { order: 2, ...places[1] },
      ],
      totals: { distanceKm: 111.2, durationMinutes: 95, transportType: "car" },
      path: [places[0].coordinates, places[1].coordinates],
      segments: [[places[0].coordinates, places[1].coordinates]],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("ORS nepasiekiant grįžta prie geografinio atstumo įverčio", async () => {
    vi.stubEnv("OPENROUTE_API_KEY", "test-key");
    const response = await app.inject({
      method: "POST",
      url: "/api/route-preview",
      payload: request,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.json().totals).toEqual({
      distanceKm: 111.2,
      durationMinutes: 95,
      transportType: "car",
    });
  });

  it("atmeta užklausą su pasikartojančiais objektais", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/route-preview",
      payload: { ...request, placeIds: ["a", "a"] },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Duplicate placeIds are not allowed.",
    });
  });
});
