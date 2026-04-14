import Fastify from "fastify";
import {
  PLACE_CATEGORIES,
  RADIUS_OPTIONS_KM,
  TRANSPORT_TYPES,
  type ApiErrorResponse,
  type Coordinates,
  type HealthResponse,
  type PlaceCategory,
  type PlaceDetail,
  type PlaceDetailResponse,
  type PlaceFiltersResponse,
  type PlaceSummary,
  type PlacesResponse,
  type RoutePreviewRequest,
  type RoutePreviewResponse,
} from "@pathy/shared";
import { mockPlaces } from "./data/mock-places.js";
import {
  estimateDurationMinutes,
  haversineKm,
  roundToOneDecimal,
} from "./lib/geo.js";

type PlacesQuerystring = {
  query?: string;
  category?: string;
  region?: string;
  radiusKm?: string;
  lat?: string;
  lng?: string;
  excludeId?: string;
  limit?: string;
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

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

function getPlaceSummary(
  place: PlaceDetail,
  origin?: Coordinates,
): PlaceSummary {
  const distanceKm = origin
    ? roundToOneDecimal(haversineKm(origin, place.coordinates))
    : undefined;

  return {
    id: place.id,
    name: place.name,
    category: place.category,
    shortDescription: place.shortDescription,
    region: place.region,
    municipality: place.municipality,
    coordinates: place.coordinates,
    thumbnailUrl: place.thumbnailUrl,
    recommendedVisitMinutes: place.recommendedVisitMinutes,
    ...(distanceKm !== undefined ? { distanceKm } : {}),
  };
}

function getPlaceFilters(): PlaceFiltersResponse {
  return {
    categories: PLACE_CATEGORIES.filter((category) =>
      mockPlaces.some((place) => place.category === category),
    ) as PlaceCategory[],
    regions: Array.from(new Set(mockPlaces.map((place) => place.region))).sort(
      (left, right) => left.localeCompare(right, "lt"),
    ),
    transportTypes: [...TRANSPORT_TYPES],
    radiusOptionsKm: [...RADIUS_OPTIONS_KM],
  };
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

  return undefined;
}

function matchesSearch(place: PlaceDetail, searchText: string) {
  const haystack = [
    place.name,
    place.shortDescription,
    place.municipality,
    ...place.tags,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(searchText);
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

      const searchText = request.query.query
        ? normalizeText(request.query.query)
        : undefined;
      const origin = getOriginFromQuery(request.query);
      const radiusKm = parseOptionalNumber(request.query.radiusKm);
      const limit = parseOptionalNumber(request.query.limit);

      const filteredPlaces = mockPlaces.filter((place) => {
        if (
          searchText !== undefined &&
          searchText.length > 0 &&
          !matchesSearch(place, searchText)
        ) {
          return false;
        }

        if (
          request.query.category !== undefined &&
          place.category !== request.query.category
        ) {
          return false;
        }

        if (
          request.query.region !== undefined &&
          place.region !== request.query.region
        ) {
          return false;
        }

        if (
          request.query.excludeId !== undefined &&
          place.id === request.query.excludeId
        ) {
          return false;
        }

        return true;
      });

      let items = filteredPlaces.map((place) => getPlaceSummary(place, origin));

      if (radiusKm !== undefined) {
        items = items.filter(
          (place) =>
            place.distanceKm !== undefined && place.distanceKm <= radiusKm,
        );
      }

      items.sort((left, right) => {
        if (origin !== undefined) {
          return (
            (left.distanceKm ?? Number.POSITIVE_INFINITY) -
            (right.distanceKm ?? Number.POSITIVE_INFINITY)
          );
        }

        return left.name.localeCompare(right.name, "lt");
      });

      const total = items.length;
      const limitedItems =
        limit !== undefined ? items.slice(0, Math.trunc(limit)) : items;

      const response: PlacesResponse = {
        items: limitedItems,
        total,
      };

      return response;
    },
  );

  app.get<{ Params: { id: string } }>(
    "/api/places/:id",
    async (request, reply) => {
      const item = mockPlaces.find((place) => place.id === request.params.id);

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

    const routePlaces = body.placeIds.map((placeId) =>
      mockPlaces.find((place) => place.id === placeId),
    );
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
    const totalDistanceKm = roundToOneDecimal(
      getRouteDistance(body.origin, resolvedPlaces),
    );
    const response: RoutePreviewResponse = {
      stops: resolvedPlaces.map((place, index) => ({
        order: index + 1,
        id: place.id,
        name: place.name,
        coordinates: place.coordinates,
      })),
      totals: {
        distanceKm: totalDistanceKm,
        durationMinutes: estimateDurationMinutes(
          totalDistanceKm,
          body.transportType,
        ),
        transportType: body.transportType,
      },
      path: getRoutePath(body.origin, resolvedPlaces),
    };

    return response;
  });

  return app;
}
