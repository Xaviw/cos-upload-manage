import js from "@eslint/js"
import prettier from "eslint-config-prettier/flat"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import tailwind from "eslint-plugin-tailwindcss"
import { defineConfig } from "eslint/config"
import globals from "globals"
import ts from "typescript-eslint"

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "*.config.*"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  ...tailwind.configs["flat/recommended"],
  prettier,
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      tailwindcss: {
        config: `${import.meta.dirname}/src/styles/global.css`,
      },
    },
    rules: {
      "react/prop-types": "off",
      "tailwindcss/no-custom-classname": "off",
    },
  },
])
