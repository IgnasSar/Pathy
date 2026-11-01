import { describe, expect, it, vi } from "vitest";
import { isRoutePreviewRequest } from "../../../packages/api/src/app.js";

vi.mock("../../../packages/api/src/db/placesRepository.js", () => ({}));
vi.mock("../../../packages/api/src/db/savedRoutesRepository.js", () => ({}));

const request = { placeIds: ["a", "b"], transportType: "walk" };

describe("isRoutePreviewRequest – DKM", () => {
  it("priima struktūrą su origin ir be jo", () => {
    expect(isRoutePreviewRequest(request)).toBe(true);
    expect(
      isRoutePreviewRequest({ ...request, origin: { lat: 54, lng: 25 } }),
    ).toBe(true);
  });

  it.each([undefined, null, "tekstas", []])(
    "atmeta netinkamą kūną: %j",
    (body) => {
      expect(isRoutePreviewRequest(body)).toBe(false);
    },
  );

  it("reikalauja tekstinių ID masyvo", () => {
    expect(isRoutePreviewRequest({ transportType: "walk" })).toBe(false);
    expect(isRoutePreviewRequest({ ...request, placeIds: "a" })).toBe(false);
    expect(isRoutePreviewRequest({ ...request, placeIds: [1] })).toBe(false);
  });

  it("reikalauja tekstinio transportType", () => {
    expect(isRoutePreviewRequest({ placeIds: ["a", "b"] })).toBe(false);
    expect(isRoutePreviewRequest({ ...request, transportType: null })).toBe(
      false,
    );
  });

  it("atmeta netinkamą origin", () => {
    expect(isRoutePreviewRequest({ ...request, origin: null })).toBe(false);
    expect(isRoutePreviewRequest({ ...request, origin: { lat: 54 } })).toBe(
      false,
    );
  });

  it("tikrina struktūrą, o ne vietų skaičių ar transporto reikšmę", () => {
    expect(
      isRoutePreviewRequest({ placeIds: [], transportType: "plane" }),
    ).toBe(true);
  });
});
