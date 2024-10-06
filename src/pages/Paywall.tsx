import Lottie from 'lottie-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Header, Page, Panel, Divider, Plan } from '../kit'

import { useInit, useStore } from '../hooks'
import { usePostPayment } from '../api'
import { TPlan } from '../types'

import lottieKoalaStars from '../assets/animation-koala-stars.json'
import { ReactComponent as CheckColored } from '../assets/check-colored.svg'
import star from '../assets/star.png'

export const Paywall = () => {
  useInit()

  const { isDebug } = useStore()
  const { t } = useTranslation()

  const textGradient = {
    background: 'linear-gradient(85.8deg, #1C6ED8 3.42%, rgba(12, 215, 228, 0.99) 96.58%)',
    'WebkitBackgroundClip': 'text',
    'backgroundClip': 'text',
    'WebkitTextFillColor': 'transparent',
  }

  const [isBusy, setIsBusy] = useState(false)

  const [plan, setPlan] = useState<TPlan>({
    amount: 15,
    productKey: '3_days_subscription',
  })

  const postPayment = usePostPayment()

  const goPay = async () => {
    setIsBusy(true)
    try {
      const invoice = await postPayment(plan)
      if (invoice?.url) {
        window.Telegram?.WebApp.openInvoice?.(invoice.url, (status) => {
          console.log('invoice status', status)
          if (status === true) {
            window.Telegram?.WebApp.close()
          }
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Page>
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
            {[
              'featureExpenses',
              'featureCategories',
              'featureCashback',
            ].map(_ => (
              <div
                key={`CheckColored-${_}`}
                className="flex gap-1 items-center text-[14px] leading-[24px] font-semibold"
              >
                <CheckColored />
                {t(_)}
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="p-4 pb-6">
        {isDebug &&
          <>
            <Plan
              label={'Test (Debug)'}
              title={`0 ${t('days')}`}
              stars={1}
              fiat={'0 ₽'}
              isActive={plan.amount === 1}
              onClick={() => {
                setPlan({
                  amount: 1,
                  productKey: 'debug_subscription',
                })
              }}
            />
            <Divider className="my-3 mx-0" />
          </>
        }

        <div className="flex flex-col gap-2">
          <Plan
            label={t('forWeekend')}
            title={`3 ${t('days_')}`}
            stars={15}
            fiat={'29₽'}
            isActive={plan.amount === 15}
            onClick={() => {
              setPlan({
                amount: 15,
                productKey: '3_days_subscription',
              })
            }}
          />

          {/* <Divider className="my-3 mx-0" /> */}
          <Plan
            title={`7 ${t('days')}`}
            stars={50}
            fiat={'99₽'}
            isActive={plan.amount === 50}
            onClick={() => {
              setPlan({
                amount: 50,
                productKey: '1_week_subscription',
              })
            }}
          />
          <Plan
            title={`1 ${t('month_')}`}
            stars={125}
            fiat={'249₽'}
            discount={'40%'}
            isActive={plan.amount === 125}
            onClick={() => {
              setPlan({
                amount: 125,
                productKey: '1_month_subscription',
              })
            }}
          />
          <Plan
            /* label={t('profitable')} */
            labelColor={'#4094F7'}
            title={`12 ${t('months')}`}
            stars={1250}
            fiat={'2490₽'}
            discount={'50%'}
            isActive={plan.amount === 1250}
            onClick={() => {
              setPlan({
                amount: 1250,
                productKey: '1_year_subscription',
              })
            }}
          />
        </div>
      </div>
      <div className="sticky px-4 bottom-0 bg-bg2" style={{
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div className="absolute bottom-full left-0 w-full h-2 bg-gradient-to-t from-bg2" />
        <Button
          theme="clear"
          wrapperClassName="pb-4 pt-1"
          className="flex items-center justify-center gap-2 w-full h-[50px] rounded-[6px] bg-gradient-to-r from-[#1C6ED8] to-[#0CD7E4] text-[#F6F8F9] text-[14px] font-semibold"
          text={
            <>
              <span>{t('buyFor')} {plan.amount}</span>
              <img src={star} className="w-6 h-6" />
            </>
          }
          onClick={goPay}
          isBusy={isBusy}
        />
      </div>
    </Page>
  )
}
