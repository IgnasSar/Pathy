import Fastify from "fastify";
import {
  PLACE_CATEGORIES,
  TRANSPORT_TYPES,
  type ApiErrorResponse,
  type Coordinates,
  type HealthResponse,
  type PlaceCategory,
  type PlaceDetail,
  type PlaceDetailResponse,
  type PlacesResponse,
  type RecognizeRequest,
  type RecognizeResponse,
  type RoutePreviewRequest,
  type RoutePreviewResponse,
  type SavedRouteListResponse,
  type SavedRouteDetailResponse,
  type CreateSavedRouteRequest,
  type UpdateSavedRouteRequest,
} from "@pathy/shared";
import {
  getPlaceById,
  getPlaceFilters,
  getPlacesByIds,
  getSourceSubTypes,
  listPlaces,
} from "./db/placesRepository.js";
import {
  listSavedRoutes,
  getSavedRoute,
  createSavedRoute,
  updateSavedRoute,
  deleteSavedRoute,
} from "./db/savedRoutesRepository.js";
import {
  estimateDurationMinutes,
  haversineKm,
  roundToOneDecimal,
} from "./lib/geo.js";
import { recognizeImage } from "./lib/mistral.js";
import { getOrsRoute } from "./lib/ors.js";

type PlacesQuerystring = {
  query?: string;
  category?: string;
  region?: string;
  sourceSubTypeName?: string;
  radiusKm?: string;
  lat?: string;
  lng?: string;
  excludeId?: string;
  limit?: string;
  offset?: string;
};

function parseOptionalNumber(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
}

function isCoordinates(value: unknown): value is Coordinates {
  return (
    typeof value === "object" &&
    value !== null &&
    "lat" in value &&
    "lng" in value &&
    typeof value.lat === "number" &&
    typeof value.lng === "number"
  );
}

function isRoutePreviewRequest(value: unknown): value is RoutePreviewRequest {
  return (
    typeof value === "object" &&
    value !== null &&
    "placeIds" in value &&
    Array.isArray(value.placeIds) &&
    value.placeIds.every((placeId) => typeof placeId === "string") &&
    "transportType" in value &&
    typeof value.transportType === "string" &&
    (!("origin" in value) ||
      value.origin === undefined ||
      isCoordinates(value.origin))
  );
}

function getOriginFromQuery(query: PlacesQuerystring) {
  const lat = parseOptionalNumber(query.lat);
  const lng = parseOptionalNumber(query.lng);

  if (lat === undefined || lng === undefined) {
    return undefined;
  }

  return { lat, lng };
}

function getPlacesQueryError(query: PlacesQuerystring) {
  if (
    query.category !== undefined &&
    !PLACE_CATEGORIES.includes(query.category as PlaceCategory)
  ) {
    return "Unknown category.";
  }

  if ((query.lat === undefined) !== (query.lng === undefined)) {
    return "lat and lng must be provided together.";
  }

  if (query.lat !== undefined && parseOptionalNumber(query.lat) === undefined) {
    return "lat must be a number.";
  }

  if (query.lng !== undefined && parseOptionalNumber(query.lng) === undefined) {
    return "lng must be a number.";
  }

  if (
    query.radiusKm !== undefined &&
    parseOptionalNumber(query.radiusKm) === undefined
  ) {
    return "radiusKm must be a number.";
  }

  if (query.radiusKm !== undefined && query.lat === undefined) {
    return "lat and lng are required when radiusKm is used.";
  }

  if (query.limit !== undefined) {
    const limit = parseOptionalNumber(query.limit);

    if (limit === undefined || limit < 1) {
      return "limit must be a positive number.";
    }
  }

  if (query.offset !== undefined) {
    const offset = parseOptionalNumber(query.offset);

    if (offset === undefined || offset < 0) {
      return "offset must be zero or a positive number.";
    }
  }

  return undefined;
}

function getRoutePreviewError(value: RoutePreviewRequest) {
  if (value.placeIds.length < 2) {
    return "At least two places are required.";
  }

  if (!TRANSPORT_TYPES.includes(value.transportType)) {
    return "Unknown transport type.";
  }

  if (new Set(value.placeIds).size !== value.placeIds.length) {
    return "Duplicate placeIds are not allowed.";
  }

  return undefined;
}

function getRoutePath(origin: Coordinates | undefined, places: PlaceDetail[]) {
  return origin
    ? [origin, ...places.map((place) => place.coordinates)]
    : places.map((place) => place.coordinates);
}

function getRouteDistance(
  origin: Coordinates | undefined,
  places: PlaceDetail[],
) {
  let totalDistanceKm = 0;

  if (origin !== undefined && places.length > 0) {
    totalDistanceKm += haversineKm(origin, places[0].coordinates);
  }

  for (let index = 1; index < places.length; index += 1) {
    totalDistanceKm += haversineKm(
      places[index - 1].coordinates,
      places[index].coordinates,
    );
  }

  return totalDistanceKm;
}

export function buildApp() {
  const app = Fastify({
    logger: true,
    bodyLimit: 12 * 1024 * 1024, // 12 MB — needed for base64 image uploads
  });

  app.get("/health", async () => {
    const response: HealthResponse = {
      status: "ok",
    };

    return response;
  });

  app.get("/api/filters", async () => {
    return getPlaceFilters();
  });

  app.get<{ Querystring: PlacesQuerystring }>(
    "/api/places",
    async (request, reply) => {
      const queryError = getPlacesQueryError(request.query);

      if (queryError !== undefined) {
        const errorResponse: ApiErrorResponse = {
          error: queryError,
        };

        return reply.code(400).send(errorResponse);
      }

      const response: PlacesResponse = await listPlaces({
        query: request.query.query?.trim() || undefined,
        category: request.query.category,
        region: request.query.region,
        sourceSubTypeName: request.query.sourceSubTypeName,
        radiusKm: parseOptionalNumber(request.query.radiusKm),
        origin: getOriginFromQuery(request.query),
        excludeId: request.query.excludeId,
        limit: parseOptionalNumber(request.query.limit),
        offset: parseOptionalNumber(request.query.offset),
      });

      return response;
    },
  );

  app.get<{ Params: { id: string } }>(
    "/api/places/:id",
    async (request, reply) => {
      const item = await getPlaceById(request.params.id);

      if (item === undefined) {
        const errorResponse: ApiErrorResponse = {
          error: "Place not found.",
        };

        return reply.code(404).send(errorResponse);
      }

      const response: PlaceDetailResponse = {
        item,
      };

      return response;
    },
  );

  app.post("/api/recognize", async (request, reply) => {
    const body = request.body as unknown;

    if (
      typeof body !== "object" ||
      body === null ||
      !("imageBase64" in body) ||
      typeof (body as Record<string, unknown>).imageBase64 !== "string" ||
      !("mimeType" in body) ||
      !["image/jpeg", "image/png", "image/webp"].includes(
        (body as Record<string, unknown>).mimeType as string,
      ) ||
      ("origin" in body &&
        (body as Record<string, unknown>).origin !== undefined &&
        !isCoordinates((body as Record<string, unknown>).origin)) ||
      ("radiusKm" in body &&
        (body as Record<string, unknown>).radiusKm !== undefined &&
        typeof (body as Record<string, unknown>).radiusKm !== "number")
    ) {
      const errorResponse: ApiErrorResponse = {
        error:
          "Body must contain imageBase64 (string), mimeType (image/jpeg, image/png, or image/webp), and optional origin/radiusKm filters.",
      };
      return reply.code(400).send(errorResponse);
    }

    const recognizeRequest = body as RecognizeRequest;
    const { imageBase64, mimeType } = recognizeRequest;

    const base64Data = imageBase64.startsWith("data:")
      ? (imageBase64.split(",")[1] ?? imageBase64)
      : imageBase64;

    if (base64Data.length > 10 * 1024 * 1024) {
      const errorResponse: ApiErrorResponse = {
        error: "Image too large (max ~7.5 MB).",
      };
      return reply.code(400).send(errorResponse);
    }

    const sourceSubTypes = await getSourceSubTypes();
    const prediction = await recognizeImage(
      imageBase64,
      mimeType,
      sourceSubTypes.map((sourceSubType) => sourceSubType.name),
    );
    const matches = prediction.sourceSubTypeName
      ? await listPlaces({
          sourceSubTypeName: prediction.sourceSubTypeName,
          origin: recognizeRequest.origin,
          radiusKm: recognizeRequest.origin
            ? recognizeRequest.radiusKm
            : undefined,
          limit: 12,
          offset: 0,
        })
      : { items: [], total: 0, limit: 12, offset: 0 };
    const response: RecognizeResponse = {
      prediction,
      items: matches.items,
      total: matches.total,
      limit: matches.limit,
      offset: matches.offset,
    };
    return response;
  });

  app.post("/api/route-preview", async (request, reply) => {
    const body = request.body as unknown;

    if (!isRoutePreviewRequest(body)) {
      const errorResponse: ApiErrorResponse = {
        error: "Body must contain placeIds and transportType.",
      };

      return reply.code(400).send(errorResponse);
    }

    const routeError = getRoutePreviewError(body);

    if (routeError !== undefined) {
      const errorResponse: ApiErrorResponse = {
        error: routeError,
      };

      return reply.code(400).send(errorResponse);
    }

    const routePlaces = await getPlacesByIds(body.placeIds);
    const missingPlaceIds = body.placeIds.filter(
      (_, index) => routePlaces[index] === undefined,
    );

    if (missingPlaceIds.length > 0) {
      const errorResponse: ApiErrorResponse = {
        error: `Unknown placeIds: ${missingPlaceIds.join(", ")}`,
      };

      return reply.code(404).send(errorResponse);
    }

    const resolvedPlaces = routePlaces as PlaceDetail[];
    const waypoints = getRoutePath(body.origin, resolvedPlaces);

    let path: Coordinates[] = waypoints;
    let segments: Coordinates[][] = [];
    let distanceKm: number;
    let durationMinutes: number;

    function makeSegmentsFromWaypoints(wps: Coordinates[]): Coordinates[][] {
      return wps.slice(0, -1).map((_, i) => [wps[i], wps[i + 1]]);
    }

    if (process.env.OPENROUTE_API_KEY) {
      try {
        const ors = await getOrsRoute(waypoints, body.transportType);
        path = ors.path;
        segments = ors.segments;
        distanceKm = ors.distanceKm;
        durationMinutes = ors.durationMinutes;
      } catch (err) {
        app.log.warn(
          { err },
          "ORS route failed, falling back to haversine estimate",
        );
        const fallbackKm = roundToOneDecimal(
          getRouteDistance(body.origin, resolvedPlaces),
        );
        distanceKm = fallbackKm;
        durationMinutes = estimateDurationMinutes(
          fallbackKm,
          body.transportType,
        );
        segments = makeSegmentsFromWaypoints(waypoints);
      }
    } else {
      const fallbackKm = roundToOneDecimal(
        getRouteDistance(body.origin, resolvedPlaces),
      );
      distanceKm = fallbackKm;
      durationMinutes = estimateDurationMinutes(fallbackKm, body.transportType);
      segments = makeSegmentsFromWaypoints(waypoints);
    }

    const response: RoutePreviewResponse = {
      stops: resolvedPlaces.map((place, index) => ({
        order: index + 1,
        id: place.id,
        name: place.name,
        coordinates: place.coordinates,
      })),
      totals: {
        distanceKm,
        durationMinutes,
        transportType: body.transportType,
      },
      path,
      segments,
    };

    return response;
  });

  // ── Saved Routes CRUD ──────────────────────────────────────────────────────

  app.get<{ Querystring: { deviceId?: string } }>(
    "/api/saved-routes",
    async (request, reply) => {
      const { deviceId } = request.query;
      if (!deviceId || deviceId.trim() === "") {
        const errorResponse: ApiErrorResponse = {
          error: "deviceId is required.",
        };
        return reply.code(400).send(errorResponse);
      }
      const items = await listSavedRoutes(deviceId.trim());
      const response: SavedRouteListResponse = { items };
      return response;
    },
  );

  app.get<{ Params: { id: string }; Querystring: { deviceId?: string } }>(
    "/api/saved-routes/:id",
    async (request, reply) => {
      const { deviceId } = request.query;
      if (!deviceId || deviceId.trim() === "") {
        const errorResponse: ApiErrorResponse = {
          error: "deviceId is required.",
        };
        return reply.code(400).send(errorResponse);
      }
      const item = await getSavedRoute(request.params.id, deviceId.trim());
      if (!item) {
        const errorResponse: ApiErrorResponse = {
          error: "Saved route not found.",
        };
        return reply.code(404).send(errorResponse);
      }
      const response: SavedRouteDetailResponse = { item };
      return response;
    },
  );

  app.post("/api/saved-routes", async (request, reply) => {
    const body = request.body as unknown;
    if (
      typeof body !== "object" ||
      body === null ||
      !("deviceId" in body) ||
      typeof (body as Record<string, unknown>).deviceId !== "string" ||
      !("name" in body) ||
      typeof (body as Record<string, unknown>).name !== "string" ||
      !("placeIds" in body) ||
      !Array.isArray((body as Record<string, unknown>).placeIds) ||
      !("transportType" in body) ||
      !TRANSPORT_TYPES.includes(
        (body as Record<string, unknown>).transportType as any,
      )
    ) {
      const errorResponse: ApiErrorResponse = {
        error:
          "Body must contain deviceId, name, placeIds (array), and transportType.",
      };
      return reply.code(400).send(errorResponse);
    }
    const req = body as CreateSavedRouteRequest;
    if (req.name.trim().length === 0) {
      const errorResponse: ApiErrorResponse = {
        error: "name cannot be empty.",
      };
      return reply.code(400).send(errorResponse);
    }
    if (req.placeIds.length < 2) {
      const errorResponse: ApiErrorResponse = {
        error: "At least 2 places are required.",
      };
      return reply.code(400).send(errorResponse);
    }
    const item = await createSavedRoute(
      req.deviceId.trim(),
      req.name.trim(),
      req.placeIds,
      req.transportType,
    );
    return reply.code(201).send({ item });
  });

  app.patch<{ Params: { id: string } }>(
    "/api/saved-routes/:id",
    async (request, reply) => {
      const body = request.body as unknown;
      if (
        typeof body !== "object" ||
        body === null ||
        !("deviceId" in body) ||
        typeof (body as Record<string, unknown>).deviceId !== "string"
      ) {
        const errorResponse: ApiErrorResponse = {
          error: "Body must contain deviceId.",
        };
        return reply.code(400).send(errorResponse);
      }
      const req = body as UpdateSavedRouteRequest;
      if (
        req.transportType !== undefined &&
        !TRANSPORT_TYPES.includes(req.transportType)
      ) {
        const errorResponse: ApiErrorResponse = {
          error: "Unknown transport type.",
        };
        return reply.code(400).send(errorResponse);
      }
      const item = await updateSavedRoute(
        request.params.id,
        req.deviceId.trim(),
        {
          name: req.name?.trim(),
          placeIds: req.placeIds,
          transportType: req.transportType,
        },
      );
      if (!item) {
        const errorResponse: ApiErrorResponse = {
          error: "Saved route not found.",
        };
        return reply.code(404).send(errorResponse);
      }
      return { item };
    },
  );

  app.delete<{ Params: { id: string }; Querystring: { deviceId?: string } }>(
    "/api/saved-routes/:id",
    async (request, reply) => {
      const { deviceId } = request.query;
      if (!deviceId || deviceId.trim() === "") {
        const errorResponse: ApiErrorResponse = {
          error: "deviceId is required.",
        };
        return reply.code(400).send(errorResponse);
      }
      const deleted = await deleteSavedRoute(
        request.params.id,
        deviceId.trim(),
      );
      if (!deleted) {
        const errorResponse: ApiErrorResponse = {
          error: "Saved route not found.",
        };
        return reply.code(404).send(errorResponse);
      }
      return reply.code(204).send();
    },
  );

  return app;
}
