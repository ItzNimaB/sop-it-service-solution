import { initReactI18next } from "react-i18next";

import i18n from "i18next";

import DA from "./src/i18n/da/translation.json";
import EN from "./src/i18n/en/translation.json";

const resources = {
  en: { translation: EN },
  da: { translation: DA },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: "da",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
