import { useState } from "react";
import { RouteStoreProvider, useRouteStore } from "./store/routeStore";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import { SearchView } from "./views/SearchView";
import { RouteView } from "./views/RouteView";
import { ScanView } from "./views/ScanView";

type Tab = "search" | "scan" | "route";

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
        {activeTab === "search" && <SearchView />}
        {activeTab === "scan" && <ScanView />}
        {activeTab === "route" && <RouteView />}
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
    <RouteStoreProvider>
      <AppShell />
    </RouteStoreProvider>
  );
}

export default App;
