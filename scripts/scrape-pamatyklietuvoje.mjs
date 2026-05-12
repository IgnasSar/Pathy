#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const BASE_URL = "https://www.pamatyklietuvoje.lt";
const SEARCH_URL = `${BASE_URL}/api/Search/byextent`;
const TYPE_URL = `${BASE_URL}/api/Type`;
const SUB_TYPE_URL = `${BASE_URL}/api/SubType`;
const DEFAULT_PARAMS = {
  xmin: "19.5007",
  ymin: "52.3488",
  xmax: "30.7837",
  ymax: "58.0314",
  limit: "400",
  offset: "0",
  activeSubCategories: "1",
  activeSubTypes: "",
  limitPassive: "100",
  includePassive: "false",
  term: "",
};

const PHOTO_SIZE = {
  index: 0,
  width: 420,
  height: 260,
  mode: "crop",
};

function buildSearchUrl(offset) {
  const params = new URLSearchParams({
    ...DEFAULT_PARAMS,
    offset: String(offset),
  });

  return `${SEARCH_URL}?${params.toString()}`;
}

function buildPhotoUrl(globalId) {
  return `${BASE_URL}/api/Photo/${globalId}/${PHOTO_SIZE.index}/${PHOTO_SIZE.width}/${PHOTO_SIZE.height}/${PHOTO_SIZE.mode}`;
}

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": "Pathy scraper script",
    },
  });

  if (!response.ok) {
    throw new Error(
      `${label} request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

function fetchPage(offset) {
  return fetchJson(buildSearchUrl(offset), `Search offset ${offset}`);
}

function buildLookup(items, keyName) {
  return new Map(
    items
      .filter((item) => item[keyName] !== undefined && item[keyName] !== null)
      .map((item) => [String(item[keyName]), item]),
  );
}

function buildSubTypeLookups(subTypes) {
  return {
    bySubTypeId: buildLookup(subTypes, "subTypeId"),
    byCode: buildLookup(subTypes, "code"),
  };
}

function buildTypeLookups(types) {
  return {
    byTypeId: buildLookup(types, "typeId"),
    byRefTypeId: buildLookup(types, "ref_TypeId"),
  };
}

function findSubType(item, subTypeLookups) {
  // Search result subTypeId corresponds to /api/SubType.subTypeId.
  // subTypeCode corresponds to /api/SubType.code. Do not merge all ID-like
  // fields into one map because their numeric values overlap across meanings.
  return (
    subTypeLookups.bySubTypeId.get(String(item.subTypeId)) ??
    subTypeLookups.byCode.get(String(item.subTypeCode))
  );
}

function findType(subType, typeLookups) {
  // SubType.typeId corresponds to /api/Type.typeId. ref_TypeId is only a
  // fallback for older/reference IDs and must not be mixed with objectId.
  return (
    typeLookups.byTypeId.get(String(subType.typeId)) ??
    typeLookups.byRefTypeId.get(String(subType.ref_TypeId))
  );
}

function enrichObject(item, subTypeLookups, typeLookups) {
  const subType = findSubType(item, subTypeLookups);
  const type = subType ? findType(subType, typeLookups) : undefined;

  return {
    ...item,
    photoUrl: buildPhotoUrl(item.globalId),
    subType: subType
      ? {
          id: subType.subTypeId,
          code: subType.code,
          nameLt: subType.nameLt,
          nameEn: subType.nameEn,
          typeId: subType.typeId,
          refTypeId: subType.ref_TypeId,
        }
      : null,
    type: type
      ? {
          id: type.typeId,
          objectId: type.objectId,
          nameLt: type.nameLt,
          nameEn: type.nameEn,
          subCategoryId: type.subCategoryId,
          refTypeId: type.ref_TypeId,
        }
      : null,
  };
}

async function main() {
  const outputPath = process.argv[2] ?? "tmp/pamatyklietuvoje-objects.json";
  const pageSize = Number(DEFAULT_PARAMS.limit);

  const [types, subTypes] = await Promise.all([
    fetchJson(TYPE_URL, "Type"),
    fetchJson(SUB_TYPE_URL, "SubType"),
  ]);
  const typeLookups = buildTypeLookups(types);
  const subTypeLookups = buildSubTypeLookups(subTypes);

  console.log(
    `Fetched metadata: ${types.length} types, ${subTypes.length} subtypes`,
  );

  const activeObjects = [];
  const passiveObjects = [];

  let offset = 0;

  while (true) {
    const page = await fetchPage(offset);
    const active = page.activeObjects ?? [];
    const passive = page.passiveObjects ?? [];

    activeObjects.push(
      ...active.map((item) => enrichObject(item, subTypeLookups, typeLookups)),
    );

    passiveObjects.push(
      ...passive.map((item) => enrichObject(item, subTypeLookups, typeLookups)),
    );

    console.log(
      `Fetched offset ${offset}: ${active.length} active, ${passive.length} passive`,
    );

    if (active.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  const output = {
    scrapedAt: new Date().toISOString(),
    source: buildSearchUrl(0),
    sources: {
      search: buildSearchUrl(0),
      types: TYPE_URL,
      subTypes: SUB_TYPE_URL,
    },
    totals: {
      types: types.length,
      subTypes: subTypes.length,
      activeObjects: activeObjects.length,
      passiveObjects: passiveObjects.length,
    },
    metadata: {
      types,
      subTypes,
    },
    activeObjects,
    passiveObjects,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(output, null, 2), "utf8");

  console.log(
    `Saved ${activeObjects.length + passiveObjects.length} objects to ${outputPath}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
