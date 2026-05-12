import type { RecognizePrediction } from "@pathy/shared";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "pixtral-12b-2409";

const SYSTEM_PROMPT = `You are a Lithuanian tourist attraction image classifier.
Classify images into one of the provided Lithuanian attraction subtype names.
Always respond with valid JSON only — no markdown, no extra text.`;

function buildUserPrompt(sourceSubTypeNames: string[]): string {
  const subtypeList = sourceSubTypeNames.map((name) => `- ${name}`).join("\n");

  return `Analyze this image and choose the single best matching subtype from this exact list:
${subtypeList}

Respond with this exact JSON structure:
{
  "sourceSubTypeName": string | null,
  "confidence": "high" | "medium" | "low"
}

Rules:
- Use exactly one subtype name from the list, copied verbatim.
- Set "sourceSubTypeName" to null only if the image is not a visitable place/tourist attraction or no listed subtype fits.
- Do not guess a specific place name.
- Do not return category IDs or descriptions.
- "confidence" reflects certainty in the subtype classification.`;
}

type MistralMessage = {
  role: "user" | "assistant" | "system";
  content:
    | string
    | Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
};

type MistralResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

function normalizeSubtypeName(value: string) {
  return value.trim().toLocaleLowerCase("lt");
}

function getValidSubtypeName(
  value: unknown,
  sourceSubTypeNames: string[],
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = normalizeSubtypeName(value);
  return (
    sourceSubTypeNames.find(
      (name) => normalizeSubtypeName(name) === normalizedValue,
    ) ?? null
  );
}

function getConfidence(value: unknown): RecognizePrediction["confidence"] {
  return value === "high" || value === "medium" || value === "low"
    ? value
    : "low";
}

function parseMistralOutput(
  raw: string,
  sourceSubTypeNames: string[],
): RecognizePrediction {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/```\s*$/, "");
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  return {
    sourceSubTypeName: getValidSubtypeName(
      parsed.sourceSubTypeName,
      sourceSubTypeNames,
    ),
    confidence: getConfidence(parsed.confidence),
  };
}

export async function recognizeImage(
  imageBase64: string,
  mimeType: string,
  sourceSubTypeNames: string[],
): Promise<RecognizePrediction> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not configured.");
  }

  if (sourceSubTypeNames.length === 0) {
    return { sourceSubTypeName: null, confidence: "low" };
  }

  const dataUrl = imageBase64.startsWith("data:")
    ? imageBase64
    : `data:${mimeType};base64,${imageBase64}`;

  const messages: MistralMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "image_url", image_url: { url: dataUrl } },
        { type: "text", text: buildUserPrompt(sourceSubTypeNames) },
      ],
    },
  ];

  const res = await fetch(MISTRAL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, messages }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Mistral API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as MistralResponse;
  const content = data.choices?.[0]?.message?.content ?? "";

  return parseMistralOutput(content, sourceSubTypeNames);
}
