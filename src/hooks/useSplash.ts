import { useTxQuery, useUsersQuery, useChatQuery, useCurrenciesQuery, useGetSummary } from '../api'
import { useStore } from '../store'

export const useSplash = () => {
  const { isLoading: isTxLoading, error: txError, data: tx } = useTxQuery()
  const { isLoading: isSummaryLoading, error: summaryError, data: summary } = useGetSummary()

  // todo: improve
  const chatId =
    (!tx ? undefined : tx.chat_id) ||
    (!summary ? undefined : summary.chat_id)

  const { isLoading: isUsersLoading, error: usersError } = useUsersQuery(chatId)
  const { isLoading: isChatLoading, error: chatError } = useChatQuery(chatId)
  const { isLoading: isCurrenciesLoading, error: currenciesError } = useCurrenciesQuery(chatId)

  const { currencies, txPatchError } = useStore()

  const isLoading = isTxLoading || isUsersLoading || isChatLoading || isCurrenciesLoading || isSummaryLoading

  const unknownCurrencyError =
    (tx?.currency_id && currencies.length && !currencies.find((currency) => currency._id === tx.currency_id))
      ? new Error(`Unknown tx currency ${tx.currency_id}`)
      : null

  const error = txError || usersError || chatError || txPatchError || currenciesError || unknownCurrencyError || summaryError

  return { isLoading, error }
}
