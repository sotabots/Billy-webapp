import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'

import { useInit } from '../hooks'
import { feedback, EVENT } from '../feedback'

import lottieKoalaSoon from '../assets/animation-koala-soon.json'

function Paywall() {
  useInit()

  const { t } = useTranslation()
  const [isEvent, setIsEvent] = useState(false)

  useEffect(() => {
    if (!isEvent) {
      setIsEvent(true)
      feedback(EVENT.OPEN_PAYWALL)
    }
  }, [isEvent, setIsEvent])

  return (
    <Screen>
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
    </Screen>
  )
}

export default Paywall
