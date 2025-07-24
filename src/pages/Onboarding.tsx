import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSwipeable } from 'react-swipeable'

import { useFeedback, TEvent, useInit, useLink } from '../hooks'
import { Bottom, Button, Header, Page } from '../kit'

import onboarding1 from '../assets/onboarding-1.jpg'
import onboarding2 from '../assets/onboarding-2.jpg'
import onboarding3 from '../assets/onboarding-3.jpg'

const SLIDES_NUM = 3

const Pager = ({ page }: {
  page: number
}) => (
  <div className="absolute right-2 top-2 --bottom-[14px] --left-[50%] --translate-x-[50%] rounded-full px-2 py-[2px] bg-white/60 font-bold shadow-md border border-white/80 text-black/50">{page}/{SLIDES_NUM}</div>
)

export const Onboarding = ({ isEnd }: {
  isEnd?: boolean
}) => {
  useInit()

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { feedback } = useFeedback()
  const { openLink, ADD_TO_CHAT_LINK } = useLink()

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
              className="relative h-[37vh] max-w-[500px] mx-auto bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
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
              className="relative h-[37vh] max-w-[500px] mx-auto bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
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
              className="relative h-[37vh] max-w-[500px] mx-auto bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
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

      {step < SLIDES_NUM &&
        <Button
          theme="bottom"
          isBusy={isButtonBusy}
          onClick={async () => {
            const eventOfStep: TEvent[] = [
              'onb_tool_slide_1_next',
              'onb_tool_slide_2_next',
            ]
            feedback(eventOfStep[step - 1])
            setStep(step + 1)
          }}
        >
          {t(`slide${step}_button`)}
        </Button>
      }
      {step === SLIDES_NUM &&
        <Bottom h={40}>
          <div className="flex items-center justify-center gap-[10px]">
            <Button
              wrapperClassName="w-full"
              className="w-full h-[40px] rounded-[6px] bg-blue text-textButton text-[14px] font-semibold leading-[1em]"
              onClick={() => {
                openLink(ADD_TO_CHAT_LINK)
                feedback('onb_tool_slide_3_add_chat')
              }}
            >
              ➕ {t('slide3_button_add_chat')}
            </Button>
            <Button
              wrapperClassName="w-full w-full"
              className="w-full h-[40px] rounded-[6px] bg-separator text-blue text-[14px] font-semibold leading-[1em]"
              onClick={async () => {
                setIsButtonBusy(true)
                await feedback('onb_tool_slide_3_open_app')
                await feedback('onb_tool_finished')
                try {
                  // @ts-expect-error ...
                  window.Telegram?.WebApp?.send('finish')
                } catch (e) {
                  console.error(e)
                }
                navigate('/profile')
              }}
            >
              📲 {t('slide3_button_open_app')}
            </Button>
          </div>
        </Bottom>
      }
    </Page>
  )
}
