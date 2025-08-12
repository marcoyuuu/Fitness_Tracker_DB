import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import { getBasePath } from './utils/basePath';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Load translation using http -> see /public/locales. Can be configured to load from your server.
  .use(LanguageDetector) // Detect language in the browser.
  .use(initReactI18next) // Pass the i18n instance to react-i18next.
  .init({
    fallbackLng: 'en', // Use 'en' if detected lng is unavailable.
    debug: true, // Set to true to see language detection info in the console
    load: 'languageOnly',  // This will ignore regional variants like 'en-US' and just use 'en
    interpolation: {
      escapeValue: false, // React already safes from XSS.
    },
    backend: {
      // Prefix with runtime base path so it works when the app is served under a subpath
      loadPath: `${getBasePath()}/locales/{{lng}}/{{ns}}.json`,
    }
  });

export default i18n;
