import './i18n/config';
import cx from 'classnames'
import { useEffect } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExpand, WebAppProvider } from '@vkruglikov/react-telegram-web-app';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { useTheme } from './hooks'

import Check from './pages/Check'
import SelectUser from './pages/SelectUser'
import SelectCurrency from './pages/SelectCurrency'
import Start from './pages/Start'

import SplashScreen from './kit/SplashScreen'
import DemoMode from './kit/DemoMode'

const queryClient = new QueryClient()

function App() {
  const { isDarkTheme } = useTheme()

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
          <DemoMode />
        </div>
      </QueryClientProvider>
    </WebAppProvider>
  )
}

export default App
