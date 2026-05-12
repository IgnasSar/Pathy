import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createElement } from "react";
import type { PlaceSummary } from "@pathy/shared";
import { optimizePlacesOrder } from "../utils/geo";

const MAX_PLACES = 10;
const SESSION_KEY = "pathy_route_places_v2";

function loadFromSession(): PlaceSummary[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as PlaceSummary[]) : [];
  } catch {
    return [];
  }
}

export interface RouteStore {
  selectedPlaces: PlaceSummary[];
  addPlace: (place: PlaceSummary) => { success: boolean; message?: string };
  removePlace: (id: string) => void;
  hasPlace: (id: string) => boolean;
  reorderPlaces: (from: number, to: number) => void;
  clearPlaces: () => void;
}

const RouteContext = createContext<RouteStore | null>(null);

export function RouteStoreProvider({ children }: { children: ReactNode }) {
  const [selectedPlaces, setSelectedPlaces] =
    useState<PlaceSummary[]>(loadFromSession);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(selectedPlaces));
  }, [selectedPlaces]);

  const addPlace = useCallback((place: PlaceSummary) => {
    let result: { success: boolean; message?: string } = { success: false };
    setSelectedPlaces((prev) => {
      if (prev.some((p) => p.id === place.id)) {
        result = {
          success: false,
          message: "Ši vieta jau pridėta į maršrutą.",
        };
        return prev;
      }
      if (prev.length >= MAX_PLACES) {
        result = {
          success: false,
          message: `Maršrute gali būti daugiausiai ${MAX_PLACES} vietos.`,
        };
        return prev;
      }
      result = { success: true };
      return optimizePlacesOrder([...prev, place]);
    });
    return result;
  }, []);

  const removePlace = useCallback((id: string) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const hasPlace = useCallback(
    (id: string) => selectedPlaces.some((p) => p.id === id),
    [selectedPlaces],
  );

  const reorderPlaces = useCallback((from: number, to: number) => {
    setSelectedPlaces((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }, []);

  const clearPlaces = useCallback(() => setSelectedPlaces([]), []);

  return createElement(
    RouteContext.Provider,
    {
      value: {
        selectedPlaces,
        addPlace,
        removePlace,
        hasPlace,
        reorderPlaces,
        clearPlaces,
      },
    },
    children,
  );
}

export function useRouteStore(): RouteStore {
  const ctx = useContext(RouteContext);
  if (!ctx)
    throw new Error("useRouteStore must be used inside RouteStoreProvider");
  return ctx;
}
