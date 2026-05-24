import type { PlaceCategory, RadiusOptionKm } from "@pathy/shared";
import { CATEGORY_ICONS } from "../lib/placeCategoryMeta";
import { useTranslation } from "../hooks/useTranslation";
import type { TranslationKey } from "../i18n/translations";

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
  const { t } = useTranslation();

  return (
    <div className="space-y-2 px-4 pb-3">
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          id="filter-cat-all"
          className={`chip ${selectedCategory === null ? "active" : ""}`}
          onClick={() => onCategoryChange(null)}
        >
          {t("filter.allFem")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-cat-${cat}`}
            className={`chip ${selectedCategory === cat ? "active" : ""}`}
            onClick={() =>
              onCategoryChange(selectedCategory === cat ? null : cat)
            }
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            {t(`cat.${cat}` as TranslationKey)}
          </button>
        ))}
      </div>

      {hasLocation && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <span
            className="flex-shrink-0 text-xs font-medium"
            style={{ color: "rgb(130 145 170)" }}
          >
            {t("filter.distance")}
          </span>
          <button
            id="filter-radius-all"
            className={`chip ${selectedRadius === null ? "active" : ""}`}
            onClick={() => onRadiusChange(null)}
          >
            {t("filter.all")}
          </button>
          {radiusOptions.map((radius) => (
            <button
              key={radius}
              id={`filter-radius-${radius}`}
              className={`chip ${selectedRadius === radius ? "active" : ""}`}
              onClick={() =>
                onRadiusChange(selectedRadius === radius ? null : radius)
              }
            >
              {radius} km
            </button>
          ))}
        </div>
      )}

      {(selectedCategory || selectedRadius) && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "rgb(130 145 170)" }}>
            {[
              selectedCategory ? t(`cat.${selectedCategory}` as TranslationKey) : null,
              selectedRadius ? `<= ${selectedRadius} km` : null,
            ]
              .filter(Boolean)
              .join(" • ")}
          </p>
          <button
            onClick={() => {
              onCategoryChange(null);
              onRadiusChange(null);
            }}
            className="text-xs font-medium transition-colors"
            style={{ color: "rgb(52 199 89)" }}
          >
            {t("filter.clear")}
          </button>
        </div>
      )}
    </div>
  );
}
