import type { PlaceCategory } from "@pathy/shared";

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  museum: "Muziejai",
  castle: "Pilys",
  church: "Baznycios",
  viewpoint: "Apzvalgos",
  nature: "Gamta",
  park: "Parkai",
  memorial: "Memorialai",
  archaeology: "Archeologija",
  "street-art": "Gatves menas",
  landmark: "Architektura",
};

export const CATEGORY_ICONS: Record<PlaceCategory, string> = {
  museum: "🏛️",
  castle: "🏰",
  church: "⛪",
  viewpoint: "🔭",
  nature: "🌿",
  park: "🌳",
  memorial: "🕯️",
  archaeology: "🏺",
  "street-art": "🎨",
  landmark: "📍",
};
