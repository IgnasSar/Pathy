CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE INDEX IF NOT EXISTS places_search_lithuanian_idx
ON places USING gin (
  to_tsvector(
    'lithuanian',
    coalesce(name, '') || ' ' ||
    coalesce(short_description, '') || ' ' ||
    coalesce(full_description, '') || ' ' ||
    coalesce(municipality, '') || ' ' ||
    coalesce(address, '')
  )
);

CREATE INDEX IF NOT EXISTS places_name_trgm_idx
ON places USING gin (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS places_short_description_trgm_idx
ON places USING gin (short_description gin_trgm_ops);
