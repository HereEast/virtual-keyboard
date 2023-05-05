module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["airbnb-base", "airbnb-base/legacy"],
  overrides: [
    {
      files: ["*.js"],
      rules: {
        "import/extensions": [
          "off",
          "always",
          {
            ignorePackages: true
          }
        ]
      }
    }
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  },
  rules: {
    quotes: ["error", "double"],
    "import/prefer-default-export": ["off" || "warn" || "error"],
    "no-use-before-define": [
      "error",
      {
        functions: false
      }
    ]
  }
};
