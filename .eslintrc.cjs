module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    parser: "@typescript-eslint/parser",
    project: ["**/tsconfig.json"],
    tsconfigRootDir: "__dirname",
  },
  settings: { react: { version: "18.2" } },
  plugins: ["@typescript-eslint", "react-hooks, react-refresh"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
  ],
  rules: {
    "react/jsx-no-target-blank": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-empty-interface": "warn",
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/rules-of-hooks": "warn",
  },
};
