import { useState } from "react";
import type {
  PlaceDetailResponse,
  PlaceFiltersResponse,
  PlacesResponse,
  RoutePreviewResponse,
} from "@pathy/shared";

type ResultState = {
  title: string;
  body: string;
};

type ApiTestResponse =
  | PlaceFiltersResponse
  | PlacesResponse
  | PlaceDetailResponse
  | RoutePreviewResponse;

async function readJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(JSON.stringify(data, null, 2));
  }

  return data;
}

function App() {
  const [result, setResult] = useState<ResultState>({
    title: "Result",
    body: "Click a button to test the API.",
  });
  const [loading, setLoading] = useState(false);

  async function runRequest(
    title: string,
    request: () => Promise<ApiTestResponse>,
  ) {
    setLoading(true);

    try {
      const data = await request();
      setResult({
        title,
        body: JSON.stringify(data, null, 2),
      });
    } catch (error) {
      setResult({
        title: `${title} error`,
        body: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-xl space-y-4 rounded-lg border border-slate-200 p-6">
        <h1 className="text-2xl font-semibold">API test</h1>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Filters", () =>
                readJson<PlaceFiltersResponse>("/api/filters"),
              )
            }
          >
            GET /api/filters
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Places", () =>
                readJson<PlacesResponse>("/api/places"),
              )
            }
          >
            GET /api/places
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Nearby places", () =>
                readJson<PlacesResponse>(
                  "/api/places?lat=54.6872&lng=25.2797&radiusKm=40",
                ),
              )
            }
          >
            GET /api/places?radiusKm=40
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Place detail", () =>
                readJson<PlaceDetailResponse>("/api/places/trakai-castle"),
              )
            }
          >
            GET /api/places/:id
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Route preview", () =>
                readJson<RoutePreviewResponse>("/api/route-preview", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    placeIds: [
                      "trakai-castle",
                      "uzutrakis-manor",
                      "gediminas-tower",
                    ],
                    transportType: "car",
                    origin: {
                      lat: 54.6872,
                      lng: 25.2797,
                    },
                  }),
                }),
              )
            }
          >
            POST /api/route-preview
          </button>
        </div>

        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-medium">
            {loading ? "Loading..." : result.title}
          </p>
          <pre className="mt-3 overflow-x-auto text-sm whitespace-pre-wrap">
            {result.body}
          </pre>
        </div>
      </div>
    </main>
  );
}

export default App;
