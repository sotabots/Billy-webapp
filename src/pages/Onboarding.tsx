import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button, Header, Page } from '../kit'

import { useFeedback, TEvent, useInit, useStore } from '../hooks'
import { closeApp } from '../utils'

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg'
import onboarding1 from '../assets/onboarding-1.jpg'
import onboarding2 from '../assets/onboarding-2.jpg'
import onboarding3 from '../assets/onboarding-3.jpg'
import onboarding4 from '../assets/onboarding-4.jpg'
import onboarding5 from '../assets/onboarding-5.jpg'
import onboarding6 from '../assets/onboarding-6.jpg'

import { useSwipeable } from 'react-swipeable'

const Pager = ({ page }: {
  page: number
}) => (
  <div className="absolute right-2 top-2 --bottom-[14px] --left-[50%] --translate-x-[50%] rounded-full px-2 py-[2px] bg-white font-bold shadow-md border border-[#eee] text-[#aaa]">{page}/6</div>
)

export const Onboarding = ({ isEnd }: {
  isEnd?: boolean
}) => {
  useInit()

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { feedback } = useFeedback()

  const { setPaywallSource } = useStore()

  const [step, setStep] = useState(isEnd ? 6 : 1)
  const [isButtonBusy, setIsButtonBusy] = useState(false)

  const swipes = useSwipeable({
    onSwipedLeft: () => {
      setStep(Math.min(6, step + 1))
    },
    onSwipedRight: () => {
      setStep(Math.max(1, step - 1))
    }
  })

  return (
    <Page className="">
      <Header onBack={() => {
        if (step === 1) {
          closeApp()
        } else {
          setStep(step - 1)
        }
      }} />

      <div className="Swipes" {...swipes}>
        {step === 1 && (
          <>
            <div
              className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${onboarding1})` }}
            >
              <Pager page={1} />
            </div>
            <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
              <h2 className="text-[24px]">{t('slide1_title')}</h2>
              <p>{t('slide1_text')}</p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div
              className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${onboarding2})` }}
            >
              <Pager page={2} />
            </div>
            <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
              <h2 className="text-[24px]">{t('slide2_title')}</h2>
              <p>{t('slide2_text')}</p>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div
              className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${onboarding3})` }}
            >
              <Pager page={3} />
            </div>
            <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
              <h2 className="text-[24px]">{t('slide3_title')}</h2>
              <p>{t('slide3_text')}</p>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div
              className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${onboarding4})` }}
            >
              <Pager page={4} />
            </div>
            <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
              <h2 className="text-[24px]">{t('slide4_title')}</h2>
              <p>{t('slide4_text')}</p>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div
              className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${onboarding5})` }}
            >
              <Pager page={5} />
            </div>
            <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
              <h2 className="text-[24px]">{t('slide5_title')}</h2>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                  <div className="">
                    <h3>{t('slide5_subtitle1')}</h3>
                    <p className="text-[14px]">{t('slide5_text1')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                  <div className="">
                    <h3>{t('slide5_subtitle2')}</h3>
                    <p className="text-[14px]">{t('slide5_text2')}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <div
              className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${onboarding6})` }}
            >
              <Pager page={6} />
            </div>
            <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
              <h2 className="text-[24px]">{t('slide6_title')}</h2>

              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                  <div className="">
                    <h3>{t('slide6_subtitle1')}</h3>
                    <p className="text-[14px]">{t('slide6_text1')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                  <div className="">
                    <h3>{t('slide6_subtitle2')}</h3>
                    <p className="text-[14px]">{t('slide6_text2')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                  <div className="">
                    <h3>{t('slide6_subtitle3')}</h3>
                    <p className="text-[14px]">{t('slide6_text3')}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Button
        isBottom
        isBusy={isButtonBusy}
        text={
          step === 1 ? t('slide1_button') :
          step === 2 ? t('slide2_button') :
          step === 3 ? t('slide3_button') :
          step === 4 ? t('slide4_button') :
          step === 5 ? t('slide5_button') :
          step === 6 ? t('slide6_button') : ''
        }
        onClick={async () => {
          if (step <= 6) {
            const eventOfStep: TEvent[] = [
              'onb_tool_revolution_adding_next',
              'onb_tool_balance_next',
              'onb_tool_cashback_next',
              'onb_tool_edit_later_next',
              'onb_tool_features_next',
              'onb_tool_pro_next',
            ]
            const eventIndex = step - 1
            feedback(eventOfStep[eventIndex])
          }
          if (step < 6) {
            setStep(step + 1)
          }
          if (step === 6) {
            setIsButtonBusy(true)
            await feedback('onb_tool_finished')
            try {
              // @ts-expect-error ...
              window.Telegram?.WebApp?.send('finish')
            } catch (e) {
              console.error(e)
            }

            setPaywallSource('onboarding')
            navigate('/paywall')
          }
        }}
      />
    </Page>
  )
}
