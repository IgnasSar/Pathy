import type { PlaceCategory, RadiusOptionKm } from "@pathy/shared";

const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  museum: "Muziejai",
  castle: "Pilys",
  nature: "Gamta",
  viewpoint: "Apžvalgos",
  park: "Parkai",
  landmark: "Paminklai",
};

const CATEGORY_ICONS: Record<PlaceCategory, string> = {
  museum: "🏛️",
  castle: "🏰",
  nature: "🌿",
  viewpoint: "🔭",
  park: "🌳",
  landmark: "🗿",
};

interface FilterBarProps {
  categories: PlaceCategory[];
  radiusOptions: RadiusOptionKm[];
  selectedCategory: PlaceCategory | null;
  selectedRadius: RadiusOptionKm | null;
  hasLocation: boolean;
  onCategoryChange: (cat: PlaceCategory | null) => void;
  onRadiusChange: (r: RadiusOptionKm | null) => void;
}

export function FilterBar({
  categories,
  radiusOptions,
  selectedCategory,
  selectedRadius,
  hasLocation,
  onCategoryChange,
  onRadiusChange,
}: FilterBarProps) {
  return (
    <div className="space-y-2 px-4 pb-3">
      {/* Category chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          id="filter-cat-all"
          className={`chip ${selectedCategory === null ? "active" : ""}`}
          onClick={() => onCategoryChange(null)}>
          Visos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-cat-${cat}`}
            className={`chip ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => onCategoryChange(selectedCategory === cat ? null : cat)}>
            <span>{CATEGORY_ICONS[cat]}</span>
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Radius chips — only shown when location is available */}
      {hasLocation && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <span className="flex-shrink-0 text-xs font-medium" style={{ color: "rgb(130 145 170)" }}>
            Atstumas:
          </span>
          <button
            id="filter-radius-all"
            className={`chip ${selectedRadius === null ? "active" : ""}`}
            onClick={() => onRadiusChange(null)}>
            Visi
          </button>
          {radiusOptions.map((r) => (
            <button
              key={r}
              id={`filter-radius-${r}`}
              className={`chip ${selectedRadius === r ? "active" : ""}`}
              onClick={() => onRadiusChange(selectedRadius === r ? null : r)}>
              {r} km
            </button>
          ))}
        </div>
      )}

      {/* Active filter summary */}
      {(selectedCategory || selectedRadius) && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "rgb(130 145 170)" }}>
            {[
              selectedCategory ? CATEGORY_LABELS[selectedCategory] : null,
              selectedRadius ? `≤ ${selectedRadius} km` : null,
            ].filter(Boolean).join(" • ")}
          </p>
          <button
            onClick={() => { onCategoryChange(null); onRadiusChange(null); }}
            className="text-xs font-medium transition-colors"
            style={{ color: "rgb(52 199 89)" }}>
            Išvalyti
          </button>
        </div>
      )}
    </div>
  );
}
