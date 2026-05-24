export const PLACE_CATEGORIES = [
  "museum",
  "castle",
  "church",
  "viewpoint",
  "nature",
  "park",
  "memorial",
  "archaeology",
  "street-art",
  "landmark",
  "heritage",
  "engineering",
  "ethnography",
  "trail",
  "beach",
  "water-activity",
  "adventure",
  "sports",
  "food",
  "lodging",
  "transport",
  "service",
  "shopping",
  "event",
  "animal",
  "wellness",
  "other",
] as const;

export const TRANSPORT_TYPES = ["car", "bike", "walk"] as const;

export const RADIUS_OPTIONS_KM = [5, 10, 25, 50, 100] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export const PAMATYK_LIETUVOJE_TYPE_CATEGORY_MAP: Record<
  number,
  PlaceCategory
> = {
  1: "viewpoint",
  2: "nature",
  3: "castle",
  4: "museum",
  5: "church",
  6: "ethnography",
  7: "engineering",
  8: "animal",
  9: "archaeology",
  10: "landmark",
  11: "landmark",
  12: "other",
  13: "animal",
  14: "adventure",
  15: "adventure",
  16: "sports",
  17: "transport",
  18: "adventure",
  19: "water-activity",
  20: "water-activity",
  21: "beach",
  22: "water-activity",
  23: "sports",
  24: "food",
  34: "service",
  35: "service",
  36: "service",
  37: "service",
  38: "event",
  39: "sports",
  40: "sports",
  41: "transport",
  42: "transport",
  43: "transport",
  44: "transport",
  45: "sports",
  46: "lodging",
  47: "wellness",
  48: "lodging",
  49: "lodging",
  50: "lodging",
  51: "lodging",
  52: "lodging",
  53: "trail",
  54: "service",
  55: "park",
  56: "adventure",
  59: "landmark",
  60: "wellness",
  61: "shopping",
  62: "service",
  63: "service",
  64: "service",
  65: "service",
  66: "lodging",
  67: "lodging",
  68: "lodging",
  70: "food",
  71: "food",
  72: "food",
  73: "food",
  74: "food",
  75: "food",
  76: "food",
  77: "event",
  78: "lodging",
  79: "trail",
  80: "shopping",
  81: "food",
  82: "event",
  83: "adventure",
  84: "service",
  85: "adventure",
};

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
  sourceSubTypeName?: string;
  radiusKm?: number;
  origin?: Coordinates;
  excludeId?: string;
  limit?: number;
  offset?: number;
};

export type PlacesResponse = {
  items: PlaceSummary[];
  total: number;
  limit: number;
  offset: number;
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
  segments: Coordinates[][];
};

export type RecognizeRequest = {
  imageBase64: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  origin?: Coordinates;
  radiusKm?: number;
};

export type RecognizePrediction = {
  sourceSubTypeName: string | null;
  confidence: "high" | "medium" | "low";
};

export type RecognizeResponse = {
  prediction: RecognizePrediction;
  items: PlaceSummary[];
  total: number;
  limit: number;
  offset: number;
};

// ── Saved Routes ─────────────────────────────────────────────────────────────

export type SavedRouteSummary = {
  id: string;
  name: string;
  placeIds: string[];
  transportType: TransportType;
  createdAt: string;
  updatedAt: string;
};

export type SavedRoute = SavedRouteSummary & {
  places: PlaceDetail[];
};

export type SavedRouteListResponse = {
  items: SavedRouteSummary[];
};

export type SavedRouteDetailResponse = {
  item: SavedRoute;
};

export type CreateSavedRouteRequest = {
  deviceId: string;
  name: string;
  placeIds: string[];
  transportType: TransportType;
};

export type UpdateSavedRouteRequest = {
  deviceId: string;
  name?: string;
  placeIds?: string[];
  transportType?: TransportType;
};
