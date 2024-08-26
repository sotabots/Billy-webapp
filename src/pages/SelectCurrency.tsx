import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Divider from '../kit/Divider'
import Header from '../kit/Header'
import RadioButton from '../kit/RadioButton'
import Screen from '../kit/Screen'

import { useStore, useFeedback, useInit } from '../hooks'
import { TCurrencyId, TLanguageCode } from '../types'

function SelectCurrency() {
  useInit()

  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { currencies, transaction, setCurrency } = useStore()
  const [impactOccurred, , selectionChanged] = useHapticFeedback()
  const { feedback } = useFeedback()

  const onChange = useCallback((currencyId: TCurrencyId) => {
    feedback('set_currency_expshares_web', {
      currency_prev: transaction?.currency_id || null,
      currency_set: currencyId
    })
    setCurrency(currencyId)
    console.log('SelectCurrency change vibro')
    selectionChanged()
    impactOccurred('medium')
    navigate('/')
    // history.back()
  }, [impactOccurred, selectionChanged, navigate, setCurrency])

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="px-4">
        <h2>{t('selectCurrency')}</h2>
      </div>
      <div className="mt-4 overflow-y-auto">
        {currencies.map((currency, i) => (
          <div key={`currencies-${currency._id}`}>
            <RadioButton
              reverse
              group="currencies"
              label={(
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-text/5 rounded-full overflow-hidden">
                    <span className="text-8 leading-8">{currency.flag}</span>
                  </div>
                  <div className="flex flex-col -gap-[2px]">
                    {/* <span className="font-semibold">{currency.symbol}</span> */}
                    <div className="text-[14px] leading-[20px]">{currency.title[i18n.language as TLanguageCode]}</div>
                    <div className="text-[12px] leading-[16px] uppercase text-hint">{currency._id}</div>
                  </div>
                </div>
              )}
              key={`currencies-${currency._id}`}
              value={currency._id}
              checked={transaction?.currency_id === currency._id}
              onChange={onChange}
            />
            {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
          </div>
        ))}
      </div>
    </Screen>
  )
}

export default SelectCurrency
