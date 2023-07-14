import { useNavigate } from 'react-router-dom'

import Divider from './kit/Divider'
import Header from './kit/Header'
import RadioButton from './kit/RadioButton'
import Screen from './kit/Screen'

import { currencies } from './data'
import { TCurrency } from './types'

type TSelectCurrency = {
  currency: TCurrency
  setCurrency: (value: TCurrency) => void
}

function SelectCurrency({ currency, setCurrency }: TSelectCurrency) {
  const navigate = useNavigate()

  const onChange = (value: TCurrency) => {
    setCurrency(value)
    navigate('/check')
    // history.back()
  }

  return (
    <Screen className="!bg-bg">
      <div className="limiter">
        <Header onBack={() => { history.back() }} />
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
                onChange={onChange}
              />
              {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
            </>
          ))}
        </div>
      </div>
    </Screen>
  )
}

export default SelectCurrency
