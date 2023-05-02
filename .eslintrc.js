module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["airbnb-base", "eslint-config-airbnb-base"],
    overrides: [
        {
            files: ["*.js"],
            rules: {
                "import/extensions": [
                    "off",
                    "always",
                    {
                        ignorePackages: true,
                    },
                ],
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {},
};
