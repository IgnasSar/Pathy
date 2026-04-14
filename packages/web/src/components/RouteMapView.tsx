import { useEffect, useRef } from "react";
import type { PlaceSummary } from "@pathy/shared";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface RouteMapViewProps {
  places: PlaceSummary[];
}

const LITHUANIA_CENTER: L.LatLngTuple = [55.1694, 23.8813];
const DEFAULT_ZOOM = 7;

function makeNumberedIcon(n: number, isFirst: boolean, isLast: boolean) {
  const color = isFirst ? "#34c759" : isLast ? "#ff453a" : "#5aa0ff";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <ellipse cx="16" cy="38" rx="5" ry="2" fill="rgba(0,0,0,0.25)"/>
    <path d="M16 0 C7.16 0 0 7.16 0 16 C0 27 16 40 16 40 C16 40 32 27 32 16 C32 7.16 24.84 0 16 0Z" fill="${color}"/>
    <circle cx="16" cy="16" r="11" fill="rgba(0,0,0,0.18)"/>
    <text x="16" y="21" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-size="12" font-weight="700" fill="white">${n}</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -42],
  });
}

export function RouteMapView({ places }: RouteMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialise map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: LITHUANIA_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw markers + polyline whenever places change
  useEffect(() => {
    const map = mapRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    const validPlaces = places.filter(
      (p) => p.coordinates !== undefined,
    );

    if (validPlaces.length === 0) {
      map.setView(LITHUANIA_CENTER, DEFAULT_ZOOM);
      return;
    }

    const latlngs: L.LatLngTuple[] = [];

    validPlaces.forEach((place, i) => {
      const lat = place.coordinates.lat;
      const lng = place.coordinates.lng;
      latlngs.push([lat, lng]);

      const isFirst = i === 0;
      const isLast = i === validPlaces.length - 1 && validPlaces.length > 1;

      const visitHours =
        place.recommendedVisitMinutes >= 60
          ? `${Math.floor(place.recommendedVisitMinutes / 60)}h ${place.recommendedVisitMinutes % 60 > 0 ? `${place.recommendedVisitMinutes % 60}min` : ""}`
          : `${place.recommendedVisitMinutes}min`;

      const marker = L.marker([lat, lng], {
        icon: makeNumberedIcon(i + 1, isFirst, isLast),
      });

      marker.bindPopup(
        `<div style="font-family:Inter,system-ui,sans-serif;min-width:160px;">
          ${place.thumbnailUrl ? `<img src="${place.thumbnailUrl}" alt="${place.name}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px;" />` : ""}
          <strong style="font-size:13px;color:#e6ecf6;">${i + 1}. ${place.name}</strong><br/>
          <span style="font-size:11px;color:#8291aa;">📍 ${place.municipality} · ⏱ ${visitHours}</span>
        </div>`,
        { maxWidth: 220 },
      );

      group.addLayer(marker);
    });

    // Dashed polyline connecting stops
    if (latlngs.length >= 2) {
      group.addLayer(
        L.polyline(latlngs, {
          color: "#34c759",
          weight: 3,
          opacity: 0.75,
          dashArray: "8 6",
        }),
      );
    }

    map.fitBounds(L.latLngBounds(latlngs), { padding: [48, 48] });
    setTimeout(() => map.invalidateSize(), 80);
  }, [places]);

  // Invalidate size on mount (tab just switched)
  useEffect(() => {
    const t = setTimeout(() => mapRef.current?.invalidateSize(), 120);
    return () => clearTimeout(t);
  }, []);

  const hasCoords = places.some((p) => p.coordinates !== undefined);

  return (
    <div className="relative" style={{ height: "calc(100dvh - 230px)", minHeight: "320px" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />

      {/* No-coords overlay */}
      {!hasCoords && places.length > 0 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
          style={{
            background: "rgb(15 17 23 / 0.88)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          }}
        >
          <span style={{ fontSize: "2.5rem" }}>🗺️</span>
          <p className="text-sm font-medium" style={{ color: "rgb(130 145 170)" }}>
            Koordinatės neprieinamos šioms vietoms.
          </p>
        </div>
      )}

      {/* Legend */}
      {hasCoords && places.length >= 2 && (
        <div
          className="absolute flex items-center gap-3 rounded-xl px-3 py-2 text-xs"
          style={{
            top: 12,
            left: 12,
            zIndex: 800,
            background: "rgb(22 26 35 / 0.93)",
            border: "1px solid rgb(40 48 64)",
            backdropFilter: "blur(8px)",
            color: "rgb(130 145 170)",
            gap: "8px",
          }}
        >
          <span style={{ color: "#34c759", marginRight: 2 }}>●</span> Pradžia
          <span style={{ color: "#ff453a", marginRight: 2, marginLeft: 6 }}>●</span> Pabaiga
          {places.length > 2 && (
            <><span style={{ color: "#5aa0ff", marginRight: 2, marginLeft: 6 }}>●</span> Tarpinė</>
          )}
        </div>
      )}
    </div>
  );
}
