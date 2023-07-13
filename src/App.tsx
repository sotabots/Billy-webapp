import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import Check from './Check'
import SelectUser from './SelectUser'
import SelectCurrency from './SelectCurrency'
import Start from './Start'

import { currencies } from './data'
import { TCurrency } from './types'

function App() {
  const [isSelectUserOpen, setSelectUserOpen] = useState(false)
  const [isCheckOpen, setCheckOpen] = useState(false)

  const [currency, setCurrency] = useState<TCurrency>(currencies[0])
  const [isSelectCurrencyOpen, setSelectCurrencyOpen] = useState(false)

  const onSelectCurrency = (value: TCurrency) => {
    setCurrency(value)
    setSelectCurrencyOpen(false)
  }

  return (
    <div className="theme-dark">
      <Start
        onAdd={() => { setSelectUserOpen(true) }}
        onNext={() => { setCheckOpen(true) }}
      />

      {isSelectUserOpen && (
        <SelectUser onBack={() => { setSelectUserOpen(false) }} />
      )}

      {isCheckOpen && (
        <Check
          currency={currency}
          onBack={() => { setCheckOpen(false) }}
          onSelectCurrency={() => { setSelectCurrencyOpen(true) }}
        />
      )}

      {isSelectCurrencyOpen && (
        <SelectCurrency
          currency={currency}
          onSelectCurrency={onSelectCurrency}
          onBack={() => { setSelectCurrencyOpen(false) }}
        />
      )}
    </div>
  )
}

export default App
