import { useHapticFeedback } from '@vkruglikov/react-telegram-web-app'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { useStore, useFeedback, useInit } from '../hooks'
import { Header, Page, Currencies } from '../kit'
import { TCurrencyId } from '../types'

export const SelectCurrency = () => {
  useInit()

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { transaction, setCurrency } = useStore()
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
    <Page className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="px-4">
        <h2>{t('selectCurrency')}</h2>
      </div>
      <Currencies
        className="mt-4"
        value={transaction?.currency_id}
        onChange={onChange}
      />
    </Page>
  )
}
