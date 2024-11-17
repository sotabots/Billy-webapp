import { useStore, useGetTx, useGetUsers, useGetUser, useGetChat, useGetCurrencies, useGetSummary, useGetCategories, useGetTransactions } from '../hooks'

export const useSplash = () => {
  const { txPatchError } = useStore()

  const { data: transactions } = useGetTransactions()

  const { isLoading: isTxLoading, error: txError, data: tx } = useGetTx()
  const { isLoading: isSummaryLoading, error: summaryError } = useGetSummary()

  const { isLoading: isUsersLoading, error: usersError } = useGetUsers()
  const { isLoading: isUserLoading, isFetching: isUserFetching, error: userError } = useGetUser()
  const { isLoading: isChatLoading, error: chatError, data: chat } = useGetChat()
  const { isLoading: isCurrenciesLoading, error: currenciesError, data: currencies } = useGetCurrencies()
  const { isLoading: isCategoriesLoading, error: categoriesError } = useGetCategories()
  const { isLoading: isTransactionsLoading, error: transactionsError } = useGetTransactions()

  const isLoading = isTxLoading || isUsersLoading || (isUserLoading && isUserFetching) || isChatLoading || isCurrenciesLoading || isSummaryLoading || isCategoriesLoading || isTransactionsLoading

  const unknownCurrencyError =
    (tx?.currency_id && currencies?.length && currencies.find((currency) => currency._id === tx.currency_id) === undefined)
      ? new Error(`Unknown tx currency: ${tx.currency_id}`)
      : null

  console.log('splash unknownCurrencyError', !!unknownCurrencyError, unknownCurrencyError, tx, '|' , tx?.currency_id, currencies?.length, !currencies?.find((currency) => currency._id === tx?.currency_id))

  const currencyIds: string[] = [...new Set([
    ...((currencies || []).map(currency => currency._id)),
    ...((transactions || []).map(tx => tx.currency_id || 'USD'))
  ])]

  const missingRates: string[] = (!chat?.rates) ? [] : [
    ...currencyIds.filter(currencyId => chat.rates[`USD${currencyId}`] === undefined),
  ]
  const missingRatesError = missingRates.length ? new Error(`Missing rates for ${missingRates.map(_ => JSON.stringify(_)).join(', ')}`) : null

  const error = txError || usersError || userError || chatError || txPatchError || currenciesError || unknownCurrencyError || missingRatesError || summaryError || categoriesError || transactionsError

  return { isLoading, error }
}
