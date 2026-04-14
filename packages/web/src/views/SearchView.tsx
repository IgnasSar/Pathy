import { useCallback, useEffect, useState } from "react";
import type {
  PlaceCategory,
  PlaceFiltersResponse,
  PlaceSummary,
  RadiusOptionKm,
} from "@pathy/shared";
import { api } from "../api/client";
import { SearchBar } from "../components/SearchBar";
import { FilterBar } from "../components/FilterBar";
import { PlaceList } from "../components/PlaceList";

interface Coords {
  lat: number;
  lng: number;
}

export function SearchView() {
  // Filters state
  const [filters, setFilters] = useState<PlaceFiltersResponse | null>(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<PlaceCategory | null>(null);
  const [selectedRadius, setSelectedRadius] = useState<RadiusOptionKm | null>(
    null,
  );
  const [location, setLocation] = useState<Coords | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Places state
  const [places, setPlaces] = useState<PlaceSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load filters once
  useEffect(() => {
    api
      .filters()
      .then(setFilters)
      .catch(() => {});
  }, []);

  // Load places whenever filters change
  const fetchPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.places({
        query: query.trim() || undefined,
        category: selectedCategory ?? undefined,
        radiusKm: location && selectedRadius ? selectedRadius : undefined,
        lat: location?.lat,
        lng: location?.lng,
      });
      setPlaces(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nepavyko gauti vietų.");
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, selectedRadius, location]);

  useEffect(() => {
    void fetchPlaces();
  }, [fetchPlaces]);

  // GPS
  function handleGpsRequest() {
    if (!navigator.geolocation) {
      setGpsError("Jūsų naršyklė nepalaiko GPS.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsLoading(false);
      },
      () => {
        setGpsError("Nepavyko gauti lokacijos. Patikrinkite leidimus.");
        setGpsLoading(false);
      },
      { timeout: 8000 },
    );
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "calc(100dvh - 120px)" }}
    >
      {/* Search + GPS */}
      <SearchBar
        value={query}
        onChange={setQuery}
        onGpsRequest={handleGpsRequest}
        gpsLoading={gpsLoading}
      />

      {/* GPS status messages */}
      {location && (
        <div
          className="mx-4 mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
          style={{
            background: "rgb(52 199 89 / 0.1)",
            border: "1px solid rgb(52 199 89 / 0.25)",
            color: "rgb(52 199 89)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="6" />
          </svg>
          Lokacija nustatyta · rodomi atstumai
        </div>
      )}
      {gpsError && (
        <div
          className="mx-4 mb-2 rounded-xl px-3 py-2 text-xs font-medium"
          style={{
            background: "rgb(255 69 58 / 0.1)",
            border: "1px solid rgb(255 69 58 / 0.25)",
            color: "rgb(255 69 58)",
          }}
        >
          {gpsError}
        </div>
      )}

      {/* Category + Radius filters */}
      {filters && (
        <FilterBar
          categories={filters.categories}
          radiusOptions={filters.radiusOptionsKm}
          selectedCategory={selectedCategory}
          selectedRadius={selectedRadius}
          hasLocation={location !== null}
          onCategoryChange={setSelectedCategory}
          onRadiusChange={setSelectedRadius}
        />
      )}

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgb(40 48 64)",
          marginBottom: "0.75rem",
        }}
      />

      {/* Results */}
      <PlaceList
        places={places}
        loading={loading}
        error={error}
        total={total}
      />
    </div>
  );
}
