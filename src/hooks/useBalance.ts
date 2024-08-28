import { useStore, useCurrencies, useTransaction } from '../hooks'
import { formatAmount } from '../utils'

import { TTransaction } from '../types'

export const useBalance = () => {
  const { getCurrencyById } = useCurrencies()
  const { getMyBalanceDelta } = useTransaction()
  const { chat, transactions, summaryCurrencyId } = useStore()
  const rates = chat?.rates

  const balanceCurrency = getCurrencyById(summaryCurrencyId || chat?.default_currency || 'USD')
  const balanceCurrencyId = balanceCurrency?._id || 'USD'
  const balanceCurrencySymbol = balanceCurrency?.symbol || '$'

  const balance: number = (transactions || [])
    .filter((tx: TTransaction) => !tx.is_canceled && tx.is_confirmed && !!tx.currency_id)
    .reduce((acc, tx) => {
      if (!rates) {
        return acc
      }

      const myBalanceDeltaInTxCurrency = getMyBalanceDelta(tx)

      const amountInBalanceCurrency = tx.currency_id === balanceCurrencyId
        ? myBalanceDeltaInTxCurrency
        : myBalanceDeltaInTxCurrency * rates[`USD${balanceCurrencyId}`] / rates[`USD${tx.currency_id}`]

      return acc + amountInBalanceCurrency
    }, 0)

  const balanceFormatted = `${balance < 0 ? '−' : ''}${formatAmount(Math.abs(balance))}${balanceCurrencySymbol}`

  return { balance, balanceFormatted }
}