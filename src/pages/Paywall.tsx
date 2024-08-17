import Lottie from 'lottie-react'
import { /* useEffect,*/ useState } from 'react'
import { useTranslation } from 'react-i18next'

import Button from '../kit/Button'
import Header from '../kit/Header'
import Screen from '../kit/Screen'
import Panel from '../kit/Panel'
import Divider from '../kit/Divider'
import Plan from '../kit/Plan'

import { useInit /*, useFeedback */ } from '../hooks'
import { usePostPayment } from '../api'

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


  const [plan, setPlan] = useState(20)

  const postPayment = usePostPayment()

  const goPay = async () => {
    const invoice = await postPayment({ amount: plan })
    console.log(invoice)
    // const link = 'https://t.me/$57jAnvUn6ElOIwMAscGfUwoljzY'
    // location.replace(link)
  }

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

      <div className="p-4 pb-6">
        <Plan
          label={'Test'}
          title={`0 ${t('days')}`}
          stars={1}
          fiat={`0 ₽`}
          isActive={plan === 1}
          onClick={() => { setPlan(1) }}
        />
        <Divider className="my-3 mx-0" />

        <Plan
          label={t('forWeekend')}
          title={`3 ${t('days')}`}
          stars={20}
          fiat={`299₽`}
          isActive={plan === 20}
          onClick={() => { setPlan(20) }}
        />

        <Divider className="my-3 mx-0" />

        <div className="flex flex-col gap-2">
          <Plan
            label={t('profitable')}
            labelColor={'#4094F7'}
            title={`12 ${t('months')}`}
            stars={2500}
            fiat={`4999₽`}
            discount={'50%'}
            isActive={plan === 2500}
            onClick={() => { setPlan(2500) }}
          />
          <Plan
            title={`1 ${t('month')}`}
            stars={250}
            fiat={`1999₽`}
            discount={'30%'}
            isActive={plan === 250}
            onClick={() => { setPlan(250) }}
          />
          <Plan
            title={`7 ${t('days')}`}
            stars={80}
            fiat={`699₽`}
            isActive={plan === 80}
            onClick={() => { setPlan(80) }}
          />
        </div>
      </div>
      <div className="sticky px-4 py-2 bottom-0">
        <Button
          theme="clear"
          wrapperClassName="mt-5"
          className="flex items-center justify-center gap-2 w-full h-[50px] rounded-[6px] bg-gradient-to-r from-[#1C6ED8] to-[#0CD7E4] text-[#F6F8F9] text-[14px] font-semibold"
          text={
            <>
              <span>{t('buyFor')} {plan}</span>
              <img src={star} className="w-6 h-6" />
            </>
          }
          onClick={goPay}
        />
      </div>
    </Screen>
  )
}

export default Paywall
