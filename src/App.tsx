import cx from 'classnames'
import { useState } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { useTheme } from './hooks/useTheme'

import Check from './Check'
import SelectUser from './SelectUser'
import SelectCurrency from './SelectCurrency'
import Start from './Start'

import { currencies } from './data'
import { TCurrency, TData } from './types'

import { generateUserAmount } from './data'

function App() {
  const [currency, setCurrency] = useState<TCurrency>(currencies[0])

  const { isDarkTheme } = useTheme()

  const [data, setData] = useState<TData>([
    generateUserAmount({ isPayed: true }),
    generateUserAmount({ isPayed: true }),
    generateUserAmount({ isPayed: false }),
    generateUserAmount({ isPayed: false }),
  ])

  const router = createHashRouter([
    {
      path: "/",
      element: (
        <Start />
      ),
    },
    {
      path: "/select-user",
      element: (
        <SelectUser />
      ),
    },
    {
      path: "/check",
      element: (
        <Check
          currency={currency}
          data={data}
          setData={setData}
        />
      ),
    },
    {
      path: "/select-currency",
      element: (
        <SelectCurrency
          currency={currency}
          setCurrency={setCurrency}
        />
      ),
    },
  ])

  return (
    <div className={cx(isDarkTheme ? 'theme-dark' : 'theme-light')}>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
