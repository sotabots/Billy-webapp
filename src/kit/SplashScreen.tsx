import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useEffect } from 'react'

import { useSplash } from '../hooks'
import Loader from './Loader'
import Overlay from './Overlay'

import lottieSuccess from '../assets/lottie-success.json'

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
    <Overlay isOpen={isSplash}>
      <div className="flex items-center justify-center w-full min-h-full">
        {isLoading && !error && !isSuccess && <Loader size={50} />}
        {!!error && (
          <div className="p-4 text-center text-[#e00]">
            Error: {error.message}
          </div>
        )}
        {!!isSuccess && (
          <div className="w-[200px] h-[200px] p-4 text-center text-button text-[24px] font-medium">
            <Lottie animationData={lottieSuccess} loop={true} />
          </div>
        )}
      </div>
    </Overlay>
  )
}

export default SplashScreen
