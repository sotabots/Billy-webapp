import cx from 'classnames'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

import { useSplash } from '../hooks'
import Loader from './Loader'

function SplashScreen() {
  const { isSplash, isLoading, error, isSuccess } = useSplash()

  useEffect(() => {
    if (isSuccess) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [isSuccess])

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
