import { useCurrencies } from '../hooks'
import { formatAmount } from '../utils'

import { useStore } from '../store'

export const useTotal = () => {
  const { getCurrencyById } = useCurrencies()
  const { chat } = useStore()

  const chatDefaultCurrencyId = 'USD'
  const total = 38654.55
  const chatCurrency = getCurrencyById(chat?.default_currency || chatDefaultCurrencyId)
  const currencySymbol = chatCurrency?.symbol || '$'
  const totalFormatted = `${formatAmount(total)}${currencySymbol}`

  const totalCategories = [
    {
      categoryKey: 'life_entertainment',
      amountFormatted: `${formatAmount(2)}${currencySymbol}`,
      relativeValue: 2,
    },
    {
      categoryKey: 'unknown',
      amountFormatted: `${formatAmount(1)}${currencySymbol}`,
      relativeValue: 1,
    },
  ]

  return { totalFormatted, totalCategories }
}