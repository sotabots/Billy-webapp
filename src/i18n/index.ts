// see example: https://github.com/i18next/react-i18next/tree/master/example/react-typescript/simple
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationEn from './translation-en.json'
import translationRu from './translation-ru.json'
import translationUk from './translation-uk.json'

i18next.use(initReactI18next).init({
  // if you're using a language detector, do not define the lng option
  // lng: window.Telegram?.WebApp.initDataUnsafe.user?.language_code === 'ru' ? 'ru' : 'en',
  lng: 'en',
  fallbackLng: ['en', 'ru', 'uk'],
  supportedLngs: ['en', 'ru', 'uk'],
  debug: true,
  resources: {
    en: { translation: translationEn },
    ru: { translation: translationRu },
    uk: { translation: translationUk },
  },
})

export default i18next
