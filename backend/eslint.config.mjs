import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node,
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      "prettier/prettier": "error",
      "no-console": "off",
      "no-unused-vars": "warn",
    },
  },
  prettier,
]);