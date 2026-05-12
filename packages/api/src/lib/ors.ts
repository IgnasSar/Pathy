packages/api/src/lib/ors.tsimport type { Coordinates, TransportType } from "@pathy/shared";

const ORS_BASE = "https://api.openrouteservice.org/v2/directions";

const ORS_PROFILES: Record<TransportType, string> = {
  car: "driving-car",
  bike: "cycling-regular",
  walk: "foot-walking",
};

type OrsGeoJsonResponse = {
  features: Array<{
    geometry: {
      coordinates: [number, number][];
    };
    properties: {
      summary: {
        distance: number;
        duration: number;
      };
      way_points: number[];
    };
  }>;
};

export type OrsRouteResult = {
  path: Coordinates[];
  segments: Coordinates[][];
  distanceKm: number;
  durationMinutes: number;
};

export async function getOrsRoute(
  waypoints: Coordinates[],
  transportType: TransportType,
): Promise<OrsRouteResult> {
  const apiKey = process.env.OPENROUTE_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTE_API_KEY is not configured.");
  }

  const profile = ORS_PROFILES[transportType];
  // ORS expects [longitude, latitude] — note the reversal
  const coordinates = waypoints.map((w) => [w.lng, w.lat]);

  const res = await fetch(`${ORS_BASE}/${profile}/geojson`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: apiKey,
    },
    body: JSON.stringify({
      coordinates,
      radiuses: coordinates.map(() => -1),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`ORS API error ${res.status}: ${body}`);
  }

  const data = (await res.json()) as OrsGeoJsonResponse;
  const feature = data.features?.[0];

  if (!feature) {
    throw new Error("ORS returned no route.");
  }

  const path: Coordinates[] = feature.geometry.coordinates.map(
    ([lng, lat]) => ({ lat, lng }),
  );

  const wayPointIndices = feature.properties.way_points;
  const segments: Coordinates[][] = [];
  for (let i = 0; i < wayPointIndices.length - 1; i++) {
    segments.push(path.slice(wayPointIndices[i], wayPointIndices[i + 1] + 1));
  }

  const distanceKm =
    Math.round(feature.properties.summary.distance / 100) / 10;
  const durationMinutes = Math.round(
    feature.properties.summary.duration / 60,
  );

  return { path, segments, distanceKm, durationMinutes };
}
