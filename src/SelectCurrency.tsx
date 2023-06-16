import { MouseEventHandler } from 'react'
import Divider from './kit/Divider'
import Header from './kit/Header'
import RadioButton from './kit/RadioButton'

import { currencies } from './data'
import { TCurrency } from './types'

type TSelectCurrency = {
  currency: TCurrency
  onSelectCurrency: (value: TCurrency) => void
  onBack: MouseEventHandler<HTMLButtonElement>
}

function SelectCurrency({ currency, onSelectCurrency, onBack }: TSelectCurrency) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-bg">
      <div className="limiter">
        <Header onBack={onBack} />
        <div className="px-4">
          <h2>Выберите валюту</h2>
        </div>
        <div className="mt-4 overflow-y-auto">
          {currencies.map((currencyItem, i) => (
            <>
              <RadioButton
                group="currencies"
                label={currencyItem.label}
                key={`currencies-${currencyItem.id}`}
                value={currencyItem}
                checked={currency.id === currencyItem.id}
                onChange={onSelectCurrency}
              />
              {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SelectCurrency
