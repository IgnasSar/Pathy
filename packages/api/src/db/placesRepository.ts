import type {
  Coordinates,
  PlaceCategory,
  PlaceDetail,
  PlaceFiltersResponse,
  PlaceSummary,
} from "@pathy/shared";
import {
  PLACE_CATEGORIES,
  RADIUS_OPTIONS_KM,
  TRANSPORT_TYPES,
} from "@pathy/shared";
import { pool } from "./client.js";

export type ListPlacesFilters = {
  query?: string;
  category?: string;
  region?: string;
  radiusKm?: number;
  origin?: Coordinates;
  excludeId?: string;
  limit?: number;
  offset?: number;
};

type PlaceRow = {
  id: string;
  name: string;
  category: string;
  short_description: string;
  full_description: string;
  region: string;
  municipality: string;
  address: string;
  lat: number;
  lng: number;
  thumbnail_url: string | null;
  recommended_visit_minutes: number;
  image_urls: string[] | null;
  tags: string[] | null;
  distance_km?: number | null;
};

function toPlaceCategory(value: string): PlaceCategory {
  return PLACE_CATEGORIES.includes(value as PlaceCategory)
    ? (value as PlaceCategory)
    : "other";
}

function toSummary(row: PlaceRow): PlaceSummary {
  return {
    id: row.id,
    name: row.name,
    category: toPlaceCategory(row.category),
    shortDescription: row.short_description,
    region: row.region,
    municipality: row.municipality,
    coordinates: { lat: row.lat, lng: row.lng },
    thumbnailUrl: row.thumbnail_url,
    recommendedVisitMinutes: row.recommended_visit_minutes,
    ...(row.distance_km !== undefined && row.distance_km !== null
      ? { distanceKm: Number(row.distance_km) }
      : {}),
  };
}

function toDetail(row: PlaceRow): PlaceDetail {
  return {
    ...toSummary(row),
    fullDescription: row.full_description,
    address: row.address,
    tags: row.tags ?? [],
    imageUrls: row.image_urls ?? [],
  };
}

function getBaseSelect(origin?: Coordinates) {
  const distanceSelect = origin
    ? `round((ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000)::numeric, 1)::double precision as distance_km,`
    : "null::double precision as distance_km,";

  return `
    select
      p.id,
      p.name,
      p.category,
      p.short_description,
      p.full_description,
      p.region,
      p.municipality,
      p.address,
      p.lat,
      p.lng,
      p.thumbnail_url,
      p.recommended_visit_minutes,
      ${distanceSelect}
      coalesce(array_agg(distinct pi.url) filter (where pi.url is not null), '{}') as image_urls,
      coalesce(array_agg(distinct pt.tag) filter (where pt.tag is not null), '{}') as tags
    from places p
    left join place_images pi on pi.place_id = p.id
    left join place_tags pt on pt.place_id = p.id
  `;
}

export async function getPlaceFilters(): Promise<PlaceFiltersResponse> {
  const result = await pool.query<{ category: string; region: string }>(
    "select distinct category, region from places order by category, region",
  );

  return {
    categories: PLACE_CATEGORIES.filter((category) =>
      result.rows.some((row) => row.category === category),
    ),
    regions: Array.from(new Set(result.rows.map((row) => row.region))).sort(
      (left, right) => left.localeCompare(right, "lt"),
    ),
    transportTypes: [...TRANSPORT_TYPES],
    radiusOptionsKm: [...RADIUS_OPTIONS_KM],
  };
}

export async function listPlaces(filters: ListPlacesFilters) {
  const values: unknown[] = [];
  const where: string[] = [];

  if (filters.origin) {
    values.push(filters.origin.lng, filters.origin.lat);
  }

  function addValue(value: unknown) {
    values.push(value);
    return `$${values.length}`;
  }

  if (filters.query && filters.query.length > 0) {
    const param = addValue(`%${filters.query}%`);
    where.push(`(
      p.name ilike ${param}
      or p.short_description ilike ${param}
      or p.municipality ilike ${param}
      or exists (
        select 1 from place_tags search_pt
        where search_pt.place_id = p.id and search_pt.tag ilike ${param}
      )
    )`);
  }

  if (filters.category) {
    where.push(`p.category = ${addValue(filters.category)}`);
  }

  if (filters.region) {
    where.push(`p.region = ${addValue(filters.region)}`);
  }

  if (filters.excludeId) {
    where.push(`p.id <> ${addValue(filters.excludeId)}::uuid`);
  }

  if (filters.radiusKm !== undefined && filters.origin) {
    where.push(
      `ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, ${addValue(filters.radiusKm * 1000)})`,
    );
  }

  const whereSql = where.length > 0 ? `where ${where.join(" and ")}` : "";
  const orderSql = filters.origin
    ? "order by distance_km asc"
    : "order by p.name asc";
  const countValues = [...values];
  const limit = Math.trunc(filters.limit ?? 24);
  const offset = Math.trunc(filters.offset ?? 0);
  const limitSql = `limit ${addValue(limit)} offset ${addValue(offset)}`;

  const result = await pool.query<PlaceRow>(
    `
      ${getBaseSelect(filters.origin)}
      ${whereSql}
      group by p.id
      ${orderSql}
      ${limitSql}
    `,
    values,
  );

  const countResult = await pool.query<{ count: string }>(
    `select count(*) from places p ${whereSql}`,
    countValues,
  );

  return {
    items: result.rows.map(toSummary),
    total: Number(countResult.rows[0].count),
    limit,
    offset,
  };
}

export async function getPlaceById(id: string) {
  const result = await pool.query<PlaceRow>(
    `
      ${getBaseSelect()}
      where p.id = $1::uuid
      group by p.id
    `,
    [id],
  );

  return result.rows[0] ? toDetail(result.rows[0]) : undefined;
}

export async function getPlacesByIds(ids: string[]) {
  if (ids.length === 0) return [];

  const result = await pool.query<PlaceRow>(
    `
      ${getBaseSelect()}
      where p.id = any($1::uuid[])
      group by p.id
    `,
    [ids],
  );
  const placeById = new Map(result.rows.map((row) => [row.id, toDetail(row)]));

  return ids.map((id) => placeById.get(id));
}
