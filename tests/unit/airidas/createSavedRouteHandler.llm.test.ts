import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "../../../packages/api/src/app.js";
import { createSavedRoute } from "../../../packages/api/src/db/savedRoutesRepository.js";

vi.mock("../../../packages/api/src/db/placesRepository.js", () => ({}));
vi.mock("../../../packages/api/src/db/savedRoutesRepository.js", () => ({
  createSavedRoute: vi.fn(),
}));

const request = {
  deviceId: "dev",
  name: "Kelionė",
  placeIds: ["a", "b"],
  transportType: "bike",
};
const saved = {
  id: "r1",
  name: "Kelionė",
  placeIds: ["a", "b"],
  transportType: "bike" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};
let app: ReturnType<typeof buildApp>;

beforeEach(() => {
  app = buildApp();
  app.log.level = "silent";
  vi.mocked(createSavedRoute).mockResolvedValue(saved);
});
afterEach(() => app.close());

describe("POST /api/saved-routes – DKM", () => {
  it("priima dvi vietas ir pašalina pavadinimo bei deviceId tarpus", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, name: " Kelionė ", deviceId: " dev " },
    });
    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({ item: saved });
    expect(createSavedRoute).toHaveBeenCalledWith(
      "dev",
      "Kelionė",
      ["a", "b"],
      "bike",
    );
  });

  it("atmeta trūkstamus privalomus laukus", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: {},
    });
    expect(response.statusCode).toBe(400);
    expect(createSavedRoute).not.toHaveBeenCalled();
  });

  it("atmeta netinkamą vietų sąrašo tipą", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, placeIds: "a,b" },
    });
    expect(response.statusCode).toBe(400);
  });

  it("atmeta nežinomą transportą", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, transportType: "plane" },
    });
    expect(response.statusCode).toBe(400);
  });

  it("atmeta pavadinimą iš tarpų", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, name: " " },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: "name cannot be empty." });
  });

  it.each([0, 1])("atmeta per mažą vietų skaičių: %i", async (count) => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, placeIds: request.placeIds.slice(0, count) },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "At least 2 places are required.",
    });
  });
});
