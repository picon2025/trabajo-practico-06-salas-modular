const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/**"]
  },
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",

        __dirname: "readonly"
      }
    },
    rules: {
      ...js.configs.recommended.rules
    }
  }
];