import { useTxQuery, useUsersQuery, useCurrenciesQuery } from '../api'
import { useStore } from '../store'

export const useSplash = () => {
  const { isLoading: isTxLoading, error: txError, data: tx } = useTxQuery()
  const { isLoading: isUsersLoading, error: usersError } = useUsersQuery(!tx ? undefined : tx.chat_id)
  const { isLoading: isCurrenciesLoading, error: currenciesError } = useCurrenciesQuery(!tx ? undefined : tx.chat_id)
  const { currencies } = useStore()

  const { isSuccess, txPatchError } = useStore()

  const isLoading = isTxLoading || isUsersLoading || isCurrenciesLoading
  const unknownCurrencyError =
    (tx?.currency_id && currencies.length && !currencies.find((currency) => currency._id === tx.currency_id))
      ? new Error(`Unknown tx currency ${tx.currency_id}`)
      : null
  const error = txError || usersError || txPatchError || currenciesError || unknownCurrencyError

  const isSplash = isLoading || error || isSuccess

  return { isSplash, isLoading, error, isSuccess }
}
