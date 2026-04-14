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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Trakai%20Island%20Castle.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Trakai%20Island%20Castle%20(8210815).jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Trakai%20Island%20Castle%20(7).jpg",
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/U%C5%BEutrakio%20dvaras%2027.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/U%C5%BEutrakio%20dvaras%2028.JPG",
      "https://commons.wikimedia.org/wiki/Special:FilePath/U%C5%BEutrakio%20dvaras%20-%20panoramio%20(3).jpg",
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gediminas-Tower.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gediminas%20Tower.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gediminas%20Tower%20(9651326233).jpg",
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bernardinai%20garden.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bernardinai%20garden%202.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bernardinai%20garden%203.jpg",
    ],
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/IX%20Fort%20(2008-09-20)01.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/IX%20Fort%20(2008-09-20)02.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/9%20fort.JPG",
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pa%C5%BEaislis%20monastery01.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pa%C5%BEaislis%20monastery05.JPG",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pazaislis%20Monastery%20(Kaunas%2C%20Lithuania%2C%202017).jpg",
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hill%20of%20crosses.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hill%20of%20Crosses%2005082019%20016.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hill%20of%20Crosses%2005082019%20020.jpg",
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kirkilai%20Observation%20Tower%2C%202016.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kirkilu%20ezeras%20nuo%20apzvalgos%20boksto%20sum.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/BirzaiSinkhole.jpg",
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
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nida%20Dunes.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Parnidis%20dune.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Parnidis%20Dune%2002.jpg",
    ],
    tags: ["sea", "nature", "walk"],
    recommendedVisitMinutes: 120,
  },
] satisfies PlaceDetail[];
