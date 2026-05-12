import {
  doublePrecision,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const places = pgTable(
  "places",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    shortDescription: text("short_description").notNull(),
    fullDescription: text("full_description").notNull(),
    region: text("region").notNull(),
    municipality: text("municipality").notNull(),
    address: text("address").notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    recommendedVisitMinutes: integer("recommended_visit_minutes")
      .notNull()
      .default(60),
    source: text("source"),
    sourceId: text("source_id"),
    sourceUrl: text("source_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("places_category_idx").on(table.category),
    index("places_region_idx").on(table.region),
    index("places_name_search_idx").using(
      "gin",
      sql`to_tsvector('simple', ${table.name})`,
    ),
    uniqueIndex("places_source_unique_idx")
      .on(table.source, table.sourceId)
      .where(sql`${table.source} is not null and ${table.sourceId} is not null`),
  ],
);

export const placeImages = pgTable(
  "place_images",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    placeId: uuid("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("place_images_place_id_idx").on(table.placeId)],
);

export const placeTags = pgTable(
  "place_tags",
  {
    placeId: uuid("place_id")
      .notNull()
      .references(() => places.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (table) => [primaryKey({ columns: [table.placeId, table.tag] })],
);

export type PlaceRow = typeof places.$inferSelect;
export type NewPlaceRow = typeof places.$inferInsert;
