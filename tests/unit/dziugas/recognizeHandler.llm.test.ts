import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildApp } from "../../../packages/api/src/app.js";
import {
  getSourceSubTypes,
  listPlaces,
} from "../../../packages/api/src/db/placesRepository.js";
import { recognizeImage } from "../../../packages/api/src/lib/mistral.js";

vi.mock("../../../packages/api/src/db/placesRepository.js", () => ({
  getSourceSubTypes: vi.fn(),
  listPlaces: vi.fn(),
}));
vi.mock("../../../packages/api/src/db/savedRoutesRepository.js", () => ({}));
vi.mock("../../../packages/api/src/lib/mistral.js", () => ({
  recognizeImage: vi.fn(),
}));

const request = { imageBase64: "QUJD", mimeType: "image/png" };
let app: ReturnType<typeof buildApp>;

beforeEach(() => {
  app = buildApp();
  app.log.level = "silent";
  vi.mocked(getSourceSubTypes).mockResolvedValue([
    { name: "Muziejai", count: 2 },
  ]);
  vi.mocked(recognizeImage).mockResolvedValue({
    sourceSubTypeName: "Muziejai",
    confidence: "medium",
  });
  vi.mocked(listPlaces).mockResolvedValue({
    items: [],
    total: 0,
    limit: 12,
    offset: 0,
  });
});
afterEach(() => app.close());

describe("POST /api/recognize – DKM", () => {
  it("grąžina atpažinimą ir perduoda filtrus paieškai", async () => {
    const origin = { lat: 54, lng: 25 };
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, origin, radiusKm: 5 },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().prediction).toEqual({
      sourceSubTypeName: "Muziejai",
      confidence: "medium",
    });
    expect(listPlaces).toHaveBeenCalledWith({
      sourceSubTypeName: "Muziejai",
      origin,
      radiusKm: 5,
      limit: 12,
      offset: 0,
    });
  });

  it("neatpažinus nuotraukos grąžina tuščią sąrašą", async () => {
    vi.mocked(recognizeImage).mockResolvedValue({
      sourceSubTypeName: null,
      confidence: "low",
    });
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: request,
    });
    expect(response.statusCode).toBe(200);
    expect(response.json().items).toEqual([]);
    expect(listPlaces).not.toHaveBeenCalled();
  });

  it("atmeta užklausą be imageBase64", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { mimeType: "image/png" },
    });
    expect(response.statusCode).toBe(400);
    expect(recognizeImage).not.toHaveBeenCalled();
  });

  it("atmeta netinkamą formatą", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, mimeType: "text/plain" },
    });
    expect(response.statusCode).toBe(400);
  });

  it("atmeta netinkamą origin", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, origin: null },
    });
    expect(response.statusCode).toBe(400);
  });

  it("atmeta neskaitinį spindulį", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, radiusKm: "5" },
    });
    expect(response.statusCode).toBe(400);
  });

  it("atmeta per didelę nuotrauką", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, imageBase64: "A".repeat(10 * 1024 * 1024 + 1) },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Image too large (max ~7.5 MB).",
    });
  });
});
