type Tab = "search" | "route";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  routeCount: number;
}

export function BottomNav({ activeTab, onTabChange, routeCount }: BottomNavProps) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "search",
      label: "Paieška",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
    },
    {
      id: "route",
      label: "Maršrutas",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      style={{ background: "rgb(15 17 23 / 0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgb(40 48 64)" }}>
      <div className="flex items-center justify-around px-4 pt-2 pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 px-6 py-1.5 transition-all"
              style={{ color: isActive ? "rgb(52 199 89)" : "rgb(130 145 170)" }}>
              <span className="relative">
                {tab.icon}
                {tab.id === "route" && routeCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: "rgb(52 199 89)", color: "#0a1408", fontSize: "0.625rem" }}>
                    {routeCount}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <span
                  className="absolute -top-2 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                  style={{ background: "rgb(52 199 89)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
