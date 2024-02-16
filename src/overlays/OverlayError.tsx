import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useEffect } from 'react'

import { useSplash } from '../hooks'

import Overlay from '../kit/Overlay'

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
      <div className="p-4 text-[#e00]">
        Backend error: {error?.message}
      </div>
    </Overlay>
  )
}

export default OverlayError
