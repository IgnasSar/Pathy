import { beforeEach, describe, expect, it, vi } from "vitest";
import { recognizeImage } from "../../../packages/api/src/lib/mistral.js";

const fetchMock = vi.fn();
const subtypes = ["Pilys", "Muziejai"];

// Mistral atsakymas pakeičiamas lokaliu Response, tinklas nenaudojamas.
function reply(content: string) {
  fetchMock.mockResolvedValue(
    new Response(JSON.stringify({ choices: [{ message: { content } }] })),
  );
}

beforeEach(() => {
  vi.stubEnv("MISTRAL_API_KEY", "test-key");
  vi.stubGlobal("fetch", fetchMock);
  reply('{"sourceSubTypeName":"Pilys","confidence":"high"}');
});

describe("recognizeImage", () => {
  it("reikalauja API rakto", async () => {
    vi.stubEnv("MISTRAL_API_KEY", "");
    await expect(
      recognizeImage("QUJD", "image/jpeg", subtypes),
    ).rejects.toThrow("MISTRAL_API_KEY is not configured.");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("esant tuščiam potipių sąrašui API nekviečia", async () => {
    await expect(recognizeImage("QUJD", "image/jpeg", [])).resolves.toEqual({
      sourceSubTypeName: null,
      confidence: "low",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("iš base64 sukuria data URL ir grąžina atpažintą potipį", async () => {
    const result = await recognizeImage("QUJD", "image/jpeg", subtypes);
    const [url, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(url).toBe("https://api.mistral.ai/v1/chat/completions");
    expect(options.headers.Authorization).toBe("Bearer test-key");
    expect(body.messages[1].content[0].image_url.url).toBe(
      "data:image/jpeg;base64,QUJD",
    );
    expect(result).toEqual({ sourceSubTypeName: "Pilys", confidence: "high" });
  });

  it("jau pateikto data URL nekeičia", async () => {
    await recognizeImage("data:image/png;base64,QUJD", "image/png", subtypes);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages[1].content[0].image_url.url).toBe(
      "data:image/png;base64,QUJD",
    );
  });

  it("grąžina klaidą, kai API atsako nesėkmingai", async () => {
    fetchMock.mockResolvedValue(new Response("unavailable", { status: 503 }));
    await expect(
      recognizeImage("QUJD", "image/jpeg", subtypes),
    ).rejects.toThrow("Mistral API error 503: unavailable");
  });

  it("išvalo markdown bloką ir suvienodina potipio raidžių dydį", async () => {
    reply(
      '```json\n{"sourceSubTypeName":"  PILYS ","confidence":"medium"}\n```',
    );
    await expect(
      recognizeImage("QUJD", "image/jpeg", subtypes),
    ).resolves.toEqual({ sourceSubTypeName: "Pilys", confidence: "medium" });
  });

  it("nežinomą potipį ir confidence pakeičia į null ir low", async () => {
    reply('{"sourceSubTypeName":"Nežinomas","confidence":"sure"}');
    await expect(
      recognizeImage("QUJD", "image/jpeg", subtypes),
    ).resolves.toEqual({ sourceSubTypeName: null, confidence: "low" });
  });

  it("neteisingas JSON sukelia parsinimo klaidą", async () => {
    reply("ne JSON");
    await expect(
      recognizeImage("QUJD", "image/jpeg", subtypes),
    ).rejects.toThrow(SyntaxError);
  });
});
