module.exports = {
  locales: ["da", "en"],
  defaultNamespace: "translation",
  input: ["src/**/*.{js,jsx,ts,tsx}"],
  output: "src/i18n/$LOCALE/$NAMESPACE.json",
  sort: true,
  createOldCatalogs: false,
  keepRemoved: false,
  lexers: {
    js: ["JavascriptLexer"],
    jsx: ["JsxLexer"],
    ts: ["JavascriptLexer"],
    tsx: ["JsxLexer"],
  },
  defaultValue: (locale, namespace, key) => key,
};
