import cx from 'classnames'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'


import { useTheme } from './hooks/useTheme'

import Check from './pages/Check'
import SelectUser from './pages/SelectUser'
import SelectCurrency from './pages/SelectCurrency'
import Start from './pages/Start'

import SplashScreen from './kit/SplashScreen'

const queryClient = new QueryClient()

function App() {
  const { isDarkTheme } = useTheme()

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
    <QueryClientProvider client={queryClient}>
      <div className={cx(isDarkTheme ? 'theme-dark' : 'theme-light')}>
        <RouterProvider router={router} />
        <SplashScreen />
      </div>
    </QueryClientProvider>
  )
}

export default App
