// Testiniai duomenys, paimti iš tikros Pathy DB (GET /api/places?limit=12&offset=300,
// POST /api/route-preview su pirmais 2 objektais, kelias suretintas).
import type { PlaceSummary, RoutePreviewResponse } from "@pathy/shared";

export const PLACES: PlaceSummary[] = [
  {
    id: "azuolpamuses-piliakalnis-1163",
    name: "Ąžuolpamūšės piliakalnis",
    category: "archaeology",
    shortDescription: "Piliakalniai. Adresas: Ąžuolpamūšė, Pasvalio r..",
    region: "Lietuva",
    municipality: "Pasvalio r.",
    coordinates: {
      lat: 56.1233325706528,
      lng: 24.4601266618405,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/21a87145-e92e-49c8-a2cd-1ccc740ca4a1/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "azuolu-karaliene-1208",
    name: "Ąžuolų karalienė",
    category: "nature",
    shortDescription: "Botaniniai objektai. Adresas: Levydonys, Vilniaus r..",
    region: "Lietuva",
    municipality: "Vilniaus r.",
    coordinates: {
      lat: 54.8098421560001,
      lng: 25.004504164,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/6bf5957c-11e3-4218-88f2-4c02c47970bb/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "azuolynas-bitynas-26863",
    name: "Ąžuolynas bitynas",
    category: "shopping",
    shortDescription:
      "Išskirtiniai produktai. Adresas: Kurmio g. 17-1, Ąžuolyno k. Marijampolės sav..",
    region: "Lietuva",
    municipality: "Ąžuolyno k. Marijampolės sav.",
    coordinates: {
      lat: 54.447073,
      lng: 23.407242,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/84f012cf-0ca1-4787-9b95-9eb79545c0c6/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "azuolyno-prieplaukos-apzvalgos-aikstele-1143",
    name: "Ažuolyno prieplaukos apžvalgos aikštelė",
    category: "viewpoint",
    shortDescription:
      "Apžvalgos vietos. Adresas: Žvejų gyvenvietė, Neringos sav..",
    region: "Lietuva",
    municipality: "Neringos sav.",
    coordinates: {
      lat: 55.533310858823,
      lng: 21.1213932637317,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/e0149ca6-0b36-463e-8a8b-a241b83df6c2/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "babilono-sodai-26685",
    name: "Babilono sodai",
    category: "nature",
    shortDescription:
      "Botaniniai objektai. Adresas: Apžvalgos gatvė 2, Letūkai, 92373 Klaipėdos r. sav..",
    region: "Lietuva",
    municipality: "92373 Klaipėdos r. sav.",
    coordinates: {
      lat: 55.8543050461388,
      lng: 21.1073799312638,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/f0d7e938-2c73-439e-8b16-0d45cdcb4440/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "babriskiu-sv-arkangelo-mykolo-baznycia-2347",
    name: "Babriškių Šv. Arkangelo Mykolo bažnyčia",
    category: "church",
    shortDescription:
      "Bažnyčios. Adresas: Bažnyčios g. 5, Babriškės, Varėnos r..",
    region: "Lietuva",
    municipality: "Varėnos r.",
    coordinates: {
      lat: 54.322289009,
      lng: 24.5111221830001,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/c77f53f7-2a1e-458f-b2a1-04bbb5f2cd17/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "babtu-krastotyros-muziejus-2074",
    name: "Babtų kraštotyros muziejus",
    category: "museum",
    shortDescription: "Muziejai. Adresas: Nevėžio g. 3, Babtai, Kauno r..",
    region: "Lietuva",
    municipality: "Kauno r.",
    coordinates: {
      lat: 55.087455920172,
      lng: 23.7954967578832,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/f4f36ed0-11af-401d-8cfa-2bca0d7f6d8d/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "babtu-sv-apastalu-petro-ir-povilo-baznycia-3539",
    name: "Babtų Šv. apaštalų Petro ir Povilo bažnyčia",
    category: "church",
    shortDescription: "Bažnyčios. Adresas: Nevėžio g. 4A, Babtai, Kauno r..",
    region: "Lietuva",
    municipality: "Kauno r.",
    coordinates: {
      lat: 55.0887774893819,
      lng: 23.7948826979165,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/77a7f0c5-3e14-4e4b-bb7e-237a1d47f4a4/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "babtyno-dvaras-1582",
    name: "Babtyno dvaras",
    category: "castle",
    shortDescription: "Dvarai. Adresas: Žemaitkiemis, Kauno r..",
    region: "Lietuva",
    municipality: "Kauno r.",
    coordinates: {
      lat: 55.0655873306105,
      lng: 23.7922156126307,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/2f3cedfc-ae5e-48ae-b6d0-9bd7c2319295/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "baciunu-vejo-malunas-3213",
    name: "Bačiūnų vėjo malūnas",
    category: "engineering",
    shortDescription: "Vėjo malūnai. Adresas: Bačiūnai, Pakruojo r..",
    region: "Lietuva",
    municipality: "Pakruojo r.",
    coordinates: {
      lat: 55.9107055990671,
      lng: 23.7665093899543,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/e2bec562-c7f0-4d90-a20b-b139b396cd73/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "badauskiu-piliakalnis-903",
    name: "Badauskių piliakalnis",
    category: "archaeology",
    shortDescription: "Piliakalniai. Adresas: Badauskiai, Kelmės r..",
    region: "Lietuva",
    municipality: "Kelmės r.",
    coordinates: {
      lat: 55.7517314516857,
      lng: 23.0849546491359,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/c811b0a8-a843-4abf-8e77-eb824fc7385c/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
  {
    id: "bagdoniu-sentikiu-cerkve-10113",
    name: "Bagdonių sentikių cerkvė",
    category: "church",
    shortDescription:
      "Cerkvės. Adresas: Kauniškio g. 24, Bagdonys, Kupiškio r..",
    region: "Lietuva",
    municipality: "Kupiškio r.",
    coordinates: {
      lat: 55.9041446534193,
      lng: 25.0292180400153,
    },
    thumbnailUrl:
      "https://www.pamatyklietuvoje.lt/api/Photo/5cf04643-b626-454e-94bc-9999519b72df/0/420/260/crop",
    recommendedVisitMinutes: 60,
  },
];

export const ROUTE_PREVIEW: RoutePreviewResponse = {
  stops: [
    {
      order: 1,
      id: "azuolpamuses-piliakalnis-1163",
      name: "Ąžuolpamūšės piliakalnis",
      coordinates: {
        lat: 56.1233325706528,
        lng: 24.4601266618405,
      },
    },
    {
      order: 2,
      id: "azuolu-karaliene-1208",
      name: "Ąžuolų karalienė",
      coordinates: {
        lat: 54.8098421560001,
        lng: 25.004504164,
      },
    },
  ],
  totals: {
    distanceKm: 176.9,
    durationMinutes: 124,
    transportType: "car",
  },
  path: [
    {
      lat: 56.123358,
      lng: 24.460483,
    },
    {
      lat: 56.103897,
      lng: 24.460579,
    },
    {
      lat: 56.062927,
      lng: 24.425974,
    },
    {
      lat: 56.040663,
      lng: 24.377362,
    },
    {
      lat: 55.992407,
      lng: 24.343536,
    },
    {
      lat: 55.928786,
      lng: 24.335593,
    },
    {
      lat: 55.873032,
      lng: 24.345612,
    },
    {
      lat: 55.809504,
      lng: 24.368183,
    },
    {
      lat: 55.802907,
      lng: 24.331274,
    },
    {
      lat: 55.767451,
      lng: 24.29459,
    },
    {
      lat: 55.732217,
      lng: 24.275308,
    },
    {
      lat: 55.687852,
      lng: 24.28155,
    },
    {
      lat: 55.667812,
      lng: 24.353925,
    },
    {
      lat: 55.615033,
      lng: 24.41796,
    },
    {
      lat: 55.55585,
      lng: 24.510653,
    },
    {
      lat: 55.515138,
      lng: 24.598939,
    },
    {
      lat: 55.438607,
      lng: 24.673407,
    },
    {
      lat: 55.385603,
      lng: 24.706063,
    },
    {
      lat: 55.315908,
      lng: 24.780451,
    },
    {
      lat: 55.230594,
      lng: 24.819498,
    },
    {
      lat: 55.15018,
      lng: 24.824152,
    },
    {
      lat: 55.072673,
      lng: 24.881869,
    },
    {
      lat: 54.969464,
      lng: 24.948493,
    },
    {
      lat: 54.900786,
      lng: 25.039322,
    },
    {
      lat: 54.871767,
      lng: 25.066365,
    },
    {
      lat: 54.854994,
      lng: 25.010558,
    },
    {
      lat: 54.824707,
      lng: 24.984082,
    },
    {
      lat: 54.812273,
      lng: 24.98473,
    },
    {
      lat: 54.809301,
      lng: 25.00527,
    },
  ],
  segments: [
    [
      {
        lat: 56.123358,
        lng: 24.460483,
      },
      {
        lat: 56.103897,
        lng: 24.460579,
      },
      {
        lat: 56.062927,
        lng: 24.425974,
      },
      {
        lat: 56.040663,
        lng: 24.377362,
      },
      {
        lat: 55.992407,
        lng: 24.343536,
      },
      {
        lat: 55.928786,
        lng: 24.335593,
      },
      {
        lat: 55.873032,
        lng: 24.345612,
      },
      {
        lat: 55.809504,
        lng: 24.368183,
      },
      {
        lat: 55.802907,
        lng: 24.331274,
      },
      {
        lat: 55.767451,
        lng: 24.29459,
      },
      {
        lat: 55.732217,
        lng: 24.275308,
      },
      {
        lat: 55.687852,
        lng: 24.28155,
      },
      {
        lat: 55.667812,
        lng: 24.353925,
      },
      {
        lat: 55.615033,
        lng: 24.41796,
      },
      {
        lat: 55.55585,
        lng: 24.510653,
      },
      {
        lat: 55.515138,
        lng: 24.598939,
      },
      {
        lat: 55.438607,
        lng: 24.673407,
      },
      {
        lat: 55.385603,
        lng: 24.706063,
      },
      {
        lat: 55.315908,
        lng: 24.780451,
      },
      {
        lat: 55.230594,
        lng: 24.819498,
      },
      {
        lat: 55.15018,
        lng: 24.824152,
      },
      {
        lat: 55.072673,
        lng: 24.881869,
      },
      {
        lat: 54.969464,
        lng: 24.948493,
      },
      {
        lat: 54.900786,
        lng: 25.039322,
      },
      {
        lat: 54.871767,
        lng: 25.066365,
      },
      {
        lat: 54.854994,
        lng: 25.010558,
      },
      {
        lat: 54.824707,
        lng: 24.984082,
      },
      {
        lat: 54.812273,
        lng: 24.98473,
      },
      {
        lat: 54.809301,
        lng: 25.00527,
      },
    ],
  ],
};
