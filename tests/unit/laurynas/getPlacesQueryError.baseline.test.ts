import { describe, expect, it, vi } from "vitest";
import { getPlacesQueryError } from "../../../packages/api/src/app.js";

// Šiam testui DB nereikalinga, bet app.ts importuoja repozitorijas.
vi.mock("../../../packages/api/src/db/placesRepository.js", () => ({}));
vi.mock("../../../packages/api/src/db/savedRoutesRepository.js", () => ({}));

describe("getPlacesQueryError", () => {
  it("priima tuščią užklausą", () => {
    expect(getPlacesQueryError({})).toBeUndefined();
  });

  it("priima galiojančius filtrus", () => {
    expect(
      getPlacesQueryError({
        category: "castle",
        lat: "54.68",
        lng: "25.28",
        radiusKm: "10",
        limit: "12",
        offset: "0",
      }),
    ).toBeUndefined();
  });

  it("atmeta nežinomą kategoriją", () => {
    expect(getPlacesQueryError({ category: "zoo" })).toBe("Unknown category.");
  });

  it("reikalauja abiejų koordinačių", () => {
    expect(getPlacesQueryError({ lat: "54.68" })).toBe(
      "lat and lng must be provided together.",
    );
    expect(getPlacesQueryError({ lng: "25.28" })).toBe(
      "lat and lng must be provided together.",
    );
  });

  it("atmeta neskaitinę platumą", () => {
    expect(getPlacesQueryError({ lat: "abc", lng: "25.28" })).toBe(
      "lat must be a number.",
    );
  });

  it("atmeta neskaitinę ilgumą", () => {
    expect(getPlacesQueryError({ lat: "54.68", lng: "abc" })).toBe(
      "lng must be a number.",
    );
  });

  it("atmeta neskaitinį spindulį", () => {
    expect(
      getPlacesQueryError({ lat: "54.68", lng: "25.28", radiusKm: "abc" }),
    ).toBe("radiusKm must be a number.");
  });

  it("reikalauja koordinačių, kai naudojamas spindulys", () => {
    expect(getPlacesQueryError({ radiusKm: "10" })).toBe(
      "lat and lng are required when radiusKm is used.",
    );
  });

  it.each(["abc", "0", "-1"])("atmeta netinkamą limit: %s", (limit) => {
    expect(getPlacesQueryError({ limit })).toBe(
      "limit must be a positive number.",
    );
  });

  it.each(["abc", "-1"])("atmeta netinkamą offset: %s", (offset) => {
    expect(getPlacesQueryError({ offset })).toBe(
      "offset must be zero or a positive number.",
    );
  });

  it("esant kelioms klaidoms pirmiausia grąžina kategorijos klaidą", () => {
    expect(getPlacesQueryError({ category: "zoo", limit: "0" })).toBe(
      "Unknown category.",
    );
  });
});
