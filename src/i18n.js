import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: {
        name: "Name",
        status: "Status",
        species: "Species",
        gender: "Gender",
        origin: "Origin"
      }
    },
    de: {
      translation: {
        name: "Name",
        status: "Status",
        species: "Spezies",
        gender: "Geschlecht",
        origin: "Herkunft"
      }
    }
  };
  
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
  
  export default i18n;