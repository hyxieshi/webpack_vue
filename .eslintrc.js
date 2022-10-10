module.exports = {
    // vue  官方 es
    root: true,
    env: {
        node: true,
    },
    extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
    parserOptions: {
        parser: "@babel/eslint-parser",
    },
};