import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import Divider from '../kit/Divider'
import RadioButton from '../kit/RadioButton'

import { TCurrency, TCurrencyId, TLanguageCode } from '../types'
import { useStore } from '../hooks'

const CurrenciesGroup = ({ className, title, currencies, value, onChange }: {
  className?: string
  title?: string
  currencies: TCurrency[]
  value?: TCurrencyId | null
  onChange: (currencyId: TCurrencyId) => void
}) => {
  const { i18n } = useTranslation()
  return (
    <div className={cx('CurrenciesGroup overflow-y-auto', className)}>
      {title &&
        <div className="mx-4 mb-2 text-[12px] leading-[16px] text-[#5B6871] font-semibold">{title}</div>
      }
      {currencies.map((currency, i) => (
        <div key={`currencies-${currency._id}`}>
          <RadioButton
            key={`currencies-${currency._id}`}
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
            value={currency._id}
            checked={value === currency._id}
            onChange={onChange}
          />
          {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
        </div>
      ))}
    </div>
  )
}

function Currencies({ className, value, onChange }: {
  className?: string
  value?: TCurrencyId | null
  onChange: (currencyId: TCurrencyId) => void
}) {
  const { t } = useTranslation()
  const { currencies } = useStore()

  const recentCurrencies = currencies.filter(currency => currency.is_used_in_chat)

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
      <CurrenciesGroup
        title={t('allCurrencies')}
        currencies={currencies}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default Currencies