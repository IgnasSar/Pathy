import { useEffect, useState } from "react";
import type { SavedRouteSummary } from "@pathy/shared";
import { api } from "../api/client";
import { deviceId } from "../store/deviceStore";
import { useTranslation } from "../hooks/useTranslation";
import { useRouteStore } from "../store/routeStore";

interface SavedRoutesViewProps {
  isActive: boolean;
  onApplyRoute: () => void;
}

export function SavedRoutesView({ isActive, onApplyRoute }: SavedRoutesViewProps) {
  const { t } = useTranslation();
  const { setSelectedPlaces, setTransport } = useRouteStore();
  const [routes, setRoutes] = useState<SavedRouteSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.savedRoutes.list(deviceId);
      setRoutes(res.items);
    } catch (err) {
      setError(t("saved.errorLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) {
      fetchRoutes();
    }
  }, [isActive]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.savedRoutes.delete(id, deviceId);
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(t("saved.errorSave"));
    }
  };

  const handleApply = async (id: string) => {
    try {
      const res = await api.savedRoutes.get(id, deviceId);
      setSelectedPlaces(res.item.places);
      setTransport(res.item.transportType);
      onApplyRoute();
    } catch (err) {
      alert(t("saved.errorLoad"));
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4 pb-24">
      <h2 className="mb-6 text-xl font-bold">{t("saved.title")}</h2>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-500">
          {error}
          <button
            onClick={fetchRoutes}
            className="mt-2 block font-medium underline"
          >
            Retry
          </button>
        </div>
      )}

      {!error && routes.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-[rgb(130_145_170)]">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 opacity-50"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <p>{t("saved.empty")}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => handleApply(route.id)}
            className="group relative flex cursor-pointer flex-col gap-2 rounded-xl bg-[rgb(25_30_40)] p-4 transition-all hover:bg-[rgb(30_36_48)] active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-semibold text-white">{route.name}</h3>
              <button
                onClick={(e) => handleDelete(route.id, e)}
                className="rounded-lg p-2 text-red-400 opacity-80 transition-opacity hover:bg-red-400/10 hover:opacity-100"
                aria-label={t("saved.delete")}
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
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 text-sm text-[rgb(130_145_170)]">
              <div className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {route.placeIds.length} {t("place.places")}
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {route.transportType === "car" && (
                    <>
                      <rect x="2" y="7" width="20" height="10" rx="2" />
                      <circle cx="6" cy="17" r="2" />
                      <circle cx="18" cy="17" r="2" />
                      <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                    </>
                  )}
                  {route.transportType === "bike" && (
                    <>
                      <circle cx="5.5" cy="17.5" r="3.5" />
                      <circle cx="18.5" cy="17.5" r="3.5" />
                      <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5V14l-3-3 4-3 2 3h2" />
                    </>
                  )}
                  {route.transportType === "walk" && (
                    <path d="M14 4a2 2 0 1 0-4 0 2 2 0 0 0 4 0zm-2 4v7m-3-3l3 3 3-3m-3 3v5" />
                  )}
                </svg>
                {t(`route.${route.transportType}` as any)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
