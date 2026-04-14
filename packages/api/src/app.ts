import Fastify from "fastify";
import type {
  ApiErrorResponse,
  DemoEchoRequest,
  DemoEchoResponse,
  DemoItemsResponse,
  DemoMessageResponse,
  HealthResponse,
} from "@pathy/shared";

const demoItems: DemoItemsResponse["items"] = [
  { id: "first", label: "First item" },
  { id: "second", label: "Second item" },
  { id: "third", label: "Third item" },
];

function isDemoEchoRequest(value: unknown): value is DemoEchoRequest {
  return (
    typeof value === "object" &&
    value !== null &&
    "text" in value &&
    typeof value.text === "string"
  );
}

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.get("/health", async () => {
    const response: HealthResponse = {
      status: "ok",
    };

    return response;
  });

  app.get("/api/demo/message", async () => {
    const response: DemoMessageResponse = {
      message: "Hello from the API",
      timestamp: new Date().toISOString(),
    };

    return response;
  });

  app.get("/api/demo/items", async () => {
    const response: DemoItemsResponse = {
      items: demoItems,
    };

    return response;
  });

  app.post("/api/demo/echo", async (request, reply) => {
    if (!isDemoEchoRequest(request.body)) {
      const errorResponse: ApiErrorResponse = {
        error: "Body must contain a text field.",
      };

      return reply.code(400).send(errorResponse);
    }

    const response: DemoEchoResponse = {
      received: request.body.text,
      timestamp: new Date().toISOString(),
    };

    return response;
  });

  return app;
}
