import { useNavigate } from 'react-router-dom'

import Divider from '../kit/Divider'
import Header from '../kit/Header'
import RadioButton from '../kit/RadioButton'
import Screen from '../kit/Screen'

import { TCurrency } from '../types'
import { useStore } from '../store'

function SelectCurrency() {
  const navigate = useNavigate()

  const { currencies, currency, setCurrency } = useStore()

  const onChange = (value: TCurrency) => {
    setCurrency(value)
    navigate('/check')
    // history.back()
  }

  return (
    <Screen className="!bg-bg">
      <Header onBack={() => { history.back() }} />

      <div className="px-4">
        <h2>Выберите валюту</h2>
      </div>
      <div className="mt-4 overflow-y-auto">
        {currencies.map((currencyItem, i) => (
          <>
            <RadioButton
              group="currencies"
              label={`${currencyItem.symbol} ${currencyItem.title}`}
              key={`currencies-${currencyItem.id}`}
              value={currencyItem}
              checked={currency?.id === currencyItem.id}
              onChange={onChange}
            />
            {i < currencies.length - 1 && <Divider key={`Divider-${i}`} />}
          </>
        ))}
      </div>
    </Screen>
  )
}

export default SelectCurrency
