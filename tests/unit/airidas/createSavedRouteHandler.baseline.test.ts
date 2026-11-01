import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "../../../packages/api/src/app.js";
import { createSavedRoute } from "../../../packages/api/src/db/savedRoutesRepository.js";

vi.mock("../../../packages/api/src/db/placesRepository.js", () => ({}));
vi.mock("../../../packages/api/src/db/savedRoutesRepository.js", () => ({
  createSavedRoute: vi.fn(),
}));

const request = {
  deviceId: "dev-1",
  name: "Kelionė",
  placeIds: ["a", "b"],
  transportType: "car",
};
const saved = {
  id: "r1",
  name: "Kelionė",
  placeIds: ["a", "b"],
  transportType: "car" as const,
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

describe("POST /api/saved-routes", () => {
  it("sukuria maršrutą ir apkarpo pavadinimo bei įrenginio ID tarpus", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, deviceId: " dev-1 ", name: " Kelionė " },
    });
    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({ item: saved });
    expect(createSavedRoute).toHaveBeenCalledWith(
      "dev-1",
      "Kelionė",
      ["a", "b"],
      "car",
    );
  });

  it("atmeta užklausą be įrenginio ID", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { name: "Kelionė", placeIds: ["a", "b"], transportType: "car" },
    });
    expect(response.statusCode).toBe(400);
    expect(createSavedRoute).not.toHaveBeenCalled();
  });

  it("atmeta placeIds, kuris nėra masyvas", async () => {
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

  it("atmeta tuščią pavadinimą", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, name: "   " },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({ error: "name cannot be empty." });
  });

  it("reikalauja bent dviejų vietų", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/saved-routes",
      payload: { ...request, placeIds: ["a"] },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "At least 2 places are required.",
    });
  });
});
