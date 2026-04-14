import { useState } from "react";
import type {
  DemoEchoResponse,
  DemoItemsResponse,
  DemoMessageResponse,
  HealthResponse,
} from "@pathy/shared";

type ResultState = {
  title: string;
  body: string;
};

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
    request: () => Promise<
      | HealthResponse
      | DemoMessageResponse
      | DemoItemsResponse
      | DemoEchoResponse
    >,
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
              runRequest("Health", () => readJson<HealthResponse>("/health"))
            }
          >
            GET /health
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Message", () =>
                readJson<DemoMessageResponse>("/api/demo/message"),
              )
            }
          >
            GET /api/demo/message
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Items", () =>
                readJson<DemoItemsResponse>("/api/demo/items"),
              )
            }
          >
            GET /api/demo/items
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() =>
              runRequest("Echo", () =>
                readJson<DemoEchoResponse>("/api/demo/echo", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    text: "Hello from the frontend",
                  }),
                }),
              )
            }
          >
            POST /api/demo/echo
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
