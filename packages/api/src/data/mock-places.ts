import type { PlaceDetail } from "@pathy/shared";

export const mockPlaces = [
  {
    id: "trakai-castle",
    name: "Traku pilis",
    category: "castle",
    shortDescription: "Gotikine pilis Galves ezero saloje.",
    fullDescription:
      "Viena zinomiausiu Lietuvos istoriniu vietu su ekspozicijomis ir pasivaiksciojimu saloje.",
    region: "Vilniaus apskritis",
    municipality: "Traku rajonas",
    address: "Karaimu g. 43C, Trakai",
    coordinates: {
      lat: 54.6521,
      lng: 24.9341,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Trakai%20Island%20Castle%2002.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Trakai%20Island%20Castle%2002.jpg",
    ],
    tags: ["history", "castle", "lake"],
    recommendedVisitMinutes: 90,
  },
  {
    id: "uzutrakis-manor",
    name: "Uzutrakio dvaras",
    category: "landmark",
    shortDescription: "Dvaras su parku ir vaizdu i Galves ezera.",
    fullDescription:
      "Istorinis dvaro ansamblis salia Traku, tinkamas ramiam pasivaiksciojimui ir architekturos apziurai.",
    region: "Vilniaus apskritis",
    municipality: "Traku rajonas",
    address: "Uzutrakio g. 17, Trakai",
    coordinates: {
      lat: 54.6423,
      lng: 24.9712,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/U%C5%BEutrakio%20dvaras%2028.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/U%C5%BEutrakio%20dvaras%2028.JPG",
    ],
    tags: ["architecture", "history", "park"],
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gediminas%20Tower%20(27350727230).jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gediminas%20Tower%20(27350727230).jpg",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Bernardinai%20garden.jpg",
    ],
    tags: ["park", "city", "family-friendly"],
    recommendedVisitMinutes: 40,
  },
  {
    id: "nine-fort-museum",
    name: "Devintojo forto muziejus",
    category: "museum",
    shortDescription: "Istorinis muziejus ir memorialinis kompleksas Kaune.",
    fullDescription:
      "Stipri istorine vieta apie XX amziaus ivykius, Kauno tvirtove ir okupaciju laikotarpi.",
    region: "Kauno apskritis",
    municipality: "Kauno miestas",
    address: "Zemaiciu pl. 75, Kaunas",
    coordinates: {
      lat: 54.9452,
      lng: 23.8709,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/IX%20Fort%20(2008-09-20)08.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/IX%20Fort%20(2008-09-20)08.jpg",
    ],
    tags: ["museum", "history", "memorial"],
    recommendedVisitMinutes: 80,
  },
  {
    id: "pazaislis-monastery",
    name: "Pazaislio vienuolynas",
    category: "church",
    shortDescription: "Barokinis sakralinis ansamblis prie Kauno mariu.",
    fullDescription:
      "Vienas brandziausiu baroko architekturos pavyzdziu Lietuvoje, lankomas del interjero ir aplinkos.",
    region: "Kauno apskritis",
    municipality: "Kauno miestas",
    address: "T. Masiulio g. 31, Kaunas",
    coordinates: {
      lat: 54.8777,
      lng: 24.0207,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pazaislis%20Monastery%20(Kaunas%2C%20Lithuania%2C%202017).jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Pazaislis%20Monastery%20(Kaunas%2C%20Lithuania%2C%202017).jpg",
    ],
    tags: ["church", "architecture", "history"],
    recommendedVisitMinutes: 60,
  },
  {
    id: "hill-of-crosses",
    name: "Kryziu kalnas",
    category: "memorial",
    shortDescription: "Unikali piligrimine ir atminties vieta netoli Siauliu.",
    fullDescription:
      "Vienas zinomiausiu Lietuvos dvasiniu simboliu, lankomas del isskirtines atmosferos ir istorines reiksmes.",
    region: "Siauliu apskritis",
    municipality: "Siauliu rajonas",
    address: "Jurgaiiciai, Siauliu rajonas",
    coordinates: {
      lat: 56.0153,
      lng: 23.4167,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hill%20of%20Crosses%2005082019%20020.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hill%20of%20Crosses%2005082019%20020.jpg",
    ],
    tags: ["pilgrimage", "history", "memorial"],
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kirkilai%20Observation%20Tower%2C%202016.jpg",
    ],
    tags: ["viewpoint", "nature", "photography"],
    recommendedVisitMinutes: 35,
  },
  {
    id: "nida-dunes",
    name: "Nidos kopos",
    category: "nature",
    shortDescription: "Kopos ir pesciuju marsrutai Kurso nerijoje.",
    fullDescription:
      "Isskirtinis pajurio krastovaizdis su smeliu, mariomis ir ilgesniam gamtos apsilankymui tinkamais takais.",
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
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nida%20Dunes.jpg",
    ],
    tags: ["sea", "nature", "walk"],
    recommendedVisitMinutes: 120,
  },
  {
    id: "vilnius-cathedral",
    name: "Vilniaus katedra",
    category: "church",
    shortDescription: "Svarbiausia Lietuvos kataliku sventove sostines centre.",
    fullDescription:
      "Katedra ir aikste yra vienas pagrindiniu Vilniaus senamiescio traukos tasku.",
    region: "Vilniaus apskritis",
    municipality: "Vilniaus miestas",
    address: "Katedros a. 1, Vilnius",
    coordinates: {
      lat: 54.6859,
      lng: 25.2879,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Vilnius%20Cathedral%202014.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Vilnius%20Cathedral%202014.jpg",
    ],
    tags: ["church", "old-town", "architecture"],
    recommendedVisitMinutes: 40,
  },
  {
    id: "st-annes-church",
    name: "Sv. Onos baznycia",
    category: "church",
    shortDescription: "Ikonine gotikine baznycia Vilniaus senamiestyje.",
    fullDescription:
      "Viena atpazistamiausiu Vilniaus baznyciu, vertinama del fasado ir vietos salia Bernardinu ansamblio.",
    region: "Vilniaus apskritis",
    municipality: "Vilniaus miestas",
    address: "Maironio g. 8, Vilnius",
    coordinates: {
      lat: 54.6831,
      lng: 25.2933,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/St.%20Anne%27s%20Church%20in%20Vilnius%202005.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/St.%20Anne%27s%20Church%20in%20Vilnius%202005.jpg",
    ],
    tags: ["church", "gothic", "old-town"],
    recommendedVisitMinutes: 30,
  },
  {
    id: "paneriai-memorial",
    name: "Paneriu memorialas",
    category: "memorial",
    shortDescription: "Holokausto ir masiniu zudyniu atminimo vieta Vilniuje.",
    fullDescription:
      "Svarbi istorines atminties vieta su memorialu, informacija apie ivykius ir misko aplinka.",
    region: "Vilniaus apskritis",
    municipality: "Vilniaus miestas",
    address: "Agrastu g. 15A, Vilnius",
    coordinates: {
      lat: 54.6303,
      lng: 25.1597,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Paneriai%20memorial%20-%20panoramio.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Paneriai%20memorial%20-%20panoramio.jpg",
    ],
    tags: ["memorial", "history", "holocaust"],
    recommendedVisitMinutes: 50,
  },
  {
    id: "kernave-mounds",
    name: "Kernaves piliakalniai",
    category: "archaeology",
    shortDescription: "UNESCO archeologine vietove su piliakalniu kompleksu.",
    fullDescription:
      "Vienas svarbiausiu ankstyvosios Lietuvos valstybingumo ir archeologinio paveldo objektu.",
    region: "Vilniaus apskritis",
    municipality: "Sirvintu rajonas",
    address: "Kernave, Sirvintu rajonas",
    coordinates: {
      lat: 54.8825,
      lng: 24.8514,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kernav%C4%97s%20piliakalniai%201.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kernav%C4%97s%20piliakalniai%201.jpg",
    ],
    tags: ["archaeology", "history", "unesco"],
    recommendedVisitMinutes: 75,
  },
  {
    id: "anyksciai-treetop-path",
    name: "Anyksciu laju takas",
    category: "viewpoint",
    shortDescription: "Medziu laju takas ir bokstas Anyksciu silelyje.",
    fullDescription:
      "Vienas populiariausiu Lietuvos gamtiniu marsrutu su vaizdu i miska is aukscio.",
    region: "Utenos apskritis",
    municipality: "Anyksciu rajonas",
    address: "Dvaroniu k. 5, Anyksciu rajonas",
    coordinates: {
      lat: 55.4859,
      lng: 25.0624,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Anyk%C5%A1%C4%8Di%C5%B3%20laj%C5%B3%20takas.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Anyk%C5%A1%C4%8Di%C5%B3%20laj%C5%B3%20takas.JPG",
    ],
    tags: ["viewpoint", "forest", "walk"],
    recommendedVisitMinutes: 75,
  },
  {
    id: "merkine-tower",
    name: "Merkines apzvalgos bokstas",
    category: "viewpoint",
    shortDescription: "Apzvalgos bokstas prie Nemuno ir Merkio santakos.",
    fullDescription:
      "Bokstas suteikia platu vaizda i Merkines apylinkes, upe ir nacionalinio parko krastovaizdi.",
    region: "Alytaus apskritis",
    municipality: "Varenos rajonas",
    address: "Seinu g., Merkine",
    coordinates: {
      lat: 54.1637,
      lng: 24.1746,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nemunas%20from%20Merkin%C4%97%20Observation%20Tower%2C%202016%2001.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Nemunas%20from%20Merkin%C4%97%20Observation%20Tower%2C%202016%2001.JPG",
    ],
    tags: ["viewpoint", "river", "panorama"],
    recommendedVisitMinutes: 35,
  },
  {
    id: "puntukas-stone",
    name: "Puntuko akmuo",
    category: "nature",
    shortDescription: "Vienas garsiausiu rieduliu Lietuvoje prie Anyksciu.",
    fullDescription:
      "Didelis gamtinis ir kulturos objektas Anyksciu silelyje, siejamas su legendomis ir literaturine tradicija.",
    region: "Utenos apskritis",
    municipality: "Anyksciu rajonas",
    address: "Anyksciu silas, Anyksciu rajonas",
    coordinates: {
      lat: 55.5251,
      lng: 25.1172,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Puntukas%20(cropped).jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Puntukas%20(cropped).jpg",
    ],
    tags: ["nature", "boulder", "legend"],
    recommendedVisitMinutes: 30,
  },
  {
    id: "olando-kepure",
    name: "Olando kepure",
    category: "nature",
    shortDescription: "Pajurio skardis netoli Karkles.",
    fullDescription:
      "Vienas zinomiausiu Lietuvos pajurio gamtos objektu su vaizdu i Baltijos jura ir skardi.",
    region: "Klaipedos apskritis",
    municipality: "Klaipedos rajonas",
    address: "Karkle, Klaipedos rajonas",
    coordinates: {
      lat: 55.7967,
      lng: 21.0672,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dutchman%27s-hat-%28Olando-Kepure%291.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dutchman%27s-hat-%28Olando-Kepure%291.jpg",
    ],
    tags: ["coast", "nature", "sea"],
    recommendedVisitMinutes: 45,
  },
  {
    id: "museum-of-ethnocosmology",
    name: "Lietuvos etnokosmologijos muziejus",
    category: "museum",
    shortDescription: "Muziejus apie zmogaus rysi su kosmosu ir visata.",
    fullDescription:
      "Isskirtinis muziejus Kulionyse, zinomas del architekturos, ekspoziciju ir apzvalgos boksto.",
    region: "Utenos apskritis",
    municipality: "Moletu rajonas",
    address: "Kulioniu k. 10, Moletu rajonas",
    coordinates: {
      lat: 55.3154,
      lng: 25.5551,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lithuanian%20Museum%20of%20Ethnocosmology%20in%20Spring%202012.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lithuanian%20Museum%20of%20Ethnocosmology%20in%20Spring%202012.jpg",
    ],
    tags: ["museum", "science", "architecture"],
    recommendedVisitMinutes: 90,
  },
  {
    id: "devils-museum",
    name: "Velniu muziejus",
    category: "museum",
    shortDescription: "Unikalus muziejus su velniu ir mitologijos kolekcija.",
    fullDescription:
      "Zinomas Kauno muziejus, issiskiriantis tematika, menine kolekcija ir neiprasta atmosfera.",
    region: "Kauno apskritis",
    municipality: "Kauno miestas",
    address: "V. Putvinskio g. 64, Kaunas",
    coordinates: {
      lat: 54.9008,
      lng: 23.9106,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/A.%20%C5%BDmuidzinavi%C4%8Diaus%20memorialiniai%20namai%2C%20Velni%C5%B3%20muziejus.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/A.%20%C5%BDmuidzinavi%C4%8Diaus%20memorialiniai%20namai%2C%20Velni%C5%B3%20muziejus.jpg",
    ],
    tags: ["museum", "art", "mythology"],
    recommendedVisitMinutes: 60,
  },
  {
    id: "open-air-museum",
    name: "Lietuvos liaudies buities muziejus",
    category: "museum",
    shortDescription: "Didelis muziejus po atviru dangumi Rumsiskese.",
    fullDescription:
      "Etnografiniu sodybu ir pastatu muziejus, leidziantis pamatyti skirtingu regionu tradicine architektura.",
    region: "Kauno apskritis",
    municipality: "Kaisiadoriu rajonas",
    address: "L. Lekaviciaus g. 2, Rumsiskes",
    coordinates: {
      lat: 54.8707,
      lng: 24.2019,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Open-Air%20Museum%20of%20Lithuania%2026.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Open-Air%20Museum%20of%20Lithuania%2026.jpg",
    ],
    tags: ["museum", "ethnography", "open-air"],
    recommendedVisitMinutes: 120,
  },
  {
    id: "grutas-park",
    name: "Gruto parkas",
    category: "park",
    shortDescription:
      "Parkas ir ekspozicija su sovietinio laikotarpio monumentais.",
    fullDescription:
      "Neiprastas parkas prie Druskininku, kuriame eksponuojamos sovietines skulpturos ir istorinis kontekstas.",
    region: "Alytaus apskritis",
    municipality: "Druskininku savivaldybe",
    address: "Grutas, Druskininku savivaldybe",
    coordinates: {
      lat: 54.0208,
      lng: 24.0797,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gr%C5%ABto%20parkas%20-%20Lenin.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Gr%C5%ABto%20parkas%20-%20Lenin.JPG",
    ],
    tags: ["park", "history", "sculpture"],
    recommendedVisitMinutes: 90,
  },
  {
    id: "panemune-castle",
    name: "Panemunes pilis",
    category: "castle",
    shortDescription:
      "Renesansine pilis Panemunes regioninio parko apylinkese.",
    fullDescription:
      "Viena geriausiai zinomu Lietuvos piliu rezidenciju, lankoma del boksto, interjero ir Nemuno panoramu.",
    region: "Taurages apskritis",
    municipality: "Jurbarko rajonas",
    address: "Pilies I k., Jurbarko rajonas",
    coordinates: {
      lat: 55.099,
      lng: 22.986,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Panemun%C4%97s%20pilis%202009-07-29.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Panemun%C4%97s%20pilis%202009-07-29.jpg",
    ],
    tags: ["castle", "architecture", "history"],
    recommendedVisitMinutes: 75,
  },
  {
    id: "kaunas-castle",
    name: "Kauno pilis",
    category: "castle",
    shortDescription: "Seniausia islikusi murine pilis Kaune.",
    fullDescription:
      "Kauno senamiescio simbolis prie Neries ir Nemuno santakos, tinkamas trumpam istoriniam sustojimui.",
    region: "Kauno apskritis",
    municipality: "Kauno miestas",
    address: "Pilies g. 17, Kaunas",
    coordinates: {
      lat: 54.8989,
      lng: 23.885,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kaunas%20Castle%20in%202011.JPG",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Kaunas%20Castle%20in%202011.JPG",
    ],
    tags: ["castle", "history", "old-town"],
    recommendedVisitMinutes: 45,
  },
  {
    id: "cold-war-museum",
    name: "Saltojo karo muziejus",
    category: "museum",
    shortDescription: "Buvusi raketu baze Zemaitijos nacionaliniame parke.",
    fullDescription:
      "Po zeminiais koridoriais ir silosu irengtas muziejus, atskleidziantis Saltojo karo istorija Lietuvoje.",
    region: "Telsiu apskritis",
    municipality: "Plunges rajonas",
    address: "Plokstine, Plunges rajonas",
    coordinates: {
      lat: 56.0323,
      lng: 21.9063,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lithuania%20Plokstine%20missile%20base%201.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lithuania%20Plokstine%20missile%20base%201.jpg",
    ],
    tags: ["museum", "history", "cold-war"],
    recommendedVisitMinutes: 90,
  },
  {
    id: "medvegalis",
    name: "Medvegalis",
    category: "archaeology",
    shortDescription: "Aukstas Zemaitijos piliakalnis su placia panorama.",
    fullDescription:
      "Istorinis piliakalnis ir viena stipriausiai su viduramziu gynyba siejamu Zemaitijos vietu.",
    region: "Taurages apskritis",
    municipality: "Silales rajonas",
    address: "Medvegalis, Silales rajonas",
    coordinates: {
      lat: 55.6289,
      lng: 22.3886,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Medvegalis.Pilioriu%20kalnas.2009-05-21.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Medvegalis.Pilioriu%20kalnas.2009-05-21.jpg",
    ],
    tags: ["archaeology", "hillfort", "history"],
    recommendedVisitMinutes: 60,
  },
  {
    id: "literatu-street",
    name: "Literatu gatve",
    category: "street-art",
    shortDescription: "Meno instaliaciju gatve Vilniaus senamiestyje.",
    fullDescription:
      "Trumpa, bet labai atpazistama senamiescio gatve su literaturai skirtomis meninemis plokstelemis ir darbais.",
    region: "Vilniaus apskritis",
    municipality: "Vilniaus miestas",
    address: "Literatu g., Vilnius",
    coordinates: {
      lat: 54.6822,
      lng: 25.2903,
    },
    thumbnailUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Literatu.jpg",
    imageUrls: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Literatu.jpg",
    ],
    tags: ["street-art", "old-town", "culture"],
    recommendedVisitMinutes: 20,
  },
] satisfies PlaceDetail[];
