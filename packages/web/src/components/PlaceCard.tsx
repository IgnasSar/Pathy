import { useState } from "react";
import type { PlaceSummary } from "@pathy/shared";
import { useRouteStore } from "../store/routeStore";
import { CATEGORY_ICONS } from "../lib/placeCategoryMeta";
import { useTranslation } from "../hooks/useTranslation";
import type { TranslationKey } from "../i18n/translations";

interface PlaceCardProps {
  place: PlaceSummary;
  onClick?: (place: PlaceSummary) => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  const { addPlace, removePlace, hasPlace } = useRouteStore();
  const isAdded = hasPlace(place.id);
  const [toast, setToast] = useState<string | null>(null);
  const { t } = useTranslation();

  function handleAddRemove(event: React.MouseEvent) {
    event.stopPropagation();

    if (isAdded) {
      removePlace(place.id);
      return;
    }

    const result = addPlace(place);
    if (!result.success && result.message) {
      setToast(result.message);
      setTimeout(() => setToast(null), 3000);
    }
  }

  const visitHours =
    place.recommendedVisitMinutes >= 60
      ? `${Math.floor(place.recommendedVisitMinutes / 60)}${t("place.h")} ${
          place.recommendedVisitMinutes % 60 > 0
            ? `${place.recommendedVisitMinutes % 60}${t("place.min")}`
            : ""
        }`
      : `${place.recommendedVisitMinutes}${t("place.min")}`;

  return (
    <article
      id={`place-card-${place.id}`}
      className="card cursor-pointer"
      onClick={() => onClick?.(place)}
    >
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: "rgb(30 36 48)" }}
      >
        {place.thumbnailUrl ? (
          <img
            src={place.thumbnailUrl}
            alt={place.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-5xl">
            {CATEGORY_ICONS[place.category]}
          </div>
        )}

        <div className="absolute left-2 top-2">
          <span className={`badge badge-${place.category}`}>
            {CATEGORY_ICONS[place.category]}{" "}
            {t(`cat.${place.category}` as TranslationKey)}
          </span>
        </div>

        {place.distanceKm !== undefined && (
          <div className="absolute right-2 top-2">
            <span
              className="badge"
              style={{
                background: "rgb(15 17 23 / 0.85)",
                color: "rgb(230 236 246)",
                backdropFilter: "blur(4px)",
              }}
            >
              📍 {place.distanceKm} km
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3
          className="mb-1 font-semibold leading-tight"
          style={{ color: "rgb(230 236 246)", fontSize: "1rem" }}
        >
          {place.name}
        </h3>
        <p
          className="mb-2 line-clamp-2 text-sm leading-snug"
          style={{ color: "rgb(130 145 170)" }}
        >
          {place.shortDescription}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "rgb(130 145 170)" }}
          >
            <span>📍 {place.municipality}</span>
            <span>•</span>
            <span>⏱ {visitHours}</span>
          </div>

          <button
            id={`add-to-route-${place.id}`}
            onClick={handleAddRemove}
            className="btn flex-shrink-0 px-3 py-1.5 text-xs"
            style={{
              background: isAdded ? "rgb(52 199 89 / 0.15)" : "rgb(52 199 89)",
              color: isAdded ? "rgb(52 199 89)" : "#0a1408",
              border: isAdded ? "1.5px solid rgb(52 199 89 / 0.4)" : "none",
              borderRadius: "0.625rem",
            }}
          >
            {isAdded ? (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t("place.added")}
              </>
            ) : (
              <>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                {t("place.add")}
              </>
            )}
          </button>
        </div>

        {toast && (
          <p
            className="mt-2 rounded-lg px-3 py-2 text-xs font-medium"
            style={{
              background: "rgb(255 69 58 / 0.15)",
              color: "rgb(255 69 58)",
              border: "1px solid rgb(255 69 58 / 0.3)",
            }}
          >
            {toast}
          </p>
        )}
      </div>
    </article>
  );
}
