import js from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ignores: ["dist/**", "node_modules/**"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
            },
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended.rules,
        },
    },
    prettier, // ensures Prettier and ESLint don’t conflict
];
