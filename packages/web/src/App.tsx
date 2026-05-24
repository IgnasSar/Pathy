import { useState } from "react";
import { RouteStoreProvider, useRouteStore } from "./store/routeStore";
import { LangStoreProvider } from "./store/langStore";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { SearchView } from "./views/SearchView";
import { RouteView } from "./views/RouteView";
import { ScanView } from "./views/ScanView";
import { SavedRoutesView } from "./views/SavedRoutesView";

export type Tab = "search" | "scan" | "route" | "saved";

function AppShell() {
  const [activeTab, setActiveTab] = useState<Tab>("search");
  const { selectedPlaces } = useRouteStore();

  function handleRouteClick() {
    setActiveTab("route");
  }

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100dvh", maxWidth: "600px", margin: "0 auto" }}
    >
      {/* Sticky header */}
      <Header onRouteClick={handleRouteClick} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div style={{ display: activeTab === "search" ? "block" : "none" }}>
          <SearchView />
        </div>
        <div style={{ display: activeTab === "scan" ? "block" : "none" }}>
          <ScanView />
        </div>
        <div style={{ display: activeTab === "route" ? "block" : "none" }}>
          <RouteView />
        </div>
        <div style={{ display: activeTab === "saved" ? "block" : "none" }}>
          <SavedRoutesView
            isActive={activeTab === "saved"}
            onApplyRoute={() => setActiveTab("route")}
          />
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        routeCount={selectedPlaces.length}
      />
    </div>
  );
}

function App() {
  return (
    <LangStoreProvider>
      <RouteStoreProvider>
        <AppShell />
      </RouteStoreProvider>
    </LangStoreProvider>
  );
}

export default App;
