import type { Coordinates, TransportType } from "@pathy/shared";

const transportSpeedsKmh: Record<TransportType, number> = {
  car: 70,
  bike: 18,
  walk: 5,
};

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

export function estimateDurationMinutes(
  distanceKm: number,
  transportType: TransportType,
) {
  if (distanceKm === 0) {
    return 0;
  }

  const hours = distanceKm / transportSpeedsKmh[transportType];
  return Math.max(1, Math.round(hours * 60));
}

export function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function optimizeRouteOrder<T extends { coordinates: Coordinates }>(
  places: T[],
): T[] {
  if (places.length <= 2) return places;

  // First place is kept as the fixed start point
  const unvisited = places.slice(1);
  const result: T[] = [places[0]];

  while (unvisited.length > 0) {
    const current = result[result.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = haversineKm(current.coordinates, unvisited[i].coordinates);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    result.push(unvisited.splice(nearestIdx, 1)[0]);
  }

  return result;
}
