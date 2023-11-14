import { useEffect } from 'react'
import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import cx from 'classnames'

import { useSplash } from '../hooks'
import Loader from './Loader'

function SplashScreen() {
  const { isSplash, isLoading, error, isSuccess } = useSplash()

  const [, notificationOccurred] = useHapticFeedback()

  useEffect(() => {
    if (isSuccess) {
      console.log('success vibro')
      notificationOccurred('success')
    }
  }, [isSuccess, notificationOccurred])

  useEffect(() => {
    if (error) {
      console.log('error vibro')
      notificationOccurred('error')
    }
  }, [error, notificationOccurred])

  return (
    <div className={cx(
      'fixed top-0 left-0 w-full h-full overflow-y-auto bg-bg2 transition-all',
      isSplash ? 'opacity-100' : 'pointer-events-none opacity-0'
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
