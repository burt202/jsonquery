module.exports = {
  plugins: ["react", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
    node: true,
    mocha: true,
    es6: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
}
