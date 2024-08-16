import Lottie from 'lottie-react'
import { /* useEffect, useState */ } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import Panel from '../kit/Panel'

import { useInit /*, useFeedback */ } from '../hooks'

import lottieKoalaStars from '../assets/animation-koala-stars.json'
import { ReactComponent as CheckColored } from '../assets/check-colored.svg'
import star from '../assets/star.png'

function Paywall() {
  useInit()

  const { t } = useTranslation()
  // const { feedback } = useFeedback()

  // const [isEvent, setIsEvent] = useState(false)

  /*
  useEffect(() => {
    if (!isEvent) {
      setIsEvent(true)
      feedback('open_soon_web')
    }
  }, [isEvent, setIsEvent])
  */

  const textGradient = {
    background: 'linear-gradient(85.8deg, #1C6ED8 3.42%, rgba(12, 215, 228, 0.99) 96.58%)',
    '-webkit-background-clip': 'text',
    'background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  }

  const link = 'https://t.me/$57jAnvUn6ElOIwMAscGfUwoljzY'

  return (
    <Screen>
      <Header onBack={() => { history.back() }} />

      <Panel>
        <div className="flex flex-col gap-2">
          <div className="flex items-center">
            <div className="w-full text-[24px] leading-[32px] font-semibold">
              {t('manageExpensesWith')} Billy <span style={{ ...textGradient }}>Pro</span>
            </div>
            <div className="w-[108px] h-[70px]">
              <Lottie
                style={{ width: 108, height: 70 }}
                animationData={lottieKoalaStars}
                loop={false}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {['featureExpenses', 'featureCategories', 'featureCashback'].map(_ => (
              <div className="flex gap-1 items-center text-[14px] leading-[24px] font-semibold">
                <CheckColored />
                {t(_)}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <Button
        theme="clear"
        wrapperClassName="mt-10"
        className="flex items-center justify-center gap-2 w-full h-[50px] rounded-[6px] bg-gradient-to-r from-[#1C6ED8] to-[#0CD7E4] text-[#F6F8F9] text-[14px] font-semibold"
        text={
          <>
            <span>{t('buyFor')} 80</span>
            <img src={star} className="w-6 h-6" />
          </>
        }
        onClick={() => { location.replace(link) }}
      />
    </Screen>
  )
}

export default Paywall
