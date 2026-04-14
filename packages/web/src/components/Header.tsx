import { useRouteStore } from "../store/routeStore";

interface HeaderProps {
  onRouteClick: () => void;
}

export function Header({ onRouteClick }: HeaderProps) {
  const { selectedPlaces } = useRouteStore();
  const count = selectedPlaces.length;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3"
      style={{ background: "rgb(15 17 23 / 0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgb(40 48 64)" }}>
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg, rgb(52 199 89), rgb(34 158 66))" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        </div>
        <span className="text-lg font-bold tracking-tight" style={{ color: "rgb(230 236 246)" }}>
          Pathy
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Language toggle placeholder */}
        <button
          id="lang-toggle"
          className="btn btn-ghost px-3 py-1.5 text-xs"
          style={{ borderRadius: "0.5rem", fontSize: "0.75rem" }}>
          LT
        </button>

        {/* Route basket */}
        <button
          id="route-basket-btn"
          onClick={onRouteClick}
          className="relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all"
          style={{ background: count > 0 ? "rgb(52 199 89 / 0.15)" : "rgb(40 48 64)", color: count > 0 ? "rgb(52 199 89)" : "rgb(130 145 170)", border: `1.5px solid ${count > 0 ? "rgb(52 199 89 / 0.4)" : "rgb(40 48 64)"}` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          <span>Maršrutas</span>
          {count > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "rgb(52 199 89)", color: "#0a1408", minWidth: "1.25rem" }}>
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
