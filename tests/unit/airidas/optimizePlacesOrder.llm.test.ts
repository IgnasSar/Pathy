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

const a = place("a", 0);
const b = place("b", 1);
const c = place("c", 2);
const d = place("d", 3);

describe("optimizePlacesOrder – DKM", () => {
  it("tvarko tuščią ir vienos vietos sąrašą", () => {
    expect(optimizePlacesOrder([])).toEqual([]);
    expect(optimizePlacesOrder([a])).toEqual([a]);
  });

  it("dviejų vietų tvarkos nekeičia", () => {
    expect(optimizePlacesOrder([d, a])).toEqual([d, a]);
  });

  it("vietas rikiuoja pagal artimiausią kaimyną", () => {
    expect(optimizePlacesOrder([a, d, c, b])).toEqual([a, b, c, d]);
  });

  it("nekeičia pirmos vietos ir išlaiko visus elementus", () => {
    expect(optimizePlacesOrder([d, a, b, c])).toEqual([d, c, b, a]);
  });

  it("esant lygiems atstumams renkasi ankstesnį elementą", () => {
    const west = place("west", -1);
    expect(optimizePlacesOrder([a, b, west])).toEqual([a, b, west]);
  });

  it("grąžina naują masyvą ir nekeičia įvesties", () => {
    const input = [a, c, b];
    const result = optimizePlacesOrder(input);
    expect(result).not.toBe(input);
    expect(input).toEqual([a, c, b]);
  });
});
