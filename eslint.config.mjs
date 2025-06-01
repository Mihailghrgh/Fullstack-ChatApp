import { fileURLToPath } from "url";
import { dirname } from "path";
import { FlatCompat } from "@eslint/eslintrc";
import pkg from "@typescript-eslint/eslint-plugin";
const { config: tseslintConfig } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  ...tseslintConfig({
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  }),
];
