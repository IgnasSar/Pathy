import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: { parser: tseslint.parser },
    plugins: { sonarjs },
    // Riba 0: įrankis išspausdina kiekvienos funkcijos sudėtingumą.
    rules: {
      complexity: ["warn", 0],
      "sonarjs/cognitive-complexity": ["warn", 0],
    },
  },
];
