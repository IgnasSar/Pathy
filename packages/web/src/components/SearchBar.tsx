import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onGpsRequest: () => void;
  gpsLoading: boolean;
  gpsActive?: boolean;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  onGpsRequest,
  gpsLoading,
  gpsActive = false,
  placeholder = "Ieškoti vietų...",
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes (e.g. clear)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value;
    setLocalValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(next), 300);
  }

  function handleClear() {
    setLocalValue("");
    onChange("");
  }

  return (
    <div className="relative flex items-center gap-2 px-4 pt-3 pb-2">
      {/* Search icon */}
      <div className="relative flex-1">
        <div
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "rgb(130 145 170)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          id="search-input"
          type="search"
          className="input pl-10 pr-10"
          placeholder={placeholder}
          value={localValue}
          onChange={handleChange}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity"
            style={{ color: "rgb(130 145 170)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* GPS button */}
      <button
        id="gps-btn"
        onClick={onGpsRequest}
        disabled={gpsLoading}
        title="Naudoti mano lokaciją"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-all"
        style={{
          background:
            gpsLoading || gpsActive
              ? "rgb(52 199 89 / 0.2)"
              : "rgb(52 199 89 / 0.1)",
          border: gpsActive
            ? "1.5px solid rgb(52 199 89)"
            : "1.5px solid rgb(52 199 89 / 0.35)",
          color: "rgb(52 199 89)",
        }}
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
  );
}
