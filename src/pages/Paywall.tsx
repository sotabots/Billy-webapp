import { useShowPopup } from '@vkruglikov/react-telegram-web-app'
import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'


import { useInit, useStore, useFeedback, useUser, usePostPayment } from '../hooks'
import { Button, Header, Page, Panel, Divider, Plan, Limiter } from '../kit'
import { TPlan } from '../types'

import lottieKoalaStars from '../assets/animation-koala-stars.json'
import { ReactComponent as CheckColored } from '../assets/check-colored.svg'
import star from '../assets/star.png'

export const Paywall = () => {
  useInit()

  const { isDebug, paywallSource, paywallFrom } = useStore()
  const { t } = useTranslation()
  const { feedback } = useFeedback()
  const { refetchUser } = useUser()

  const [isOpened, setIsOpened] = useState(false)
  useEffect(() => {
    if (!isOpened) {
      setIsOpened(true)
      feedback('paywall_open')
    }
  }, [])

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

  const planData = {
    1: {
      plan: '0_days_1_star',
      time: '0 days',
      stars: 1,
      currency: 'XTR',
    },
    15: {
      plan: '3_days_15_stars',
      time: '3 days',
      stars: 15,
      currency: 'XTR',
    },
    50: {
      plan: '1_week_50_stars',
      time: '1 week',
      stars: 50,
      currency: 'XTR',
    },
    125: {
      plan: '1_month_125_stars',
      time: '1 month',
      stars: 125,
      currency: 'XTR',
    },
    1250: {
      plan: '12_months_1250_stars',
      time: '12 months',
      stars: 1250,
      currency: 'XTR',
    }
  }

  const postPayment = usePostPayment()

  const goPay = async () => {
    setIsBusy(true)
    try {
      await feedback('paywall_pay', planData[plan.amount])
      const invoice = await postPayment(plan)
      if (invoice?.url) {
        window.Telegram?.WebApp.openInvoice?.(invoice.url, async (status) => {
          await feedback('paywall_pay_finish', {
            ...planData[plan.amount],
            payment_status: status
          })
          if (status === 'paid') {
            if (paywallFrom) {
              await refetchUser()
              history.back()
            } else {
              window.Telegram?.WebApp.close()
            }
          }
        })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsBusy(false)
    }
  }

  const showPopup = useShowPopup()
  const [isClosedPopup, setIsClosedPopup] = useState(false)

  useEffect(() => {
    (async () => {
      if (paywallSource === 'voice_limit' && !isClosedPopup) {
        await showPopup({
          title: t('voiceLimitTitle'),
          message: t('voiceLimitMessage'),
          buttons: [
            {
              id: 'ok',
              text: t('ok'),
              type: 'default',
            },
          ],
        })
        setIsClosedPopup(true)
      }
    })()
  }, [paywallSource, isClosedPopup, showPopup, t])

  return (
    <Page>
      <Header />

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
                feedback('paywall_select_plan', planData[1])
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
              feedback('paywall_select_plan', planData[15])
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
              feedback('paywall_select_plan', planData[50])
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
              feedback('paywall_select_plan', planData[125])
            }}
          />
          <Plan
            /* label={t('profitable')} */
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
              feedback('paywall_select_plan', planData[1250])
            }}
          />
        </div>
      </div>
      <div
        className="Spacer h-[70px]"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)'
        }}
      />
      <div className="fixed w-full px-4 bottom-0 left-0 bg-bg2" style={{
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <div className="absolute bottom-full left-0 w-full h-2 bg-gradient-to-t from-bg2" />
        <Limiter>
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
        </Limiter>
      </div>
    </Page>
  )
}
