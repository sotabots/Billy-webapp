import { useTxQuery, useUsersQuery } from '../api'
import { useStore } from '../store'

export const useSplash = () => {
  // const { isLoading: isCurrenciesLoading, error: currenciesError, /* success, data*/ } = useCurrenciesQuery()
  const { isLoading: isTxLoading, error: txError, data: tx } = useTxQuery()
  const { isLoading: isUsersLoading, error: usersError } = useUsersQuery(!tx ? undefined : tx.chat_id)

  const { isSuccess, txPatchError } = useStore()

  const isLoading = isTxLoading || isUsersLoading
  const error = txError || usersError || txPatchError

  const isSplash = isLoading || error || isSuccess

  return { isSplash, isLoading, error, isSuccess }
}