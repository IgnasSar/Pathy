import { useRouteStore } from "../store/routeStore";

const TRANSPORT_LABELS: Record<string, string> = {
  car: "🚗 Automobilis",
  bike: "🚲 Dviratis",
  walk: "🚶 Pėsčiomis",
};

export function RouteView() {
  const { selectedPlaces, removePlace, reorderPlaces, clearPlaces } = useRouteStore();

  if (selectedPlaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 pb-32 text-center"
        style={{ minHeight: "calc(100dvh - 140px)" }}>
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl text-5xl"
          style={{ background: "rgb(30 36 48)", border: "2px dashed rgb(52 199 89 / 0.3)" }}>
          🗺️
        </div>
        <h2 className="mb-2 text-xl font-bold" style={{ color: "rgb(230 236 246)" }}>
          Maršrutas tuščias
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "rgb(130 145 170)" }}>
          Paieškoje pasirinkite vietas ir jos atsiras čia. Galite pridėti iki 10 vietų.
        </p>
        <div className="mt-6 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm"
          style={{ background: "rgb(52 199 89 / 0.1)", border: "1px solid rgb(52 199 89 / 0.25)", color: "rgb(52 199 89)" }}>
          ← Eikite į paiešką ir pridėkite vietų
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-32" style={{ paddingTop: "0.75rem" }}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
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
          className="btn btn-danger px-3 py-1.5 text-xs">
          Išvalyti viską
        </button>
      </div>

      {/* Places list */}
      <div className="space-y-3 mb-6">
        {selectedPlaces.map((place, index) => (
          <div
            key={place.id}
            id={`route-item-${place.id}`}
            className="card flex items-center gap-3 p-3">
            {/* Order number */}
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold"
              style={{ background: "rgb(52 199 89 / 0.15)", color: "rgb(52 199 89)", border: "1.5px solid rgb(52 199 89 / 0.3)" }}>
              {index + 1}
            </div>

            {/* Thumbnail */}
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl"
              style={{ background: "rgb(30 36 48)" }}>
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
                style={{ color: "rgb(130 145 170)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="18 15 12 9 6 15"/>
                </svg>
              </button>
              <button
                disabled={index === selectedPlaces.length - 1}
                onClick={() => reorderPlaces(index, index + 1)}
                className="flex h-6 w-6 items-center justify-center rounded transition-all disabled:opacity-25"
                style={{ color: "rgb(130 145 170)" }}>
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
              style={{ color: "rgb(255 69 58)", background: "rgb(255 69 58 / 0.1)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Transport type selector */}
      {selectedPlaces.length >= 2 && (
        <div className="card p-4">
          <p className="mb-3 text-sm font-semibold" style={{ color: "rgb(230 236 246)" }}>
            Transporto priemonė
          </p>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(TRANSPORT_LABELS).map(([key, label]) => (
              <button
                key={key}
                id={`transport-${key}`}
                className="flex flex-col items-center gap-1.5 rounded-xl px-2 py-3 text-center transition-all"
                style={{
                  background: "rgb(30 36 48)",
                  border: "1.5px solid rgb(40 48 64)",
                  color: "rgb(130 145 170)",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}>
                <span className="text-2xl">{label.split(" ")[0]}</span>
                <span>{label.split(" ").slice(1).join(" ")}</span>
              </button>
            ))}
          </div>

          {/* Generate route CTA */}
          <button
            id="generate-route-btn"
            className="btn btn-primary mt-4 w-full py-3 text-base"
            disabled>
            Generuoti maršrutą
            <span className="text-xs opacity-70 ml-1">(netrukus)</span>
          </button>
          <p className="mt-2 text-center text-xs" style={{ color: "rgb(130 145 170)" }}>
            Žemėlapio integracija bus pridėta kitame etape.
          </p>
        </div>
      )}
    </div>
  );
}
