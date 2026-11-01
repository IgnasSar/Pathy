import { describe, expect, it, vi } from "vitest";
import { getPlacesQueryError } from "../../../packages/api/src/app.js";

vi.mock("../../../packages/api/src/db/placesRepository.js", () => ({}));
vi.mock("../../../packages/api/src/db/savedRoutesRepository.js", () => ({}));

describe("getPlacesQueryError – DKM", () => {
  it("priima tuščią užklausą ir galiojančius filtrus", () => {
    expect(getPlacesQueryError({})).toBeUndefined();
    expect(
      getPlacesQueryError({
        category: "museum",
        lat: "54",
        lng: "25",
        radiusKm: "5",
        limit: "1",
        offset: "0",
      }),
    ).toBeUndefined();
  });

  it("atmeta nežinomą kategoriją net jei yra ir kitų klaidų", () => {
    expect(getPlacesQueryError({ category: "unknown", limit: "0" })).toBe(
      "Unknown category.",
    );
  });

  it("reikalauja abiejų koordinačių", () => {
    expect(getPlacesQueryError({ lat: "54" })).toBe(
      "lat and lng must be provided together.",
    );
    expect(getPlacesQueryError({ lng: "25" })).toBe(
      "lat and lng must be provided together.",
    );
  });

  it("atmeta netinkamas skaitines koordinates", () => {
    expect(getPlacesQueryError({ lat: "NaN", lng: "25" })).toBe(
      "lat must be a number.",
    );
    expect(getPlacesQueryError({ lat: "54", lng: "Infinity" })).toBe(
      "lng must be a number.",
    );
  });

  it("atmeta netinkamą spindulį arba spindulį be koordinačių", () => {
    expect(getPlacesQueryError({ lat: "54", lng: "25", radiusKm: "abc" })).toBe(
      "radiusKm must be a number.",
    );
    expect(getPlacesQueryError({ radiusKm: "5" })).toBe(
      "lat and lng are required when radiusKm is used.",
    );
  });

  it.each(["abc", "0", "-1"])("atmeta limit reikšmę %s", (limit) => {
    expect(getPlacesQueryError({ limit })).toBe(
      "limit must be a positive number.",
    );
  });

  it.each(["abc", "-1"])("atmeta offset reikšmę %s", (offset) => {
    expect(getPlacesQueryError({ offset })).toBe(
      "offset must be zero or a positive number.",
    );
  });
});
