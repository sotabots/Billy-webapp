import cx from 'classnames'
import { useTranslation } from 'react-i18next'

import Divider from '../kit/Divider'
import RadioButton from '../kit/RadioButton'

import { TCurrencyId, TLanguageCode } from '../types'
import { useStore } from '../store'

function Currencies({ className, value, onChange }: {
  className?: string
  value?: TCurrencyId | null
  onChange: (currencyId: TCurrencyId) => void
}) {
  const { i18n } = useTranslation()
  const { currencies } = useStore()
  return (
    <div className={cx('Currencies overflow-y-auto', className)}>
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
            checked={value === currency._id}
            onChange={onChange}
          />
          {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
        </div>
      ))}
    </div>
  )
}

export default Currencies
