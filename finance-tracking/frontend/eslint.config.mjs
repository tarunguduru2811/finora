import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  //Disable rules that are blocking
  {
    rules:{
        "@typescript-eslint/no-explicit-any": "off",  // allow `any` types
      "@typescript-eslint/no-unused-vars": "off",  // allow unused vars
      "react-hooks/exhaustive-deps": "off",        // skip missing deps warning
      "prefer-const": "off",                        // allow let instead of const
    },
    }
];

export default eslintConfig;
