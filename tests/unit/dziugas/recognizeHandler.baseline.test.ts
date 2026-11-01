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

const request = { imageBase64: "QUJD", mimeType: "image/jpeg" };
let app: ReturnType<typeof buildApp>;

beforeEach(() => {
  app = buildApp();
  app.log.level = "silent";
  vi.mocked(getSourceSubTypes).mockResolvedValue([{ name: "Pilys", count: 5 }]);
  vi.mocked(recognizeImage).mockResolvedValue({
    sourceSubTypeName: "Pilys",
    confidence: "high",
  });
  vi.mocked(listPlaces).mockResolvedValue({
    items: [],
    total: 0,
    limit: 12,
    offset: 0,
  });
});
afterEach(() => app.close());

describe("POST /api/recognize", () => {
  it("perduoda nuotrauką atpažinimui ir grąžina paieškos rezultatus", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: request,
    });
    expect(response.statusCode).toBe(200);
    expect(recognizeImage).toHaveBeenCalledWith("QUJD", "image/jpeg", [
      "Pilys",
    ]);
    expect(response.json()).toEqual({
      prediction: { sourceSubTypeName: "Pilys", confidence: "high" },
      items: [],
      total: 0,
      limit: 12,
      offset: 0,
    });
  });

  it("perduoda vietos ir spindulio filtrus paieškai", async () => {
    const origin = { lat: 54.68, lng: 25.28 };
    await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, origin, radiusKm: 10 },
    });
    expect(listPlaces).toHaveBeenCalledWith({
      sourceSubTypeName: "Pilys",
      origin,
      radiusKm: 10,
      limit: 12,
      offset: 0,
    });
  });

  it("neatpažinus potipio paieškos nekviečia", async () => {
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

  it("atmeta užklausą be nuotraukos", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { mimeType: "image/jpeg" },
    });
    expect(response.statusCode).toBe(400);
    expect(recognizeImage).not.toHaveBeenCalled();
  });

  it("atmeta nepalaikomą formatą", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, mimeType: "image/gif" },
    });
    expect(response.statusCode).toBe(400);
  });

  it("atmeta netinkamas koordinates", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, origin: { lat: "abc", lng: 25 } },
    });
    expect(response.statusCode).toBe(400);
  });

  it("atmeta neskaitinį spindulį", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/recognize",
      payload: { ...request, radiusKm: "10" },
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
