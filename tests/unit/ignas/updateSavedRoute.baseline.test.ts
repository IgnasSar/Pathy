import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateSavedRoute } from "../../../packages/api/src/db/savedRoutesRepository.js";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../../../packages/api/src/db/client.js", () => ({ pool: { query } }));

const row = {
  id: "r1",
  device_id: "dev-1",
  name: "Kelionė",
  place_ids: ["a", "b"],
  transport_type: "car",
  created_at: new Date("2026-01-01T00:00:00Z"),
  updated_at: new Date("2026-01-02T00:00:00Z"),
};

beforeEach(() => {
  query.mockReset();
  query.mockResolvedValue({ rows: [row] });
});

describe("updateSavedRoute", () => {
  it("nepateikus pakeitimų tik perskaito esamą maršrutą", async () => {
    const result = await updateSavedRoute("r1", "dev-1", {});
    expect(query.mock.calls[0][0]).toContain("SELECT");
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev-1"]);
    expect(result?.createdAt).toBe("2026-01-01T00:00:00.000Z");
  });

  it("neradus maršruto grąžina undefined", async () => {
    query.mockResolvedValue({ rows: [] });
    expect(await updateSavedRoute("r1", "kitas", {})).toBeUndefined();
  });

  it("atnaujina pavadinimą", async () => {
    query.mockResolvedValue({ rows: [{ ...row, name: "Naujas" }] });
    const result = await updateSavedRoute("r1", "dev-1", { name: "Naujas" });
    expect(query.mock.calls[0][0]).toContain("name = $3");
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev-1", "Naujas"]);
    expect(result?.name).toBe("Naujas");
  });

  it("vietų sąrašą perduoda JSON formatu", async () => {
    await updateSavedRoute("r1", "dev-1", { placeIds: ["c", "d"] });
    expect(query.mock.calls[0][0]).toContain("place_ids = $3::jsonb");
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev-1", '["c","d"]']);
  });

  it("atnaujina transportą", async () => {
    await updateSavedRoute("r1", "dev-1", { transportType: "walk" });
    expect(query.mock.calls[0][0]).toContain("transport_type = $3");
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev-1", "walk"]);
  });

  it("pateikus visus laukus išlaiko parametrų eilę ir įrenginio patikrą", async () => {
    await updateSavedRoute("r1", "dev-1", {
      name: "N",
      placeIds: ["x", "y"],
      transportType: "bike",
    });
    expect(query.mock.calls[0][1]).toEqual([
      "r1",
      "dev-1",
      "N",
      '["x","y"]',
      "bike",
    ]);
    expect(query.mock.calls[0][0]).toContain(
      "WHERE id = $1 AND device_id = $2",
    );
  });

  it("UPDATE negrąžinus eilutės grąžina undefined", async () => {
    query.mockResolvedValue({ rows: [] });
    expect(
      await updateSavedRoute("r1", "kitas", { name: "Naujas" }),
    ).toBeUndefined();
  });
});
