import { useState } from "react";
import { useRouteStore } from "../store/routeStore";
import { RouteMapView } from "../components/RouteMapView";

type ViewMode = "list" | "map";

const TRANSPORTS: { key: string; emoji: string; label: string }[] = [
  { key: "car",  emoji: "🚗", label: "Automobilis" },
  { key: "bike", emoji: "🚲", label: "Dviratis"    },
  { key: "walk", emoji: "🚶", label: "Pėsčiomis"   },
];

export function RouteView() {
  const { selectedPlaces, removePlace, reorderPlaces, clearPlaces } = useRouteStore();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [transport, setTransport] = useState<string | null>(null);

  /* ── Empty state ──────────────────────────────────────────────────── */
  if (selectedPlaces.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center px-8 pb-32 text-center"
        style={{ minHeight: "calc(100dvh - 140px)" }}
      >
        <div
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
          style={{ background: "rgb(30 36 48)", border: "2px dashed rgb(52 199 89 / 0.3)" }}
        >
          🗺️
        </div>
        <h2 className="mb-2 text-xl font-bold" style={{ color: "rgb(230 236 246)" }}>
          Maršrutas tuščias
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "rgb(130 145 170)" }}>
          Paieškoje pasirinkite vietas ir jos atsiras čia. Galite pridėti iki 10 vietų.
        </p>
        <div
          className="mt-6 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
          style={{
            background: "rgb(52 199 89 / 0.1)",
            border: "1px solid rgb(52 199 89 / 0.25)",
            color: "rgb(52 199 89)",
          }}
        >
          ← Eikite į paiešką ir pridėkite vietų
        </div>
      </div>
    );
  }

  /* ── Filled state ─────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col" style={{ paddingTop: "0.75rem", paddingBottom: "6rem" }}>

      {/* ── Top bar: title + clear ───────────────────────────────────── */}
      <div className="mb-3 flex items-center justify-between px-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "rgb(230 236 246)" }}>
            Jūsų maršrutas
          </h2>
          <p className="text-xs" style={{ color: "rgb(130 145 170)" }}>
            {selectedPlaces.length} / 10 vietų pasirinkta
          </p>
        </div>
        <button
          id="clear-route-btn"
          onClick={clearPlaces}
          className="btn btn-danger px-3 py-1.5 text-xs"
        >
          Išvalyti viską
        </button>
      </div>

      {/* ── List / Map toggle pill ───────────────────────────────────── */}
      <div className="mx-4 mb-4 flex rounded-xl p-1" style={{ background: "rgb(22 26 35)", border: "1px solid rgb(40 48 64)" }}>
        <button
          id="route-view-list"
          onClick={() => setViewMode("list")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all"
          style={{
            background: viewMode === "list" ? "rgb(52 199 89 / 0.15)" : "transparent",
            color: viewMode === "list" ? "rgb(52 199 89)" : "rgb(130 145 170)",
            border: viewMode === "list" ? "1px solid rgb(52 199 89 / 0.3)" : "1px solid transparent",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Sąrašas
        </button>
        <button
          id="route-view-map"
          onClick={() => setViewMode("map")}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all"
          style={{
            background: viewMode === "map" ? "rgb(52 199 89 / 0.15)" : "transparent",
            color: viewMode === "map" ? "rgb(52 199 89)" : "rgb(130 145 170)",
            border: viewMode === "map" ? "1px solid rgb(52 199 89 / 0.3)" : "1px solid transparent",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
          Žemėlapis
        </button>
      </div>

      {/* ── LIST view ───────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div className="space-y-3 px-4">
          {selectedPlaces.map((place, index) => (
            <div
              key={place.id}
              id={`route-item-${place.id}`}
              className="card flex items-center gap-3 p-3"
            >
              {/* Order number */}
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
                style={{
                  background: "rgb(52 199 89 / 0.15)",
                  color: "rgb(52 199 89)",
                  border: "1.5px solid rgb(52 199 89 / 0.3)",
                }}
              >
                {index + 1}
              </div>

              {/* Thumbnail */}
              <div
                className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl"
                style={{ background: "rgb(30 36 48)" }}
              >
                {place.thumbnailUrl ? (
                  <img src={place.thumbnailUrl} alt={place.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl">📍</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-sm" style={{ color: "rgb(230 236 246)" }}>
                  {place.name}
                </p>
                <p className="text-xs" style={{ color: "rgb(130 145 170)" }}>
                  {place.municipality}
                  {place.distanceKm !== undefined && ` · ${place.distanceKm} km`}
                </p>
              </div>

              {/* Reorder */}
              <div className="flex flex-col gap-0.5">
                <button
                  disabled={index === 0}
                  onClick={() => reorderPlaces(index, index - 1)}
                  className="flex h-6 w-6 items-center justify-center rounded transition-all disabled:opacity-25"
                  style={{ color: "rgb(130 145 170)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                </button>
                <button
                  disabled={index === selectedPlaces.length - 1}
                  onClick={() => reorderPlaces(index, index + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded transition-all disabled:opacity-25"
                  style={{ color: "rgb(130 145 170)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
              </div>

              {/* Remove */}
              <button
                id={`remove-route-${place.id}`}
                onClick={() => removePlace(place.id)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-all"
                style={{ color: "rgb(255 69 58)", background: "rgb(255 69 58 / 0.1)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── MAP view ────────────────────────────────────────────────── */}
      {viewMode === "map" && (
        <div className="px-4">
          <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgb(40 48 64)" }}>
            <RouteMapView places={selectedPlaces} />
          </div>
        </div>
      )}

      {/* ── Transport + Generate (shown in both views when ≥2 places) ── */}
      {selectedPlaces.length >= 2 && (
        <div className="mx-4 mt-4 card p-4">
          <p className="mb-3 text-sm font-semibold" style={{ color: "rgb(230 236 246)" }}>
            Transporto priemonė
          </p>
          <div className="grid grid-cols-3 gap-2">
            {TRANSPORTS.map(({ key, emoji, label }) => {
              const active = transport === key;
              return (
                <button
                  key={key}
                  id={`transport-${key}`}
                  onClick={() => setTransport(active ? null : key)}
                  className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition-all"
                  style={{
                    background: active ? "rgb(52 199 89 / 0.12)" : "rgb(30 36 48)",
                    border: `1.5px solid ${active ? "rgb(52 199 89 / 0.5)" : "rgb(40 48 64)"}`,
                    color: active ? "rgb(52 199 89)" : "rgb(130 145 170)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                  }}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Validation hint */}
          {!transport && (
            <p className="mt-3 text-center text-xs" style={{ color: "rgb(130 145 170)" }}>
              Pasirinkite transporto priemonę, kad galėtumėte generuoti maršrutą.
            </p>
          )}

          {/* Generate CTA */}
          <button
            id="generate-route-btn"
            disabled={!transport}
            className="btn btn-primary mt-4 w-full py-3 text-base"
            style={
              !transport
                ? { opacity: 0.45, cursor: "not-allowed" }
                : {}
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            Generuoti maršrutą
          </button>
        </div>
      )}
    </div>
  );
}
