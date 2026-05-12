import { useRef, useState } from "react";
import type { RecognizeResult } from "@pathy/shared";
import { PLACE_SUBTYPES } from "@pathy/shared";
import { api } from "../api/client";

type UploadState =
  | { kind: "idle" }
  | { kind: "preview"; file: File; dataUrl: string }
  | { kind: "loading"; dataUrl: string }
  | { kind: "result"; dataUrl: string; result: RecognizeResult }
  | { kind: "error"; dataUrl: string; message: string };

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type AcceptedMimeType = (typeof ACCEPTED_TYPES)[number];

function isAcceptedMimeType(type: string): type is AcceptedMimeType {
  return (ACCEPTED_TYPES as readonly string[]).includes(type);
}

const MAX_BYTES = 7.5 * 1024 * 1024;

const CONFIDENCE_LABEL: Record<RecognizeResult["confidence"], string> = {
  high: "Aukštas",
  medium: "Vidutinis",
  low: "Žemas",
};

const CONFIDENCE_COLOR: Record<RecognizeResult["confidence"], string> = {
  high: "rgb(52 199 89)",
  medium: "rgb(255 204 0)",
  low: "rgb(255 100 80)",
};

export function ScanView() {
  const [state, setState] = useState<UploadState>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      const dataUrl = ev.target?.result as string;
      setState({ kind: "preview", file, dataUrl });
    };
    reader.readAsDataURL(file);
  }

  async function handleAnalyze() {
    if (state.kind !== "preview") return;
    const { file, dataUrl } = state;

    if (!isAcceptedMimeType(file.type)) return;

    setState({ kind: "loading", dataUrl });

    try {
      const response = await api.recognize({
        imageBase64: dataUrl,
        mimeType: file.type,
      });
      setState({ kind: "result", dataUrl, result: response.result });
    } catch (err) {
      setState({
        kind: "error",
        dataUrl,
        message: err instanceof Error ? err.message : "Nepavyko atpažinti vaizdo.",
      });
    }
  }

  function handleReset() {
    setState({ kind: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  const dataUrl =
    state.kind === "idle" ? null : state.dataUrl;

  return (
    <div className="flex flex-col gap-5 px-4 py-5" style={{ paddingBottom: "90px" }}>
      <div>
        <h2
          className="text-lg font-semibold"
          style={{ color: "rgb(220 230 240)" }}
        >
          Atpažinti vietą
        </h2>
        <p className="mt-1 text-sm" style={{ color: "rgb(100 120 150)" }}>
          Įkelkite nuotrauką — AI identifikuos Lietuvos lankytinos vietos tipą.
        </p>
      </div>

      {/* Upload zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer overflow-hidden"
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
              className="text-sm font-medium text-center"
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

      {/* Actions */}
      {(state.kind === "preview" || state.kind === "result" || state.kind === "error") && (
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

      {/* Loading */}
      {state.kind === "loading" && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className="h-8 w-8 animate-spin rounded-full"
            style={{ border: "3px solid rgb(30 45 65)", borderTopColor: "rgb(52 199 89)" }}
          />
          <span className="text-sm" style={{ color: "rgb(100 120 150)" }}>
            AI analizuoja vaizdą…
          </span>
        </div>
      )}

      {/* Error */}
      {state.kind === "error" && (
        <div
          className="rounded-xl p-4 text-sm"
          style={{ background: "rgb(40 15 15)", border: "1px solid rgb(90 30 30)", color: "rgb(255 120 120)" }}
        >
          {state.message}
        </div>
      )}

      {/* Result */}
      {state.kind === "result" && (
        <ResultCard result={state.result} />
      )}
    </div>
  );
}

function ResultCard({ result }: { result: RecognizeResult }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-4"
      style={{ background: "rgb(14 20 32)", border: "1px solid rgb(30 45 65)" }}
    >
      {/* Recognized / not recognized header */}
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-semibold"
          style={{ color: result.recognized ? "rgb(52 199 89)" : "rgb(255 100 80)" }}
        >
          {result.recognized ? "Vieta atpažinta" : "Neatpažinta"}
        </span>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: "rgb(20 30 48)",
            color: CONFIDENCE_COLOR[result.confidence],
            border: `1px solid ${CONFIDENCE_COLOR[result.confidence]}40`,
          }}
        >
          Tikslumas: {CONFIDENCE_LABEL[result.confidence]}
        </span>
      </div>

      {result.name && (
        <div>
          <span className="text-xs uppercase tracking-wide" style={{ color: "rgb(70 90 115)" }}>
            Pavadinimas
          </span>
          <p className="mt-0.5 text-base font-semibold" style={{ color: "rgb(210 225 245)" }}>
            {result.name}
          </p>
        </div>
      )}

      {result.category && (
        <div>
          <span className="text-xs uppercase tracking-wide" style={{ color: "rgb(70 90 115)" }}>
            Kategorija
          </span>
          <p className="mt-0.5 text-sm font-medium" style={{ color: "rgb(52 199 89)" }}>
            {result.category}
          </p>
        </div>
      )}

      {result.sourceSubTypeId !== null && (
        <div>
          <span className="text-xs uppercase tracking-wide" style={{ color: "rgb(70 90 115)" }}>
            Subkategorija
          </span>
          <p className="mt-0.5 text-sm font-medium" style={{ color: "rgb(130 200 255)" }}>
            {PLACE_SUBTYPES[result.sourceSubTypeId] ?? `ID ${result.sourceSubTypeId}`}
          </p>
        </div>
      )}

      {/* Raw JSON toggle */}
      <details className="mt-1">
        <summary
          className="cursor-pointer text-xs select-none"
          style={{ color: "rgb(70 90 115)" }}
        >
          Rodyti JSON atsakymą
        </summary>
        <pre
          className="mt-2 overflow-x-auto rounded-lg p-3 text-xs leading-relaxed"
          style={{
            background: "rgb(10 14 22)",
            color: "rgb(100 180 130)",
            border: "1px solid rgb(25 40 60)",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      </details>
    </div>
  );
}