import type { PlaceCategory, RecognizeResult } from "@pathy/shared";
import { PLACE_CATEGORIES, PLACE_SUBTYPES } from "@pathy/shared";

const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "pixtral-12b-2409";

const CATEGORY_DESCRIPTIONS: Record<PlaceCategory, string> = {
  museum: "museum, gallery, exhibition",
  castle: "castle, fortress, manor house, palace",
  church: "church, cathedral, chapel, monastery",
  viewpoint: "observation point, scenic viewpoint, lookout tower",
  nature: "natural landmark, forest, lake, river, cliff, cave",
  park: "national park, nature reserve, botanical garden",
  memorial: "memorial, monument, war memorial, cemetery",
  archaeology: "archaeological site, ancient ruins, burial mound",
  "street-art": "street art, mural, graffiti, public sculpture",
  landmark: "historic building, statue, notable structure",
  heritage: "UNESCO heritage site, old town, historic district",
  engineering: "bridge, dam, windmill, lighthouse, technical structure",
  ethnography: "open-air museum, folk village, ethnographic site",
  trail: "hiking trail, walking path, nature trail",
  beach: "beach, lakeshore, sand dunes",
  "water-activity": "water sports, kayaking, boat trip, waterfall",
  adventure: "zipline, rope course, climbing, extreme sports",
  sports: "sports venue, stadium, sport facility",
  food: "restaurant, café, brewery, winery, market",
  lodging: "hotel, campsite, guesthouse",
  transport: "airport, train station, bus station, port",
  service: "tourist information, pharmacy, bank",
  shopping: "market, shop, craft store",
  event: "festival, fair, event venue",
  animal: "zoo, farm, bird watching, aquarium",
  wellness: "spa, health resort, thermal bath",
  other: "other visitable attraction",
};

const SYSTEM_PROMPT = `You are a Lithuanian landmark and tourist attraction recognition assistant.
Analyze images to identify visitable places and attractions in Lithuania.
Always respond with valid JSON only — no markdown, no extra text.`;

function buildUserPrompt(): string {
  const categoryList = PLACE_CATEGORIES.map(
    (c) => `"${c}" (${CATEGORY_DESCRIPTIONS[c]})`,
  ).join(", ");

  const subtypeList = Object.entries(PLACE_SUBTYPES)
    .map(([id, name]) => `${id}=${name}`)
    .join(", ");

  return `Analyze this image. Determine if it shows a visitable place, landmark, or tourist attraction in Lithuania.

Respond with this exact JSON structure:
{
  "recognized": boolean,
  "name": string | null,
  "category": string | null,
  "sourceSubTypeId": number | null,
  "confidence": "high" | "medium" | "low"
}

Rules:
- Set "recognized" to true only if the image clearly shows a Lithuanian place or attraction
- "name" should be the Lithuanian or internationally known name of the place (null if not recognized)
- "category" must be one of these exact values: ${categoryList} — or null if not recognized
- "sourceSubTypeId" must be one of these exact integer IDs that best matches what is visible: ${subtypeList} — or null if nothing matches
- "confidence" reflects how certain you are of the identification`;
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

function parseMistralOutput(raw: string): RecognizeResult {
  const cleaned = raw.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "");
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  const recognized = parsed.recognized === true;
  const name = typeof parsed.name === "string" ? parsed.name : null;
  const rawCategory = typeof parsed.category === "string" ? parsed.category : null;
  const category =
    rawCategory !== null && PLACE_CATEGORIES.includes(rawCategory as PlaceCategory)
      ? (rawCategory as PlaceCategory)
      : null;
  const rawSubTypeId = parsed.sourceSubTypeId;
  const sourceSubTypeId =
    typeof rawSubTypeId === "number" &&
    Number.isInteger(rawSubTypeId) &&
    rawSubTypeId in PLACE_SUBTYPES
      ? rawSubTypeId
      : null;
  const confidence =
    parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
      ? parsed.confidence
      : "low";

  return { recognized, name, category, sourceSubTypeId, confidence };
}

export async function recognizeImage(
  imageBase64: string,
  mimeType: string,
): Promise<RecognizeResult> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error("MISTRAL_API_KEY is not configured.");
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
        { type: "text", text: buildUserPrompt() },
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

  return parseMistralOutput(content);
}