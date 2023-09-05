module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
    },
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "prettier", "import"],
    extends: [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "next",
    ],
    parserOptions: {
        project: ["tsconfig.json"],
        sourceType: "module",
        tsconfigRootDir: __dirname,
    },
    rules: {
        semi: ["error", "always"],
        "@typescript-eslint/no-unused-vars": "error",
        "prettier/prettier": [
            "error",
            {
                printWidth: 80,
                endOfLine: "auto",
                tabWidth: 4,
                trailingComma: "es5",
            },
        ],
    },
};
