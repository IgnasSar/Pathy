export const PLACE_CATEGORIES = [
  "museum",
  "castle",
  "nature",
  "viewpoint",
  "park",
  "landmark",
] as const;

export const TRANSPORT_TYPES = ["car", "bike", "walk"] as const;

export const RADIUS_OPTIONS_KM = [5, 10, 25, 50, 100] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export type TransportType = (typeof TRANSPORT_TYPES)[number];

export type RadiusOptionKm = (typeof RADIUS_OPTIONS_KM)[number];

export type HealthResponse = {
  status: "ok";
};

export type ApiErrorResponse = {
  error: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type PlaceSummary = {
  id: string;
  name: string;
  category: PlaceCategory;
  shortDescription: string;
  region: string;
  municipality: string;
  coordinates: Coordinates;
  thumbnailUrl: string | null;
  recommendedVisitMinutes: number;
  distanceKm?: number;
};

export type PlaceDetail = PlaceSummary & {
  fullDescription: string;
  address: string;
  tags: string[];
  imageUrls: string[];
};

export type PlacesQuery = {
  query?: string;
  category?: PlaceCategory;
  region?: string;
  radiusKm?: number;
  origin?: Coordinates;
  excludeId?: string;
  limit?: number;
};

export type PlacesResponse = {
  items: PlaceSummary[];
  total: number;
};

export type PlaceDetailResponse = {
  item: PlaceDetail;
};

export type PlaceFiltersResponse = {
  categories: PlaceCategory[];
  regions: string[];
  transportTypes: TransportType[];
  radiusOptionsKm: RadiusOptionKm[];
};

export type RoutePreviewRequest = {
  placeIds: string[];
  transportType: TransportType;
  origin?: Coordinates;
};

export type RouteStop = {
  order: number;
  id: string;
  name: string;
  coordinates: Coordinates;
};

export type RoutePreviewResponse = {
  stops: RouteStop[];
  totals: {
    distanceKm: number;
    durationMinutes: number;
    transportType: TransportType;
  };
  path: Coordinates[];
};
