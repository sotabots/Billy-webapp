import Lottie from 'lottie-react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Overlay from '../kit/Overlay'
import Screen from '../kit/Screen'

import { closeApp } from '../utils'

import { useInit } from '../hooks'
// import { feedback, EVENT } from '../feedback'

import lottieKoalaSuccess from '../assets/animation-koala-success.json'

function Paywall() {
  useInit()

  const { t } = useTranslation()

  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <Button
        isBottom
        text={t('close')}
        onClick={closeApp}
      />

      <Overlay isOpen={true}>
        <div className="w-[280px] mx-auto flex flex-col gap-4 pt-[112px] text-center">
          <div className="mx-auto w-[123px] h-[114px]">
            <Lottie
              style={{ width: 123, height: 114 }}
              animationData={lottieKoalaSuccess}
              loop={true}
            />
          </div>
          <div className="text-[24px] leading-[32px] font-semibold">
            {t('featureSoon')}
          </div>
        </div>
      </Overlay>
    </Screen>
  )
}

export default Paywall
