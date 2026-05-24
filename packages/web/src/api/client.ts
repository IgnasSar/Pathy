import type {
  PlaceCategory,
  PlaceDetailResponse,
  PlaceFiltersResponse,
  PlacesResponse,
  RecognizeRequest,
  RecognizeResponse,
  RoutePreviewRequest,
  RoutePreviewResponse,
  SavedRouteListResponse,
  SavedRouteDetailResponse,
  CreateSavedRouteRequest,
  UpdateSavedRouteRequest,
} from "@pathy/shared";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Request failed");
  }
  if (!res.ok)
    throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Request failed");
  }
  if (!res.ok)
    throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

async function patch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error("Request failed");
  }
  if (!res.ok)
    throw new Error((data as { error?: string }).error ?? "Request failed");
  return data as T;
}

async function del(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    let err = "Request failed";
    try {
      const data = await res.json();
      if (data.error) err = data.error;
    } catch {}
    throw new Error(err);
  }
}

export interface PlacesQuery {
  query?: string;
  category?: PlaceCategory;
  region?: string;
  sourceSubTypeName?: string;
  radiusKm?: number;
  lat?: number;
  lng?: number;
  excludeId?: string;
  limit?: number;
  offset?: number;
}

function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined) as [
    string,
    string | number,
  ][];
  if (entries.length === 0) return "";
  return (
    "?" +
    entries
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&")
  );
}

export const api = {
  recognize: (req: RecognizeRequest) =>
    post<RecognizeResponse>("/recognize", req),

  filters: () => get<PlaceFiltersResponse>("/filters"),

  places: (query: PlacesQuery = {}) => {
    const qs = buildQueryString({
      query: query.query,
      category: query.category,
      region: query.region,
      sourceSubTypeName: query.sourceSubTypeName,
      radiusKm: query.radiusKm,
      lat: query.lat,
      lng: query.lng,
      excludeId: query.excludeId,
      limit: query.limit,
      offset: query.offset,
    });
    return get<PlacesResponse>(`/places${qs}`);
  },

  placeDetail: (id: string) => get<PlaceDetailResponse>(`/places/${id}`),

  routePreview: (req: RoutePreviewRequest) =>
    post<RoutePreviewResponse>("/route-preview", req),

  savedRoutes: {
    list: (deviceId: string) =>
      get<SavedRouteListResponse>(`/saved-routes?deviceId=${deviceId}`),
    get: (id: string, deviceId: string) =>
      get<SavedRouteDetailResponse>(`/saved-routes/${id}?deviceId=${deviceId}`),
    create: (req: CreateSavedRouteRequest) =>
      post<{ item: SavedRouteDetailResponse["item"] }>("/saved-routes", req),
    update: (id: string, req: UpdateSavedRouteRequest) =>
      patch<{ item: SavedRouteDetailResponse["item"] }>(
        `/saved-routes/${id}`,
        req,
      ),
    delete: (id: string, deviceId: string) =>
      del(`/saved-routes/${id}?deviceId=${deviceId}`),
  },
};
