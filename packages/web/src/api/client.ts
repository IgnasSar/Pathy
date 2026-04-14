import type {
  PlaceCategory,
  PlaceDetailResponse,
  PlaceFiltersResponse,
  PlacesResponse,
} from "@pathy/shared";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  const data = (await res.json()) as T;
  if (!res.ok) throw new Error((data as { error?: string }).error ?? "Request failed");
  return data;
}

export interface PlacesQuery {
  query?: string;
  category?: PlaceCategory;
  region?: string;
  radiusKm?: number;
  lat?: number;
  lng?: number;
  excludeId?: string;
  limit?: number;
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined) as [string, string | number][];
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}

export const api = {
  filters: () => get<PlaceFiltersResponse>("/filters"),

  places: (query: PlacesQuery = {}) => {
    const qs = buildQueryString({
      query: query.query,
      category: query.category,
      region: query.region,
      radiusKm: query.radiusKm,
      lat: query.lat,
      lng: query.lng,
      excludeId: query.excludeId,
      limit: query.limit,
    });
    return get<PlacesResponse>(`/places${qs}`);
  },

  placeDetail: (id: string) => get<PlaceDetailResponse>(`/places/${id}`),
};
