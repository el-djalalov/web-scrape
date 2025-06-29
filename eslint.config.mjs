import { defineConfig } from "eslint-define-config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  js.configs.recommended, // It's good practice to include ESLint's own recommendations
  ...compat.extends("next/core-web-vitals"),

  {
    rules: {
      // Your custom rules
      'no-unused-vars': 'off',
    },
  },
]);
