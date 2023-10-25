import cx from 'classnames'

import { useTxQuery, useUsersQuery } from '../api'
import { useStore } from '../store'

import Loader from './Loader'

function SplashScreen() {
  // const { isLoading: isCurrenciesLoading, error: currenciesError, /* success, data*/ } = useCurrenciesQuery()
  const { isLoading: isTxLoading, error: txError, data: tx } = useTxQuery()
  const { isLoading: isUsersLoading, error: usersError } = useUsersQuery(!tx ? undefined : tx.chat_id)

  const { isSuccess, txPatchError } = useStore()

  const isLoading = isTxLoading || isUsersLoading
  const error = txError || usersError || txPatchError

  const isShown = isLoading || error || isSuccess

  return (
    <div className={cx(
      'fixed top-0 left-0 w-full h-full overflow-y-auto bg-bg2 transition-all',
      isShown ? 'opacity-100' : 'pointer-events-none opacity-0'
    )}>
      <div className="flex items-center justify-center w-full min-h-full">
        {isLoading && !error && !isSuccess && <Loader size={50} />}
        {!!error && (
          <div className="p-4 text-center text-[#e00]">
            Error: {error.message}
          </div>
        )}
        {!!isSuccess && (
          <div className="p-4 text-center text-button text-[24px] font-medium">
            Успешно!
          </div>
        )}
      </div>
    </div>
  )
}

export default SplashScreen
