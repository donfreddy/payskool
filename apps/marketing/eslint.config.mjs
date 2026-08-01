import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import { baseConfig } from "@payskool/config-eslint/base";

const eslintConfig = defineConfig([
  ...baseConfig,
  ...nextVitals.map(config => {
    if (config.plugins) {
      const { import: _import, "@typescript-eslint": _ts, ...rest } = config.plugins;
      return { ...config, plugins: rest };
    }
    return config;
  }),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
