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
  sourceSubTypeName?: string;
  radiusKm?: number;
  origin?: Coordinates;
  excludeId?: string;
  limit?: number;
  offset?: number;
};

export type SourceSubTypeOption = {
  name: string;
  count: number;
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
      p.slug as id,
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

  let searchQueryParam: string | undefined;

  if (filters.query && filters.query.length > 0) {
    searchQueryParam = addValue(filters.query);
    const searchPatternParam = addValue(`%${filters.query}%`);
    where.push(`(
      p.name ilike ${searchPatternParam}
      or p.short_description ilike ${searchPatternParam}
      or p.municipality ilike ${searchPatternParam}
      or to_tsvector(
        'lithuanian',
        coalesce(p.name, '') || ' ' ||
        coalesce(p.short_description, '') || ' ' ||
        coalesce(p.full_description, '') || ' ' ||
        coalesce(p.municipality, '') || ' ' ||
        coalesce(p.address, '')
      ) @@ websearch_to_tsquery('lithuanian', ${searchQueryParam})
      or similarity(p.name, ${searchQueryParam}) > 0.2
      or word_similarity(${searchQueryParam}, p.name) > 0.35
      or exists (
        select 1 from place_tags search_pt
        where search_pt.place_id = p.id and search_pt.tag ilike ${searchPatternParam}
      )
    )`);
  }

  if (filters.category) {
    where.push(`p.category = ${addValue(filters.category)}`);
  }

  if (filters.region) {
    where.push(`p.region = ${addValue(filters.region)}`);
  }

  if (filters.sourceSubTypeName) {
    where.push(
      `p.source_sub_type_name = ${addValue(filters.sourceSubTypeName)}`,
    );
  }

  if (filters.excludeId) {
    where.push(`p.slug <> ${addValue(filters.excludeId)}`);
  }

  if (filters.radiusKm !== undefined && filters.origin) {
    where.push(
      `ST_DWithin(p.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, ${addValue(filters.radiusKm * 1000)})`,
    );
  }

  const whereSql = where.length > 0 ? `where ${where.join(" and ")}` : "";
  const searchOrderSql = searchQueryParam
    ? `
      ts_rank_cd(
        to_tsvector(
          'lithuanian',
          coalesce(p.name, '') || ' ' ||
          coalesce(p.short_description, '') || ' ' ||
          coalesce(p.full_description, '') || ' ' ||
          coalesce(p.municipality, '') || ' ' ||
          coalesce(p.address, '')
        ),
        websearch_to_tsquery('lithuanian', ${searchQueryParam})
      ) desc,
      similarity(p.name, ${searchQueryParam}) desc,
      word_similarity(${searchQueryParam}, p.name) desc,
    `
    : "";
  const orderSql = filters.origin
    ? `order by ${searchOrderSql} distance_km asc`
    : `order by ${searchOrderSql} p.name asc`;
  const countValues = [...values];
  const limit = Math.trunc(filters.limit ?? 24);
  const offset = Math.trunc(filters.offset ?? 0);
  const limitSql = `limit ${addValue(limit)} offset ${addValue(offset)}`;

  const result = await pool.query<PlaceRow>(
    `
      ${getBaseSelect(filters.origin)}
      ${whereSql}
      group by p.id, p.slug
      ${orderSql}
      ${limitSql}
    `,
    values,
  );

  const countResult = await pool.query<{ count: string }>(
    `
      select count(*) from (
        ${getBaseSelect(filters.origin)}
        ${whereSql}
        group by p.id, p.slug
      ) counted
    `,
    countValues,
  );

  return {
    items: result.rows.map(toSummary),
    total: Number(countResult.rows[0].count),
    limit,
    offset,
  };
}

export async function getSourceSubTypes(): Promise<SourceSubTypeOption[]> {
  const result = await pool.query<{ name: string; count: string }>(
    `
      select source_sub_type_name as name, count(*) as count
      from places
      where source_sub_type_name is not null
        and trim(source_sub_type_name) <> ''
      group by source_sub_type_name
      order by count(*) desc, source_sub_type_name asc
    `,
  );

  return result.rows.map((row) => ({
    name: row.name,
    count: Number(row.count),
  }));
}

export async function getPlaceById(id: string) {
  const result = await pool.query<PlaceRow>(
    `
      ${getBaseSelect()}
      where p.slug = $1
      group by p.id, p.slug
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
      where p.slug = any($1::text[])
      group by p.id, p.slug
    `,
    [ids],
  );
  const placeById = new Map(result.rows.map((row) => [row.id, toDetail(row)]));

  return ids.map((id) => placeById.get(id));
}
