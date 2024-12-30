import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useSplash, useFeedback, useLink } from '../hooks'

import { Button, Debug, Overlay } from '../kit'

import lottieKoalaForbidden from '../assets/animation-koala-forbidden.json'
import lottieKoalaError from '../assets/animation-koala-error.json'

export const OverlayError = () => {
  const { error: _error } = useSplash()
  const error = Math.random() > 0 // debug
    ? { message: 'test error' } as Error
    : _error

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

  const { openLink, SUPPORT_LINK } = useLink()

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
        <div className="flex flex-col gap-4 p-4">
          <div className="">
            {isForbiddenError ? t('error.forbidden') : t('error.other')}
          </div>
          <Button
            className="text-blue"
            onClick={() => { openLink(SUPPORT_LINK) }}
          >
            {t('error.contactSupport')}
          </Button>
        </div>
        <Debug />
      </div>
    </Overlay>
  )
}
