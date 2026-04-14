import type { PlaceDetail } from "@pathy/shared";

export const mockPlaces = [
  {
    id: "trakai-castle",
    name: "Traku pilis",
    category: "castle",
    shortDescription: "Gotikine pilis Galves ezero saloje.",
    fullDescription:
      "Viena zinomiausiu Lietuvos istoriniu vietu, tinkama trumpam ar ilgesniam apsilankymui.",
    region: "Vilniaus apskritis",
    municipality: "Traku rajonas",
    address: "Karaimu g. 43C, Trakai",
    coordinates: {
      lat: 54.6521,
      lng: 24.9341,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=Trakai+Castle",
    imageUrls: [
      "https://placehold.co/600x400?text=Trakai+Castle+1",
      "https://placehold.co/600x400?text=Trakai+Castle+2",
    ],
    tags: ["history", "lake", "family-friendly"],
    recommendedVisitMinutes: 90,
  },
  {
    id: "uzutrakis-manor",
    name: "Uzutrakio dvaras",
    category: "landmark",
    shortDescription: "Istorinis dvaras salia Traku ir ezero.",
    fullDescription:
      "Dvaro ansamblis su parku ir vaizdais i Galves ezera, tinkamas ramiam pasivaiksciojimui.",
    region: "Vilniaus apskritis",
    municipality: "Traku rajonas",
    address: "Uzutrakio g. 17, Trakai",
    coordinates: {
      lat: 54.6423,
      lng: 24.9712,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=Uzutrakis+Manor",
    imageUrls: [
      "https://placehold.co/600x400?text=Uzutrakis+Manor+1",
      "https://placehold.co/600x400?text=Uzutrakis+Manor+2",
    ],
    tags: ["history", "architecture", "park"],
    recommendedVisitMinutes: 60,
  },
  {
    id: "gediminas-tower",
    name: "Gedimino pilies bokstas",
    category: "landmark",
    shortDescription: "Vienas zinomiausiu Vilniaus simboliu.",
    fullDescription:
      "Istorinis bokstas ant kalno su miesto panorama, daznai lankomas tiek turistu, tiek vietiniu.",
    region: "Vilniaus apskritis",
    municipality: "Vilniaus miestas",
    address: "Arsenalo g. 5, Vilnius",
    coordinates: {
      lat: 54.6868,
      lng: 25.2906,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=Gediminas+Tower",
    imageUrls: [
      "https://placehold.co/600x400?text=Gediminas+Tower+1",
      "https://placehold.co/600x400?text=Gediminas+Tower+2",
    ],
    tags: ["history", "city", "panorama"],
    recommendedVisitMinutes: 45,
  },
  {
    id: "bernardine-garden",
    name: "Bernardinu sodas",
    category: "park",
    shortDescription: "Miesto parkas Vilniaus senamiestyje.",
    fullDescription:
      "Tvarkingas parkas pasivaiksciojimams ir trumpam poilsiui salia pagrindiniu miesto objektu.",
    region: "Vilniaus apskritis",
    municipality: "Vilniaus miestas",
    address: "B. Radvilaites g. 8A, Vilnius",
    coordinates: {
      lat: 54.6836,
      lng: 25.2926,
    },
    thumbnailUrl: null,
    imageUrls: [],
    tags: ["park", "city", "family-friendly"],
    recommendedVisitMinutes: 40,
  },
  {
    id: "nine-fort-museum",
    name: "Devintojo forto muziejus",
    category: "museum",
    shortDescription: "Istorinis muziejus Kaune.",
    fullDescription:
      "Muziejus ir memorialinis kompleksas, skirtas XX amziaus istorijai ir atminciai.",
    region: "Kauno apskritis",
    municipality: "Kauno miestas",
    address: "Zemaiciu pl. 75, Kaunas",
    coordinates: {
      lat: 54.9302,
      lng: 23.8818,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=IX+Fort+Museum",
    imageUrls: [
      "https://placehold.co/600x400?text=IX+Fort+Museum+1",
      "https://placehold.co/600x400?text=IX+Fort+Museum+2",
    ],
    tags: ["museum", "history", "memorial"],
    recommendedVisitMinutes: 80,
  },
  {
    id: "pazaislis-monastery",
    name: "Pazaislio vienuolynas",
    category: "landmark",
    shortDescription: "Barokinis ansamblis prie Kauno mariu.",
    fullDescription:
      "Vienas brandziausiu baroko architekturos pavyzdziu Lietuvoje, tinkamas trumpam kulturos sustojimui.",
    region: "Kauno apskritis",
    municipality: "Kauno miestas",
    address: "T. Masiulio g. 31, Kaunas",
    coordinates: {
      lat: 54.8777,
      lng: 24.0207,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=Pazaislis+Monastery",
    imageUrls: [
      "https://placehold.co/600x400?text=Pazaislis+Monastery+1",
      "https://placehold.co/600x400?text=Pazaislis+Monastery+2",
    ],
    tags: ["architecture", "history", "lake"],
    recommendedVisitMinutes: 60,
  },
  {
    id: "hill-of-crosses",
    name: "Kryziu kalnas",
    category: "landmark",
    shortDescription: "Unikali piligrimine vieta netoli Siauliu.",
    fullDescription:
      "Vienas zinomiausiu Lietuvos dvasiniu simboliu, lankomas del savo isskirtines atmosferos.",
    region: "Siauliu apskritis",
    municipality: "Siauliu rajonas",
    address: "Jurgaiiciai, Siauliu rajonas",
    coordinates: {
      lat: 56.0153,
      lng: 23.4167,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=Hill+of+Crosses",
    imageUrls: [
      "https://placehold.co/600x400?text=Hill+of+Crosses+1",
      "https://placehold.co/600x400?text=Hill+of+Crosses+2",
    ],
    tags: ["pilgrimage", "history", "landmark"],
    recommendedVisitMinutes: 50,
  },
  {
    id: "kirkilai-tower",
    name: "Kirkilu apzvalgos bokstas",
    category: "viewpoint",
    shortDescription: "Apzvalgos bokstas virs karstiniu ezereliu.",
    fullDescription:
      "Populiari vieta trumpam sustojimui, apzvalgai ir nuotraukoms salia Birzu.",
    region: "Panevezio apskritis",
    municipality: "Birzu rajonas",
    address: "Kirkilai, Birzu rajonas",
    coordinates: {
      lat: 56.1938,
      lng: 24.7592,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=Kirkilai+Tower",
    imageUrls: [
      "https://placehold.co/600x400?text=Kirkilai+Tower+1",
      "https://placehold.co/600x400?text=Kirkilai+Tower+2",
    ],
    tags: ["viewpoint", "nature", "photography"],
    recommendedVisitMinutes: 35,
  },
  {
    id: "nida-dunes",
    name: "Nidos kopos",
    category: "nature",
    shortDescription: "Pajurio gamtos vieta su isskirtiniu krastovaizdziu.",
    fullDescription:
      "Smelio kopos ir pesciuju marsrutai Kurso nerijoje, tinkami ilgesniam gamtos apsilankymui.",
    region: "Klaipedos apskritis",
    municipality: "Neringa",
    address: "Nida, Neringa",
    coordinates: {
      lat: 55.3036,
      lng: 21.0084,
    },
    thumbnailUrl: "https://placehold.co/600x400?text=Nida+Dunes",
    imageUrls: [
      "https://placehold.co/600x400?text=Nida+Dunes+1",
      "https://placehold.co/600x400?text=Nida+Dunes+2",
    ],
    tags: ["sea", "nature", "walk"],
    recommendedVisitMinutes: 120,
  },
] satisfies PlaceDetail[];
