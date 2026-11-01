import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateSavedRoute } from "../../../packages/api/src/db/savedRoutesRepository.js";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../../../packages/api/src/db/client.js", () => ({ pool: { query } }));

const row = {
  id: "r1",
  device_id: "dev",
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

describe("updateSavedRoute – DKM", () => {
  it("be pakeitimų skaito esamą maršrutą ir grąžina ISO datą", async () => {
    const result = await updateSavedRoute("r1", "dev", {});
    expect(query.mock.calls[0][0]).toContain("SELECT");
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev"]);
    expect(result?.updatedAt).toBe("2026-01-02T00:00:00.000Z");
  });

  it("keičia pavadinimą", async () => {
    query.mockResolvedValue({ rows: [{ ...row, name: "Nauja" }] });
    const result = await updateSavedRoute("r1", "dev", { name: "Nauja" });
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev", "Nauja"]);
    expect(result?.name).toBe("Nauja");
  });

  it("vietas serializuoja kaip JSON", async () => {
    await updateSavedRoute("r1", "dev", { placeIds: ["c", "d"] });
    expect(query.mock.calls[0][0]).toContain("place_ids = $3::jsonb");
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev", '["c","d"]']);
  });

  it("keičia transportą", async () => {
    await updateSavedRoute("r1", "dev", { transportType: "walk" });
    expect(query.mock.calls[0][0]).toContain("transport_type = $3");
    expect(query.mock.calls[0][1]).toEqual(["r1", "dev", "walk"]);
  });

  it("keičiant visus laukus išlaiko parametrų tvarką ir tikrina deviceId", async () => {
    await updateSavedRoute("r1", "dev", {
      name: "N",
      placeIds: ["c", "d"],
      transportType: "bike",
    });
    expect(query.mock.calls[0][1]).toEqual([
      "r1",
      "dev",
      "N",
      '["c","d"]',
      "bike",
    ]);
    expect(query.mock.calls[0][0]).toContain(
      "WHERE id = $1 AND device_id = $2",
    );
  });

  it.each([{}, { name: "N" }])(
    "neradus maršruto grąžina undefined: %j",
    async (changes) => {
      query.mockResolvedValue({ rows: [] });
      expect(await updateSavedRoute("r1", "kitas", changes)).toBeUndefined();
    },
  );
});
