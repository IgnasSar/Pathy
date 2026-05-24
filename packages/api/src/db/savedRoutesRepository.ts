import type {
  PlaceDetail,
  SavedRoute,
  SavedRouteSummary,
  TransportType,
} from "@pathy/shared";
import { pool } from "./client.js";
import { getPlacesByIds } from "./placesRepository.js";

type SavedRouteRow = {
  id: string;
  device_id: string;
  name: string;
  place_ids: string[];
  transport_type: string;
  created_at: Date;
  updated_at: Date;
};

function toSummary(row: SavedRouteRow): SavedRouteSummary {
  return {
    id: row.id,
    name: row.name,
    placeIds: row.place_ids,
    transportType: row.transport_type as TransportType,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listSavedRoutes(
  deviceId: string,
): Promise<SavedRouteSummary[]> {
  const result = await pool.query<SavedRouteRow>(
    `SELECT id, device_id, name, place_ids, transport_type, created_at, updated_at
     FROM saved_routes
     WHERE device_id = $1
     ORDER BY created_at DESC`,
    [deviceId],
  );
  return result.rows.map(toSummary);
}

export async function getSavedRoute(
  id: string,
  deviceId: string,
): Promise<SavedRoute | undefined> {
  const result = await pool.query<SavedRouteRow>(
    `SELECT id, device_id, name, place_ids, transport_type, created_at, updated_at
     FROM saved_routes
     WHERE id = $1 AND device_id = $2`,
    [id, deviceId],
  );

  const row = result.rows[0];
  if (!row) return undefined;

  const places = await getPlacesByIds(row.place_ids);
  const resolvedPlaces = places.filter(
    (p): p is PlaceDetail => p !== undefined,
  );

  return {
    ...toSummary(row),
    places: resolvedPlaces,
  };
}

export async function createSavedRoute(
  deviceId: string,
  name: string,
  placeIds: string[],
  transportType: string,
): Promise<SavedRouteSummary> {
  const result = await pool.query<SavedRouteRow>(
    `INSERT INTO saved_routes (device_id, name, place_ids, transport_type)
     VALUES ($1, $2, $3::jsonb, $4)
     RETURNING id, device_id, name, place_ids, transport_type, created_at, updated_at`,
    [deviceId, name, JSON.stringify(placeIds), transportType],
  );
  return toSummary(result.rows[0]);
}

export async function updateSavedRoute(
  id: string,
  deviceId: string,
  data: { name?: string; placeIds?: string[]; transportType?: string },
): Promise<SavedRouteSummary | undefined> {
  const setClauses: string[] = ["updated_at = now()"];
  const values: unknown[] = [id, deviceId];

  if (data.name !== undefined) {
    values.push(data.name);
    setClauses.push(`name = $${values.length}`);
  }
  if (data.placeIds !== undefined) {
    values.push(JSON.stringify(data.placeIds));
    setClauses.push(`place_ids = $${values.length}::jsonb`);
  }
  if (data.transportType !== undefined) {
    values.push(data.transportType);
    setClauses.push(`transport_type = $${values.length}`);
  }

  if (setClauses.length === 1) {
    // Nothing to update besides timestamp
    const result = await pool.query<SavedRouteRow>(
      `SELECT id, device_id, name, place_ids, transport_type, created_at, updated_at
       FROM saved_routes WHERE id = $1 AND device_id = $2`,
      [id, deviceId],
    );
    return result.rows[0] ? toSummary(result.rows[0]) : undefined;
  }

  const result = await pool.query<SavedRouteRow>(
    `UPDATE saved_routes
     SET ${setClauses.join(", ")}
     WHERE id = $1 AND device_id = $2
     RETURNING id, device_id, name, place_ids, transport_type, created_at, updated_at`,
    values,
  );
  return result.rows[0] ? toSummary(result.rows[0]) : undefined;
}

export async function deleteSavedRoute(
  id: string,
  deviceId: string,
): Promise<boolean> {
  const result = await pool.query(
    `DELETE FROM saved_routes WHERE id = $1 AND device_id = $2`,
    [id, deviceId],
  );
  return (result.rowCount ?? 0) > 0;
}
