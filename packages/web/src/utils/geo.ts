import type { Coordinates, PlaceSummary } from "@pathy/shared";

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function haversineKm(from: Coordinates, to: Coordinates) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lngDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function optimizePlacesOrder(places: PlaceSummary[]): PlaceSummary[] {
  if (places.length <= 2) return [...places];

  // We assume the first added place is the desired starting origin.
  const start = places[0];
  const unvisited = [...places.slice(1)];
  const optimized: PlaceSummary[] = [start];

  let current = start;

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < unvisited.length; i++) {
      // Fallback for safety if coordinates are completely missing
      if (!current.coordinates || !unvisited[i].coordinates) continue;

      const dist = haversineKm(current.coordinates, unvisited[i].coordinates);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }

    current = unvisited[nearestIdx];
    optimized.push(current);
    unvisited.splice(nearestIdx, 1);
  }

  return optimized;
}
