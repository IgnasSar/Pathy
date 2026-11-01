import escomplex from "typhonjs-escomplex";
import { readFileSync, readdirSync } from "node:fs";

const files = ["api", "web", "shared"].flatMap((pkg) => {
  const folder = `packages/${pkg}/src`;
  return readdirSync(folder, { recursive: true })
    .map((name) => `${folder}/${name}`)
    .filter((file) => /\.tsx?$/.test(file) && !/\/tests\/|\.d\.ts$/.test(file));
});

const result = escomplex.analyzeProject(
  files.map((file) => ({ srcPath: file, code: readFileSync(file, "utf8") })),
);

console.table(
  result.modules.map((module) => ({
    failas: module.srcPath,
    MI: module.maintainability,
  })),
);
console.log(
  "Projekto MI (įrankio modulių vidurkis):",
  result.moduleAverage.maintainability,
);
