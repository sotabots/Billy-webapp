import { useAuth, useCurrencies, useGetChat, useGetUserSettings, useStore } from '../hooks'
import { formatAmount } from '../utils'

import { TTransaction } from '../types'

export const useTotal = ({ filteredTransactions }: {
  filteredTransactions: TTransaction[]
}) => {
  const { userId } = useAuth()

  const { getCurrencyById } = useCurrencies()
  const { filterTotal } = useStore()
  const { data: chat } = useGetChat()
  const rates = chat?.rates

  const { data: userSettings } = useGetUserSettings()

  const myCurrency = getCurrencyById(userSettings?.currency || 'USD')
  const myCurrencySymbol = myCurrency?.symbol || '$'
  const myCurrencyId = myCurrency?._id || 'USD'

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

      const amountInTxCurrency = tx.shares
        .filter(share => !share.is_payer)
        .filter(share => filterTotal === 'ONLY_MINE'
          ? share.related_user_id === userId
          : true
        )
        .reduce((amountAcc, share) => amountAcc + share.amount, 0)

      const amountInMyCurrency = tx.currency_id === myCurrencyId
        ? amountInTxCurrency
        : amountInTxCurrency * rates[`USD${myCurrencyId}`] / rates[`USD${tx.currency_id}`]

      const txCategory = tx.category || 'unknown'
      const itemIndex = acc.findIndex((rawCat: TRawCategory) => rawCat.categoryKey === txCategory)
      if (itemIndex === -1) {
        acc.push({
          categoryKey: txCategory,
          amount: amountInMyCurrency
        })
      } else {
        acc[itemIndex].amount += amountInMyCurrency
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
  const totalFormatted = `${formatAmount(total)}${myCurrencySymbol}`

  const totalCategories: {
    categoryKey: string
    amountFormatted: string
    relativeValue: number
  }[] = rawCategories.map(({ categoryKey, amount }) => ({
    categoryKey,
    amountFormatted: `${formatAmount(amount)}${myCurrencySymbol}`,
    relativeValue: amount / total,
  }))

  return { totalFormatted, totalCategories }
}