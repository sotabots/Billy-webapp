import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Divider from '../kit/Divider'
import Header from '../kit/Header'
import RadioButton from '../kit/RadioButton'
import Screen from '../kit/Screen'

import { useInit } from '../hooks'
import { TCurrencyId, TLanguageCode } from '../types'
import { useStore } from '../store'

function SelectCurrency() {
  useInit()

  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { currencies, transaction, setCurrency } = useStore()
  const [impactOccurred, , selectionChanged] = useHapticFeedback()

  const onChange = useCallback((currencyId: TCurrencyId) => {
    setCurrency(currencyId)
    console.log('SelectCurrency change vibro')
    selectionChanged()
    impactOccurred('medium')
    navigate('/check')
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
              group="currencies"
              label={(
                <>
                  <span className="font-semibold">{currency.symbol}</span>
                  {' '}
                  <span>{currency.flag}</span>
                  {' '}
                  <span>{currency.title[i18n.language as TLanguageCode]}</span>
                </>
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
