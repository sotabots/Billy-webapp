import { useState } from 'react'
// import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'

import { ReactComponent as CheckmarkIcon } from '../assets/checkmark.svg'
// import { ReactComponent as SettingsLanguageIcon } from '../assets/settings-language.svg'

function Onboarding() {
  // const { t, i18n } = useTranslation()
  // const { feedback } = useFeedback()

  const [step, setStep] = useState(1)

  return (
    <Screen className="px-4">
      <Header /*onBack={ () => { isOpen ? closeInnerPages() : history.back() } } */ />

      {step === 1 && (
        <>
          <div className="h-[]"></div>
          <div className="flex flex-col gap-3 max-w-[500px]">
            <h2 className="text-[24px]">Революционная запись трат</h2>
            <p>Просто добавь меня в ваш чат, чтобы начать пользоваться ботом. Траты можно записывать как текстом, так и голосовыми сообщениями! Я найду эти сообщения в чате и всё учту.</p>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="h-[]"></div>
          <div className="flex flex-col gap-3 max-w-[500px]">
            <h2 className="text-[24px]">Надоело переводить друг другу деньги после каждой общей оплаты?</h2>
            <p>Достаточно, чтобы кто-то один написал о трате в чат – Билли это увидит и запишет в историю. В конце периода он просуммирует все траты и скажет, кто кому сколько должен.</p>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="h-[]"></div>
          <div className="flex flex-col gap-3 max-w-[500px]">
            <h2 className="text-[24px]">Никто не хочет брать ответственность за оплату общих расходов?</h2>
            <p>Плати за друзей - получай кэшбэк в Билли реальными деньгами!</p>
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="h-[]"></div>
          <div className="flex flex-col gap-3 max-w-[500px]">
            <h2 className="text-[24px]">Не встанем из-за стола, пока не посчитаем, кто сколько съел?</h2>
            <p>Запиши трату сейчас, а друзья заполнят свои доли потом.</p>
          </div>
        </>
      )}

      {step === 5 && (
        <>
          <div className="h-[]"></div>
          <div className="flex flex-col gap-4 max-w-[500px]">
            <h2 className="text-[24px]">Самое удобное ведение группового бюджета!</h2>

            <div className="flex items-start gap-3">
              <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
              <div className="">
                <h3>Конвертация валют</h3>
                <p className="text-[14px]">упростит финальные расчёты, пересчитав все траты в выбранную валюту. Особенно актуально в путешествиях!</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
              <div className="">
                <h3>Категории</h3>
                <p className="text-[14px]">Билли автоматически определит и проставит категорию для каждой траты, а в конце предоставит анализ самых больших из них.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckmarkIcon className="flex-shrink-0 w-[22px] h-[22px] text-button" />
              <div className="">
                <h3>Настройки языка и валюты</h3>
                <p className="text-[14px]">Выбери удобный язык и валюту для ведения общих трат.</p>
              </div>
            </div>
          </div>
        </>
      )}

      <Button
        isBottom
        text={
          step === 1 ? '1' :
          step === 2 ? '2' :
          step === 3 ? '3' :
          step === 4 ? '4' :
          step === 5 ? '5' : ''
        }
        onClick={() => {
          if (step === 5) {
            return
          }
          setStep(step + 1)
        }}
      />
    </Screen>
  )
}

export default Onboarding
