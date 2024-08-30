import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import { CurrenciesGroup } from '../kit'

import { TCurrencyId } from '../types'
import { useStore } from '../hooks'

function Currencies({ className, value, onChange }: {
  className?: string
  value?: TCurrencyId | null
  onChange: (currencyId: TCurrencyId) => void
}) {
  const { t } = useTranslation()
  const { currencies } = useStore()

  const recentCurrencies = currencies.filter(currency => currency.is_used_in_chat)
  const restCurrencies = currencies.filter(currency => !currency.is_used_in_chat)

  return (
    <div className={cx('Currencies overflow-y-auto', className)}>
      {recentCurrencies.length > 0 &&
        <CurrenciesGroup
          className="mb-4"
          title={t('recentCurrencies')}
          currencies={recentCurrencies}
          value={value}
          onChange={onChange}
        />
      }
      {restCurrencies.length > 0 &&
        <CurrenciesGroup
          title={t('allCurrencies')}
          currencies={restCurrencies}
          value={value}
          onChange={onChange}
        />
      }
    </div>
  )
}

export default Currencies
