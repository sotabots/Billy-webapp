import { TCurrency } from '../types'

export const mockCurrencies: TCurrency[] = [
  {
    _id: 'RUB',
    symbol: '₽',
    title: {
      en: 'Ruble',
      ru: 'Рубль',
      uk: 'Рубль',
    },
    flag: '🇷🇺',
  },
  {
    _id: 'EUR',
    symbol: '€',
    title: {
      en: 'Euro',
      ru: 'Евро',
      uk: 'Євро',
    },
    flag: '🇪🇺',
  },
  {
    _id: "USD",
    symbol: "$",
    title: {
      en: 'Dollar',
      ru: 'Доллар',
      uk: 'Долар',
    },
    flag: '🇺🇸',
  },
]
