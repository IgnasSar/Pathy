import { beforeEach, describe, expect, it, vi } from "vitest";
import { recognizeImage } from "../../../packages/api/src/lib/mistral.js";

const fetchMock = vi.fn();
const subtypes = ["Pilys"];

beforeEach(() => {
  vi.stubEnv("MISTRAL_API_KEY", "test-key");
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockResolvedValue(
    new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: '{"sourceSubTypeName":"Pilys","confidence":"high"}',
            },
          },
        ],
      }),
    ),
  );
});

describe("recognizeImage – DKM", () => {
  it("meta klaidą be API rakto", async () => {
    vi.stubEnv("MISTRAL_API_KEY", "");
    await expect(recognizeImage("QUJD", "image/png", subtypes)).rejects.toThrow(
      "MISTRAL_API_KEY is not configured.",
    );
  });

  it("tuščiam potipių sąrašui API nekviečia", async () => {
    expect(await recognizeImage("QUJD", "image/png", [])).toEqual({
      sourceSubTypeName: null,
      confidence: "low",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("siunčia base64 kaip data URL ir grąžina rezultatą", async () => {
    const result = await recognizeImage("QUJD", "image/png", subtypes);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.mistral.ai/v1/chat/completions");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body).messages[1].content[0].image_url.url).toBe(
      "data:image/png;base64,QUJD",
    );
    expect(result).toEqual({ sourceSubTypeName: "Pilys", confidence: "high" });
  });

  it("esamo data URL nekeičia", async () => {
    const image = "data:image/png;base64,QUJD";
    await recognizeImage(image, "image/png", subtypes);
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages[1].content[0].image_url.url).toBe(image);
  });

  it("perduoda API klaidą su būsenos kodu", async () => {
    fetchMock.mockResolvedValue(
      new Response("quota exceeded", { status: 429 }),
    );
    await expect(recognizeImage("QUJD", "image/png", subtypes)).rejects.toThrow(
      "Mistral API error 429: quota exceeded",
    );
  });

  it("išvalo markdown ir normalizuoja potipį", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content:
                  '```json\n{"sourceSubTypeName":" PILYS ","confidence":"medium"}\n```',
              },
            },
          ],
        }),
      ),
    );
    expect(await recognizeImage("QUJD", "image/png", subtypes)).toEqual({
      sourceSubTypeName: "Pilys",
      confidence: "medium",
    });
  });

  it("netinkamam JSON grąžina parsinimo klaidą", async () => {
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: "abc" } }] }),
      ),
    );
    await expect(recognizeImage("QUJD", "image/png", subtypes)).rejects.toThrow(
      SyntaxError,
    );
  });
});
