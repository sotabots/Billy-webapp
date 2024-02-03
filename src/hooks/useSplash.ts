import { useTxQuery, useUsersQuery, useChatQuery, useCurrenciesQuery } from '../api'
import { useStore } from '../store'

export const useSplash = () => {
  const { isLoading: isTxLoading, error: txError, data: tx } = useTxQuery()
  const { isLoading: isUsersLoading, error: usersError } = useUsersQuery(!tx ? undefined : tx.chat_id)
  const { isLoading: isChatLoading, error: chatError } = useChatQuery(!tx ? undefined : tx.chat_id)
  const { isLoading: isCurrenciesLoading, error: currenciesError } = useCurrenciesQuery(!tx ? undefined : tx.chat_id)

  const { currencies, txPatchError } = useStore()

  const isLoading = isTxLoading || isUsersLoading || isChatLoading || isCurrenciesLoading

  const unknownCurrencyError =
    (tx?.currency_id && currencies.length && !currencies.find((currency) => currency._id === tx.currency_id))
      ? new Error(`Unknown tx currency ${tx.currency_id}`)
      : null

  const error = txError || usersError || chatError || txPatchError || currenciesError || unknownCurrencyError

  return { isLoading, error }
}
