import { describe, expect, it, vi } from "vitest";
import { isRoutePreviewRequest } from "../../../packages/api/src/app.js";

vi.mock("../../../packages/api/src/db/placesRepository.js", () => ({}));
vi.mock("../../../packages/api/src/db/savedRoutesRepository.js", () => ({}));

const request = { placeIds: ["a", "b"], transportType: "car" };

describe("isRoutePreviewRequest", () => {
  it("priima galiojančią struktūrą be origin", () => {
    expect(isRoutePreviewRequest(request)).toBe(true);
  });

  it("priima galiojančias koordinates", () => {
    expect(
      isRoutePreviewRequest({ ...request, origin: { lat: 54.68, lng: 25.28 } }),
    ).toBe(true);
  });

  it("leidžia neprivalomą origin palikti undefined", () => {
    expect(isRoutePreviewRequest({ ...request, origin: undefined })).toBe(true);
  });

  it.each([null, undefined, "tekstas", 42])(
    "atmeta ne objektą: %s",
    (value) => {
      expect(isRoutePreviewRequest(value)).toBe(false);
    },
  );

  it("atmeta užklausą be placeIds", () => {
    expect(isRoutePreviewRequest({ transportType: "car" })).toBe(false);
  });

  it("atmeta placeIds, kuris nėra masyvas", () => {
    expect(isRoutePreviewRequest({ ...request, placeIds: "a,b" })).toBe(false);
  });

  it("atmeta ne tekstinius placeIds elementus", () => {
    expect(isRoutePreviewRequest({ ...request, placeIds: ["a", 2] })).toBe(
      false,
    );
  });

  it("atmeta užklausą be transportType", () => {
    expect(isRoutePreviewRequest({ placeIds: ["a", "b"] })).toBe(false);
  });

  it("atmeta ne tekstinį transportType", () => {
    expect(isRoutePreviewRequest({ ...request, transportType: 1 })).toBe(false);
  });

  it("atmeta netinkamas koordinates", () => {
    expect(
      isRoutePreviewRequest({
        ...request,
        origin: { lat: "54.68", lng: 25.28 },
      }),
    ).toBe(false);
  });
});
