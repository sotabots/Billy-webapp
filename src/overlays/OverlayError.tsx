import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useSplash, useFeedback } from '../hooks'

import { Debug, Overlay } from '../kit'

import lottieKoalaForbidden from '../assets/animation-koala-forbidden.json'
import lottieKoalaError from '../assets/animation-koala-error.json'

export const OverlayError = () => {
  const { error } = useSplash()
  const { t } = useTranslation()
  const { feedback } = useFeedback()

  const [, notificationOccurred] = useHapticFeedback()

  useEffect(() => {
    if (error) {
      console.error(error)
      notificationOccurred('error')
      feedback('error_web', {
        message: error.message || null,
      })
    }
  }, [error, notificationOccurred])

  const isForbiddenError = String(error?.message).includes('[401]') || String(error?.message).includes('[403]')

  return (
    <Overlay isOpen={!!error} isCenter>
      <div className="flex flex-col gap-4">
        <div className="mx-auto w-[123px] h-[114px]">
          {isForbiddenError ? (
            <Lottie
              style={{ width: 123, height: 114 }}
              animationData={lottieKoalaForbidden}
              loop={true}
            />
          ) : (
            <Lottie
              style={{ width: 123, height: 114 }}
              animationData={lottieKoalaError}
              loop={true}
            />
          )}
        </div>
        <div className="p-4">
          {isForbiddenError ? t('errorForbidden') : t('errorOther')}
        </div>
        <Debug />
      </div>
    </Overlay>
  )
}
