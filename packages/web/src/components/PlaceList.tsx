import type { PlaceSummary } from "@pathy/shared";
import { PlaceCard } from "./PlaceCard";

interface PlaceListProps {
  places: PlaceSummary[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-44 w-full" style={{ borderRadius: 0 }} />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-3 w-24" />
          <div className="skeleton h-7 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function PlaceList({
  places,
  loading,
  error,
  total,
  hasMore,
  loadingMore,
  onLoadMore,
}: PlaceListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 pb-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="mb-4 text-5xl">⚠️</div>
        <p className="font-semibold mb-1" style={{ color: "rgb(255 69 58)" }}>
          Klaida
        </p>
        <p className="text-sm" style={{ color: "rgb(130 145 170)" }}>
          {error}
        </p>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
        <div className="mb-4 text-5xl">🔍</div>
        <p className="font-semibold mb-1" style={{ color: "rgb(230 236 246)" }}>
          Vietų nerasta
        </p>
        <p className="text-sm" style={{ color: "rgb(130 145 170)" }}>
          Pabandykite pakeisti paieškos žodžius arba filtrus.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-24">
      {/* Result count */}
      <p className="mb-3 text-xs" style={{ color: "rgb(130 145 170)" }}>
        Rodoma {places.length} iš{" "}
        <span className="font-semibold" style={{ color: "rgb(230 236 246)" }}>
          {total}
        </span>{" "}
        vietų
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          className="btn btn-secondary mt-4 w-full"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Kraunama..." : "Rodyti daugiau"}
        </button>
      )}
    </div>
  );
}
