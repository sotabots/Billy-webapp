import { useCurrencies } from '../hooks'
import { formatAmount } from '../utils'

import { useStore } from '../store'
import { TTransaction } from '../types'

export const useTotal = ({ filteredTransactions }: { filteredTransactions: TTransaction[] }) => {
  const { getCurrencyById } = useCurrencies()
  const { /*rates,*/ chat } = useStore()
  const rates = chat?.rates

  const chatCurrency = getCurrencyById(chat?.default_currency || 'USD')
  const chatCurrencySymbol = chatCurrency?.symbol || '$'
  const chatCurrencyId = chatCurrency?._id || 'USD'

  type TRawCategory = {
    categoryKey: string
    amount: number
  }

  const rawCategories: TRawCategory[] = filteredTransactions
    .filter((tx: TTransaction) => !tx.is_canceled && tx.is_confirmed && !!tx.currency_id)
    .reduce((acc, tx) => {
      if (!rates) {
        return acc
      }
      const txCategory = tx.category || 'unknown'
      const itemIndex = acc.findIndex((rawCat: TRawCategory) => rawCat.categoryKey === txCategory)
      const amountInCurrency = tx.shares
        .filter(share => !share.is_payer)
        .reduce((amountAcc, share) => amountAcc + share.amount, 0)

      const amount = amountInCurrency * rates[`USD${chatCurrencyId}`] / rates[`USD${tx.currency_id}`]

      if (itemIndex === -1) {
        acc.push({
          categoryKey: txCategory,
          amount
        })
      } else {
        acc[itemIndex].amount += amount
      }
      return acc
    }, [] as TRawCategory[])

  rawCategories.sort((_1, _2) => _1.amount > _2.amount ? -1 : 1)

  if (rawCategories.length === 0) {
    rawCategories.push({
      categoryKey: 'unknown',
      amount: 0,
    })
  }

  const total = rawCategories.reduce((acc, _) => (acc + _.amount), 0)
  const totalFormatted = `${formatAmount(total)}${chatCurrencySymbol}`

  const totalCategories: {
    categoryKey: string
    amountFormatted: string
    relativeValue: number
  }[] = rawCategories.map(({ categoryKey, amount }) => ({
    categoryKey,
    amountFormatted: `${formatAmount(amount)}${chatCurrencySymbol}`,
    relativeValue: amount / total,
  }))

  return { totalFormatted, totalCategories }
}