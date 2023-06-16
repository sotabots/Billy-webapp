import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import Check from './Check'
import SelectUser from './SelectUser'
import SelectCurrency from './SelectCurrency'
import Start from './Start'

import { currencies } from './data'

function App() {
  const [isSelectUserOpen, setSelectUserOpen] = useState(false)
  const [isCheckOpen, setCheckOpen] = useState(false)

  const [currency, setCurrency] = useState(currencies[0].value)
  const [isSelectCurrencyOpen, setSelectCurrencyOpen] = useState(false)

  const onSelectCurrency = (value: string) => {
    setCurrency(value)
    setSelectCurrencyOpen(false)
  }

  return (
    <>
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
    </>
  )
}

export default App
