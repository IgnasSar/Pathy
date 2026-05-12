import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type {
  Coordinates,
  PlaceSummary,
  RadiusOptionKm,
  RecognizePrediction,
} from "@pathy/shared";
import { RADIUS_OPTIONS_KM } from "@pathy/shared";
import { api } from "../api/client";
import { PlaceCard } from "../components/PlaceCard";

type ScanResult = {
  prediction: RecognizePrediction;
  items: PlaceSummary[];
  total: number;
};

type UploadState =
  | { kind: "idle" }
  | { kind: "preview"; file: File; dataUrl: string }
  | { kind: "loading"; dataUrl: string }
  | { kind: "result"; dataUrl: string; result: ScanResult }
  | { kind: "error"; dataUrl: string; message: string };

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AcceptedMimeType = (typeof ACCEPTED_TYPES)[number];

function isAcceptedMimeType(type: string): type is AcceptedMimeType {
  return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

const MAX_BYTES = 7.5 * 1024 * 1024;

const CONFIDENCE_LABEL: Record<RecognizePrediction["confidence"], string> = {
  high: "Aukštas",
  medium: "Vidutinis",
  low: "Žemas",
};

const CONFIDENCE_COLOR: Record<RecognizePrediction["confidence"], string> = {
  high: "rgb(52 199 89)",
  medium: "rgb(255 204 0)",
  low: "rgb(255 100 80)",
};

export function ScanView() {
  const [state, setState] = useState<UploadState>({ kind: "idle" });
  const [selectedRadius, setSelectedRadius] = useState<RadiusOptionKm | null>(
    null,
  );
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recognizedSubtypeName =
    state.kind === "result" ? state.result.prediction.sourceSubTypeName : null;

  function getMatchFilters() {
    return {
      lat: location?.lat,
      lng: location?.lng,
      radiusKm: location && selectedRadius ? selectedRadius : undefined,
    };
  }

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

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAcceptedMimeType(file.type)) {
      alert("Palaikomi formatai: JPEG, PNG, WebP.");
      return;
    }

    if (file.size > MAX_BYTES) {
      alert("Vaizdas per didelis. Maksimalus dydis — 7,5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        setState({ kind: "preview", file, dataUrl });
        setMatchesError(null);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (state.kind !== "preview") return;
    const { file, dataUrl } = state;

    if (!isAcceptedMimeType(file.type)) return;

    setState({ kind: "loading", dataUrl });
    setMatchesError(null);

    try {
      const response = await api.recognize({
        imageBase64: dataUrl,
        mimeType: file.type,
        origin: location ?? undefined,
        radiusKm: location && selectedRadius ? selectedRadius : undefined,
      });
      setState({
        kind: "result",
        dataUrl,
        result: {
          prediction: response.prediction,
          items: response.items,
          total: response.total,
        },
      });
    } catch (err) {
      setState({
        kind: "error",
        dataUrl,
        message:
          err instanceof Error ? err.message : "Nepavyko atpažinti vaizdo.",
      });
    }
  }

  function handleReset() {
    setState({ kind: "idle" });
    setMatchesError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  useEffect(() => {
    if (state.kind !== "result" || !recognizedSubtypeName) return;

    let ignore = false;
    setMatchesLoading(true);
    setMatchesError(null);

    api
      .places({
        sourceSubTypeName: recognizedSubtypeName,
        ...getMatchFilters(),
        limit: 12,
        offset: 0,
      })
      .then((response) => {
        if (ignore) return;
        setState((current) => {
          if (current.kind !== "result") return current;
          return {
            ...current,
            result: {
              ...current.result,
              items: response.items,
              total: response.total,
            },
          };
        });
      })
      .catch((err) => {
        if (!ignore) {
          setMatchesError(
            err instanceof Error ? err.message : "Nepavyko atnaujinti vietų.",
          );
        }
      })
      .finally(() => {
        if (!ignore) setMatchesLoading(false);
      });

    return () => {
      ignore = true;
    };
    // Re-fetch only when distance filters or recognized subtype change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognizedSubtypeName, selectedRadius, location?.lat, location?.lng]);

  const dataUrl = state.kind === "idle" ? null : state.dataUrl;

  return (
    <div
      className="flex flex-col gap-5 px-4 py-5"
      style={{ paddingBottom: "90px" }}
    >
      <div>
        <h2
          className="text-lg font-semibold"
          style={{ color: "rgb(220 230 240)" }}
        >
          Atpažinti vietos tipą
        </h2>
        <p className="mt-1 text-sm" style={{ color: "rgb(100 120 150)" }}>
          Įkelkite nuotrauką — AI parinks panašių Lietuvos lankytinų vietų tipą
          ir parodys atitinkančius objektus.
        </p>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl transition-all"
        style={{
          border: "2px dashed rgb(40 56 76)",
          background: "rgb(15 20 30)",
          minHeight: dataUrl ? undefined : "220px",
        }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt="Pasirinktas vaizdas"
            className="w-full rounded-2xl object-contain"
            style={{ maxHeight: "340px" }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-10">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgb(52 199 89)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span
              className="text-center text-sm font-medium"
              style={{ color: "rgb(130 150 175)" }}
            >
              Spustelėkite, kad pasirinktumėte nuotrauką
              <br />
              <span style={{ color: "rgb(70 90 115)", fontSize: "0.75rem" }}>
                JPEG · PNG · WebP · maks. 7,5 MB
              </span>
            </span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <DistanceFilter
        selectedRadius={selectedRadius}
        location={location}
        gpsLoading={gpsLoading}
        gpsError={gpsError}
        onGpsRequest={handleGpsRequest}
        onRadiusChange={setSelectedRadius}
      />

      {(state.kind === "preview" ||
        state.kind === "result" ||
        state.kind === "error") && (
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 rounded-xl py-2.5 text-sm font-medium transition-all"
            style={{
              background: "rgb(20 28 42)",
              color: "rgb(130 150 175)",
              border: "1px solid rgb(40 56 76)",
            }}
          >
            Pasirinkti kitą
          </button>
          {state.kind === "preview" && (
            <button
              onClick={handleAnalyze}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all"
              style={{ background: "rgb(52 199 89)", color: "#0a1408" }}
            >
              Analizuoti
            </button>
          )}
        </div>
      )}

      {state.kind === "loading" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className="h-8 w-8 animate-spin rounded-full"
            style={{
              border: "3px solid rgb(30 45 65)",
              borderTopColor: "rgb(52 199 89)",
            }}
          />
          <span className="text-sm" style={{ color: "rgb(100 120 150)" }}>
            AI analizuoja vaizdą…
          </span>
        </div>
      )}

      {state.kind === "error" && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{
            background: "rgb(40 15 15)",
            border: "1px solid rgb(90 30 30)",
            color: "rgb(255 120 120)",
          }}
        >
          {state.message}
        </div>
      )}

      {state.kind === "result" && (
        <ResultPanel
          result={state.result}
          matchesLoading={matchesLoading}
          matchesError={matchesError}
          radiusKm={location ? selectedRadius : null}
        />
      )}
    </div>
  );
}

function DistanceFilter({
  selectedRadius,
  location,
  gpsLoading,
  gpsError,
  onGpsRequest,
  onRadiusChange,
}: {
  selectedRadius: RadiusOptionKm | null;
  location: Coordinates | null;
  gpsLoading: boolean;
  gpsError: string | null;
  onGpsRequest: () => void;
  onRadiusChange: (radius: RadiusOptionKm | null) => void;
}) {
  return (
    <div
      className="flex flex-col gap-2 rounded-2xl p-3"
      style={{ background: "rgb(14 20 32)", border: "1px solid rgb(30 45 65)" }}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: "rgb(220 230 240)" }}
          >
            Atstumo filtras
          </p>
          <p className="text-xs" style={{ color: "rgb(100 120 150)" }}>
            Naudokite GPS, kad rezultatai būtų rodomi pagal atstumą.
          </p>
        </div>
        <button
          id="scan-gps-btn"
          onClick={onGpsRequest}
          disabled={gpsLoading}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all"
          style={{
            background: gpsLoading
              ? "rgb(52 199 89 / 0.2)"
              : "rgb(52 199 89 / 0.1)",
            border: "1.5px solid rgb(52 199 89 / 0.35)",
            color: "rgb(52 199 89)",
          }}
          title="Naudoti mano lokaciją"
        >
          {gpsLoading ? (
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
            </svg>
          )}
        </button>
      </div>

      {location && (
        <div
          className="rounded-xl px-3 py-2 text-xs font-medium"
          style={{
            background: "rgb(52 199 89 / 0.1)",
            border: "1px solid rgb(52 199 89 / 0.25)",
            color: "rgb(52 199 89)",
          }}
        >
          Lokacija nustatyta · galima filtruoti pagal atstumą
        </div>
      )}
      {gpsError && (
        <div
          className="rounded-xl px-3 py-2 text-xs font-medium"
          style={{
            background: "rgb(255 69 58 / 0.1)",
            border: "1px solid rgb(255 69 58 / 0.25)",
            color: "rgb(255 69 58)",
          }}
        >
          {gpsError}
        </div>
      )}

      {location && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 pt-1">
          <button
            id="scan-filter-radius-all"
            className={`chip ${selectedRadius === null ? "active" : ""}`}
            onClick={() => onRadiusChange(null)}
          >
            Visi
          </button>
          {RADIUS_OPTIONS_KM.map((radius) => (
            <button
              key={radius}
              id={`scan-filter-radius-${radius}`}
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
    </div>
  );
}

function ResultPanel({
  result,
  matchesLoading,
  matchesError,
  radiusKm,
}: {
  result: ScanResult;
  matchesLoading: boolean;
  matchesError: string | null;
  radiusKm: RadiusOptionKm | null;
}) {
  const subtypeName = result.prediction.sourceSubTypeName;

  return (
    <div className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-3 rounded-2xl p-4"
        style={{
          background: "rgb(14 20 32)",
          border: "1px solid rgb(30 45 65)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-sm font-semibold"
            style={{
              color: subtypeName ? "rgb(52 199 89)" : "rgb(255 100 80)",
            }}
          >
            {subtypeName ? "Tipas atpažintas" : "Tipas neatpažintas"}
          </span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              background: "rgb(20 30 48)",
              color: CONFIDENCE_COLOR[result.prediction.confidence],
              border: `1px solid ${CONFIDENCE_COLOR[result.prediction.confidence]}40`,
            }}
          >
            Tikslumas: {CONFIDENCE_LABEL[result.prediction.confidence]}
          </span>
        </div>

        {subtypeName ? (
          <div>
            <span
              className="text-xs uppercase tracking-wide"
              style={{ color: "rgb(70 90 115)" }}
            >
              Atpažintas tipas
            </span>
            <p
              className="mt-0.5 text-base font-semibold"
              style={{ color: "rgb(210 225 245)" }}
            >
              {subtypeName}
            </p>
          </div>
        ) : (
          <p className="text-sm" style={{ color: "rgb(130 145 170)" }}>
            Nepavyko priskirti nuotraukos jokiam turimam lankytinų vietų tipui.
          </p>
        )}
      </div>

      {subtypeName && (
        <section>
          <p className="mb-3 text-xs" style={{ color: "rgb(130 145 170)" }}>
            Rasta {result.items.length} iš{" "}
            <span
              className="font-semibold"
              style={{ color: "rgb(230 236 246)" }}
            >
              {result.total}
            </span>{" "}
            panašių vietų{radiusKm ? ` iki ${radiusKm} km atstumu` : ""}
            {matchesLoading ? " · atnaujinama..." : ""}
          </p>

          {matchesError && (
            <div
              className="mb-3 rounded-xl p-3 text-xs font-medium"
              style={{
                background: "rgb(255 69 58 / 0.15)",
                color: "rgb(255 69 58)",
                border: "1px solid rgb(255 69 58 / 0.3)",
              }}
            >
              {matchesError}
            </div>
          )}

          {result.items.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {result.items.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div
              className="rounded-xl p-4 text-sm"
              style={{
                background: "rgb(20 28 42)",
                border: "1px solid rgb(40 56 76)",
                color: "rgb(130 145 170)",
              }}
            >
              Šiam tipui objektų nerasta.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
