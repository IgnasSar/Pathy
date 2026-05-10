#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const SEARCH_URL = 'https://www.pamatyklietuvoje.lt/api/Search/byextent';
const DEFAULT_PARAMS = {
  xmin: '20.6261',
  ymin: '53.5131',
  xmax: '27.1064',
  ymax: '56.7849',
  limit: '400',
  offset: '0',
  activeSubCategories: '1',
  activeSubTypes: '',
  limitPassive: '100',
  includePassive: 'false',
  term: '',
};

const PHOTO_SIZE = {
  index: 0,
  width: 420,
  height: 260,
  mode: 'crop',
};

function buildSearchUrl(offset) {
  const params = new URLSearchParams({
    ...DEFAULT_PARAMS,
    offset: String(offset),
  });

  return `${SEARCH_URL}?${params.toString()}`;
}

function buildPhotoUrl(globalId) {
  return `https://www.pamatyklietuvoje.lt/api/Photo/${globalId}/${PHOTO_SIZE.index}/${PHOTO_SIZE.width}/${PHOTO_SIZE.height}/${PHOTO_SIZE.mode}`;
}

async function fetchPage(offset) {
  const response = await fetch(buildSearchUrl(offset), {
    headers: {
      accept: 'application/json',
      'user-agent': 'Pathy scraper script',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed at offset ${offset}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  const outputPath = process.argv[2] ?? 'tmp/pamatyklietuvoje-objects.json';
  const pageSize = Number(DEFAULT_PARAMS.limit);

  const activeObjects = [];
  const passiveObjects = [];

  let offset = 0;

  while (true) {
    const page = await fetchPage(offset);
    const active = page.activeObjects ?? [];
    const passive = page.passiveObjects ?? [];

    activeObjects.push(
      ...active.map((item) => ({
        ...item,
        photoUrl: buildPhotoUrl(item.globalId),
      })),
    );

    passiveObjects.push(
      ...passive.map((item) => ({
        ...item,
        photoUrl: buildPhotoUrl(item.globalId),
      })),
    );

    console.log(`Fetched offset ${offset}: ${active.length} active, ${passive.length} passive`);

    if (active.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  const output = {
    scrapedAt: new Date().toISOString(),
    source: buildSearchUrl(0),
    totals: {
      activeObjects: activeObjects.length,
      passiveObjects: passiveObjects.length,
    },
    activeObjects,
    passiveObjects,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(output, null, 2), 'utf8');

  console.log(`Saved ${activeObjects.length + passiveObjects.length} objects to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
