import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "dotenv";
import pg from "pg";
import {
  PAMATYK_LIETUVOJE_TYPE_CATEGORY_MAP,
  type PlaceCategory,
} from "@pathy/shared";

config({ path: "../../.env" });

type ScrapedObject = {
  commonObjectId?: number;
  address?: string | null;
  globalId: string;
  name: string;
  shape?: { x?: number; y?: number; srid?: number } | null;
  pathPointObjectShapes?: unknown;
  photoUrl?: string | null;
  subType?: {
    id?: number;
    code?: number;
    nameLt?: string | null;
  } | null;
  type?: {
    id?: number;
    nameLt?: string | null;
  } | null;
};

type ScrapeOutput = {
  activeObjects?: ScrapedObject[];
  passiveObjects?: ScrapedObject[];
};

const SOURCE = "pamatyklietuvoje";
const DEFAULT_INPUT = "../../tmp/pamatyklietuvoje-objects.json";

function slugify(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return normalized || "place";
}

function getStableSlug(item: ScrapedObject) {
  const suffix = item.commonObjectId ?? item.globalId.slice(0, 8);
  return `${slugify(item.name)}-${suffix}`;
}

function getCategory(item: ScrapedObject): PlaceCategory {
  if (item.type?.id !== undefined) {
    return PAMATYK_LIETUVOJE_TYPE_CATEGORY_MAP[item.type.id] ?? "other";
  }

  return "other";
}

function getMunicipality(address: string | null | undefined) {
  if (!address) return "Nežinoma";

  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.at(-1) ?? "Nežinoma";
}

function getRegion(_address: string | null | undefined) {
  return "Lietuva";
}

function getDescription(item: ScrapedObject) {
  const category = item.subType?.nameLt ?? item.type?.nameLt;
  const address = item.address?.trim();

  if (category && address) {
    return `${category}. Adresas: ${address}.`;
  }

  if (category) {
    return category;
  }

  if (address) {
    return `Adresas: ${address}.`;
  }

  return item.name;
}

function getTags(item: ScrapedObject) {
  return Array.from(
    new Set(
      [item.type?.nameLt, item.subType?.nameLt]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.toLowerCase()),
    ),
  );
}

function isImportable(item: ScrapedObject) {
  return (
    item.globalId &&
    item.name &&
    typeof item.shape?.x === "number" &&
    typeof item.shape?.y === "number"
  );
}

async function resolveInputPath(inputPath: string) {
  const candidates = [inputPath, resolve("../..", inputPath)];

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try next candidate.
    }
  }

  return inputPath;
}

async function main() {
  const inputPath = await resolveInputPath(process.argv[2] ?? DEFAULT_INPUT);
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  const raw = await readFile(inputPath, "utf8");
  const data = JSON.parse(raw) as ScrapeOutput;
  const objects = [
    ...(data.activeObjects ?? []),
    ...(data.passiveObjects ?? []),
  ];
  // TODO: Consider preserving whether a source object came from activeObjects,
  // passiveObjects, or both. For now we deduplicate by globalId and import one
  // place row per source object.
  const importableObjects = Array.from(
    new Map(
      objects
        .filter(isImportable)
        .map((item) => [item.globalId, item] as const),
    ).values(),
  );
  const skipped = objects.length - importableObjects.length;

  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  try {
    await client.query("begin");

    const placeRows = importableObjects.map((item) => {
      const description = getDescription(item);

      return {
        slug: getStableSlug(item),
        name: item.name,
        category: getCategory(item),
        shortDescription: description.slice(0, 280),
        fullDescription: description,
        region: getRegion(item.address),
        municipality: getMunicipality(item.address),
        address: item.address ?? "",
        lat: item.shape!.y,
        lng: item.shape!.x,
        thumbnailUrl: item.photoUrl ?? null,
        recommendedVisitMinutes: 60,
        source: SOURCE,
        sourceId: item.globalId,
        sourceUrl: `https://www.pamatyklietuvoje.lt/details/${item.globalId}`,
        sourceTypeId: item.type?.id ?? null,
        sourceTypeName: item.type?.nameLt ?? null,
        sourceSubTypeId: item.subType?.id ?? null,
        sourceSubTypeName: item.subType?.nameLt ?? null,
        sourceGeometry: {
          shape: item.shape,
          pathPointObjectShapes: item.pathPointObjectShapes ?? null,
        },
      };
    });

    const upsertResult = await client.query<{ id: string; source_id: string }>(
      `
        with input as (
          select * from jsonb_to_recordset($1::jsonb) as x(
            slug text,
            name text,
            category text,
            "shortDescription" text,
            "fullDescription" text,
            region text,
            municipality text,
            address text,
            lat double precision,
            lng double precision,
            "thumbnailUrl" text,
            "recommendedVisitMinutes" integer,
            source text,
            "sourceId" text,
            "sourceUrl" text,
            "sourceTypeId" integer,
            "sourceTypeName" text,
            "sourceSubTypeId" integer,
            "sourceSubTypeName" text,
            "sourceGeometry" jsonb
          )
        )
        insert into places (
          slug,
          name,
          category,
          short_description,
          full_description,
          region,
          municipality,
          address,
          lat,
          lng,
          thumbnail_url,
          recommended_visit_minutes,
          source,
          source_id,
          source_url,
          source_type_id,
          source_type_name,
          source_sub_type_id,
          source_sub_type_name,
          source_geometry,
          updated_at
        )
        select
          slug,
          name,
          category,
          "shortDescription",
          "fullDescription",
          region,
          municipality,
          address,
          lat,
          lng,
          "thumbnailUrl",
          "recommendedVisitMinutes",
          source,
          "sourceId",
          "sourceUrl",
          "sourceTypeId",
          "sourceTypeName",
          "sourceSubTypeId",
          "sourceSubTypeName",
          "sourceGeometry",
          now()
        from input
        on conflict (source, source_id) where source is not null and source_id is not null
        do update set
          slug = excluded.slug,
          name = excluded.name,
          category = excluded.category,
          short_description = excluded.short_description,
          full_description = excluded.full_description,
          region = excluded.region,
          municipality = excluded.municipality,
          address = excluded.address,
          lat = excluded.lat,
          lng = excluded.lng,
          thumbnail_url = excluded.thumbnail_url,
          recommended_visit_minutes = excluded.recommended_visit_minutes,
          source_url = excluded.source_url,
          source_type_id = excluded.source_type_id,
          source_type_name = excluded.source_type_name,
          source_sub_type_id = excluded.source_sub_type_id,
          source_sub_type_name = excluded.source_sub_type_name,
          source_geometry = excluded.source_geometry,
          updated_at = now()
        returning id, source_id
      `,
      [JSON.stringify(placeRows)],
    );

    const placeIdBySourceId = new Map(
      upsertResult.rows.map((row) => [row.source_id, row.id]),
    );
    const placeIds = upsertResult.rows.map((row) => row.id);

    await client.query(
      "delete from place_images where place_id = any($1::uuid[])",
      [placeIds],
    );
    await client.query(
      "delete from place_tags where place_id = any($1::uuid[])",
      [placeIds],
    );

    const imageRows = importableObjects
      .map((item) => ({
        placeId: placeIdBySourceId.get(item.globalId),
        url: item.photoUrl,
      }))
      .filter((row): row is { placeId: string; url: string } =>
        Boolean(row.placeId && row.url),
      );

    if (imageRows.length > 0) {
      await client.query(
        `
          insert into place_images (place_id, url, sort_order)
          select "placeId", url, 0
          from jsonb_to_recordset($1::jsonb) as x("placeId" uuid, url text)
        `,
        [JSON.stringify(imageRows)],
      );
    }

    const tagRows = importableObjects.flatMap((item) => {
      const placeId = placeIdBySourceId.get(item.globalId);
      return placeId ? getTags(item).map((tag) => ({ placeId, tag })) : [];
    });

    if (tagRows.length > 0) {
      await client.query(
        `
          insert into place_tags (place_id, tag)
          select "placeId", tag
          from jsonb_to_recordset($1::jsonb) as x("placeId" uuid, tag text)
          on conflict do nothing
        `,
        [JSON.stringify(tagRows)],
      );
    }

    await client.query("commit");
    console.log(
      `Imported ${upsertResult.rowCount} places from ${inputPath}. Skipped ${skipped} objects without coordinates.`,
    );
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
