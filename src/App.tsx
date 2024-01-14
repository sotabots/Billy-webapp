import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useExpand, WebAppProvider } from '@vkruglikov/react-telegram-web-app';

import { useEffect } from 'react'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { useTheme } from './hooks'

import './i18n';

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import Check from './pages/Check'
import SelectUser from './pages/SelectUser'
import SelectCurrency from './pages/SelectCurrency'
import Start from './pages/Start'

import SplashScreen from './kit/SplashScreen'
import DemoMode from './kit/DemoMode'

const queryClient = new QueryClient()

function App() {
  useTheme()

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
        <RouterProvider router={router} />
        <SplashScreen />
        <DemoMode />
      </QueryClientProvider>
    </WebAppProvider>
  )
}

export default App
