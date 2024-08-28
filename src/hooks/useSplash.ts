import { useGetTx, useGetUsers, useGetChat, useGetCurrencies, useGetSummary, useGetCategories, useGetTransactions } from '../api'
import { useStore, useChatId } from '../hooks'

export const useSplash = () => {
  const { currencies, transactions, txPatchError } = useStore()

  const { isLoading: isTxLoading, error: txError, data: tx } = useGetTx()
  const { isLoading: isSummaryLoading, error: summaryError } = useGetSummary()

  const { chatId } = useChatId()

  const { isLoading: isUsersLoading, error: usersError } = useGetUsers(chatId)
  const { isLoading: isChatLoading, error: chatError, data: chat } = useGetChat(chatId)
  const { isLoading: isCurrenciesLoading, error: currenciesError } = useGetCurrencies(chatId)
  const { isLoading: isCategoriesLoading, error: categoriesError } = useGetCategories()
  const { isLoading: isTransactionsLoading, error: transactionsError } = useGetTransactions(chatId)

  const isLoading = isTxLoading || isUsersLoading || isChatLoading || isCurrenciesLoading || isSummaryLoading || isCategoriesLoading || isTransactionsLoading

  const unknownCurrencyError =
    (tx?.currency_id && currencies.length && !currencies.find((currency) => currency._id === tx.currency_id))
      ? new Error(`Unknown tx currency: ${tx.currency_id}`)
      : null

  console.log('splash unknownCurrencyError', !!unknownCurrencyError, unknownCurrencyError, tx, '|' , tx?.currency_id, currencies.length, !currencies.find((currency) => currency._id === tx?.currency_id))

  const currencyIds: string[] = [...new Set([
    ...(currencies.map(currency => currency._id)),
    ...((transactions || []).map(tx => tx.currency_id || 'USD'))
  ])]

  const missingRates: string[] = (!chat?.rates) ? [] : [
    ...currencyIds.filter(currencyId => chat.rates[`USD${currencyId}`] === undefined),
  ]
  const missingRatesError = missingRates.length ? new Error(`Missing rates for ${missingRates.map(_ => JSON.stringify(_)).join(', ')}`) : null

  const error = txError || usersError || chatError || txPatchError || currenciesError || unknownCurrencyError || missingRatesError || summaryError || categoriesError || transactionsError

  return { isLoading, error }
}
