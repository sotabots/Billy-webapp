import cx from 'classnames'

import { useCurrenciesQuery } from '../api'
import { useStore } from '../store'

import Loader from './Loader'

function SplashScreen() {
  const { isLoading: isCurrenciesLoading, error: currenciesError, /* success, data*/ } = useCurrenciesQuery()

  const isLoading = isCurrenciesLoading
  const error = currenciesError

  const { isSuccess } = useStore()

  const isShown = isLoading || error || isSuccess

  return (
    <div className={cx(
      'fixed top-0 left-0 w-full h-full overflow-y-auto bg-bg2 transition-all',
      isShown ? 'opacity-100' : 'pointer-events-none opacity-0'
    )}>
      <div className="flex items-center justify-center w-full min-h-full">
        {isLoading && <Loader size={50} />}
        {!!error && (
          <div className="p-4 text-center text-[#c00]">
            Ошибка: {error.message}
          </div>
        )}
        {!!isSuccess && (
          <div className="p-4 text-center text-button text-[24px]">
            Успешно!
          </div>
        )}
        {isSuccess === false && (
          <div className="p-4 text-center text-[#c00] text-[24px]">
            Ошибка сохранения
          </div>
        )}
      </div>
    </div>
  )
}

export default SplashScreen
