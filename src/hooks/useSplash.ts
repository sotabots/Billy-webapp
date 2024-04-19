import { useGetTx, useGetUsers, useGetChat, useGetCurrencies, useGetRates, useGetSummary, useGetCategories, useGetTransactions } from '../api'
import { useChatId } from '../hooks'
import { useStore } from '../store'

export const useSplash = () => {
  const { currencies, txPatchError } = useStore()

  const { isLoading: isTxLoading, error: txError, data: tx } = useGetTx()
  const { isLoading: isSummaryLoading, error: summaryError } = useGetSummary()

  const { chatId } = useChatId()

  const { isLoading: isUsersLoading, error: usersError } = useGetUsers(chatId)
  const { isLoading: isChatLoading, error: chatError } = useGetChat(chatId)
  const { isLoading: isCurrenciesLoading, error: currenciesError } = useGetCurrencies(chatId)
  const { isLoading: isRatesLoading, error: ratesError } = useGetRates()
  const { isLoading: isCategoriesLoading, error: categoriesError } = useGetCategories()
  const { isLoading: isTransactionsLoading, error: transactionsError } = useGetTransactions(chatId)
  // todo: remove
  console.log('useGetTransactions', isTransactionsLoading, transactionsError)

  const isLoading = isTxLoading || isUsersLoading || isChatLoading || isCurrenciesLoading || isRatesLoading || isSummaryLoading || isCategoriesLoading || isTransactionsLoading

  const unknownCurrencyError =
    (tx?.currency_id && currencies.length && !currencies.find((currency) => currency._id === tx.currency_id))
      ? new Error(`Unknown tx currency: ${tx.currency_id}`)
      : null

  const missingRates: string[] = []
  const missingRatesError = missingRates.length ? new Error(`Missing rates: ${missingRates.join(', ')}`) : null

  const error = txError || usersError || chatError || txPatchError || currenciesError || unknownCurrencyError || ratesError || missingRatesError || summaryError || categoriesError || transactionsError

  return { isLoading, error }
}
