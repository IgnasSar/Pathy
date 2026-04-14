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
