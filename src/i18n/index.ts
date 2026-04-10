import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import sv from './sv.json'

const savedLang = typeof window !== 'undefined'
  ? localStorage.getItem('cafo-lang') || 'en'
  : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    sv: { translation: sv },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('cafo-lang', lng)
  document.documentElement.lang = lng
})

export default i18n
