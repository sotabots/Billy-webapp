import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useInit, useFeedback } from '../hooks'
import { Button, Header, Page } from '../kit'

import lottieKoalaSoon from '../assets/animation-koala-soon.json'

export const Soon = () => {
  useInit()

  const { t } = useTranslation()
  const { feedback } = useFeedback()

  const [isEvent, setIsEvent] = useState(false)

  useEffect(() => {
    if (!isEvent) {
      setIsEvent(true)
      feedback('open_soon_web')
    }
  }, [isEvent, setIsEvent])

  return (
    <Page>
      <Header onBack={() => { history.back() }} />

      <div className="w-[280px] mx-auto flex flex-col gap-4 pt-[112px] text-center">
        <div className="mx-auto w-[123px] h-[114px]">
          <Lottie
            style={{ width: 123, height: 114 }}
            animationData={lottieKoalaSoon}
            loop={true}
          />
        </div>
        <div className="text-[24px] leading-[32px] font-semibold">
          {t('featureSoon')}
        </div>
      </div>

      <Button
        isBottom
        text={t('okay')}
        onClick={() => { history.back() }}
      />
    </Page>
  )
}

export default Soon
