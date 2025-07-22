import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'

import { useFeedback, TEvent, useInit, useStore } from '../hooks'
import { Button, Header, Page } from '../kit'

import onboarding1 from '../assets/onboarding-1.jpg'
import onboarding2 from '../assets/onboarding-2.jpg'
import onboarding3 from '../assets/onboarding-3.jpg'

const SLIDES_NUM = 3

const Pager = ({ page }: {
  page: number
}) => (
  <div className="absolute right-2 top-2 --bottom-[14px] --left-[50%] --translate-x-[50%] rounded-full px-2 py-[2px] bg-white font-bold shadow-md border border-[#eee] text-[#aaa]">{page}/{SLIDES_NUM}</div>
)

export const Onboarding = ({ isEnd }: {
  isEnd?: boolean
}) => {
  useInit()

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { feedback } = useFeedback()

  const { setPaywallSource, setPaywallFrom } = useStore()

  const [step, setStep] = useState(isEnd ? SLIDES_NUM : 1)
  const [isButtonBusy, setIsButtonBusy] = useState(false)

  const swipes = useSwipeable({
    onSwipedLeft: () => {
      setStep(Math.min(SLIDES_NUM, step + 1))
    },
    onSwipedRight: () => {
      setStep(Math.max(1, step - 1))
    }
  })

  return (
    <Page className="">
      <Header onBack={
        isEnd ? undefined :
        step === 1 ? undefined :
        () => { setStep(step - 1) }
      } />

      <div className="Swipes" {...swipes}>
        {step === 1 && (
          <>
            <div
              className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${onboarding1})` }}
            >
              {!isEnd &&
                <Pager page={1} />
              }
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
              {!isEnd &&
                <Pager page={2} />
              }
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
              {!isEnd &&
                <Pager page={3} />
              }
            </div>
            <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
              <h2 className="text-[24px]">{t('slide3_title')}</h2>
              <p>{t('slide3_text')}</p>
            </div>
          </>
        )}

      </div>

      <Button
        theme="bottom"
        isBusy={isButtonBusy}
        onClick={async () => {
          if (step <= SLIDES_NUM) {
            const eventOfStep: TEvent[] = [
              'onb_tool_slide_1_next',
              'onb_tool_slide_2_next',
              'onb_tool_slide_3_next',
            ]
            const eventIndex = step - 1
            feedback(eventOfStep[eventIndex])
          }
          if (step < SLIDES_NUM) {
            setStep(step + 1)
          }
          if (step === SLIDES_NUM) {
            setIsButtonBusy(true)
            await feedback('onb_tool_finished')
            try {
              // @ts-expect-error ...
              window.Telegram?.WebApp?.send('finish')
            } catch (e) {
              console.error(e)
            }

            setPaywallSource('onboarding')
            setPaywallFrom('onboarding')
            navigate('/paywall')
          }
        }}
      >
        {
          step === 1 ? t('slide1_button') :
          step === 2 ? t('slide2_button') :
          step === 3 ? t('slide3_button') :
          ''
        }
      </Button>
    </Page>
  )
}
