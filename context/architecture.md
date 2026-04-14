# Pathy Architecture

## Parinktas stackas

| Sluoksnis             | Technologija                     | Ką darys projekte                                                         |
| :-------------------- | :------------------------------- | :------------------------------------------------------------------------ |
| Frontend              | `React + TypeScript`             | Web aplikacijos UI, objektų sąrašai, filtrai, kortelės, maršruto peržiūra |
| Build įrankis         | `Vite`                           | Frontend paleidimas ir build procesas                                     |
| Stiliai               | `Tailwind CSS`                   | Mobile-first dizainas ir greitas UI formavimas                            |
| Frontend būsena       | `TanStack Query` + `Zustand`     | API duomenų valdymas, pasirinkimų sąrašas, sesijos būsena                 |
| Backend               | `Node.js + TypeScript + Fastify` | REST API paieškai, filtravimui, objektų informacijai ir maršrutų logikai  |
| Duomenų bazė          | `PostgreSQL`                     | Objektai, kategorijos, koordinatės, maršrutų duomenys                     |
| Geografinės užklausos | `PostGIS`                        | Filtravimas pagal atstumą, lokaciją ir koordinates                        |
| Žemėlapis             | `Leaflet + OpenStreetMap`        | Objektų ir maršrutų rodymas žemėlapyje                                    |
| Maršrutų skaičiavimas | `OpenRouteService`               | Maršruto ir trukmės skaičiavimas pagal transporto tipą                    |
| Lokalizacija          | `react-i18next`                  | Kelių kalbų sąsaja                                                        |
| Logavimas             | `Pino`                           | Serverio klaidų ir įvykių registravimas                                   |

## Sistemos vaizdas

```text
[ React frontend ]
        |
        v
[ Fastify REST API ]
        |
        +--> [ PostgreSQL + PostGIS ]
        +--> [ OpenRouteService ]
        +--> [ OpenStreetMap / Leaflet ]
```

## Ką darys dabartinė versija

- Ieškos objektų pagal pavadinimą
- Filtruos objektus pagal vartotojo lokaciją ir pasirinktą atstumą
- Rodys objektų informaciją ir vietą žemėlapyje
- Leis pridėti objektus į maršrutą ir juos šalinti
- Skaičiuos maršrutą pagal pasirinktus taškus ir transporto tipą
- Rodys maršruto trukmę
- Palaikys kelių kalbų sąsają

## Kas gali atsirasti vėliau

- Periodinis duomenų atnaujinimas iš scraping ar importo šaltinių
- Nuotraukos įkėlimas ir objekto atpažinimas
- Embeddings pagrindu veikianti panašių objektų paieška
- Atskiras `Python + FastAPI` servisas AI funkcijoms
