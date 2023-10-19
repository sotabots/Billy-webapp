import cx from 'classnames'

import { useCurrenciesQuery } from '../api'
import { useStore } from '../store'

function SplashScreen() {
  const { isLoading: isCurrenciesLoading, error: currenciesError, /* success, data*/ } = useCurrenciesQuery()

  const isLoading = isCurrenciesLoading
  const error = currenciesError

  const { isSuccess } = useStore()

  const isShown = isLoading || error || isSuccess

  return (
    <div className={cx(
      'fixed top-0 left-0 w-full h-full bg-bg2 transition-all',
      isShown ? 'opacity-100' : 'pointer-events-none opacity-0'
    )}>
      {isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[50px] h-[50px]">
          <div className="w-full h-full rounded-full border-[3px] border-button border-l-button/10 border-t-button/10 animate-[spin_0.6s_linear_infinite]" />
        </div>
      )}
      {!!error && (
        <div className="p-4 text-[#c00] text-center">
          Ошибка: {error.message}
        </div>
      )}
      {!!isSuccess && (
        <div className="p-4 text-[#0c0] text-center">
          Успешно!
        </div>
      )}
      {isSuccess === false && (
        <div className="p-4 text-[#c00] text-center">
          Ошибка сохранения
        </div>
      )}
    </div>
  )
}

export default SplashScreen
