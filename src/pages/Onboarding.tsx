import { useEffect, useState } from 'react'
// import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'

import { usePostUserOnboarding } from '../api'
import { useFeedback, TEvent } from '../hooks'
import { closeApp } from '../utils'

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg'
import onboarding1 from '../assets/onboarding-1.jpg'
import onboarding2 from '../assets/onboarding-2.jpg'
import onboarding3 from '../assets/onboarding-3.jpg'
import onboarding4 from '../assets/onboarding-4.jpg'
import onboarding5 from '../assets/onboarding-5.jpg'

const Pager = ({ page }: {
  page: number
}) => (
  <div className="absolute right-2 top-2 --bottom-[14px] --left-[50%] --translate-x-[50%] rounded-full px-2 py-[2px] bg-white font-bold shadow-md border border-[#eee] text-[#aaa]">{page}/5</div>
)

function Onboarding() {
  const postUserOnboarding = usePostUserOnboarding()
  // const { t, i18n } = useTranslation()
  const { feedback } = useFeedback()
  const [step, setStep] = useState(1)
  const [isButtonBusy, setIsButtonBusy] = useState(false)

  const [isInitialFeedback, setIsInitialFeedback] = useState(false)
  useEffect(() => {
    if (!isInitialFeedback) {
      setIsInitialFeedback(true)
      feedback('onb_tool_started')
      postUserOnboarding()
    }
  }, [isInitialFeedback])

  return (
    <Screen className="">
      <Header onBack={() => {
        if (step === 1) {
          closeApp()
        } else {
          setStep(step - 1)
        }
      }} />

      {step === 1 && (
        <>
          <div
            className="relative h-[37vh] bg-[#ffca6a] bg-center bg-cover bg-no-repeat"
            style={{ backgroundImage: `url(${onboarding1})` }}
          >
            <Pager page={1} />
          </div>
          <div className="flex flex-col gap-5 max-w-[500px] mx-auto px-4 py-6">
            <h2 className="text-[24px]">Революционная запись трат</h2>
            <p>Просто добавь меня в ваш чат, чтобы начать пользоваться ботом. Траты можно записывать как текстом, так и голосовыми сообщениями! Я найду эти сообщения в чате и всё учту.</p>
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
            <h2 className="text-[24px]">Надоело переводить друг другу деньги после каждой общей оплаты?</h2>
            <p>Достаточно, чтобы кто-то один написал о трате в чат – Билли это увидит и запишет в историю. В конце периода он просуммирует все траты и скажет, кто кому сколько должен.</p>
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
            <h2 className="text-[24px]">Никто не хочет брать ответственность за оплату общих расходов?</h2>
            <p>Плати за друзей - получай кэшбэк в Билли реальными деньгами!</p>
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
            <h2 className="text-[24px]">Не встанем из-за стола, пока не посчитаем, кто сколько съел?</h2>
            <p>Запиши трату сейчас, а друзья заполнят свои доли потом.</p>
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
            <h2 className="text-[24px]">Самое удобное ведение группового бюджета!</h2>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                <div className="">
                  <h3>Конвертация валют</h3>
                  <p className="text-[14px]">Упростит финальные расчёты, пересчитав все траты в выбранную валюту. Особенно актуально в путешествиях!</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                <div className="">
                  <h3>Категории</h3>
                  <p className="text-[14px]">Билли определит категорию для каждой траты, а в конце покажет анализ самых больших из них</p>
                </div>
              </div>

              {/*
              <div className="flex items-start gap-3">
                <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
                <div className="">
                  <h3>Настройки языка и валюты</h3>
                  <p className="text-[14px]">Выбери удобный язык и валюту для ведения общих трат</p>
                </div>
              </div>
              */}
            </div>
          </div>
        </>
      )}

      <Button
        isBottom
        isBusy={isButtonBusy}
        text={
          step === 1 ? 'ТОП-3 проблемы группового расчёта' :
          step === 2 ? 'Согласны?' :
          step === 3 ? 'Узнали?' :
          step === 4 ? 'Это всё?' :
          step === 5 ? 'Попробовать записать трату' : ''
        }
        onClick={async () => {
          if (step <= 5) {
            const eventOfStep: TEvent[] = [
              'onb_tool_revolution_adding_next',
              'onb_tool_balance_next',
              'onb_tool_cashback_next',
              'onb_tool_edit_later_next',
              'onb_tool_features_next',
            ]
            const eventIndex = step - 1
            feedback(eventOfStep[eventIndex])
          }
          if (step < 5) {
            setStep(step + 1)
          }
          if (step === 5) {
            setIsButtonBusy(true)
            await feedback('onb_tool_finished')
            try {
              // @ts-expect-error ...
              window.Telegram?.WebApp?.send('finish')
            } catch (e) {
              console.error(e)
            }
            closeApp()
          }
        }}
      />
    </Screen>
  )
}

export default Onboarding
