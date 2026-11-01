import { describe, expect, it } from "vitest";
import type { PlaceSummary } from "@pathy/shared";
import { optimizePlacesOrder } from "../../../packages/web/src/utils/geo.js";

function place(id: string, lng: number): PlaceSummary {
  return {
    id,
    name: id,
    coordinates: { lat: 0, lng },
    category: "landmark",
    shortDescription: "",
    region: "",
    municipality: "",
    thumbnailUrl: null,
    recommendedVisitMinutes: 30,
  };
}

const start = place("pradžia", 0);
const near = place("artima", 1);
const far = place("tolima", 3);

describe("optimizePlacesOrder", () => {
  it("grąžina tuščią sąrašą, kai vietų nėra", () => {
    expect(optimizePlacesOrder([])).toEqual([]);
  });

  it("dviejų vietų tvarkos nekeičia ir grąžina naują masyvą", () => {
    const input = [far, start];
    const result = optimizePlacesOrder(input);
    expect(result).toEqual(input);
    expect(result).not.toBe(input);
  });

  it("po pradžios taško parenka artimiausią vietą", () => {
    const result = optimizePlacesOrder([start, far, near]);
    expect(result.map((p) => p.id)).toEqual(["pradžia", "artima", "tolima"]);
  });

  it("pirmą vietą palieka maršruto pradžia", () => {
    expect(optimizePlacesOrder([near, start, far])[0]).toBe(near);
  });

  it("vienodo atstumo atveju pirmiau ima anksčiau sąraše buvusią vietą", () => {
    const west = place("vakarai", -1);
    expect(optimizePlacesOrder([start, near, west])).toEqual([
      start,
      near,
      west,
    ]);
  });

  it("nemodifikuoja pradinio sąrašo", () => {
    const input = [start, far, near];
    optimizePlacesOrder(input);
    expect(input).toEqual([start, far, near]);
  });
});
