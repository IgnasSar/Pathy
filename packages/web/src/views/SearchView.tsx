import { useCallback, useEffect, useRef, useState } from "react";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const placesLengthRef = useRef(0);
  const loadingRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(false);

  // Load filters once
  useEffect(() => {
    api
      .filters()
      .then(setFilters)
      .catch(() => {});
  }, []);

  const pageSize = 24;

  // Load places whenever filters change
  const fetchPlaces = useCallback(
    async (offset = 0) => {
      if (offset === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);
      try {
        const res = await api.places({
          query: query.trim() || undefined,
          category: selectedCategory ?? undefined,
          radiusKm: location && selectedRadius ? selectedRadius : undefined,
          lat: location?.lat,
          lng: location?.lng,
          limit: pageSize,
          offset,
        });
        setPlaces((currentPlaces) =>
          offset === 0 ? res.items : [...currentPlaces, ...res.items],
        );
        setTotal(res.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Nepavyko gauti vietų.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, selectedCategory, selectedRadius, location],
  );

  useEffect(() => {
    void fetchPlaces();
  }, [fetchPlaces]);

  useEffect(() => {
    placesLengthRef.current = places.length;
    loadingRef.current = loading;
    loadingMoreRef.current = loadingMore;
    hasMoreRef.current = places.length < total;
  }, [places.length, loading, loadingMore, total]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node === null) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;

          if (
            entry.isIntersecting &&
            hasMoreRef.current &&
            !loadingRef.current &&
            !loadingMoreRef.current
          ) {
            void fetchPlaces(placesLengthRef.current);
          }
        },
        { rootMargin: "600px 0px" },
      );

      observer.observe(node);

      return () => observer.disconnect();
    },
    [fetchPlaces],
  );

  // GPS
  function handleGpsRequest() {
    if (location) {
      setLocation(null);
      setSelectedRadius(null);
      setGpsError(null);
      return;
    }

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
        gpsActive={location !== null}
      />

      {/* GPS error */}
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
        hasMore={places.length < total}
        loadingMore={loadingMore}
        loadMoreRef={loadMoreRef}
      />
    </div>
  );
}
