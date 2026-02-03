import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import fr from './locales/fr.json'
import en from './locales/en.json'

// Pour ajouter une langue : 1) créer src/locales/xx.json (copier fr.json et traduire)
// 2) ajouter : import xx from './locales/xx.json'
// 3) ajouter dans resources : xx: { translation: xx }
// 4) ajouter dans supportedLngs : 'xx'
const resources = {
  fr: { translation: fr },
  en: { translation: en }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })

export default i18n
