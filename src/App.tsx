import cx from 'classnames'
import { useEffect } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExpand, WebAppProvider } from '@vkruglikov/react-telegram-web-app';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { useTheme } from './hooks'
import { useStore } from './store'

import Check from './pages/Check'
import SelectUser from './pages/SelectUser'
import SelectCurrency from './pages/SelectCurrency'
import Start from './pages/Start'

import SplashScreen from './kit/SplashScreen'

const queryClient = new QueryClient()

function App() {
  const { isDarkTheme } = useTheme()
  const { txId } = useStore()

  const [isExpanded, expand] = useExpand()
  useEffect(() => {
    if (!isExpanded) {
      expand()
    }
  }, [])

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
        <Check />
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
    <WebAppProvider
      options={{
        smoothButtonsTransition: true
      }}
    >
      <QueryClientProvider client={queryClient}>
        <div className={cx(isDarkTheme ? 'theme-dark dark' : 'theme-light')}>
          <RouterProvider router={router} />
          <SplashScreen />
          {txId === null && (
            <div className="fixed top-0 width-auto left-[50%] -translate-x-[50%] px-4 py-[1px] text-[13px] leading-[1em] font-semibold bg-[#3a3] text-white rounded-b-md">Демо-режим</div>
          )}
        </div>
      </QueryClientProvider>
    </WebAppProvider>
  )
}

export default App
