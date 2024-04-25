import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useEffect } from 'react'

import { useSplash } from '../hooks'

import Debug from '../kit/Debug'
import Overlay from '../kit/Overlay'

import lottieKoalaForbidden from '../assets/animation-koala-forbidden.json'

function OverlayError() {
  const { error } = useSplash()

  const [, notificationOccurred] = useHapticFeedback()

  useEffect(() => {
    if (error) {
      console.log('error vibro')
      notificationOccurred('error')
    }
  }, [error, notificationOccurred])

  return (
    <Overlay isOpen={!!error} isCenter>
      <div className="flex flex-col gap-4">
        <div
          className="mx-auto w-[123px] h-[114px]"
          style={{ display: (String(error?.message).includes('[401]') || String(error?.message).includes('[403]')) ? 'block' : 'none' }}
        >
          <Lottie
            style={{ width: 123, height: 114 }}
            animationData={lottieKoalaForbidden}
            loop={true}
          />
        </div>
        <div className="p-4 text-[#e00]">
          Backend error: {error?.message}
        </div>
        <Debug />
      </div>
    </Overlay>
  )
}

export default OverlayError
