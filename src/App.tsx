import cx from 'classnames'
import { useState } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { useTheme } from './hooks/useTheme'

import Check from './Check'
import Debug from './kit/Debug'
import SelectUser from './SelectUser'
import SelectCurrency from './SelectCurrency'
import Start from './Start'

import { TData } from './types'

import { generateUserAmount } from './data'

function App() {

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
      errorElement: (
        <Start />
      ),
    },
    {
      path: "*",
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
          data={data}
          setData={setData}
        />
      ),
    },
    {
      path: "/select-currency",
      element: (
        <SelectCurrency />
      ),
    },
  ])

  return (
    <div className={cx(isDarkTheme ? 'theme-dark' : 'theme-light')}>
      <RouterProvider router={router} />

      <Debug />
    </div>
  )
}

export default App
